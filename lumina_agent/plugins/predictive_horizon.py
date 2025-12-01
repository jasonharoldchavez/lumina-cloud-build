import os, json, math
from datetime import datetime

LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs")
HORIZON_FILE = os.path.join(LOG_DIR, "horizon_forecast.json")
HISTORY_FILE = os.path.join(LOG_DIR, "drift_history.json")

class Plugin:
    def __init__(self):
        os.makedirs(LOG_DIR, exist_ok=True)

    def _load_history(self):
        try:
            if not os.path.exists(HISTORY_FILE):
                return []
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except:
            return []

    def _save_history(self, hist):
        with open(HISTORY_FILE, "w") as f:
            json.dump(hist, f, indent=2)

    def predict(self, vec, penalty, state, log):
        hist = self._load_history()
        entry = {"ts": datetime.utcnow().isoformat(), "vec": vec, "penalty": penalty.total, "state": state}
        hist.append(entry)
        # keep last 200 entries
        hist = hist[-200:]
        self._save_history(hist)

        # compute simple drift metric: mean distance between last N points
        def dist(a,b): return math.sqrt(sum((a[i]-b[i])**2 for i in range(3)))
        drift = 0.0
        if len(hist) >= 2:
            ds = [dist(hist[i]["vec"], hist[i-1]["vec"]) for i in range(1, len(hist))]
            drift = sum(ds)/len(ds) if ds else 0.0

        # simple projection: penalty growth factor from recent drift
        growth = 1.0 + min(5.0, drift*0.1)
        projected = penalty.total * (growth ** 3)

        forecast = {
            "generated": datetime.utcnow().isoformat(),
            "current_vector": vec,
            "current_penalty": penalty.total,
            "drift_mean": drift,
            "projected_penalty_in_3": projected,
            "projected_state_in_3": "TSLP_LOCKOUT" if projected >= 10 else "TSLP_ALIGNED"
        }

        with open(HORIZON_FILE, "w") as f:
            json.dump(forecast, f, indent=2)

        log(f"[HORIZON] updated: penalty={penalty.total} projected={projected:.2f}")
