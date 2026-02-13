import firebase_admin
from firebase_admin import firestore, initialize_app
from firebase_functions import firestore_fn
from datetime import datetime
from ..utils.risk_engine import RiskEngine

# Initialize Firebase app
initialize_app()
db = firestore.client()

@firestore_fn.on_document_created("transactions/{transactionId}")
def on_transaction_create(event):
    try:
        # Get transaction data and userId
        transaction_data = event.data
        transaction_id = event.params["transactionId"]
        user_id = transaction_data.get("userId")

        if not user_id:
            raise ValueError("Transaction does not have a userId")

        # Fetch user's last 50 transactions
        user_transactions_ref = db.collection("transactions").where("userId", "==", user_id).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(50)
        user_transactions = [doc.to_dict() for doc in user_transactions_ref.stream()]

        # Calculate risk score using RiskEngine
        risk_engine = RiskEngine()
        risk_result = risk_engine.calculate_risk_score(transaction_data, user_transactions)

        # Save risk result to "risk_scores" collection
        risk_score_data = {
            "transactionId": transaction_id,
            "userId": user_id,
            "score": risk_result["score"],
            "riskLevel": risk_result["risk_level"],
            "factors": risk_result["factors"],
            "timestamp": datetime.utcnow()
        }
        risk_score_ref = db.collection("risk_scores").add(risk_score_data)

        # Update original transaction with riskScoreId and riskLevel
        db.collection("transactions").document(transaction_id).update({
            "riskScoreId": risk_score_ref[1].id,
            "riskLevel": risk_result["risk_level"]
        })

        # Create alert if risk level is high or critical
        if risk_result["risk_level"] in ["high", "critical"]:
            alert_data = {
                "transactionId": transaction_id,
                "userId": user_id,
                "riskLevel": risk_result["risk_level"],
                "score": risk_result["score"],
                "timestamp": datetime.utcnow()
            }
            db.collection("alerts").add(alert_data)

    except Exception as e:
        print(f"Error processing transaction {event.params['transactionId']}: {e}")
