from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, GoogleLoginRequest
from app.services.auth_service import create_user, authenticate_user, google_login
from app.core.security import get_current_user
from app.config import get_settings
import httpx

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await create_user(db, user_data)
    from app.core.security import create_access_token
    token = create_access_token(data={"sub": str(user.user_id), "role": user.role})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await authenticate_user(db, user_data)
    return TokenResponse(
        access_token=result["access_token"],
        user=UserResponse.model_validate(result["user"]),
    )


@router.post("/google", response_model=TokenResponse)
async def google_auth(req: GoogleLoginRequest, db: AsyncSession = Depends(get_db)):
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": req.credential},
                timeout=10,
            )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google token")

        payload = resp.json()
        google_id = payload.get("sub")
        email = payload.get("email")
        name = payload.get("name", "Google User")
        avatar = payload.get("picture")

        if not google_id or not email:
            raise HTTPException(status_code=401, detail="Invalid Google token data")

        result = await google_login(db, google_id, email, name, avatar)
        return TokenResponse(
            access_token=result["access_token"],
            user=UserResponse.model_validate(result["user"]),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google auth failed: {str(e)}")


@router.get("/me", response_model=UserResponse)
async def get_me(user=Depends(get_current_user)):
    return UserResponse.model_validate(user)
