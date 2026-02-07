"""Tool 8: Place real phone call via ElevenLabs + Twilio."""

import os
import requests


def execute_place_call(
    to_number: str, purpose: str, service_name: str, message_script: str
) -> dict:
    """
    Execute an outbound call via ElevenLabs Conversational AI + Twilio.
    Called ONLY after user confirms the call preview.
    """
    api_key = os.getenv("ELEVENLABS_API_KEY")
    agent_id = os.getenv("ELEVENLABS_AGENT_ID")
    phone_id = os.getenv("ELEVENLABS_PHONE_ID")

    if not all([api_key, agent_id, phone_id]):
        return _fallback_call(to_number, message_script)

    try:
        response = requests.post(
            "https://api.elevenlabs.io/v1/convai/twilio/outbound-call",
            headers={
                "xi-api-key": api_key,
                "Content-Type": "application/json",
            },
            json={
                "agent_id": agent_id,
                "agent_phone_number_id": phone_id,
                "to_number": to_number,
                "conversation_config_override": {
                    "agent": {
                        "prompt": {
                            "prompt": f"You are GoldenGuide calling about: {purpose} for service: {service_name}. Here is what to say: {message_script}"
                        }
                    }
                },
            },
            timeout=15,
        )

        if response.status_code == 200:
            return {"status": "calling", "details": response.json()}
        else:
            return _fallback_call(to_number, message_script)
    except Exception as e:
        return _fallback_call(to_number, message_script)


def _fallback_call(to_number: str, message_script: str) -> dict:
    """Fallback: Use Twilio Voice to play a pre-generated TTS message."""
    from twilio.rest import Client

    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_PHONE_NUMBER")

    if not all([account_sid, auth_token, from_number]):
        return {"status": "error", "message": "Twilio credentials not configured"}

    try:
        client = Client(account_sid, auth_token)

        twiml = f'<Response><Say voice="Polly.Joanna" language="en-US">{message_script}</Say></Response>'

        call = client.calls.create(
            to=to_number,
            from_=from_number,
            twiml=twiml,
        )

        return {
            "status": "calling",
            "call_sid": call.sid,
            "method": "twilio_tts_fallback",
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
