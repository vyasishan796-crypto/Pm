import hashlib
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from pydantic import BaseModel
from typing import Optional
import logging

router = APIRouter(prefix="/api/translate", tags=["translate"])
logger = logging.getLogger(__name__)

# Translation service endpoints - using MyMemory API (free, no API key)
MYMEMORY_URL = "https://api.mymemory.translated.net/get"

# In-memory cache (for production, use Redis)
translation_cache = {}

# Language code mapping (frontend -> translation service codes)
LANGUAGE_MAP = {
    "en": "en",
    "hi": "hi",
    "sa": "sa",
    "bn": "bn",
    "ta": "ta",
    "te": "te",
    "mr": "mr",
    "gu": "gu",
    "kn": "kn",
    "ml": "ml",
}

class TranslateRequest(BaseModel):
    text: str
    target_lang: str
    source_lang: Optional[str] = None

class TranslateResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str
    cached: bool

def get_cache_key(text: str, source_lang: str, target_lang: str) -> str:
    """Generate cache key from text + languages"""
    content = f"{source_lang}:{target_lang}:{text}"
    return hashlib.sha256(content.encode()).hexdigest()

def map_language(code: str) -> str:
    """Map frontend language code to translation service code"""
    return LANGUAGE_MAP.get(code, code)

def mymemory_lang(code: str) -> str:
    """Map to MyMemory language codes"""
    return LANGUAGE_MAP.get(code, code)

@router.post("", response_model=TranslateResponse)
async def translate_text(
    request: TranslateRequest,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    target_lang = map_language(request.target_lang)
    source_lang = map_language(request.source_lang) if request.source_lang else "auto"

    # Check cache
    cache_key = get_cache_key(request.text, source_lang, target_lang)
    if cache_key in translation_cache:
        cached = translation_cache[cache_key]
        return TranslateResponse(
            translated_text=cached,
            source_lang=source_lang,
            target_lang=target_lang,
            cached=True,
        )

    # Use MyMemory API (free, no API key, good for Indian languages)
    translated = None
    detected_lang = source_lang

    try:
        source_mm = mymemory_lang(source_lang) if source_lang != "auto" else "en"
        target_mm = mymemory_lang(target_lang)
        lang_pair = f"{source_mm}|{target_mm}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(
                MYMEMORY_URL,
                params={
                    "q": request.text,
                    "langpair": lang_pair,
                },
                timeout=15.0,
            )
        if resp.status_code == 200:
            # Use resp.text which handles encoding automatically
            text_content = resp.text
            import json
            data = json.loads(text_content)
            response_data = data.get("responseData", {})
            translated = response_data.get("translatedText", "")
            if translated:
                detected = data.get("detectedLanguage", "auto")
    except Exception as e:
        logger.warning(f"MyMemory translation failed: {e}")

    if not translated:
        raise HTTPException(status_code=502, detail="Translation service unavailable")

    # Cache the result
    translation_cache[cache_key] = translated

    return TranslateResponse(
        translated_text=translated,
        source_lang=detected if detected != "auto" else "auto",
        target_lang=target_lang,
        cached=False,
    )