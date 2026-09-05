"""One-off migration: makes audio.duration_seconds nullable.

duration_seconds is only known once Polly finishes synthesizing the MP3, but
the column was originally created NOT NULL with no DB-level default (the
model's `default=0` is Python/ORM-side only, never applied by the Lambda's
raw SQL INSERT) — so creating the PROCESSING row failed with a NotNullViolation.

Safe to re-run: DROP NOT NULL on an already-nullable column is a no-op in Postgres.

Usage: python -m app.scripts.make_audio_duration_nullable
"""

from sqlalchemy import text

from app.database import engine

STATEMENTS = [
    "ALTER TABLE audio ALTER COLUMN duration_seconds DROP NOT NULL",
]


def main() -> None:
    with engine.begin() as conn:
        for statement in STATEMENTS:
            print(f"Running: {statement}")
            conn.execute(text(statement))
    print("Done.")


if __name__ == "__main__":
    main()
