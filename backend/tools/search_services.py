"""Tool 1: Search Kingston services knowledge base."""

import json
import os

# Load services at module level
_kb_path = os.path.join(
    os.path.dirname(__file__), "..", "knowledge", "kingston_services.json"
)
with open(_kb_path, "r") as f:
    SERVICES = json.load(f)


def search_services_impl(query: str, category: str = "all") -> list:
    """
    Simple keyword search over the Kingston services knowledge base.
    Returns top matching services with full details.
    """
    query_words = set(query.lower().split())
    results = []

    for svc in SERVICES:
        if category != "all" and svc["category"] != category:
            continue

        # Build searchable text from all fields
        searchable = " ".join(
            [
                svc.get("name", ""),
                svc.get("description", ""),
                svc.get("eligibility", ""),
                svc.get("notes", ""),
                " ".join(svc.get("keywords", [])),
            ]
        ).lower()

        # Score by number of matching query words
        score = sum(1 for word in query_words if word in searchable)
        # Bonus for keyword matches
        keyword_score = sum(
            2
            for word in query_words
            if word in " ".join(svc.get("keywords", [])).lower()
        )
        total_score = score + keyword_score

        if total_score > 0:
            results.append((total_score, svc))

    # Sort by score descending, return top 5
    results.sort(key=lambda x: x[0], reverse=True)
    return [
        {
            "name": svc["name"],
            "category": svc["category"],
            "description": svc["description"],
            "eligibility": svc.get("eligibility", ""),
            "phone": svc.get("phone", ""),
            "address": svc.get("address", ""),
            "how_to_apply": svc.get("how_to_apply", ""),
            "website": svc.get("website", ""),
            "cost": svc.get("cost", ""),
            "notes": svc.get("notes", ""),
        }
        for _, svc in results[:5]
    ]
