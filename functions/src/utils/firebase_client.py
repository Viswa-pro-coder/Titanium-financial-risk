import firebase_admin
from firebase_admin import firestore

def get_db():
    """
    Returns Firestore client.
    """
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    return firestore.client()
