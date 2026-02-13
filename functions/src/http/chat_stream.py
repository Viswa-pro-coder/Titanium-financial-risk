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

@app.route('/chat_stream', methods=['POST'])
def chat_stream():
    """
    HTTP Cloud Function to handle AI chatbot requests.
    Stub for Person 3 - implement actual LLM streaming here.
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

        user_id = data.get('userId')
        message = data.get('message')
        context = data.get('context', {})

        if not user_id or not message:
            return jsonify({"error": "Missing required fields: userId and message"}), 400, response_headers

        # Save request to Firestore
        chat_request_data = {
            "userId": user_id,
            "message": message,
            "context": context,
            "status": "pending",
            "timestamp": datetime.utcnow()
        }
        chat_request_ref = db.collection("chat_requests").add(chat_request_data)

        # Return response
        response_data = {
            "requestId": chat_request_ref[1].id,
            "status": "received",
            "response": f"Echo: {message}"  # Placeholder echo response
        }
        return jsonify(response_data), 200, response_headers

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500, response_headers

# Export the function for Firebase Functions
chat_stream_function = https_fn.wrap_flask_app(app)
