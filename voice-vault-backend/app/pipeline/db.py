"""Lambda-only DB engine.

Deliberately independent of app.config/app.database: those require the full
FastAPI env surface (AWS access keys, JWT secret) which the Lambda has no
business needing — it gets its AWS credentials from its execution role, not
literal keys, and never touches JWTs. The Lambda's environment only needs to
provide DATABASE_URL.
"""

import os

from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()  # no-op in the deployed Lambda image (no .env file ships in it)

DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
