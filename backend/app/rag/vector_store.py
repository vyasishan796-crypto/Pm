import logging

logger = logging.getLogger(__name__)

_collection = None


def get_or_create_collection():
    global _collection
    if _collection is None:
        try:
            import chromadb
            client = chromadb.Client()
            _collection = client.get_or_create_collection(
                name="nexora_documents",
                metadata={"hnsw:space": "cosine"},
            )
            logger.info("Created ChromaDB collection")
        except Exception as e:
            logger.warning(f"ChromaDB not available: {e}")
            _collection = None
    return _collection


def add_documents(doc_ids: list[str], documents: list[str], embeddings: list[list[float]], metadatas: list[dict] = None):
    collection = get_or_create_collection()
    if collection is None:
        return
    try:
        collection.upsert(
            ids=doc_ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
        )
    except Exception as e:
        logger.error(f"Error adding documents to ChromaDB: {e}")


def query_documents(query_embedding: list[float], n_results: int = 5) -> dict:
    collection = get_or_create_collection()
    if collection is None:
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}
    try:
        return collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
        )
    except Exception as e:
        logger.error(f"Error querying ChromaDB: {e}")
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}
