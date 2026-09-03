import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import ACCEPTED_UPLOAD_TYPES, MAX_UPLOAD_SIZE_BYTES
from app.core.deps import get_current_user
from app.database import get_db
from app.models import Note, User
from app.schemas.note import NoteOut
from app.services import s3

router = APIRouter(prefix="/notes", tags=["notes"])


def _get_owned_note(note_id: str, current_user: User, db: Session) -> Note:
    try:
        parsed_id = uuid.UUID(note_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    note = db.get(Note, parsed_id)
    if note is None or note.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note


@router.get("", response_model=list[NoteOut])
def list_notes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[NoteOut]:
    notes = (
        db.query(Note)
        .filter(Note.user_id == current_user.id)
        .order_by(Note.created_at.desc())
        .all()
    )
    return [NoteOut.model_validate(note) for note in notes]


@router.get("/{note_id}", response_model=NoteOut)
def get_note(
    note_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> NoteOut:
    note = _get_owned_note(note_id, current_user, db)
    return NoteOut.model_validate(note)


@router.post("/upload", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
async def upload_note(
    file: UploadFile = File(...),
    title: str | None = Form(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> NoteOut:
    if file.content_type not in ACCEPTED_UPLOAD_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Use PDF, TXT, PNG, or JPG",
        )

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please choose a file to upload")
    if len(content) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="File is too large. Maximum size is 50 MB"
        )

    filename = file.filename or "untitled"
    resolved_title = title.strip() if title and title.strip() else filename.rsplit(".", 1)[0]

    key = s3.build_note_key(str(current_user.id), filename)
    try:
        s3.upload_file(key, content, file.content_type)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail="Failed to store the uploaded file"
        )

    note = Note(
        user_id=current_user.id,
        title=resolved_title,
        source_file_name=filename,
        s3_key=key,
    )
    db.add(note)
    db.commit()
    db.refresh(note)

    return NoteOut.model_validate(note)


@router.delete("/{note_id}", status_code=status.HTTP_200_OK)
def delete_note(
    note_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    note = _get_owned_note(note_id, current_user, db)
    try:
        s3.delete_file(note.s3_key)
    except Exception:
        pass
    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}
