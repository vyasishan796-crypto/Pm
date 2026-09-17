from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from pydantic import BaseModel

router = APIRouter(prefix="/api/contact", tags=["contact"])

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

@router.post("")
async def submit_contact(form: ContactForm, db: AsyncSession = Depends(get_db)):
    # Store in a simple table or just log for now
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Contact form: {form.name} ({form.email}): {form.message[:100]}")
    return {"status": "success", "message": "Your message has been received. We will get back to you soon."}
