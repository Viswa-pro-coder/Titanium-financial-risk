from firebase_functions import https_fn
from firebase_admin import firestore, initialize_app
import json
import re
from src.utils.rag_service import get_rag_context
from src.utils.encryption import decrypt

# Initialize Firebase Admin if not already initialized
if not firestore.api_client:
    initialize_app()

db = firestore.client()

KNOWLEDGE_BASE = {
    "high_risk": "Your risk score is elevated. Based on our Ensemble model (XGBoost/RF), you should immediately review your latest transactions.",
    "budget": "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
    "savings": "Aim for an emergency fund covering 3 months of expenses.",
    "privacy": "Rest assured, your sensitive data is protected with AES-256 field-level encryption.",
    "default": "I am your FinGuard AI advisor, specializing in risk management and financial wellness."
}

def simulate_llama_response(message, context, score):
    """
    Simulates a high-quality response from a fine-tuned Llama-3 model.
    Incorporates RAG context and user-specific risk data.
    """
    prompt = f"[INST] User Query: {message}\nRisk Score: {score}\nContext: {context} [/INST]"
    
    # Showcase Response Logic
    if "risk" in message or score > 70:
        return f"Based on your current risk score of {score}, and the context retrieved from our FinGuard knowledge base, I recommend immediate action. {context}. Our primary analysis indicates we should secure your account and review the individual factors contributing to this trend."
    
    if "privacy" in message or "secure" in message or "encryption" in message:
        return f"Regarding your query on data safety: {context}. We implement robust AES-256 field-level encryption across all transaction layers to ensure your merchant details and descriptions are never exposed to unauthorized entities."

    if context:
        return f"Analyzing your request with our fine-tuned FinGuard-Llama engine... {context} This insight aligns with your current financial profile. Would you like a detailed breakdown of these recommendations?"
    
    return f"As your personal FinGuard AI advisor, I've analyzed your financial state. I recommend maintaining a 20% savings rate and monitoring your risk levels weekly. Is there a specific transaction category you're concerned about?"


@https_fn.on_request()
def chat_stream(req):
    # Enable CORS
    if req.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return https_fn.Response('', status=204, headers=headers)

    headers = {'Access-Control-Allow-Origin': '*'}

    if req.method != 'POST':
        return https_fn.Response('Method not allowed', status=405, headers=headers)
    
    try:
        data = req.get_json()
        user_id = data.get('userId')
        message = data.get('message', '').lower()
        tier = data.get('tier', 'consumer')
        
        if not user_id:
            return https_fn.Response('User ID is required', status=400, headers=headers)

        # Get user context
        risk_doc = db.collection('users').document(user_id).collection('risk_snapshots').document('latest').get()
        risk_data = risk_doc.to_dict() or {}
        score = risk_data.get('value', 50)
        
        # Get RAG Context
        context = get_rag_context(message)
        
        # Generate model-like response (Simulation of fine-tuned Llama/Gemma)
        response = simulate_llama_response(message, context, score)

        
        # Streaming response simulation
        def generate():
            words = response.split()
            for word in words:
                yield f"data: {json.dumps({'token': word + ' '})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        
        stream_headers = {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream'
        }
        
        return https_fn.Response(
            generate(),
            headers=stream_headers
        )
        
    except Exception as e:
        return https_fn.Response(f"Error: {str(e)}", status=500, headers=headers)
