import os, json, time
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ACTIONS_DIR = os.path.join(BASE_DIR, "actions")
THRESH_PATH = os.path.join(BASE_DIR, "threshold.json")
os.makedirs(ACTIONS_DIR, exist_ok=True)

class Plugin:
    def __init__(self):
        # ensure threshold exists
        if not os.path.exists(THRESH_PATH):
            with open(THRESH_PATH, "w") as f:
                json.dump({"threshold": 10.0}, f)

    def _now(self):
        return time.strftime("%Y-%m-%d %H:%M:%S")

    def _write_action(self, name, payload):
        fn = os.path.join(ACTIONS_DIR, f"{int(time.time())}_{name}.json")
        with open(fn, "w") as f:
            json.dump(payload, f, indent=2)
        return fn

    def predict(self, vec, penalty, state, log):
        try:
            if state == "TSLP_LOCKOUT":
                payload = {
                    "time": self._now(),
                    "action": "LOCKOUT_PROTOCOL",
                    "vector": vec,
                    "penalty": penalty.total,
                    "note": "Auto action: escalate to human"
                }
                fn = self._write_action("lockout", payload)
                log(f"[REACTION] Lockout action -> {fn}")
                # bump threshold conservatively to avoid oscillation
                try:
                    with open(THRESH_PATH, "r") as f:
                        cfg = json.load(f)
                except:
                    cfg = {"threshold": 10.0}
                cfg["threshold"] = float(cfg.get("threshold", 10.0)) + 20.0
                with open(THRESH_PATH, "w") as f:
                    json.dump(cfg, f, indent=2)
                log(f"[REACTION] threshold adjusted -> {cfg['threshold']}")
            elif penalty.total >= 10.0 and penalty.total < 30.0:
                payload = {"time": self._now(), "action":"RECOMMEND", "vector": vec, "penalty": penalty.total}
                fn = self._write_action("recommend", payload)
                log(f"[REACTION] Recommendation -> {fn}")
            else:
                payload = {"time": self._now(), "action":"HOUSEKEEPING", "vector": vec, "penalty": penalty.total}
                fn = self._write_action("housekeeping", payload)
                log(f"[REACTION] Housekeeping -> {fn}")
        except Exception as e:
            log(f"[REACTION_ERROR] {e}")
