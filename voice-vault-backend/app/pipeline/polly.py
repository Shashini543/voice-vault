import logging
import re

import boto3

logger = logging.getLogger(__name__)

POLLY_VOICE_ID = "Joanna"
POLLY_ENGINE = "neural"

# Polly's real-time SynthesizeSpeech caps input at ~3000 characters per call;
# Gemini's script can exceed that, so long scripts are split into
# sentence-boundary chunks and synthesized separately.
MAX_CHUNK_CHARS = 2900

# Lambda's execution role provides credentials automatically, matching the
# _s3_client = boto3.client("s3") pattern already used in lambda_handler.py.
_polly_client = boto3.client("polly")


def _split_into_chunks(text: str, max_chars: int = MAX_CHUNK_CHARS) -> list[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    chunks: list[str] = []
    current = ""

    for sentence in sentences:
        if len(sentence) > max_chars:
            if current:
                chunks.append(current)
                current = ""
            for i in range(0, len(sentence), max_chars):
                chunks.append(sentence[i : i + max_chars])
            continue

        candidate = f"{current} {sentence}".strip() if current else sentence
        if len(candidate) > max_chars:
            chunks.append(current)
            current = sentence
        else:
            current = candidate

    if current:
        chunks.append(current)

    return chunks


def synthesize_speech(script: str) -> bytes:
    """Converts a conversational script into MP3 bytes using a neural Polly voice."""
    chunks = _split_into_chunks(script)
    if not chunks:
        raise RuntimeError("No script text to synthesize")

    logger.info("Synthesizing speech via Polly (%s, %s chunks)", POLLY_VOICE_ID, len(chunks))

    audio_parts: list[bytes] = []
    for index, chunk in enumerate(chunks):
        try:
            response = _polly_client.synthesize_speech(
                Text=chunk,
                OutputFormat="mp3",
                VoiceId=POLLY_VOICE_ID,
                Engine=POLLY_ENGINE,
            )
        except Exception as exc:
            # Polly's ClientError bodies describe the API-level problem only
            # (bad voice/engine, throttling, etc.) — safe to log directly,
            # same reasoning already applied to Gemini errors in gemini.py.
            logger.error(
                "Polly synthesize_speech failed on chunk %d/%d (%s): %s",
                index + 1,
                len(chunks),
                type(exc).__name__,
                exc,
            )
            raise RuntimeError(f"Polly speech synthesis failed: {exc}") from exc

        audio_parts.append(response["AudioStream"].read())

    return b"".join(audio_parts)
