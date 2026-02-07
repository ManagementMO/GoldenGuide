"""Tool 10: Send SMS via Twilio Programmable Messaging."""

import os


def execute_send_sms(
    to_number: str, message: str, caregiver_number: str = None
) -> dict:
    """
    Send SMS via Twilio. Called ONLY after user confirms.
    """
    from twilio.rest import Client

    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_PHONE_NUMBER")

    if not all([account_sid, auth_token, from_number]):
        return {"status": "error", "message": "Twilio SMS not configured"}

    client = Client(account_sid, auth_token)
    results = []

    try:
        sms = client.messages.create(
            to=to_number,
            from_=from_number,
            body=f"📋 GoldenGuide Action Plan\n\n{message}\n\nQuestions? Call 613-546-0000",
        )
        results.append({"to": to_number, "sid": sms.sid, "status": sms.status})

        if caregiver_number:
            cg_sms = client.messages.create(
                to=caregiver_number,
                from_=from_number,
                body=f"📋 GoldenGuide: Your family member's action plan:\n\n{message}",
            )
            results.append(
                {"to": caregiver_number, "sid": cg_sms.sid, "status": cg_sms.status}
            )

        return {"status": "sent", "messages": results}
    except Exception as e:
        return {"status": "error", "message": str(e)}
