"""Tool 5: Draft email or phone call script."""

from knowledge.demo_profile import DEMO_PROFILE


def draft_communication_impl(
    type: str,
    recipient: str,
    purpose: str,
    recipient_email: str = "",
    user_details: str = "",
) -> dict:
    """
    Draft an email and/or phone call script.
    """
    if not user_details:
        p = DEMO_PROFILE
        user_details = (
            f"My name is {p['name']}, I am {p['age']} years old, "
            f"living at {p['address']}. I am on a {p['income_level']} income "
            f"({p['income_details']}) and live alone."
        )

    result = {}

    if type in ("email", "both"):
        result["email"] = {
            "to": recipient_email or f"(email for {recipient})",
            "subject": f"Inquiry: {purpose}",
            "body": f"Dear {recipient},\n\nI am writing on behalf of a Kingston resident. {user_details}\n\nI would like to inquire about {purpose}.\n\nCould you please provide information about eligibility requirements and the application process?\n\nThank you for your time.\n\nSincerely,\nSent via GoldenGuide, an AI assistant helping Kingston seniors access municipal services",
            "recipient_name": recipient,
        }

    if type in ("phone_script", "both"):
        result["phone_script"] = {
            "number": "",
            "recipient": recipient,
            "script": f"Hello, my name is [your name]. I'm calling about {purpose}. {user_details} Could you help me understand if I'm eligible and how to apply?",
            "tips": [
                "Have your ID ready",
                "Have proof of income if asking about financial programs",
                f"Ask about: {purpose}",
            ],
        }

    return result
