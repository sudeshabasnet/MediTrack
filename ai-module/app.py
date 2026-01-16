from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# Simple forecasting model for medicine demand
class MedicineForecastModel:
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train(self, historical_data):
        """Train the model with historical medicine usage data"""
        try:
            df = pd.DataFrame(historical_data)
            
            # Feature engineering
            df['date'] = pd.to_datetime(df['date'])
            df['month'] = df['date'].dt.month
            df['day_of_week'] = df['date'].dt.dayofweek
            
            X = df[['month', 'day_of_week', 'current_stock']].values
            y = df['demand'].values
            
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            self.is_trained = True
            
            return {"status": "success", "message": "Model trained successfully"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def predict(self, features):
        """Predict future demand based on features"""
        if not self.is_trained:
            return {"error": "Model not trained yet"}
        
        try:
            features_scaled = self.scaler.transform([features])
            prediction = self.model.predict(features_scaled)[0]
            return {"predicted_demand": max(0, int(prediction))}
        except Exception as e:
            return {"error": str(e)}

# Initialize model
forecast_model = MedicineForecastModel()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "MediTrack AI Module"})

@app.route('/api/forecast/train', methods=['POST'])
def train_model():
    """Train the forecasting model with historical data"""
    try:
        data = request.get_json()
        historical_data = data.get('historical_data', [])
        
        result = forecast_model.train(historical_data)
        return jsonify(result), 200 if result['status'] == 'success' else 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/forecast/predict', methods=['POST'])
def predict_demand():
    """Predict medicine demand for given features"""
    try:
        data = request.get_json()
        month = data.get('month', datetime.now().month)
        day_of_week = data.get('day_of_week', datetime.now().weekday())
        current_stock = data.get('current_stock', 0)
        
        features = [month, day_of_week, current_stock]
        prediction = forecast_model.predict(features)
        
        return jsonify(prediction), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analytics/expiry-alerts', methods=['POST'])
def expiry_alerts():
    """Generate expiry alerts for medicines"""
    try:
        data = request.get_json()
        medicines = data.get('medicines', [])
        
        today = datetime.now().date()
        alerts = []
        
        for medicine in medicines:
            expiry_date = datetime.strptime(medicine['expiryDate'], '%Y-%m-%d').date()
            days_until_expiry = (expiry_date - today).days
            
            if days_until_expiry <= 30:
                alert_level = 'critical' if days_until_expiry <= 7 else 'warning'
                alerts.append({
                    'medicineId': medicine.get('id'),
                    'medicineName': medicine.get('name'),
                    'expiryDate': medicine['expiryDate'],
                    'daysUntilExpiry': days_until_expiry,
                    'alertLevel': alert_level,
                    'stock': medicine.get('currentStock', 0)
                })
        
        return jsonify({"alerts": alerts}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analytics/stock-recommendations', methods=['POST'])
def stock_recommendations():
    """Generate stock recommendations based on usage patterns"""
    try:
        data = request.get_json()
        medicines = data.get('medicines', [])
        usage_history = data.get('usage_history', [])
        
        recommendations = []
        
        for medicine in medicines:
            current_stock = medicine.get('currentStock', 0)
            min_stock = medicine.get('minStockLevel', 0)
            
            # Calculate average usage from history
            if usage_history:
                avg_usage = np.mean([h.get('quantity', 0) for h in usage_history])
                recommended_stock = max(min_stock * 2, int(avg_usage * 30))  # 30 days supply
            else:
                recommended_stock = min_stock * 2
            
            if current_stock < recommended_stock:
                recommendations.append({
                    'medicineId': medicine.get('id'),
                    'medicineName': medicine.get('name'),
                    'currentStock': current_stock,
                    'recommendedStock': recommended_stock,
                    'reorderQuantity': recommended_stock - current_stock,
                    'priority': 'high' if current_stock < min_stock else 'medium'
                })
        
        return jsonify({"recommendations": recommendations}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

