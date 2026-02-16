from firebase_functions import https_fn
from firebase_admin import firestore, initialize_app
import json
from datetime import datetime

# Initialize Firebase Admin if not already initialized
if not firestore.api_client:
    initialize_app()

db = firestore.client()

@https_fn.on_request()
def generate_report(req):
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
        template_id = data.get('templateId')
        
        if not analyst_id or not template_id:
            return https_fn.Response(
                json.dumps({'success': False, 'error': 'Missing analystId or templateId'}),
                mimetype='application/json',
                status=400,
                headers=headers
            )

        # In a real app, we'd fetch actual client data and generate a PDF
        # For now, we'll return a "structured report" that the frontend can "download"
        
        report_content = {
            'title': f"Risk Assessment Report - {datetime.now().strftime('%Y-%m-%d')}",
            'analyst': analyst_id,
            'template': template_id,
            'timestamp': datetime.now().isoformat(),
            'summary': "AI analysis indicates a 15% increase in high-risk transactions across the portfolio.",
            'sections': [
                {
                    'title': 'Portfolio Overview',
                    'content': 'The portfolio remains stable with an average risk score of 42. High-risk segments are concentrated in the 18-25 age demographic.'
                },
                {
                    'title': 'Anomalies Detected',
                    'content': 'Detected 3 instances of unusual transaction patterns in the healthcare category that warrants further investigation.'
                }
            ],
            'recommendations': [
                "Increase monitoring frequency for critical cases",
                "Update fraud detection rules for healthcare merchants",
                "Contact Top 5 high-risk clients for wellness review"
            ]
        }
        
        return https_fn.Response(
            json.dumps({'success': True, 'report': report_content}),
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
