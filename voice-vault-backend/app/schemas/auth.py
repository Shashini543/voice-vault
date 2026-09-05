import uuid
from datetime import datetime

from pydantic import EmailStr, Field

from app.schemas.base import CamelModel
from app.schemas.user import UserOut


class RegisterRequest(CamelModel):
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    confirm_password: str


class LoginRequest(CamelModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UpdateUserRequest(CamelModel):
    name: str | None = Field(default=None, min_length=2, max_length=255)
    email: EmailStr | None = None


class AuthSession(CamelModel):
    user: UserOut
    token: str


class ForgotPasswordRequest(CamelModel):
    email: EmailStr


class ResetPasswordRequest(CamelModel):
    token: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=72)
    confirm_password: str


class ExportedNote(CamelModel):
    id: uuid.UUID
    title: str
    category: str
    status: str
    study_notes: str | None
    script: str | None
    created_at: datetime


class ExportedAudio(CamelModel):
    id: uuid.UUID
    title: str
    category: str
    status: str
    duration_seconds: int | None
    created_at: datetime


class ExportOut(CamelModel):
    exported_at: datetime
    user: UserOut
    notes: list[ExportedNote]
    audio: list[ExportedAudio]


class DeleteAccountRequest(CamelModel):
    confirmation: str
