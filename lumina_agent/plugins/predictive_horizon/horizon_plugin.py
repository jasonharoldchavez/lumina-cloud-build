import math
import json
from pathlib import Path

class HorizonPlugin:
    def __init__(self):
        self.name = "PredictiveHorizon"
        self.data_file = Path("logs/drift_history.json")
        self.out_file = Path("logs/horizon_forecast.json")

    def _load_drift_data(self):
        if not self.data_file.exists():
            return []
        try:
            return json.loads(self.data_file.read_text())
        except:
            return []

    def _moving_average(self, values, window=3):
        if len(values) < window:
            return sum(values) / len(values)
        return sum(values[-window:]) / window

    def predict(self):
        data = self._load_drift_data()
        if not data:
            forecast = {
                "prediction": "INSUFFICIENT_DATA",
                "message": "Run the agent multiple times to build drift history."
            }
            self.out_file.write_text(json.dumps(forecast, indent=4))
            return forecast

        drift_values = [entry["drift"] for entry in data if "drift" in entry]

        trend = self._moving_average(drift_values, window=5)
        last = drift_values[-1] if drift_values else 0

        prediction = "STABLE"
        risk = "LOW"

        if trend > 5:
            prediction = "UPWARD_DRIFT"
            risk = "MEDIUM"
        if trend > 10:
            prediction = "ESCALATION"
            risk = "HIGH"
        if trend < -5:
            prediction = "RECOVERY"

        forecast = {
            "last_drift": last,
            "trend_ma5": trend,
            "prediction": prediction,
            "risk_level": risk
        }

        self.out_file.write_text(json.dumps(forecast, indent=4))
        return forecast

def register():
    return HorizonPlugin()
