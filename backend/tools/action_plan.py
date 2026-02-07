"""Tool 4: Generate structured action plan."""


def generate_action_plan_impl(user_situation: str, eligible_services: list) -> dict:
    """
    Generate a structured action plan.
    Returns JSON that the frontend renders as beautiful cards.
    """
    from tools.search_services import SERVICES

    steps = []
    priority = 1

    program_icons = {
        "MFAP": "💰",
        "CDCP": "🦷",
        "homemaking": "🏠",
        "SPARK": "🎭",
        "transit": "🚌",
        "housing": "🏘️",
        "dental": "🦷",
        "food": "🥦",
        "health": "🏥",
    }

    for service_name in eligible_services:
        matching = None
        for svc in SERVICES:
            if service_name.lower() in svc[
                "name"
            ].lower() or service_name.lower() in " ".join(svc.get("keywords", [])):
                matching = svc
                break

        icon = "📋"
        for key, emoji in program_icons.items():
            if key.lower() in service_name.lower():
                icon = emoji
                break

        step = {
            "priority": priority,
            "icon": icon,
            "service_name": matching["name"] if matching else service_name,
            "description": matching["description"][:150] if matching else "",
            "phone": matching.get("phone", "") if matching else "",
            "address": matching.get("address", "") if matching else "",
            "how_to_apply": matching.get("how_to_apply", "") if matching else "",
            "what_to_bring": "",
            "cost": matching.get("cost", "") if matching else "",
        }
        steps.append(step)
        priority += 1

    return {
        "title": "Your Personalized Action Plan",
        "user_situation": user_situation,
        "steps": steps,
        "total_steps": len(steps),
    }
