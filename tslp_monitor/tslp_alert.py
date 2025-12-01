#!/usr/bin/env python3
import smtplib
import json
from pathlib import Path
from email.mime.text import MIMEText

# Path to your report JSON
report_path = Path.home() / "downloads" / "atlas_project" / "out" / "report_demo01.json"
report = json.loads(report_path.read_text())
score = report["alignment_score"]

# --------- CONFIGURE THIS ---------
YOUR_EMAIL = "your_email@gmail.com"
YOUR_APP_PASSWORD = "your_app_password_here"
# ----------------------------------

def send_alert(score):
    subject = "TSLP ALERT — Critical Status"
    body = f"Your project score dropped to {score}. Check dashboard immediately."

    msg = MIMEText(body)
    msg["From"] = YOUR_EMAIL
    msg["To"] = YOUR_EMAIL
    msg["Subject"] = subject

    # Gmail secure SMTP
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(YOUR_EMAIL, YOUR_APP_PASSWORD)
        server.sendmail(YOUR_EMAIL, YOUR_EMAIL, msg.as_string())

if score < 60:
    send_alert(score)
    print("Alert sent!")
else:
    print("No alert needed.")
