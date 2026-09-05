import logging
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.pipeline.prompts import SCRIPT_SYSTEM_PROMPT, STUDY_NOTES_SYSTEM_PROMPT

load_dotenv()  # no-op in the deployed Lambda image; real env vars come from Lambda config

logger = logging.getLogger(__name__)

GEMINI_MODEL = "gemini-3.6-flash"
MAX_OUTPUT_TOKENS = 4096

# Fails fast at import time (visible immediately as a CloudWatch Init error)
# if GEMINI_API_KEY isn't set, matching the same fail-fast pattern already
# used for DATABASE_URL in app/pipeline/db.py.
_client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def _generate(system_prompt: str, user_message: str) -> str:
    try:
        response = _client.models.generate_content(
            model=GEMINI_MODEL,
            contents=user_message,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.3,
                max_output_tokens=MAX_OUTPUT_TOKENS,
            ),
        )
    except Exception as exc:
        # Google's genai.errors.ClientError/ServerError bodies only ever
        # describe the API-level problem (bad model name, quota, etc.) — never
        # echo back the request, so the API key can't leak through str(exc).
        # Logging it (not just the exception type) is what actually made the
        # previous gemini-2.5-flash retirement diagnosable.
        logger.error("Gemini generate_content call failed (%s): %s", type(exc).__name__, exc)
        raise RuntimeError(f"Gemini generation failed: {exc}") from exc

    text = (response.text or "").strip()
    if not text:
        raise RuntimeError("Gemini response contained no text content")
    return text


def generate_study_notes(source_text: str) -> str:
    logger.info("Generating study notes via Gemini (%s)", GEMINI_MODEL)
    return _generate(STUDY_NOTES_SYSTEM_PROMPT, source_text)


def generate_script(study_notes: str) -> str:
    logger.info("Generating conversational script via Gemini (%s)", GEMINI_MODEL)
    return _generate(SCRIPT_SYSTEM_PROMPT, study_notes)
