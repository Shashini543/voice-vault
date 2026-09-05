"""One-off additive migration: adds google_id to users and makes password_hash
nullable (Google-only accounts have no password).

Safe to re-run: every statement is idempotent. Postgres allows multiple NULLs
in a unique index, so existing password-only users (google_id = NULL) never
collide with each other or with future Google users.

Usage: python -m app.scripts.add_google_oauth_columns
"""

from sqlalchemy import text

from app.database import engine

STATEMENTS = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)",
    "ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL",
    "CREATE UNIQUE INDEX IF NOT EXISTS ix_users_google_id ON users (google_id)",
]


def main() -> None:
    with engine.begin() as conn:
        for statement in STATEMENTS:
            print(f"Running: {statement}")
            conn.execute(text(statement))
    print("Done.")


if __name__ == "__main__":
    main()
