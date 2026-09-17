import logging
from typing import List

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are IP-SAKTI Sahayak, an AI assistant specializing in Ayurveda intellectual property guidance.

Your role is to help Ayurveda practitioners, researchers, startups, students, and innovators understand:
- Patents, trademarks, copyright, and industrial designs
- Ayurveda product classification
- Indian and international IP regulations
- Traditional Knowledge (TK) protection
- Geographical Indications (GI)

Guidelines:
1. Always provide helpful, accurate, and informative responses
2. Reference the provided source documents when available
3. Clearly distinguish between general informational guidance and professional/legal advice
4. State that this is not legal advice when appropriate
5. Respond in the same language the user asks in (or English if the language is not supported)
6. If you cannot find relevant information in the knowledge base, say so clearly
7. Be concise but thorough in your explanations"""


async def generate_answer(
    question: str,
    context_parts: List[str],
    language: str,
    sources: list,
) -> str:
    language_names = {
        "en": "English", "hi": "Hindi", "sa": "Sanskrit", "bn": "Bengali",
        "ta": "Tamil", "te": "Telugu", "mr": "Marathi", "gu": "Gujarati",
        "kn": "Kannada", "ml": "Malayalam",
    }
    lang_name = language_names.get(language, "English")

    if context_parts:
        context = "\n\n---\n\n".join(context_parts[:3])
        prompt = f"""Based on the following verified knowledge base documents, answer the user's question.

Context from verified documents:
{context}

User Question: {question}

Please respond in {lang_name}. If the documents don't contain enough information, clearly state what you know and what limitations exist. Always remind the user to consult a qualified IP professional for specific legal advice."""
    else:
        prompt = f"""Please answer the following question about Ayurveda intellectual property.
Respond in {lang_name}. Since no specific verified documents were found for this query,
provide general informational guidance based on your knowledge.

User Question: {question}

Always remind the user that this is general informational guidance, not legal advice,
and they should consult a qualified IP professional for specific legal matters."""

    try:
        import httpx
        import os
        from app.config import get_settings
        settings = get_settings()

        if settings.OPENAI_API_KEY:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": prompt},
                        ],
                        "max_tokens": 1000,
                        "temperature": 0.7,
                    },
                    timeout=30,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data["choices"][0]["message"]["content"]
    except Exception as e:
        logger.warning(f"LLM API call failed: {e}")

    if context_parts:
        return f"""Based on the verified knowledge base, here is what I found regarding your question:

"{question}"

The retrieved documents contain information about {', '.join(set(s.get('category', 'IP') for s in sources))} topics relevant to your query.

Key points from the sources:
{chr(10).join(f"- {s.get('title', 'Document')}: {s.get('snippet', '')[:150]}..." for s in sources[:3])}

**Important:** This is general informational guidance. For specific legal advice regarding Ayurveda IP matters, please consult a qualified intellectual property professional or legal expert.

**Sources:** {', '.join(s.get('title', 'Unknown') for s in sources)}"""

    return f"""Thank you for your question: "{question}"

I was unable to find specific verified documents in the knowledge base for this query. This may be because the topic is outside the current scope of our Ayurveda IP knowledge base.

**Recommendations:**
- Try rephrasing your question with different keywords
- Check the Indian Patent Act, Trademarks Act, or relevant IP legislation
- Consult the Traditional Knowledge Digital Library (TKDL)
- Contact a qualified IP professional for specific legal guidance

**Important:** This is general informational guidance, not legal advice. Always consult a qualified intellectual property professional for specific legal matters."""
