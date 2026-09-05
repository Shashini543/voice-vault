import io
import logging
import urllib.parse
import uuid

import boto3
from mutagen.mp3 import MP3
from sqlalchemy import text

from app.pipeline.db import engine
from app.pipeline.extract import extract_text
from app.pipeline.gemini import generate_script, generate_study_notes
from app.pipeline.polly import synthesize_speech

logger = logging.getLogger()
logger.setLevel(logging.INFO)

_s3_client = boto3.client("s3")
AUDIO_BUCKET_PREFIX = "audio"


def handler(event, context):
    for record in event.get("Records", []):
        bucket = record["s3"]["bucket"]["name"]
        key = urllib.parse.unquote_plus(record["s3"]["object"]["key"])
        logger.info("Processing s3://%s/%s", bucket, key)
        try:
            _process_object(bucket, key)
        except Exception as exc:
            logger.exception("Failed to process s3://%s/%s", bucket, key)
            # Store the actual error (truncated) so the DB row is diagnosable
            # without needing CloudWatch access for every failure — the
            # gemini.py error messages are already confirmed safe (API-level
            # descriptions only, never request/credential content).
            _mark_failed(key, str(exc)[:2000])
            raise

    return {"statusCode": 200}


def _process_object(bucket: str, key: str) -> None:
    with engine.begin() as conn:
        note = conn.execute(
            text("SELECT id, user_id, title, category, source_file_name FROM notes WHERE s3_key = :key"),
            {"key": key},
        ).first()

    if note is None:
        logger.warning("No note found for s3_key=%s, skipping", key)
        return

    note_id = note.id

    response = _s3_client.get_object(Bucket=bucket, Key=key)
    content = response["Body"].read()
    content_type = response.get("ContentType", "application/octet-stream")

    source_text = extract_text(content, content_type)
    if not source_text.strip():
        _mark_failed(key, "No readable text could be extracted from the uploaded file.")
        return

    study_notes = generate_study_notes(source_text)
    script = generate_script(study_notes)

    audio_id = uuid.uuid4()
    with engine.begin() as conn:
        conn.execute(
            text(
                """
                INSERT INTO audio (id, note_id, title, status, category, source_file_name, created_at)
                VALUES (:id, :note_id, :title, 'PROCESSING', :category, :source_file_name, now())
                """
            ),
            {
                "id": audio_id,
                "note_id": note_id,
                "title": note.title,
                "category": note.category,
                "source_file_name": note.source_file_name,
            },
        )
        conn.execute(
            text(
                """
                UPDATE notes
                SET study_notes = :study_notes,
                    script = :script,
                    status = 'READY',
                    processing_error = NULL,
                    audio_id = :audio_id,
                    updated_at = now()
                WHERE id = :id
                """
            ),
            {"study_notes": study_notes, "script": script, "audio_id": audio_id, "id": note_id},
        )
    logger.info("Note %s marked READY, audio %s created (PROCESSING)", note_id, audio_id)

    _generate_audio(bucket, note, audio_id, script)


def _generate_audio(bucket: str, note, audio_id, script: str) -> None:
    """Runs Polly as the final pipeline stage. Failures here only mark the
    linked Audio row FAILED — the note itself stays READY since study notes
    and script already succeeded."""
    audio_key = f"{AUDIO_BUCKET_PREFIX}/{note.user_id}/{note.id}.mp3"
    try:
        mp3_bytes = synthesize_speech(script)
        _s3_client.put_object(Bucket=bucket, Key=audio_key, Body=mp3_bytes, ContentType="audio/mpeg")
        duration_seconds = round(MP3(io.BytesIO(mp3_bytes)).info.length)
    except Exception as exc:
        logger.exception("Audio generation failed for note %s", note.id)
        with engine.begin() as conn:
            conn.execute(
                text("UPDATE audio SET status = 'FAILED', error_message = :error WHERE id = :id"),
                {"error": str(exc)[:2000], "id": audio_id},
            )
        return

    with engine.begin() as conn:
        conn.execute(
            text(
                """
                UPDATE audio
                SET url = :url, status = 'READY', duration_seconds = :duration, error_message = NULL
                WHERE id = :id
                """
            ),
            {"url": audio_key, "duration": duration_seconds, "id": audio_id},
        )
        conn.execute(
            text("UPDATE notes SET duration_seconds = :duration WHERE id = :id"),
            {"duration": duration_seconds, "id": note.id},
        )
    logger.info("Audio %s marked READY (%ss)", audio_id, duration_seconds)


def _mark_failed(key: str, error_message: str) -> None:
    with engine.begin() as conn:
        conn.execute(
            text(
                """
                UPDATE notes
                SET status = 'FAILED', processing_error = :error, updated_at = now()
                WHERE s3_key = :key
                """
            ),
            {"error": error_message, "key": key},
        )
