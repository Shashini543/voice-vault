import re
import uuid

import boto3

from app.config import AWS_ACCESS_KEY_ID, AWS_REGION, AWS_S3_BUCKET, AWS_SECRET_ACCESS_KEY

_s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

_UNSAFE_CHARS = re.compile(r"[^A-Za-z0-9._-]+")


def _sanitize_filename(filename: str) -> str:
    return _UNSAFE_CHARS.sub("_", filename)[-150:]


def build_note_key(user_id: str, filename: str) -> str:
    return f"notes/{user_id}/{uuid.uuid4()}_{_sanitize_filename(filename)}"


def upload_file(key: str, content: bytes, content_type: str) -> None:
    _s3_client.put_object(
        Bucket=AWS_S3_BUCKET,
        Key=key,
        Body=content,
        ContentType=content_type,
    )


def delete_file(key: str) -> None:
    _s3_client.delete_object(Bucket=AWS_S3_BUCKET, Key=key)


def build_object_url(key: str) -> str:
    return f"https://{AWS_S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{key}"
