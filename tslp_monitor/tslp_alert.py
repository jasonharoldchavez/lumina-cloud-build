#!/usr/bin/env python3
"""Send a TSLP alert using credentials supplied only through environment variables."""
import json
import os
import smtplib
from pathlib import Path
from email.mime.text import MIMEText

# Optional override; defaults to the existing local demo report location.
report_path = Path(
    os.environ.get(
        "TSLP_REPORT_PATH",
        str(Path.home() / "downloads" / "atlas_project" / "out" / "report_demo01.json"),
    )
)
report = json.loads(report_path.read_text(encoding="utf-8"))
score = report["alignment_score"]


def send_alert(score):
    sender = os.environ.get("GMAIL_SENDER")
    recipient = os.environ.get("TSLP_ALERT_RECIPIENT")
    app_password = os.environ.get("GMAIL_APP_PASSWORD")

    missing = [
        name
        for name, value in (
            ("GMAIL_SENDER", sender),
            ("TSLP_ALERT_RECIPIENT", recipient),
            ("GMAIL_APP_PASSWORD", app_password),
        )
        if not value
    ]
    if missing:
        raise RuntimeError(
            "Email alert not sent; missing environment variable(s): "
            + ", ".join(missing)
        )

    msg = MIMEText(
        f"Your project score dropped to {score}. Check dashboard immediately."
    )
    msg["From"] = sender
    msg["To"] = recipient
    msg["Subject"] = "TSLP ALERT — Critical Status"

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=20) as server:
        server.login(sender, app_password)
        server.sendmail(sender, [recipient], msg.as_string())


if score < 60:
    send_alert(score)
    print("Alert sent.")
else:
    print("No alert needed.")
