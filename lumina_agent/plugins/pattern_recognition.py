import os, json, math
from datetime import datetime

BASE = os.path.dirname(os.path.dirname(__file__))
LOG_DIR = os.path.join(BASE, "logs")
PATTERN_FILE = os.path.join(LOG_DIR, "patterns.json")
HIST_FILE = os.path.join(LOG_DIR, "drift_history.json")

os.makedirs(LOG_DIR, exist_ok=True)

def _read_history():
    try:
        if not os.path.exists(HIST_FILE):
            return []
        return json.load(open(HIST_FILE))
    except:
        return []

def _save_patterns(pats):
    try:
        json.dump(pats[-200:], open(PATTERN_FILE, "w"), indent=2)
    except:
        pass

class Plugin:
    def __init__(self):
        pass

    def _euclid(self, a, b):
        return math.sqrt(sum((a[i]-b[i])**2 for i in range(len(a))))

    def predict(self, vec, penalty, state, log):
        try:
            hist = _read_history()
            patterns = []
            # anomaly: large jump from previous
            if len(hist) >= 1:
                prev = hist[-1]["vec"]
                jump = self._euclid(vec, prev)
                if jump > 2.0:  # threshold, tune as needed
                    patterns.append({"type":"anomaly","score":jump,"note":"sudden jump"})
            # cycle detection (periodic) — check similarity with values 3 and 6 steps back
            for lag in (3,6,12):
                if len(hist) >= lag:
                    cmpv = hist[-lag]["vec"]
                    d = self._euclid(vec, cmpv)
                    if d < 0.8:
                        patterns.append({"type":"cycle","lag":lag,"score":d})
            # motif detection: monotonic increase or decrease across last 4
            if len(hist) >= 4:
                recent = [h["vec"] for h in hist[-4:]] + [vec]
                diffs = [sum((recent[i+1][j]-recent[i][j]) for j in range(3)) for i in range(len(recent)-1)]
                if all(d > 0.0 for d in diffs):
                    patterns.append({"type":"motif","name":"increasing_trend","score":sum(diffs)})
                if all(d < 0.0 for d in diffs):
                    patterns.append({"type":"motif","name":"decreasing_trend","score":abs(sum(diffs))})
            # prepare pattern record
            out = {
                "ts": datetime.utcnow().isoformat(),
                "vec": vec,
                "penalty": penalty.total,
                "state": state,
                "patterns": patterns
            }
            # append to file
            try:
                arr = json.load(open(PATTERN_FILE)) if os.path.exists(PATTERN_FILE) else []
            except:
                arr = []
            arr.append(out)
            _save_patterns(arr)
            # log summary
            if patterns:
                log(f"[PATTERN] found {len(patterns)} pattern(s): " + ", ".join(p["type"] for p in patterns))
            else:
                log(f"[PATTERN] none")
        except Exception as e:
            log(f"[PATTERN_ERROR] {e}")
