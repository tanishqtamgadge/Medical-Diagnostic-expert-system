"""Email service — sends diagnosis reports as PDF email attachments.

Uses SMTP when credentials are provided via environment variables.
Falls back to console logging for development / demo purposes.
"""

import os
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", "noreply@medical-diagnostic.local")


def send_report_email(
    recipient_email: str,
    patient_name: str,
    disease: str,
    pdf_bytes: bytes,
) -> None:
    """Send a diagnosis PDF report to *recipient_email*.

    When SMTP credentials are not configured the email is printed to the
    console so the feature works out-of-the-box in development.
    """

    subject = f"Diagnosis Report — {patient_name}"
    body = (
        f"Hello,\n\n"
        f"Please find attached the diagnosis report for {patient_name}.\n"
        f"Top prediction: {disease}\n\n"
        f"— Medical Diagnostic Expert System"
    )

    msg = MIMEMultipart()
    msg["From"] = SMTP_FROM_EMAIL
    msg["To"] = recipient_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    attachment = MIMEApplication(pdf_bytes, _subtype="pdf")
    attachment.add_header("Content-Disposition", "attachment", filename="diagnosis-report.pdf")
    msg.attach(attachment)

    if SMTP_HOST and SMTP_USER and SMTP_PASSWORD:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"[EMAIL] Report sent to {recipient_email} via SMTP.")
    else:
        print("=" * 60)
        print("[EMAIL — CONSOLE FALLBACK]")
        print(f"  To:      {recipient_email}")
        print(f"  Subject: {subject}")
        print(f"  Body:    {body}")
        print(f"  PDF attachment: {len(pdf_bytes)} bytes")
        print("=" * 60)
