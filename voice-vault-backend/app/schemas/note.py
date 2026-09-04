import uuid
from datetime import datetime

from app.schemas.base import CamelModel


class NoteOut(CamelModel):
    id: uuid.UUID
    title: str
    source_file_name: str
    category: str
    status: str
    study_notes: str | None
    script: str | None
    audio_id: uuid.UUID | None
    duration_seconds: int | None
    created_at: datetime
    updated_at: datetime
