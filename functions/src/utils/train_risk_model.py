try:
    import xgboost as xgb
    HAS_XGB = True
except ImportError:
    HAS_XGB = False
    print("Warning: XGBoost not found. Training with RandomForest/LogisticRegression only.")

from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd
import numpy as np
import joblib
import os
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

# Set seed for reproducibility
np.random.seed(42)

def generate_synthetic_data(n_samples=2000):
    """
    Generates synthetic transaction data for training an ensemble risk model.
    """
    data = []
    
    for _ in range(n_samples):
        # Features
        amount = np.random.exponential(scale=500) # Most transactions are small
        time_of_day = np.random.randint(0, 24)
        
        # 0: Low risk location, 1: High risk location
        location_risk = np.random.choice([0, 1], p=[0.9, 0.1])
        
        # 0: Normal merchant, 1: High risk merchant (gambling, crypto)
        merchant_risk = np.random.choice([0, 1], p=[0.95, 0.05])
        
        # Frequency of recent transactions (simulated)
        frequency = np.random.poisson(lam=2)
        
        # Determine Label (Fraud/High Risk = 1, Legit = 0)
        # Base probability
        risk_prob = 0.01
        
        # Add risk factors with varying weights
        if amount > 5000: risk_prob += 0.4
        if time_of_day < 5: risk_prob += 0.15 # Late night
        if location_risk == 1: risk_prob += 0.25
        if merchant_risk == 1: risk_prob += 0.3
        if frequency > 5: risk_prob += 0.2
        
        # Add random noise
        noise = np.random.normal(0, 0.05)
        risk_prob += noise
        
        # Cap probability
        risk_prob = min(max(risk_prob, 0.0), 0.95)
        
        is_fraud = np.random.choice([0, 1], p=[1-risk_prob, risk_prob])
        
        data.append({
            'amount': amount,
            'time_of_day': time_of_day,
            'location_risk': location_risk,
            'merchant_risk': merchant_risk,
            'frequency': frequency,
            'is_fraud': is_fraud
        })
        
    return pd.DataFrame(data)

def train_ensemble_model():
    print("Generating synthetic data for Ensemble training...")
    df = generate_synthetic_data(3000)
    
    X = df.drop('is_fraud', axis=1)
    y = df['is_fraud']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Initializing classifiers...")
    
    estimators = []

    # Initialize individual models
    if HAS_XGB:
        clf1 = xgb.XGBClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=3,
            objective='binary:logistic',
            use_label_encoder=False,
            eval_metric='logloss',
            random_state=42
        )
        estimators.append(('xgb', clf1))
    
    clf2 = RandomForestClassifier(
        n_estimators=100, 
        random_state=42,
        max_depth=5
    )
    estimators.append(('rf', clf2))
    
    clf3 = LogisticRegression(
        random_state=42,
        max_iter=1000
    )
    estimators.append(('lr', clf3))
    
    # Create Voting Classifier (Soft Voting for probabilities)
    # Adjust weights based on available models
    weights = [2, 1, 1] if HAS_XGB else [1, 1]

    eclf = VotingClassifier(
        estimators=estimators,
        voting='soft',
        weights=weights
    )
    
    print("Training Ensemble Model (VotingClassifier)...")
    eclf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = eclf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Ensemble Model Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model using joblib (efficient for sklearn models)
    output_path = os.path.join(os.path.dirname(__file__), 'risk_model.joblib')
    joblib.dump(eclf, output_path)
    print(f"Ensemble Model saved to {output_path}")

if __name__ == "__main__":
    train_ensemble_model()
