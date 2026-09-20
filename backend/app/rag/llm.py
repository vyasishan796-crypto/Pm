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

## RESPONSE RULES

1. Understand the user's intent before answering.
   - Identify what the user is actually asking.
   - If the request is ambiguous and clarification is genuinely necessary, ask a short clarification question.
   - Otherwise, make a reasonable assumption and clearly state it.

2. Give the answer directly.
   - Do not unnecessarily repeat the user's question.
   - Avoid unnecessary introductions, filler, or generic statements.
   - Start with the most useful information.

3. Make answers easy to scan.
   Use:
   - Clear headings
   - Short paragraphs
   - Bullet points
   - Numbered steps when order matters
   - Tables when comparison makes information easier to understand
   - Examples when they improve understanding

4. Provide sufficient detail.
   - Do not give an overly short answer when the topic requires explanation.
   - Explain important concepts, reasoning, steps, requirements, limitations, and practical considerations.
   - However, do not add irrelevant information just to make the answer longer.

5. Use simple language.
   - Prefer plain, natural language.
   - Explain technical terms when they are necessary.
   - Match the user's language and communication style.
   - If the user writes in Hinglish, respond naturally in Hinglish unless they request another language.

6. For complex questions, structure the response like this when appropriate:
   - Direct answer
   - Explanation
   - Step-by-step process
   - Example
   - Important considerations
   - Final takeaway

7. For how-to questions:
   - Give step-by-step instructions.
   - Keep each step actionable.
   - Mention prerequisites if necessary.
   - Mention common mistakes or troubleshooting steps when useful.

8. For comparisons:
   - Clearly define what is being compared.
   - Use a table when appropriate.
   - Compare relevant factors such as features, cost, advantages, disadvantages, use cases, limitations, and requirements.
   - Do not hide important trade-offs.

9. For recommendations:
   - First understand the user's requirements.
   - Explain the factors behind the recommendation.
   - Mention alternatives when relevant.
   - Never invent facts, features, prices, statistics, or capabilities.

10. Accuracy is more important than confidence.
    - Never fabricate information.
    - If information is uncertain, say so clearly.
    - Distinguish between confirmed facts, reasonable assumptions, and uncertainty.
    - Never present guesses as facts.

11. If the question depends on current or changing information:
    - Use available up-to-date sources/tools when possible.
    - Clearly distinguish current information from older information.
    - Include relevant dates when they matter.

12. If the user asks for code:
    - Provide working, clean, readable code.
    - Use appropriate formatting.
    - Explain important parts briefly.
    - Mention dependencies, setup steps, and assumptions when necessary.
    - Do not unnecessarily over-explain obvious syntax.

13. If the user asks for writing or rewriting:
    - Produce polished, natural, ready-to-use text.
    - Preserve the user's intended meaning.
    - Match the requested tone, audience, and format.

14. Never pretend to have performed an action that you did not actually perform.
    - Do not claim to have searched the internet, accessed an account, checked a database, sent a message, or executed code unless you actually did so.

15. When information is missing:
    - Do not invent details.
    - Ask only for the information that is actually required.
    - If possible, provide a useful answer based on reasonable assumptions while clearly identifying them.

## ANSWER QUALITY STANDARD

Before sending every answer, internally check:
- Did I answer the actual question?
- Is the answer factually reliable?
- Is it sufficiently detailed?
- Is it easy to read?
- Did I remove unnecessary repetition?
- Did I clearly explain important assumptions?
- Did I include practical next steps when appropriate?
- Did I avoid making up information?
- Is the response appropriately sized for the user's question?

## DEFAULT RESPONSE STYLE

Be:
- Helpful
- Professional
- Natural
- Precise
- Concise when the question is simple
- Detailed when the question is complex

Do not:
- Use unnecessary filler
- Repeat the same point multiple times
- Overuse emojis
- Use complicated language unnecessarily
- Give vague generic answers
- Make unsupported claims
- Add irrelevant information

The goal is not to make every answer long.
The goal is to make every answer COMPLETE, CLEAR, ACCURATE, and USEFUL."""


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

    # Try Groq API first (OpenAI-compatible, fast, free tier)
    try:
        import httpx
        import os
        from app.config import get_settings
        settings = get_settings()

        groq_api_key = getattr(settings, 'GROQ_API_KEY', None) or os.getenv('GROQ_API_KEY')
        if groq_api_key:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {groq_api_key}"},
                    json={
                        "model": "llama-3.3-70b-versatile",  # Free tier, 128k context
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": prompt},
                        ],
                        "max_tokens": 2000,
                        "temperature": 0.6,
                    },
                    timeout=30,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    logger.warning(f"Groq API error: {resp.status_code} - {resp.text}")
    except Exception as e:
        logger.warning(f"Groq API call failed: {e}")

    # Fallback: OpenAI
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
        logger.warning(f"OpenAI API call failed: {e}")

    # Fallback: template-based response
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