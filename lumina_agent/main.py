#!/usr/bin/env python3
"""
Lumina Agent v1 — clean reset
Run:    python main.py run
Test:   python main.py test
Daemon: python main.py daemon 10
"""

from __future__ import annotations
import os, time, json
from dataclasses import dataclass
from typing import List

# ---------------------------------------------------
# PATHS & CONFIG
# ---------------------------------------------------
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
LOG_DIR = os.path.join(BASE_DIR, "logs")
PLUGINS_DIR = os.path.join(BASE_DIR, "plugins")
DASHBOARD_DIR = os.path.join(BASE_DIR, "dashboard")
CURRENT_VECTOR_FILE = os.path.join(BASE_DIR, "current_vector.txt")
LOG_FILE = os.path.join(LOG_DIR, "lumina_agent.log")

GOAL_VECTOR = [3.0, 6.0, 9.0]
THRESHOLD = 10.0  # penalty cutoff

os.makedirs(LOG_DIR, exist_ok=True)
os.makedirs(PLUGINS_DIR, exist_ok=True)
os.makedirs(DASHBOARD_DIR, exist_ok=True)


# ---------------------------------------------------
# UTILITIES
# ---------------------------------------------------
def now_ts():
    return time.strftime("%Y-%m-%d %H:%M:%S")


def append_log(text: str):
    with open(LOG_FILE, "a") as f:
        f.write(text + "\n")


def read_current_vector():
    with open(CURRENT_VECTOR_FILE, "r") as f:
        raw = f.read().strip()
    return [float(x) for x in raw.split(",")]


# ---------------------------------------------------
# PENALTY MODEL
# ---------------------------------------------------
@dataclass
class PenaltyComponent:
    name: str
    value: float


@dataclass
class PenaltyResult:
    total: float
    components: List[PenaltyComponent]


def evaluate_penalty(v: List[float]) -> PenaltyResult:
    comps = []
    total = 0.0
    for i, (a, b) in enumerate(zip(v, GOAL_VECTOR)):
        c = abs(a - b)
        comps.append(PenaltyComponent(f"comp{i+1}", c))
        total += c
    return PenaltyResult(total=total, components=comps)


# ---------------------------------------------------
# DASHBOARD
# ---------------------------------------------------
def update_dashboard(state, vector, penalty: PenaltyResult):
    html = f"""
    <html>
    <head><title>Lumina Dashboard</title></head>
    <body>
        <h2>State: {state}</h2>
        <p>Vector: {vector}</p>
        <p>Total Penalty: {penalty.total}</p>
        <ul>
            {''.join(f'<li>{c.name}: {c.value}</li>' for c in penalty.components)}
        </ul>
        <p>Updated: {now_ts()}</p>
    </body>
    </html>
    """
    with open(os.path.join(DASHBOARD_DIR, "index.html"), "w") as f:
        f.write(html)


# ---------------------------------------------------
# PLUGIN LOADER
# ---------------------------------------------------
def load_plugins():
    plugins = []
    for filename in os.listdir(PLUGINS_DIR):
        if filename.endswith(".py") and filename != "__init__.py":
            modname = filename[:-3]
            module = __import__(f"plugins.{modname}", fromlist=["*"])

            if hasattr(module, "Plugin"):
                try:
                    plugins.append(module.Plugin())
                except Exception as e:
                    append_log(f"[{now_ts()}] PLUGIN_INIT_FAIL: {modname} -> {e}")
    return plugins


# ---------------------------------------------------
# CORE RUN LOGIC
# ---------------------------------------------------
def run_once(plugins, verbose=True):
    try:
        vec = read_current_vector()
    except Exception:
        msg = f"[{now_ts()}] ERROR: Place current_vector.txt with values like 3.1,6.1,9.1"
        append_log(msg)
        if verbose:
            print(msg)
        return

    pr = evaluate_penalty(vec)
    state = "TSLP_ALIGNED" if pr.total < THRESHOLD else "TSLP_LOCKOUT"

    append_log(f"[{now_ts()}] STATE: {state} | TOTAL_PENALTY: {pr.total}")

    update_dashboard(state, vec, pr)

    # run plugins
    for p in plugins:
        try:
            p.predict(vec=vec, penalty=pr, state=state, log=append_log)
        except Exception as e:
            append_log(f"[{now_ts()}] PLUGIN_ERROR: {type(p).__name__} -> {e}")

    if verbose:
        print("--- Agent Run ---")
        print("State:", state, "Total penalty:", pr.total)
        print("Dashboard:", os.path.join(DASHBOARD_DIR, "index.html"))


# ---------------------------------------------------
# UNIT TESTS
# ---------------------------------------------------
def _unit_tests():
    tests = [
        ([3.1, 6.1, 9.1], "TSLP_ALIGNED"),
        ([10.0, 6.0, 9.0], "TSLP_LOCKOUT"),
        ([3.0, 6.0, 9.0], "TSLP_ALIGNED"),
        ([4.0, 6.5, 9.5], None),
    ]

    for vec, expected in tests:
        pr = evaluate_penalty(vec)
        state = "TSLP_ALIGNED" if pr.total < THRESHOLD else "TSLP_LOCKOUT"
        print(vec, state, pr.total, [(c.name, c.value) for c in pr.components])


# ---------------------------------------------------
# MAIN ENTRY
# ---------------------------------------------------
def main():
    import sys
    plugins = load_plugins()

    if len(sys.argv) < 2:
        print("Usage: python main.py [run|test|daemon <seconds>]")
        return

    cmd = sys.argv[1]

    if cmd == "run":
        run_once(plugins)
        return

    if cmd == "test":
        _unit_tests()
        return

    if cmd == "daemon":
        interval = int(sys.argv[2]) if len(sys.argv) >= 3 else 10
        append_log(f"[{now_ts()}] DAEMON_STARTED interval={interval}s")
        try:
            while True:
                run_once(plugins, verbose=False)
                time.sleep(interval)
        except KeyboardInterrupt:
            append_log(f"[{now_ts()}] DAEMON_STOPPED")
        return


if __name__ == "__main__":
    main()
