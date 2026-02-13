class RiskEngine:
    def __init__(self):
        # Define weights for each risk factor
        self.weights = {
            'amount': 0.3,
            'frequency': 0.25,
            'location': 0.2,
            'time': 0.15,
            'merchant': 0.1
        }

    def calculate_risk_score(self, transaction, user_history):
        """
        Calculate the risk score for a transaction based on various factors.

        Args:
            transaction (dict): A dictionary containing transaction details.
            user_history (list): A list of past transactions for the user.

        Returns:
            dict: A dictionary containing the risk score, risk level, and factors breakdown.
        """
        factors = {
            'amount': self._calculate_amount_risk(transaction),
            'frequency': self._calculate_frequency_risk(transaction, user_history),
            'location': self._calculate_location_risk(transaction, user_history),
            'time': self._calculate_time_risk(transaction),
            'merchant': self._calculate_merchant_risk(transaction)
        }

        # Calculate the total risk score
        total_score = sum(factors[factor] * self.weights[factor] for factor in factors)

        # Determine risk level
        if total_score < 25:
            risk_level = 'low'
        elif total_score < 50:
            risk_level = 'medium'
        elif total_score < 75:
            risk_level = 'high'
        else:
            risk_level = 'critical'

        return {
            'score': total_score,
            'risk_level': risk_level,
            'factors': factors
        }

    def _calculate_amount_risk(self, transaction):
        """Calculate risk based on transaction amount."""
        amount = transaction.get('amount', 0)
        if amount > 10000:
            return 100
        elif amount > 5000:
            return 75
        elif amount > 1000:
            return 50
        elif amount > 500:
            return 25
        else:
            return 10

    def _calculate_frequency_risk(self, transaction, user_history):
        """Calculate risk based on transaction frequency."""
        recent_transactions = [t for t in user_history if t['timestamp'] > transaction['timestamp'] - 86400]  # Last 24 hours
        if len(recent_transactions) > 10:
            return 100
        elif len(recent_transactions) > 5:
            return 75
        elif len(recent_transactions) > 3:
            return 50
        elif len(recent_transactions) > 1:
            return 25
        else:
            return 10

    def _calculate_location_risk(self, transaction, user_history):
        """Calculate risk based on transaction location."""
        location = transaction.get('location', '')
        user_locations = {t['location'] for t in user_history}
        if location not in user_locations:
            return 100
        return 10

    def _calculate_time_risk(self, transaction):
        """Calculate risk based on transaction time."""
        time_of_day = transaction.get('time_of_day', 12)  # Assume 24-hour format
        if 0 <= time_of_day < 6:  # Night time
            return 100
        elif 6 <= time_of_day < 9:  # Early morning
            return 50
        elif 9 <= time_of_day < 18:  # Day time
            return 10
        else:  # Evening
            return 25

    def _calculate_merchant_risk(self, transaction):
        """Calculate risk based on merchant type."""
        merchant_type = transaction.get('merchant_type', '').lower()
        high_risk_merchants = {'gambling', 'crypto'}
        medium_risk_merchants = {'electronics', 'travel'}

        if merchant_type in high_risk_merchants:
            return 100
        elif merchant_type in medium_risk_merchants:
            return 50
        else:
            return 10