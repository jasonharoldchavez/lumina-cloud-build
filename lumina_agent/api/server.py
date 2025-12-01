from flask import Flask, jsonify, send_from_directory
import os, json, time
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__),".."))
LOG_DIR = os.path.join(BASE, "logs")
ACTIONS_DIR = os.path.join(BASE, "actions")
MODELS_DIR = os.path.join(BASE, "models")
DASHBOARD = os.path.join(BASE, "dashboard", "index.html")

def _read_json(path):
    try:
        return json.load(open(path, "r"))
    except:
        return None

app = Flask(__name__, static_folder=os.path.join(BASE, "dashboard"))

@app.route("/status")
def status():
    # latest state from lumina_agent.log (tail)
    try:
        lines = open(os.path.join(LOG_DIR, "lumina_agent.log")).read().strip().splitlines()
        last = lines[-20:]
    except:
        last = []
    return jsonify({"log_tail": last})

@app.route("/forecast")
def forecast():
    f = os.path.join(LOG_DIR, "horizon_forecast.json")
    return jsonify(_read_json(f) or {})

@app.route("/patterns")
def patterns():
    f = os.path.join(LOG_DIR, "patterns.json")
    return jsonify(_read_json(f) or [])

@app.route("/actions")
def actions():
    try:
        files = sorted(os.listdir(ACTIONS_DIR))
        items = []
        for fn in files[-50:]:
            try:
                items.append(json.load(open(os.path.join(ACTIONS_DIR,fn))))
            except:
                pass
        return jsonify(items)
    except:
        return jsonify([])

@app.route("/model")
def model():
    f = os.path.join(MODELS_DIR, "adaptive_model.json")
    return jsonify(_read_json(f) or {})

@app.route("/dashboard")
def dashboard():
    if os.path.exists(DASHBOARD):
        return send_from_directory(os.path.join(BASE,"dashboard"), "index.html")
    return "No dashboard available", 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
