"""Default demo user profile for QHacks 2026 presentation."""

DEMO_PROFILE = {
    "name": "Margaret Chen",
    "age": 74,
    "address": "284 Johnson Street, Kingston, ON K7L 1Y4",
    "phone": "+15055949392",
    "email": "zozododorora@gmail.com",
    "income_level": "low",
    "income_details": "fixed pension, approximately $22,000/year",
    "is_kingston_resident": True,
    "years_in_kingston": 31,
    "language": "English",
    "health": {
        "general": "generally good",
        "conditions": "mild arthritis",
        "dental": "needs dental work (2 crowns) but can't afford it",
        "transportation": "no car, uses Kingston Transit",
    },
    "mobility": "walks fine but avoids long distances, uses Kingston Transit",
    "family": {
        "lives_alone": True,
        "daughter": "Susan Chen",
        "daughter_location": "Toronto",
        "daughter_phone": "+14165551234",
        "daughter_contact_frequency": "checks in weekly by phone",
    },
    "needs": [
        "affordable dental care (2 crowns needed)",
        "wants to stay independent at home",
        "lonely, could use more social activities",
        "doesn't know what programs she qualifies for",
    ],
    "current_programs": {
        "enrolled": ["OAS", "GIS"],
        "not_yet_applied": ["CDCP", "MFAP", "Kingston homemaking services"],
        "has_mfap_card": False,
    },
}


def get_demo_profile_prompt() -> str:
    """Return a formatted block for system prompt injection."""
    p = DEMO_PROFILE
    h = p["health"]
    f = p["family"]
    return f"""

=== CURRENT USER PROFILE ===
You are currently helping {p['name']}, a {p['age']}-year-old resident of Kingston, Ontario who has lived here for {p['years_in_kingston']} years.

Personal Information:
- Name: {p['name']}
- Age: {p['age']}
- Address: {p['address']}
- Phone: {p['phone']}
- Email: {p['email']}
- Income: {p['income_level']} ({p['income_details']})
- Lives Alone: {f['lives_alone']}
- Language: {p['language']}
- Kingston Resident: {p['years_in_kingston']} years

Health:
- General: {h['general']}
- Conditions: {h['conditions']}
- Dental: {h['dental']}
- Transportation: {h['transportation']}
- Mobility: {p['mobility']}

Family:
- Daughter: {f['daughter']} (lives in {f['daughter_location']}, {f['daughter_contact_frequency']})
- Daughter's phone: {f['daughter_phone']} — use as default "also send to family member" option for SMS

Current Program Status:
- Already receiving: OAS (Old Age Security), GIS (Guaranteed Income Supplement)
- Has NOT yet applied for: CDCP (Canadian Dental Care Plan), MFAP (Municipal Fee Assistance Program), Kingston homemaking services
- Does NOT have an MFAP card yet (key demo moment — help her apply!)

Needs: {', '.join(p['needs'])}

AGENT INSTRUCTIONS FOR THIS USER:
1. Always use age=74, income_level="low", is_kingston_resident=True when calling check_eligibility.
2. Reference Margaret by name in emails, calls, and action plans.
3. Do NOT ask Margaret for information that is already in this profile — use it directly.
4. Susan Chen (daughter in Toronto) is the emergency contact and primary caregiver who checks in weekly by phone.
5. When drafting communications, include Margaret's details automatically.
6. When sending SMS, default the caregiver_number to {f['daughter_phone']} (Susan Chen) so she stays informed.
7. Margaret has no car — use her address ({p['address']}) for transit directions.
8. Margaret speaks English only.
=== END USER PROFILE ===
"""
