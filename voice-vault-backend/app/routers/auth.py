import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import FRONTEND_URL, PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
from app.core.deps import get_current_user
from app.core.security import (
    create_access_token,
    generate_reset_token,
    hash_password,
    hash_reset_token,
    verify_password,
)
from app.database import get_db
from app.models import Audio, Note, PasswordResetToken, User
from app.schemas.auth import (
    AuthSession,
    DeleteAccountRequest,
    ExportedAudio,
    ExportedNote,
    ExportOut,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    UpdateUserRequest,
)
from app.schemas.user import UserOut
from app.services import s3, ses

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

GENERIC_FORGOT_PASSWORD_MESSAGE = "If an account exists for that email, a password reset link has been sent."
GENERIC_INVALID_TOKEN_MESSAGE = "This reset link is invalid or has expired."


@router.post("/register", response_model=AuthSession, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthSession:
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists"
        )

    user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    return AuthSession(user=UserOut.model_validate(user), token=token)


@router.post("/login", response_model=AuthSession)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthSession:
    invalid = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user is None or user.password_hash is None or not verify_password(payload.password, user.password_hash):
        raise invalid

    token = create_access_token(str(user.id))
    return AuthSession(user=UserOut.model_validate(user), token=token)


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(current_user: User = Depends(get_current_user)) -> dict:
    return {"message": "Logged out"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)


@router.patch("/me", response_model=UserOut)
def update_me(
    payload: UpdateUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserOut:
    if payload.email is not None and payload.email.lower() != current_user.email:
        existing = db.query(User).filter(User.email == payload.email.lower()).first()
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists"
            )
        current_user.email = payload.email.lower()

    if payload.name is not None:
        current_user.name = payload.name

    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.email == payload.email.lower()).first()

    if user is not None:
        raw_token = generate_reset_token()
        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=hash_reset_token(raw_token),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES),
        )
        db.add(reset_token)
        db.commit()

        reset_link = f"{FRONTEND_URL}/reset-password?token={raw_token}"
        try:
            ses.send_password_reset_email(user.email, reset_link)
        except Exception:
            # Never let an SES failure leak whether the account exists, or
            # surface AWS-level details to the caller — log it server-side only.
            logger.exception("Failed to send password reset email for user %s", user.id)

    return {"message": GENERIC_FORGOT_PASSWORD_MESSAGE}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> dict:
    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

    invalid = HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=GENERIC_INVALID_TOKEN_MESSAGE)

    token_hash = hash_reset_token(payload.token)
    reset_token = db.query(PasswordResetToken).filter(PasswordResetToken.token_hash == token_hash).first()

    if reset_token is None or reset_token.used_at is not None:
        raise invalid
    if reset_token.expires_at < datetime.now(timezone.utc):
        raise invalid

    user = db.get(User, reset_token.user_id)
    if user is None:
        raise invalid

    user.password_hash = hash_password(payload.new_password)

    now = datetime.now(timezone.utc)
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id, PasswordResetToken.used_at.is_(None)
    ).update({"used_at": now})

    db.commit()
    return {"message": "Password updated successfully."}


@router.get("/export", response_model=ExportOut)
def export_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ExportOut:
    notes = db.query(Note).filter(Note.user_id == current_user.id).order_by(Note.created_at.desc()).all()
    audio_tracks = (
        db.query(Audio)
        .join(Note, Note.id == Audio.note_id)
        .filter(Note.user_id == current_user.id)
        .order_by(Audio.created_at.desc())
        .all()
    )

    return ExportOut(
        exported_at=datetime.now(timezone.utc),
        user=UserOut.model_validate(current_user),
        notes=[ExportedNote.model_validate(note) for note in notes],
        audio=[ExportedAudio.model_validate(audio) for audio in audio_tracks],
    )


@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_account(
    payload: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    if payload.confirmation != "DELETE":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Type "DELETE" to confirm.')

    notes = db.query(Note).filter(Note.user_id == current_user.id).all()
    for note in notes:
        try:
            s3.delete_file(note.s3_key)
        except Exception:
            logger.exception("Failed to delete S3 object for note %s during account deletion", note.id)

    audio_tracks = (
        db.query(Audio)
        .join(Note, Note.id == Audio.note_id)
        .filter(Note.user_id == current_user.id)
        .all()
    )
    for audio in audio_tracks:
        if audio.url:
            try:
                s3.delete_file(audio.url)
            except Exception:
                logger.exception("Failed to delete S3 object for audio %s during account deletion", audio.id)

    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted"}
