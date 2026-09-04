"""One-off additive migration: adds study_notes/processing_error to notes.

Base.metadata.create_all() only creates missing tables, not new columns on
existing ones, so this covers the gap until Alembic is introduced. Safe to
re-run: every statement is idempotent (IF NOT EXISTS).

Usage: python -m app.scripts.add_note_processing_columns
"""

from sqlalchemy import text

from app.database import engine

STATEMENTS = [
    "ALTER TABLE notes ADD COLUMN IF NOT EXISTS study_notes TEXT",
    "ALTER TABLE notes ADD COLUMN IF NOT EXISTS processing_error TEXT",
]


def main() -> None:
    with engine.begin() as conn:
        for statement in STATEMENTS:
            print(f"Running: {statement}")
            conn.execute(text(statement))
    print("Done.")


if __name__ == "__main__":
    main()
