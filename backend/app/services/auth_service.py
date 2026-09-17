from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_access_token
from fastapi import HTTPException


async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    existing = await db.execute(select(User).where(User.email == user_data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
        language=user_data.language,
        auth_provider="local",
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, user_data: UserLogin) -> dict:
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    if not user or not user.password_hash or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account suspended")

    token = create_access_token(data={"sub": str(user.user_id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


async def google_login(db: AsyncSession, google_id: str, email: str, name: str, avatar_url: str = None) -> dict:
    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if user:
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account suspended")
        token = create_access_token(data={"sub": str(user.user_id), "role": user.role})
        return {"access_token": token, "token_type": "bearer", "user": user}

    existing = await db.execute(select(User).where(User.email == email))
    existing_user = existing.scalar_one_or_none()
    if existing_user:
        existing_user.google_id = google_id
        existing_user.auth_provider = "google"
        if avatar_url:
            existing_user.avatar_url = avatar_url
        await db.flush()
        await db.refresh(existing_user)
        token = create_access_token(data={"sub": str(existing_user.user_id), "role": existing_user.role})
        return {"access_token": token, "token_type": "bearer", "user": existing_user}

    user = User(
        name=name,
        email=email,
        password_hash=None,
        role="user",
        language="en",
        auth_provider="google",
        google_id=google_id,
        avatar_url=avatar_url,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    token = create_access_token(data={"sub": str(user.user_id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


async def get_all_users(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()
