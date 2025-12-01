#!/usr/bin/env python3
import json
from datetime import datetime, UTC
from pathlib import Path

WORKDIR = Path.home() / "tslp_monitor"
OUTDIR = WORKDIR / "out"
LOGDIR = WORKDIR / "logs"

OUTDIR.mkdir(exist_ok=True)
LOGDIR.mkdir(exist_ok=True)

def compute_alignment_score(project):
    return 75  # replace later with real logic

def generate_svg_plan(project, out_path):
    svg = f"""<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
    <rect x='50' y='50' width='700' height='500' fill='none' stroke='black'/>
    <text x='70' y='90'>Project: {project.get('name','(unnamed)')}</text>
    </svg>"""
    out_path.write_text(svg)

def cost_estimate(project):
    area = project.get("area", 1000)
    unit = 120
    return {"total": area * unit, "breakdown": {"area_cost": area * unit}}

def generate_daily_report(project, score, estimate):
    report = {
        "project": project,
        "alignment_score": score,
        "cost_estimate": estimate,
        "generated_at": datetime.now(UTC).isoformat()
    }
    out_file = OUTDIR / f"report_{project['id']}.json"
    out_file.write_text(json.dumps(report, indent=2))
    return out_file

def main():
    project = {
        "id": "demo01",
        "name": "Demo Project",
        "area": 1200,
        "owner": "Jason"
    }

    score = compute_alignment_score(project)
    estimate = cost_estimate(project)
    generate_svg_plan(project, OUTDIR / f"plan_{project['id']}.svg")
    report_path = generate_daily_report(project, score, estimate)

    print("Report generated:", report_path)
    print("Alignment score:", score)
    print("Cost total:", estimate["total"])

if __name__ == "__main__":
    main()
