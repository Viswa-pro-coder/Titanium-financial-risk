import firebase_admin
from firebase_admin import firestore
from firebase_functions import scheduler_fn
from datetime import datetime, timedelta

# Initialize Firebase app
firebase_admin.initialize_app()
db = firestore.client()

@scheduler_fn.on_schedule("every 60 minutes")
def aggregate_institution_metrics(event):
    """
    Scheduled Cloud Function to aggregate institution metrics every 60 minutes.
    """
    try:
        # Get the current timestamp and 24 hours ago
        now = datetime.utcnow()
        one_day_ago = now - timedelta(hours=24)

        # Query users collection for B2B and B2Pro tiers
        users_ref = db.collection("users").where("tier", "in", ["b2b", "b2pro"])
        users = [user.to_dict() for user in users_ref.stream()]

        for user in users:
            institution_id = user.get("institutionId")
            if not institution_id:
                continue

            # Query transactions for the last 24 hours
            transactions_ref = db.collection("transactions").where("userId", "==", user["userId"]).where("timestamp", ">=", one_day_ago)
            transactions = [t.to_dict() for t in transactions_ref.stream()]

            # Calculate metrics
            total_volume = sum(t.get("amount", 0) for t in transactions)
            transaction_count = len(transactions)
            avg_transaction_value = total_volume / transaction_count if transaction_count > 0 else 0
            avg_risk_score = sum(t.get("riskScore", 0) for t in transactions) / transaction_count if transaction_count > 0 else 0

            high_risk_count = sum(1 for t in transactions if t.get("riskScore", 0) >= 75)
            medium_risk_count = sum(1 for t in transactions if 40 <= t.get("riskScore", 0) < 75)
            low_risk_count = sum(1 for t in transactions if t.get("riskScore", 0) < 40)

            # Count merchant types
            merchant_type_counts = {}
            for t in transactions:
                merchant_type = t.get("merchantType", "unknown")
                merchant_type_counts[merchant_type] = merchant_type_counts.get(merchant_type, 0) + 1

            top_5_merchant_types = sorted(merchant_type_counts.items(), key=lambda x: x[1], reverse=True)[:5]

            # Save metrics to Firestore
            metrics_data = {
                "institutionId": institution_id,
                "timestamp": now,
                "totalVolume": total_volume,
                "transactionCount": transaction_count,
                "avgTransactionValue": avg_transaction_value,
                "avgRiskScore": avg_risk_score,
                "highRiskCount": high_risk_count,
                "mediumRiskCount": medium_risk_count,
                "lowRiskCount": low_risk_count,
                "topMerchantTypes": [merchant[0] for merchant in top_5_merchant_types]
            }

            document_id = f"{institution_id}_{now.strftime('%Y%m%d%H%M%S')}"
            db.collection("institution_metrics").document(document_id).set(metrics_data)

            print(f"Metrics saved for institution {institution_id} with document ID {document_id}")

    except Exception as e:
        print(f"Error aggregating institution metrics: {str(e)}")
