import firebase_admin
from firebase_admin import credentials

# Import functions from src modules
from src.triggers.on_transaction_create import on_transaction_create
from src.http.chat_stream import chat_stream_function
from src.http.batch_analyze import batch_analyze_function
from src.scheduled.aggregate_metrics import aggregate_institution_metrics

# Initialize Firebase Admin if not already initialized
if not firebase_admin._apps:
    try:
        firebase_admin.initialize_app()
    except Exception as e:
        print(f"Error initializing Firebase Admin: {e}")

# Export all functions
__all__ = [
    "on_transaction_create",
    "chat_stream_function",
    "batch_analyze_function",
    "aggregate_institution_metrics"
]
