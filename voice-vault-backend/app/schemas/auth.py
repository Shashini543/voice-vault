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
