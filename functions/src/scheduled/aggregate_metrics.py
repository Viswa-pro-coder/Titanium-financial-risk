from firebase_functions import scheduler_fn
from firebase_admin import firestore, initialize_app
from datetime import datetime, timedelta

# Initialize Firebase Admin if not already initialized
if not firestore.api_client:
    initialize_app()

db = firestore.client()

@scheduler_fn.on_schedule(schedule="every 5 minutes")
def aggregate_metrics(event):
    # Get all institutions
    institutions = db.collection('institutions').stream()
    count = 0
    
    for inst in institutions:
        inst_id = inst.id
        inst_ref = inst.reference
        count += 1
        
        # Get all linked users
        users = inst_ref.collection('users').stream()
        user_ids = [u.id for u in users]
        
        if not user_ids:
            continue
        
        # Aggregate risk scores
        total_risk = 0
        high_risk_count = 0
        critical_count = 0
        
        for uid in user_ids:
            risk_doc = db.collection('users').document(uid).collection('risk_snapshots').document('latest').get()
            if risk_doc.exists:
                score = risk_doc.to_dict().get('value', 50)
                total_risk += score
                if score > 70:
                    high_risk_count += 1
                if score > 85:
                    critical_count += 1
        
        avg_risk = total_risk / len(user_ids) if user_ids else 50
        
        # Update metrics
        inst_ref.collection('metrics').document('realtime').set({
            'average_risk': avg_risk,
            'total_customers': len(user_ids),
            'high_risk_count': high_risk_count,
            'critical_count': critical_count,
            'compliance_rate': 100 - (high_risk_count / len(user_ids) * 100) if user_ids else 100,
            'updated_at': firestore.SERVER_TIMESTAMP
        })
    
    return f"Aggregated {count} institutions"
