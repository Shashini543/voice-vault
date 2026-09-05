"""One-off additive migration: adds status/error_message to audio, and makes
audio.url nullable (unknown until Polly synthesis finishes).

Base.metadata.create_all() only creates missing tables, not new columns on
existing ones, so this covers the gap until Alembic is introduced. Safe to
re-run: every statement is idempotent.

Usage: python -m app.scripts.add_audio_status_columns
"""

from sqlalchemy import text

from app.database import engine

STATEMENTS = [
    "ALTER TABLE audio ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'PROCESSING'",
    "ALTER TABLE audio ADD COLUMN IF NOT EXISTS error_message TEXT",
    "ALTER TABLE audio ALTER COLUMN url DROP NOT NULL",
]


def main() -> None:
    with engine.begin() as conn:
        for statement in STATEMENTS:
            print(f"Running: {statement}")
            conn.execute(text(statement))
    print("Done.")


if __name__ == "__main__":
    main()
