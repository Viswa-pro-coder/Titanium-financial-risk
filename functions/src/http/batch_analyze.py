from flask import Flask, request, jsonify
from firebase_admin import firestore
from firebase_functions import https_fn
from datetime import datetime
import firebase_admin
from firebase_admin import initialize_app

# Initialize Firebase app
initialize_app()
db = firestore.client()

app = Flask(__name__)

@app.route('/batch_analyze', methods=['POST'])
def batch_analyze():
    """
    HTTP Cloud Function to handle bulk risk analysis requests.
    Stub for Person 4 - implement actual batch processing here.
    """
    try:
        # Set CORS headers
        response_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        }

        # Validate request method
        if request.method != 'POST':
            return jsonify({"error": "Method not allowed"}), 405, response_headers

        # Parse and validate JSON body
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400, response_headers

        user_ids = data.get('userIds', [])
        analysis_type = data.get('analysisType')
        parameters = data.get('parameters', {})

        if not user_ids or not isinstance(user_ids, list):
            return jsonify({"error": "userIds must be a non-empty array"}), 400, response_headers

        # Create batch job document in Firestore
        batch_job_data = {
            "userIds": user_ids,
            "analysisType": analysis_type,
            "parameters": parameters,
            "status": "queued",
            "totalUsers": len(user_ids),
            "processedUsers": 0,
            "results": [],
            "createdAt": datetime.utcnow(),
            "startedAt": None,
            "completedAt": None
        }
        batch_job_ref = db.collection("batch_jobs").add(batch_job_data)

        # Return response
        response_data = {
            "jobId": batch_job_ref[1].id,
            "status": "queued",
            "message": f"Batch job created for {len(user_ids)} users."
        }
        return jsonify(response_data), 202, response_headers

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500, response_headers

# Export the function for Firebase Functions
batch_analyze_function = https_fn.wrap_flask_app(app)
