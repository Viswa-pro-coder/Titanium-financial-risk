from firebase_functions import firestore_fn
from firebase_admin import firestore
import logging

# Placeholder for on_transaction_create
@firestore_fn.on_document_created(document="users/{userId}/transactions/{transactionId}")
def on_transaction_create(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]) -> None:
    """
    Triggered when a new transaction is created.
    """
    try:
        snapshot = event.data
        if not snapshot:
            return

        transaction_data = snapshot.to_dict()
        logging.info(f"New transaction created: {event.params['transactionId']}")

        # Add logic here (e.g., risk calculation)

    except Exception as e:
        logging.error(f"Error processing transaction: {e}")
