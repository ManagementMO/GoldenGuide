"""Tool 2: Rule-based eligibility checker for Kingston programs."""

# Eligibility rules scraped from city website
PROGRAM_RULES = {
    "CDCP": {
        "name": "Canadian Dental Care Program",
        "min_age": 65,
        "income_requirement": "low",
        "residency": "canada",
        "description": "Free dental care for seniors 65+ with income under $70,000",
    },
    "MFAP": {
        "name": "Municipal Fee Assistance Program",
        "min_age": None,
        "income_requirement": "low",
        "residency": "kingston",
        "description": "Discounted city services for low-income Kingston residents",
    },
    "homemaking": {
        "name": "Subsidized Homemaking Services",
        "min_age": 60,
        "income_requirement": "low",
        "residency": "kingston",
        "description": "Subsidized home help through Comfort Keepers",
    },
    "SPARK": {
        "name": "SPARK Recreation Subsidy",
        "min_age": None,
        "income_requirement": "low",
        "residency": "kingston",
        "prerequisite": "MFAP",
        "description": "$300/year toward recreation programs",
    },
    "transit_discount": {
        "name": "Senior Transit Discount",
        "min_age": 65,
        "income_requirement": None,
        "residency": "kingston",
        "description": "Reduced transit fares for seniors 65+",
    },
    "housing": {
        "name": "Affordable Housing Programs",
        "min_age": None,
        "income_requirement": "low",
        "residency": "kingston",
        "description": "Social housing waitlist and Ontario Renovates grants",
    },
    "low_income_health": {
        "name": "Low-Income Health Benefits",
        "min_age": None,
        "income_requirement": "low",
        "residency": "kingston",
        "prerequisite": "MFAP",
        "description": "Dental, vision, and prescription coverage via MFAP",
    },
}


def check_eligibility_impl(
    programs_to_check: list,
    age: int = None,
    income_level: str = "unknown",
    household_size: int = 1,
    is_kingston_resident: bool = True,
    has_disability: bool = False,
) -> dict:
    """Check eligibility across multiple Kingston programs."""

    results = {
        "eligible": [],
        "maybe_eligible": [],
        "not_eligible": [],
    }

    for program_id in programs_to_check:
        rules = PROGRAM_RULES.get(program_id)
        if not rules:
            continue

        eligible = True
        maybe = False
        reasons = []

        # Check age requirement
        if rules.get("min_age") and age:
            if age < rules["min_age"]:
                eligible = False
                reasons.append(f"Must be {rules['min_age']}+ (you are {age})")

        # Check income requirement
        if rules.get("income_requirement") == "low":
            if income_level == "low":
                reasons.append("Income appears to qualify")
            elif income_level == "unknown":
                maybe = True
                reasons.append(
                    "Income verification needed — likely eligible based on situation"
                )
            elif income_level in ("moderate", "high"):
                eligible = False
                reasons.append("Income may be above threshold")

        # Check residency
        if rules.get("residency") == "kingston" and not is_kingston_resident:
            eligible = False
            reasons.append("Must be a Kingston resident")

        # Check prerequisites
        if rules.get("prerequisite"):
            reasons.append(f"Requires {rules['prerequisite']} card first")

        entry = {
            "program": program_id,
            "program_name": rules["name"],
            "description": rules["description"],
            "reasons": reasons,
        }

        if not eligible:
            results["not_eligible"].append(entry)
        elif maybe:
            results["maybe_eligible"].append(entry)
        else:
            results["eligible"].append(entry)

    return results
