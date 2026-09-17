import logging

logger = logging.getLogger(__name__)

_model = None


def get_embedding_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Loaded sentence-transformers embedding model")
        except Exception as e:
            logger.warning(f"Could not load sentence-transformers: {e}")
            _model = None
    return _model


def get_embeddings(texts: list[str]) -> list[list[float]]:
    model = get_embedding_model()
    if model is None:
        return [[0.0] * 384 for _ in texts]
    return model.encode(texts).tolist()
