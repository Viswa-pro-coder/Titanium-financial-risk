import sys
import os

# Add functions/src to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from src.utils.risk_engine import RiskEngine

def test_risk_engine():
    engine = RiskEngine()
    
    # Test Transaction (Likely High Risk)
    transaction = {
        'amount': 8000,
        'time_of_day': 3, # Late night
        'location': 'New Location',
        'merchant_type': 'gambling'
    }
    
    user_history = [] # Empty history implies new location risk
    
    result = engine.calculate_risk_score(transaction, user_history)
    
    print(f"Risk Score: {result['score']}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Factors: {result['factors']}")

    if result['score'] > 0:
        print("SUCCESS: Risk engine calculated a score.")
    else:
        print("FAILURE: Risk score is zero.")

if __name__ == "__main__":
    test_risk_engine()
