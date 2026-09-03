import uuid
from datetime import datetime

from app.schemas.base import CamelModel


class UserOut(CamelModel):
    id: uuid.UUID
    name: str
    email: str
    created_at: datetime
