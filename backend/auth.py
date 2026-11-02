# backend/auth.py

from typing import Dict

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr

router = APIRouter()
security = HTTPBearer()

# --------------------------
# In-memory "database"
# --------------------------

# email -> user dict
fake_users_db: Dict[str, Dict] = {}

# token -> user dict
tokens_db: Dict[str, Dict] = {}

_next_id = 1


# --------------------------
# Pydantic models
# --------------------------

class SignupPayload(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: int
    email: EmailStr
    full_name: str


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --------------------------
# Helpers
# --------------------------

def get_user_by_email(email: str) -> Dict | None:
    return fake_users_db.get(email.lower())


def create_token_for_user(user: Dict) -> str:
    # Simple dev token – not secure, but fine for local testing
    token = f"token-{user['id']}"
    tokens_db[token] = user
    return token


# --------------------------
# Dependencies
# --------------------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Dict:
    token = credentials.credentials
    user = tokens_db.get(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return user


# --------------------------
# Routes
# --------------------------

@router.post("/signup", response_model=UserPublic)
def signup(payload: SignupPayload):
    """
    Simple in-memory signup (no hashing, dev only).
    """
    global _next_id

    email_key = payload.email.lower()

    if get_user_by_email(email_key):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = {
        "id": _next_id,
        "email": email_key,
        "full_name": payload.full_name,
        "password": payload.password,  # plain text (DEV ONLY)
    }
    fake_users_db[email_key] = user
    _next_id += 1

    return UserPublic(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
    )


@router.post("/login", response_model=TokenOut)
def login(payload: LoginPayload):
    """
    Simple login – plain password check.
    """
    email_key = payload.email.lower()
    user = get_user_by_email(email_key)

    if not user or user["password"] != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_token_for_user(user)
    return TokenOut(access_token=token)
