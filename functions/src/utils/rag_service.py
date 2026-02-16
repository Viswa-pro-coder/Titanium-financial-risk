import chromadb
import os

class RAGService:
    def __init__(self):
        self.persist_directory = os.path.join(os.path.dirname(__file__), "chroma_db")
        self.client = None
        self.collection = None
        self._initialize()

    def _initialize(self):
        try:
            import chromadb
            if os.path.exists(self.persist_directory):
                self.client = chromadb.PersistentClient(path=self.persist_directory)
                self.collection = self.client.get_collection(name="finguard_knowledge")
        except Exception as e:
            print(f"RAG ChromaDB unavailable, using keyword fallback: {e}")

    def query(self, text, n_results=2):
        # Keyword-based fallback for showcase if ChromaDB is not ready
        if not self.collection:
            return self._keyword_search(text)
        
        try:
            results = self.collection.query(
                query_texts=[text],
                n_results=n_results
            )
            return results['documents'][0] if results['documents'] else []
        except Exception as e:
            print(f"RAG Query error: {e}")
            return self._keyword_search(text)

    def _keyword_search(self, text):
        """Simulated RAG search for showcase when ChromaDB is unavailable."""
        text = text.lower()
        knowledge = {
            "risk": "FinGuard AI uses a multi-factor Ensemble Risk Engine (XGBoost/RF) with a soft voting mechanism.",
            "budget": "The 50/30/20 rule suggests: 50% Needs, 30% Wants, 20% Savings/Debt.",
            "save": "Emergency funds should cover 3-6 months of essential living expenses.",
            "privacy": "Field-level encryption (AES-256) protects sensitive merchant and description data.",
            "score": "Scores above 75 require immediate review and enabling 2FA on all linked accounts."
        }
        
        matches = [val for key, val in knowledge.items() if key in text]
        return matches[:2]

def get_rag_context(message):
    service = RAGService()
    context_docs = service.query(message)
    if not context_docs:
        return ""
    
    context = "\n".join([f"- {doc}" for doc in context_docs])
    return f"RELEVANT CONTEXT FROM FINGUARD KNOWLEDGE BASE:\n{context}\n"
