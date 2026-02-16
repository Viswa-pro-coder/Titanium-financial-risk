from firebase_functions import firestore_fn
from firebase_admin import firestore, initialize_app
import json
from datetime import datetime, timedelta

# Initialize Firebase Admin if not already initialized
if not firestore.api_client:
    initialize_app()

db = firestore.client()

def calculate_risk_features(transactions):
    """Calculate risk features from transaction list"""
    if not transactions:
        return {"score": 50, "factors": ["insufficient_data"]}
    
    amounts = [t.get('amount', 0) for t in transactions]
    categories = [t.get('category', 'unknown') for t in transactions]
    
    # Velocity features
    now = datetime.now()
    total_7d = sum(a for a, t in zip(amounts, transactions) 
                   if t.get('timestamp', now).replace(tzinfo=None) > now - timedelta(days=7))
    total_30d = sum(a for a, t in zip(amounts, transactions) 
                    if t.get('timestamp', now).replace(tzinfo=None) > now - timedelta(days=30))
    
    # Category analysis
    high_risk_cats = ['cash_advance', 'gambling', 'pawn']
    high_risk_count = sum(1 for c in categories if c in high_risk_cats)
    
    # Calculate score (0-100, higher = more risky)
    score = 30  # Base score
    
    if total_30d < -50000:  # High spending
        score += 20
    if high_risk_count > 0:
        score += 25
    if len(transactions) < 5:  # New user
        score += 10
    
    factors = []
    if total_30d < -50000:
        factors.append("high_monthly_spending")
    if high_risk_count > 0:
        factors.append("high_risk_transactions")
    if total_7d < total_30d / 4:  # Spending accelerating
        factors.append("spending_velocity_increasing")
    
    return {
        "score": min(100, max(0, score)),
        "factors": factors if factors else ["stable_pattern"],
        "total_7d": total_7d,
        "total_30d": total_30d
    }

@firestore_fn.on_document_created(document="users/{userId}/transactions/{txId}")
def on_transaction_create(event):
    user_id = event.params["userId"]
    
    # Get last 90 days of transactions
    txs_ref = db.collection('users').document(user_id).collection('transactions')
    cutoff = datetime.now() - timedelta(days=90)
    # Note: Firestore query might require an index for order_by and where
    txs = txs_ref.where('timestamp', '>', cutoff).order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
    
    transactions = [t.to_dict() for t in txs]
    
    # Calculate risk
    risk = calculate_risk_features(transactions)
    
    # Update risk snapshot
    db.collection('users').document(user_id).collection('risk_snapshots').document('latest').set({
        'value': risk['score'],
        'factors': risk['factors'],
        'trend': 'up' if risk['score'] > 50 else 'down',
        'timestamp': firestore.SERVER_TIMESTAMP,
        'total_7d': risk.get('total_7d', 0),
        'total_30d': risk.get('total_30d', 0)
    })
    
    # Create alert if high risk
    if risk['score'] > 60:
        db.collection('users').document(user_id).collection('alerts').add({
            'title': 'High Financial Risk Detected',
            'message': f"Your risk score is {risk['score']}/100. {', '.join(risk['factors'])}",
            'severity': 'high' if risk['score'] > 75 else 'medium',
            'type': 'predictive',
            'acknowledged': False,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
    
    return f"Updated risk for {user_id}: {risk['score']}"
