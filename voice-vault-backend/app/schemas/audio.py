import uuid
from datetime import datetime

from app.schemas.base import CamelModel


class AudioOut(CamelModel):
    id: uuid.UUID
    note_id: uuid.UUID
    title: str
    status: str
    error_message: str | None
    duration_seconds: int | None
    category: str
    source_file_name: str
    created_at: datetime


class AudioDownloadOut(CamelModel):
    url: str
