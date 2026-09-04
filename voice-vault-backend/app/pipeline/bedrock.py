import os

import boto3
from dotenv import load_dotenv

from app.pipeline.prompts import SCRIPT_SYSTEM_PROMPT, STUDY_NOTES_SYSTEM_PROMPT

load_dotenv()  # no-op in the deployed Lambda image; Lambda sets AWS_REGION itself

BEDROCK_MODEL_ID = "amazon.nova-lite-v1:0"
MAX_OUTPUT_TOKENS = 4096

# Explicit region_name so this also works when run locally (outside Lambda,
# boto3 has no implicit region). Inside Lambda, AWS_REGION is a reserved env
# var the runtime sets automatically, so this still resolves correctly there.
_bedrock_client = boto3.client("bedrock-runtime", region_name=os.environ.get("AWS_REGION"))


def _converse(system_prompt: str, user_message: str) -> str:
    response = _bedrock_client.converse(
        modelId=BEDROCK_MODEL_ID,
        system=[{"text": system_prompt}],
        messages=[{"role": "user", "content": [{"text": user_message}]}],
        inferenceConfig={"maxTokens": MAX_OUTPUT_TOKENS, "temperature": 0.3},
    )
    content = response["output"]["message"]["content"]
    text_block = next((block for block in content if "text" in block), None)
    if text_block is None:
        raise RuntimeError("Bedrock response contained no text content")
    return text_block["text"].strip()


def generate_study_notes(source_text: str) -> str:
    return _converse(STUDY_NOTES_SYSTEM_PROMPT, source_text)


def generate_script(study_notes: str) -> str:
    return _converse(SCRIPT_SYSTEM_PROMPT, study_notes)
