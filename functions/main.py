from firebase_functions import https_fn, firestore_fn, scheduler_fn
from firebase_admin import initialize_app

initialize_app()

from src.triggers.on_transaction_create import on_transaction_create
from src.http.chat_stream import chat_stream
from src.http.batch_analyze import batch_analyze
from src.scheduled.aggregate_metrics import aggregate_metrics
