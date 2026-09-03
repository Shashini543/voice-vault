import os

from dotenv import load_dotenv

load_dotenv()


def _require(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


DATABASE_URL = _require("DATABASE_URL")

AWS_REGION = _require("AWS_REGION")
AWS_S3_BUCKET = _require("AWS_S3_BUCKET")
AWS_ACCESS_KEY_ID = _require("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = _require("AWS_SECRET_ACCESS_KEY")

JWT_SECRET_KEY = _require("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", str(60 * 24 * 7)))

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024
ACCEPTED_UPLOAD_TYPES = {
    "application/pdf",
    "text/plain",
    "image/png",
    "image/jpeg",
}
