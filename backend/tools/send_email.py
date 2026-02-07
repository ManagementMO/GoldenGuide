"""Tool 9: Send real email via Twilio SendGrid."""

import os


def execute_send_email(to_email: str, subject: str, body_html: str) -> dict:
    """
    Send an email via SendGrid. Called ONLY after user confirms the draft.
    """
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail

    api_key = os.getenv("SENDGRID_API_KEY")
    from_email = os.getenv("SENDGRID_FROM_EMAIL", "goldenguide.kingston@gmail.com")

    if not api_key:
        return _fallback_email(to_email, subject, body_html)

    html_content = f"""
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #FFFAF0; border-radius: 12px;">
        <h2 style="color: #B8860B; margin-bottom: 16px;">GoldenGuide — Kingston Senior Services</h2>
        <div style="color: #2C1810; font-size: 16px; line-height: 1.6;">
            {body_html}
        </div>
        <hr style="border: 1px solid #F5DEB3; margin: 20px 0;">
        <p style="color: #8B4513; font-size: 14px; font-style: italic;">
            Sent by GoldenGuide, an AI assistant helping Kingston seniors access municipal services.
        </p>
    </div>
    """

    message = Mail(
        from_email=(from_email, "GoldenGuide Kingston"),
        to_emails=to_email,
        subject=subject,
        html_content=html_content,
    )

    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        return {
            "status": "sent",
            "status_code": response.status_code,
            "to": to_email,
        }
    except Exception as e:
        return _fallback_email(to_email, subject, body_html)


def _fallback_email(to_email: str, subject: str, body_html: str) -> dict:
    """Fallback to Gmail SMTP if SendGrid fails."""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    gmail_addr = os.getenv("GMAIL_ADDRESS")
    gmail_pass = os.getenv("GMAIL_APP_PASSWORD")

    if not gmail_addr or not gmail_pass:
        return {"status": "error", "message": "Email service not configured"}

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"GoldenGuide Kingston <{gmail_addr}>"
        msg["To"] = to_email
        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(gmail_addr, gmail_pass)
            server.send_message(msg)

        return {"status": "sent", "to": to_email, "method": "gmail_fallback"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
