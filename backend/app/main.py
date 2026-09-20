import json
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import init_db, async_session
from app.routers.auth import router as auth_router
from app.routers.ai import router as ai_router
from app.routers.blood import router as blood_router
from app.routers.admin import router as admin_router
from app.routers.users import router as users_router
from app.routers.contact import router as contact_router
from app.routers.translate import router as translate_router
from app.core.security import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_data():
    import os
    from sqlalchemy import select, func
    from app.models.user import User
    from app.models.blood_bank import BloodBank
    from app.models.blood_availability import BloodAvailability
    from app.models.document import Document

    async with async_session() as db:
        count = await db.execute(select(func.count(User.user_id)))
        if count.scalar() > 0:
            logger.info("Database already seeded, skipping")
            return

        logger.info("Seeding database...")

        admin = User(
            name="Admin",
            email="admin@nexora.in",
            password_hash=hash_password("admin123"),
            role="admin",
            language="en",
        )
        db.add(admin)
        await db.flush()

        bb_user = User(
            name="Blood Bank Staff",
            email="staff@redcross.in",
            password_hash=hash_password("staff123"),
            role="blood_bank",
            language="en",
        )
        db.add(bb_user)
        await db.flush()

        seed_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "seed_data", "blood_banks.json")
        if os.path.exists(seed_path):
            with open(seed_path) as f:
                banks_data = json.load(f)
            for bank_data in banks_data:
                avail_data = bank_data.pop("availability")
                bank = BloodBank(
                    name=bank_data["name"],
                    address=bank_data["address"],
                    city=bank_data["city"],
                    latitude=bank_data["latitude"],
                    longitude=bank_data["longitude"],
                    phone=bank_data["phone"],
                    verification_status="verified",
                )
                db.add(bank)
                await db.flush()
                for av in avail_data:
                    db.add(BloodAvailability(
                        blood_bank_id=bank.blood_bank_id,
                        blood_group=av["blood_group"],
                        status=av["status"],
                        units_available=av["units_available"],
                    ))

        documents = [
            {
                "title": "Indian Patent Act - Section 3(p) Traditional Knowledge",
                "source": "Indian Patent Act, 1970 (Amended)",
                "category": "patent",
                "content_text": """Section 3(p) of the Indian Patent Act, 1970 excludes the following from patentability:
"an invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components."

This section specifically protects traditional knowledge, including Ayurvedic formulations and practices, from being patented by individuals or organizations. The objective is to prevent biopiracy and ensure that traditional knowledge remains in the public domain.

Key Points:
1. Traditional knowledge as such is not patentable
2. Aggregation of known properties of traditional components is excluded
3. This provision works in conjunction with TKDL (Traditional Knowledge Digital Library)
4. The Controller of Patents examines applications against TKDL database
5. India successfully used this provision to prevent patenting of turmeric and neem-based inventions internationally"""
            },
            {
                "title": "Trademarks Act - Brand Protection for Ayurveda Products",
                "source": "Trade Marks Act, 1999",
                "category": "trademark",
                "content_text": """The Trade Marks Act, 1999 governs trademark protection in India. For Ayurveda products and services:

1. BRAND NAME PROTECTION: Ayurveda companies can register brand names, logos, and slogans as trademarks
2. CLASSIFICATION: Ayurveda products typically fall under Class 5 (Pharmaceuticals) and Class 44 (Medical Services)
3. GENERIC TERMS: Terms like "Ayurveda", "Herbal", "Natural" cannot be monopolized as trademarks
4. DISTINCTIVE ELEMENTS: Unique brand names, logos, and trade dress can be protected
5. REGISTRATION PROCESS: File TM-A application with the Indian Trade Marks Registry
6. PROTECTION PERIOD: 10 years, renewable indefinitely
7. INFRINGEMENT: Unauthorized use of identical/similar marks for similar goods/services"""
            },
            {
                "title": "Traditional Knowledge Digital Library (TKDL)",
                "source": "CSIR & Department of AYUSH",
                "category": "traditional_knowledge",
                "content_text": """TKDL is a pioneering initiative to prevent biopiracy and protect India's traditional knowledge:

1. OVERVIEW: TKDL is a digital repository of traditional knowledge from Ayurveda, Unani, Siddha, and Yoga
2. DATABASE: Contains over 2.5 lakh formulations documented in multiple languages
3. PURPOSE: Acts as prior art reference to prevent wrongful patenting of traditional knowledge
4. ACCESS: Available to patent examiners worldwide through WIPO and IP offices
5. FORMATS: Documents available in English, French, German, Japanese, Spanish
6. CONTRIBUTIONS: Documented from classical texts like Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya
7. SUCCESS: Helped prevent patents on turmeric, neem, and basmati rice internationally
8. COLLABORATION: Joint initiative of CSIR and Department of AYUSH (now Ministry of AYUSH)"""
            },
            {
                "title": "Geographical Indications for Ayurveda Products",
                "source": "Geographical Indications of Goods Act, 1999",
                "category": "geographical_indication",
                "content_text": """Geographical Indication (GI) protection for Ayurveda and traditional products:

1. GI REGISTRATION: Products with specific geographical origin and unique qualities can be registered
2. AYURVEDIC EXAMPLES: Basmati Rice (North India), Darjeeling Tea, Mysore Sandalwood
3. BENEFITS: Prevents unauthorized use of geographical names, ensures quality standards
4. APPLICATION: Filed with the GI Registry at Chennai
5. PROTECTION PERIOD: Initial 10 years, renewable for 10-year periods
6. AUTHORIZED USERS: Only producers from the defined geographical area can use the GI
7. ENFORCEMENT: GI holders can take legal action against unauthorized use
8. COLLECTIVE RIGHTS: GI is a collective right, not individual"""
            },
            {
                "title": "AYUSH Ministry - Regulatory Framework for Ayurveda",
                "source": "Ministry of AYUSH, Government of India",
                "category": "patent",
                "content_text": """The Ministry of AYUSH regulates Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy:

1. ESTABLISHED: 2014 (originally Department of AYUSH under Ministry of Health)
2. REGULATIONS: The Ministry frames policies, standards, and regulations for AYUSH systems
3. EDUCATION: Sets standards for Ayurveda education through Central Council of Indian Medicine
4. PRACTITIONERS: Registers practitioners and regulates practice standards
5. PRODUCTS: Regulates manufacture and sale of AYUSH medicines and products
6. RESEARCH: Promotes research through AYUSH research councils
7. INTERNATIONAL: Promotes AYUSH systems globally through bilateral agreements
8. INTEGRATION: Works towards integrating AYUSH with mainstream healthcare"""
            },
            {
                "title": "Ayurveda Product Classification for IP Protection",
                "source": "Nexora Knowledge Base",
                "category": "trademark",
                "content_text": """Classification of Ayurveda products for intellectual property protection:

1. PROPRIETARY FORMULATIONS: New formulations developed through R&D can be patented
2. CLASSICAL FORMULATIONS: Traditional formulations from classical texts cannot be patented
3. TRADE SECRETS: Manufacturing processes can be protected as trade secrets
4. BRAND NAMES: Product brand names can be trademarked
5. PACKAGING: Unique packaging design can be protected as industrial design
6. GEOGRAPHICAL: Products with unique regional characteristics can get GI protection
7. DOCUMENTATION: Proper documentation of formulations and processes is essential for IP protection
8. REGULATORY: Products must comply with AYUSH regulations and Schedule T of Drugs & Cosmetics Act"""
            },
        ]

        for doc in documents:
            db.add(Document(
                title=doc["title"],
                source=doc["source"],
                category=doc["category"],
                language="en",
                content_text=doc["content_text"],
                verified_status="verified",
            ))

        await db.commit()
        logger.info("Database seeded successfully!")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Nexora Backend...")
    await init_db()
    await seed_data()
    yield
    logger.info("Shutting down Nexora Backend...")


app = FastAPI(
    title="Nexora API",
    description="IP-SAKTI Sahayak + Blood Availability Finder API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://frontend-umber-iota-21.vercel.app",
        "https://frontend-qq1zt0cj7-vyasishan796-1264.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(ai_router)
app.include_router(blood_router)
app.include_router(admin_router)
app.include_router(users_router)
app.include_router(contact_router)
app.include_router(translate_router)


@app.get("/")
async def root():
    return {
        "name": "Nexora API",
        "version": "1.0.0",
        "modules": ["IP-SAKTI Sahayak", "Blood Availability Finder"],
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
