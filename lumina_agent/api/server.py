"""Local-first Lumina Agent status API.

By default the API listens on loopback only. Remote exposure requires an
explicit host setting and a bearer token supplied through the environment.
"""
from flask import Flask, jsonify, send_from_directory, request, abort
import hmac
import os
import json

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOG_DIR = os.path.join(BASE, "logs")
ACTIONS_DIR = os.path.join(BASE, "actions")
MODELS_DIR = os.path.join(BASE, "models")
DASHBOARD = os.path.join(BASE, "dashboard", "index.html")

HOST = os.environ.get("LUMINA_API_HOST", "127.0.0.1").strip()
PORT = int(os.environ.get("LUMINA_API_PORT", "8080"))
API_TOKEN = os.environ.get("LUMINA_API_TOKEN", "").strip()
LOOPBACK_HOSTS = {"127.0.0.1", "::1", "localhost"}

if HOST not in LOOPBACK_HOSTS and len(API_TOKEN) < 32:
    raise RuntimeError(
        "Remote API binding requires LUMINA_API_TOKEN with at least 32 characters."
    )

def _read_json(path):
    try:
        with open(path, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except (OSError, ValueError, TypeError):
        return None

app = Flask(__name__, static_folder=os.path.join(BASE, "dashboard"))

@app.before_request
def protect_remote_api():
    # Loopback-only use needs no network credential. Any explicitly remote
    # deployment must present a high-entropy bearer token on every route.
    if HOST not in LOOPBACK_HOSTS:
        supplied = request.headers.get("Authorization", "")
        expected = "Bearer " + API_TOKEN
        if not hmac.compare_digest(supplied, expected):
            abort(401)

@app.route("/status")
def status():
    try:
        with open(os.path.join(LOG_DIR, "lumina_agent.log"), encoding="utf-8") as handle:
            last = handle.read().splitlines()[-20:]
    except OSError:
        last = []
    return jsonify({"log_tail": last})

@app.route("/forecast")
def forecast():
    return jsonify(_read_json(os.path.join(LOG_DIR, "horizon_forecast.json")) or {})

@app.route("/patterns")
def patterns():
    return jsonify(_read_json(os.path.join(LOG_DIR, "patterns.json")) or [])

@app.route("/actions")
def actions():
    items = []
    try:
        files = sorted(
            name for name in os.listdir(ACTIONS_DIR)
            if name.endswith(".json") and os.path.isfile(os.path.join(ACTIONS_DIR, name))
        )
        for name in files[-50:]:
            value = _read_json(os.path.join(ACTIONS_DIR, name))
            if value is not None:
                items.append(value)
    except OSError:
        pass
    return jsonify(items)

@app.route("/model")
def model():
    return jsonify(_read_json(os.path.join(MODELS_DIR, "adaptive_model.json")) or {})

@app.route("/dashboard")
def dashboard():
    if os.path.isfile(DASHBOARD):
        return send_from_directory(os.path.join(BASE, "dashboard"), "index.html")
    return "No dashboard available", 404

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=False, use_reloader=False)
