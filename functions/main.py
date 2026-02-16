import firebase_admin
from firebase_admin import credentials, initialize_app

# Initialize Firebase Admin if not already initialized
if not firebase_admin._apps:
    try:
        initialize_app()
    except Exception as e:
        print(f"Error initializing Firebase Admin: {e}")

# Import functions from src modules
from src.triggers.on_transaction_create import on_transaction_create
from src.http.chat_stream import chat_stream
from src.http.batch_analyze import batch_analyze
from src.http.generate_report import generate_report
from src.scheduled.aggregate_metrics import aggregate_metrics

# Export all functions
__all__ = [
    "on_transaction_create",
    "chat_stream",
    "batch_analyze",
    "generate_report",
    "aggregate_metrics"
]
