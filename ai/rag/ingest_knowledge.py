import chromadb
import os

# Define knowledge base documents
DOCUMENTS = [
    {
        "id": "doc1",
        "text": "FinGuard AI uses a multi-factor Ensemble Risk Engine combining XGBoost, Random Forest, and Logistic Regression. This provides a soft voting mechanism for fraud detection.",
        "metadata": {"category": "technical", "topic": "risk_engine"}
    },
    {
        "id": "doc2",
        "text": "For high risk scores (above 75), users should immediately review their last 5 transactions and enable two-factor authentication on all linked bank accounts.",
        "metadata": {"category": "advice", "topic": "high_risk"}
    },
    {
        "id": "doc3",
        "text": "The 50/30/20 budgeting rule suggests allocating 50% of income to Needs, 30% to Wants, and 20% to Savings or Debt Repayment.",
        "metadata": {"category": "advice", "topic": "budgeting"}
    },
    {
        "id": "doc4",
        "text": "Emergency funds should ideally cover 3-6 months of essential living expenses. Start by saving small amounts daily to build this cushion.",
        "metadata": {"category": "advice", "topic": "savings"}
    },
    {
        "id": "doc5",
        "text": "Field-level encryption (AES-256) is applied to sensitive transaction data in FinGuard AI, ensuring that merchants and descriptions remain private.",
        "metadata": {"category": "technical", "topic": "privacy"}
    }
]

def ingest():
    print("Initializing ChromaDB...")
    # Using a local persistent directory for the showcase
    persist_directory = os.path.join(os.getcwd(), "functions", "src", "utils", "chroma_db")
    client = chromadb.PersistentClient(path=persist_directory)
    
    collection = client.get_or_create_collection(name="finguard_knowledge")
    
    print(f"Ingesting {len(DOCUMENTS)} documents...")
    collection.upsert(
        documents=[doc["text"] for doc in DOCUMENTS],
        metadatas=[doc["metadata"] for doc in DOCUMENTS],
        ids=[doc["id"] for doc in DOCUMENTS]
    )
    print("Ingestion complete. Knowledge base is ready.")

if __name__ == "__main__":
    ingest()
