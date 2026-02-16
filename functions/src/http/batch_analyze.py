from firebase_functions import https_fn
from firebase_admin import firestore, initialize_app
import json
import csv
import io
from datetime import datetime

# Initialize Firebase Admin if not already initialized
if not firestore.api_client:
    initialize_app()

db = firestore.client()

@https_fn.on_request()
def batch_analyze(req):
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
        analyst_id = data.get('analystId')
        csv_content = data.get('csv')  # Base64 or raw CSV string
        
        if not analyst_id or not csv_content:
            return https_fn.Response(
                json.dumps({'success': False, 'error': 'Missing analystId or csv'}),
                mimetype='application/json',
                status=400,
                headers=headers
            )

        # Parse CSV
        csv_file = io.StringIO(csv_content)
        reader = csv.DictReader(csv_file)
        
        results = []
        for row in reader:
            client_id = row.get('client_id', 'unknown')
            # Simple risk calc based on provided data
            try:
                income = float(row.get('income', 0))
                expenses = float(row.get('expenses', 0))
                debt = float(row.get('debt', 0))
            except (ValueError, TypeError):
                income, expenses, debt = 0, 0, 0
            
            # Basic risk formula
            risk = 30
            if income > 0 and expenses > income * 0.8:
                risk += 30
            if income > 0 and debt > income * 3:
                risk += 25
            
            results.append({
                'client_id': client_id,
                'risk_score': min(100, risk),
                'status': 'completed',
                'analyzed_at': datetime.now().isoformat()
            })
        
        # Store results for analyst
        batch_ref = db.collection('analysts').document(analyst_id).collection('batch_results').document()
        batch_ref.set({
            'results': results,
            'created_at': firestore.SERVER_TIMESTAMP,
            'total_clients': len(results)
        })
        
        return https_fn.Response(
            json.dumps({'success': True, 'batch_id': batch_ref.id, 'results': results}),
            mimetype='application/json',
            headers=headers
        )
        
    except Exception as e:
        return https_fn.Response(
            json.dumps({'success': False, 'error': str(e)}),
            mimetype='application/json',
            status=500,
            headers=headers
        )
