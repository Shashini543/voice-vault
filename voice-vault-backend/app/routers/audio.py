import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models import Audio, Note, User
from app.schemas.audio import AudioDownloadOut, AudioOut
from app.services import s3

router = APIRouter(prefix="/audio", tags=["audio"])


def _get_owned_audio(audio_id: str, current_user: User, db: Session) -> Audio:
    try:
        parsed_id = uuid.UUID(audio_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audio not found")

    audio = (
        db.query(Audio)
        .join(Note, Note.id == Audio.note_id)
        .filter(Audio.id == parsed_id, Note.user_id == current_user.id)
        .first()
    )
    if audio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audio not found")
    return audio


@router.get("", response_model=list[AudioOut])
def list_audio(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[AudioOut]:
    tracks = (
        db.query(Audio)
        .join(Note, Note.id == Audio.note_id)
        .filter(Note.user_id == current_user.id)
        .order_by(Audio.created_at.desc())
        .all()
    )
    return [AudioOut.model_validate(track) for track in tracks]


@router.get("/{audio_id}", response_model=AudioOut)
def get_audio(
    audio_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> AudioOut:
    audio = _get_owned_audio(audio_id, current_user, db)
    return AudioOut.model_validate(audio)


@router.get("/{audio_id}/download", response_model=AudioDownloadOut)
def download_audio(
    audio_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> AudioDownloadOut:
    audio = _get_owned_audio(audio_id, current_user, db)
    if audio.status != "READY" or not audio.url:
        detail = "Audio generation failed" if audio.status == "FAILED" else "Audio is not ready yet"
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)
    filename = f"{audio.title}.mp3"
    url = s3.generate_presigned_url(audio.url, filename)
    return AudioDownloadOut(url=url)
