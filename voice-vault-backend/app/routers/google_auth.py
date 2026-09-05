import logging
import secrets
from urllib.parse import quote

from fastapi import APIRouter, Cookie, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.config import FRONTEND_URL
from app.core.security import create_access_token
from app.database import get_db
from app.models import User
from app.services import google_oauth

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth/google", tags=["auth"])

STATE_COOKIE_NAME = "google_oauth_state"


def _login_redirect_with_error(reason: str) -> RedirectResponse:
    return RedirectResponse(f"{FRONTEND_URL}/login?error={quote(reason)}")


@router.get("/login")
def google_login() -> RedirectResponse:
    state = secrets.token_urlsafe(16)
    response = RedirectResponse(google_oauth.build_authorization_url(state))
    response.set_cookie(STATE_COOKIE_NAME, state, httponly=True, samesite="lax", max_age=600)
    return response


@router.get("/callback")
def google_callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    google_oauth_state: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> RedirectResponse:
    if error:
        return _login_redirect_with_error("google_oauth_denied")

    if not code or not state or not google_oauth_state or state != google_oauth_state:
        return _login_redirect_with_error("google_oauth_failed")

    try:
        tokens = google_oauth.exchange_code_for_tokens(code)
        info = google_oauth.get_user_info(tokens["access_token"])
    except Exception:
        logger.exception("Google OAuth token exchange or userinfo lookup failed")
        return _login_redirect_with_error("google_oauth_failed")

    google_id = info.get("sub")
    email = info.get("email")
    name = info.get("name") or email

    if not google_id or not email or not info.get("email_verified"):
        return _login_redirect_with_error("google_oauth_failed")

    email = email.lower()

    user = db.query(User).filter(User.google_id == google_id).first()
    if user is None:
        user = db.query(User).filter(User.email == email).first()
        if user is not None:
            user.google_id = google_id
        else:
            user = User(name=name, email=email, google_id=google_id, password_hash=None)
            db.add(user)

    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    response = RedirectResponse(f"{FRONTEND_URL}/google-callback?token={token}")
    response.delete_cookie(STATE_COOKIE_NAME)
    return response
