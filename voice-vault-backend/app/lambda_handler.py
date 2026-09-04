import logging
import urllib.parse

import boto3
from sqlalchemy import text

from app.pipeline.bedrock import generate_script, generate_study_notes
from app.pipeline.db import engine
from app.pipeline.extract import extract_text

logger = logging.getLogger()
logger.setLevel(logging.INFO)

_s3_client = boto3.client("s3")


def handler(event, context):
    for record in event.get("Records", []):
        bucket = record["s3"]["bucket"]["name"]
        key = urllib.parse.unquote_plus(record["s3"]["object"]["key"])
        logger.info("Processing s3://%s/%s", bucket, key)
        try:
            _process_object(bucket, key)
        except Exception:
            logger.exception("Failed to process s3://%s/%s", bucket, key)
            _mark_failed(key, "Processing failed. See CloudWatch logs for details.")
            raise

    return {"statusCode": 200}


def _process_object(bucket: str, key: str) -> None:
    with engine.begin() as conn:
        note = conn.execute(
            text("SELECT id FROM notes WHERE s3_key = :key"),
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

    with engine.begin() as conn:
        conn.execute(
            text(
                """
                UPDATE notes
                SET study_notes = :study_notes,
                    script = :script,
                    status = 'READY',
                    processing_error = NULL,
                    updated_at = now()
                WHERE id = :id
                """
            ),
            {"study_notes": study_notes, "script": script, "id": note_id},
        )
    logger.info("Note %s marked READY", note_id)


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
