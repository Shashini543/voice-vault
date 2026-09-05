"""One-off setup: creates the password_reset_tokens table.

Base.metadata.create_all() only creates tables that don't exist yet, so this
is safe to run standalone or repeatedly — it will never touch the existing
users/notes/audio tables or their data. app/main.py's lifespan already calls
this same function on every backend startup, so restarting the API also
creates this table automatically; this script exists for anyone who wants to
create it without a full restart.

Usage: python -m app.scripts.create_password_reset_tokens_table
"""

from app import models  # noqa: F401  (registers models with Base before create_all)
from app.database import Base, engine


def main() -> None:
    print("Running: Base.metadata.create_all() (creates password_reset_tokens if missing)")
    Base.metadata.create_all(bind=engine)
    print("Done.")


if __name__ == "__main__":
    main()
