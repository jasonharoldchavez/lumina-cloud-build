import os, json, time
from datetime import datetime

BASE = os.path.dirname(os.path.dirname(__file__))
LOG_DIR = os.path.join(BASE, "logs")
MODEL_DIR = os.path.join(BASE, "models")
ACTION_DIR = os.path.join(BASE, "actions")
os.makedirs(LOG_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(ACTION_DIR, exist_ok=True)

MODEL_FILE = os.path.join(MODEL_DIR, "adaptive_model.json")
ADAPT_LOG = os.path.join(LOG_DIR, "adaptive_log.json")

class OnlineModel:
    def __init__(self):
        self.coefs = [0.0,0.0,0.0,0.0]
        self.last_pen = 0.0
        self.lr = 0.001
        self.load()

    def load(self):
        if os.path.exists(MODEL_FILE):
            try:
                j = json.load(open(MODEL_FILE))
                self.coefs = j.get("coefs", self.coefs)
                self.last_pen = j.get("last_pen", self.last_pen)
            except:
                pass

    def save(self):
        json.dump({"coefs":self.coefs,"last_pen":self.last_pen},
                  open(MODEL_FILE,"w"), indent=2)

    def predict(self, vec):
        raw = self.coefs[3] + sum(self.coefs[i]*vec[i] for i in range(3)) + 0.5*self.last_pen
        return max(0.0, float(raw))

    def update(self, vec, actual):
        pred = self.predict(vec)
        err = actual - pred
        for i in range(3):
            self.coefs[i] += self.lr * err * vec[i]
        self.coefs[3] += self.lr * err
        self.last_pen = 0.9*self.last_pen + 0.1*actual
        self.save()
        return pred, err

MODEL = OnlineModel()

def append_log(path, obj):
    try:
        old = json.load(open(path)) if os.path.exists(path) else []
    except:
        old = []
    old.append(obj)
    json.dump(old[-200:], open(path,"w"), indent=2)

class Plugin:
    def predict(self, vec, penalty, state, log):
        pred, err = MODEL.update(vec, penalty.total)

        if pred > 10:
            action = {"type":"ESCALATE","pred_next":pred,"ts":datetime.utcnow().isoformat()}
        elif pred > 5:
            action = {"type":"WATCH","pred_next":pred,"ts":datetime.utcnow().isoformat()}
        else:
            action = {"type":"OK","pred_next":pred,"ts":datetime.utcnow().isoformat()}

        append_log(ADAPT_LOG, {
            "ts": datetime.utcnow().isoformat(),
            "vec": vec,
            "penalty": penalty.total,
            "pred": pred,
            "err": err,
            "coefs": MODEL.coefs
        })

        log(f"[ADAPT] actual={penalty.total:.3f} pred={pred:.3f} action={action['type']}")

        if action["type"] != "OK":
            out = os.path.join(ACTION_DIR, f"adaptive_{int(time.time())}.json")
            json.dump(action, open(out,"w"), indent=2)
            log(f"[ADAPT] action -> {out}")
