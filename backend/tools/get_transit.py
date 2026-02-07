"""Tool 3: Kingston Transit GTFS data lookup."""

import csv
import os
from datetime import datetime

GTFS_DIR = os.path.join(os.path.dirname(__file__), "..", "gtfs")


def _load_csv(filename):
    """Load a GTFS CSV file into a list of dicts."""
    filepath = os.path.join(GTFS_DIR, filename)
    if not os.path.exists(filepath):
        return []
    # `utf-8-sig` tolerates a UTF-8 BOM (common in CSV exports).
    with open(filepath, "r", newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


# Load GTFS data at module level (it's static)
try:
    ROUTES = _load_csv("routes.txt")
    STOPS = _load_csv("stops.txt")
    STOP_TIMES = _load_csv("stop_times.txt")
    TRIPS = _load_csv("trips.txt")
except Exception:
    ROUTES, STOPS, STOP_TIMES, TRIPS = [], [], [], []


def get_stops(query: str, limit: int = 10) -> list[dict]:
    """
    Return GTFS stops whose `stop_name` contains `query` (case-insensitive).

    Example: `get_stops("Princess")` returns stops on Princess Street.
    """
    if not STOPS:
        return []

    q = (query or "").strip().lower()
    if not q:
        return []

    matches = [
        s for s in STOPS if q in (s.get("stop_name") or "").strip().lower()
    ]
    return matches[: max(0, limit)]


def get_routes_for_stop_ids(stop_ids: set[str], limit: int = 10) -> list[dict]:
    """
    Given a set of GTFS stop_ids, return simplified route objects that serve them.
    """
    if not stop_ids or not STOP_TIMES or not TRIPS or not ROUTES:
        return []

    serving_trips = {st.get("trip_id") for st in STOP_TIMES if st.get("stop_id") in stop_ids}
    serving_trips.discard(None)

    route_ids = {t.get("route_id") for t in TRIPS if t.get("trip_id") in serving_trips}
    route_ids.discard(None)

    route_info = [
        {
            "route_id": r.get("route_id", ""),
            "name": r.get("route_long_name") or r.get("route_short_name", ""),
        }
        for r in ROUTES
        if r.get("route_id") in route_ids
    ]
    return route_info[: max(0, limit)]


def get_transit_info_impl(
    destination: str, origin: str = "", time: str = "now"
) -> dict:
    """
    Query Kingston Transit GTFS data for routes, stops, and schedules.
    Simple keyword matching on stop names.
    """
    if not STOPS:
        return {
            "error": "GTFS data not loaded. Kingston Transit info: call 613-546-0000 or visit kingstontransit.ca",
            "general_info": {
                "phone": "613-546-0000",
                "website": "kingstontransit.ca",
                "senior_fare": "$2.25",
                "regular_fare": "$3.25",
            },
        }

    # Find matching stops (limit to top 5 to match previous behavior)
    matching_stops = get_stops(destination, limit=5)

    if not matching_stops:
        return {
            "message": f"I couldn't find a stop matching '{destination}'. Try a street name or landmark.",
            "suggestion": "You can call Kingston Transit at 613-546-0000 for help planning your trip.",
            "all_info": {"phone": "613-546-0000", "website": "kingstontransit.ca"},
        }

    # Get routes serving those stops
    stop_ids = {s["stop_id"] for s in matching_stops}

    # Find trips that serve these stops
    relevant_stop_times = []
    for st in STOP_TIMES:
        if st.get("stop_id") in stop_ids:
            relevant_stop_times.append(st)

    serving_routes = get_routes_for_stop_ids(stop_ids, limit=5)

    return {
        "destination": destination,
        "matching_stops": [
            {
                "name": s["stop_name"],
                "id": s["stop_id"],
                "lat": s.get("stop_lat"),
                "lon": s.get("stop_lon"),
            }
            for s in matching_stops[:3]
        ],
        "serving_routes": serving_routes,
        "sample_times": [
            {
                "stop": st["stop_id"],
                "arrival": st.get("arrival_time"),
                "departure": st.get("departure_time"),
            }
            for st in sorted(
                relevant_stop_times, key=lambda x: x.get("departure_time", "")
            )[:5]
        ],
        "general_info": {
            "phone": "613-546-0000",
            "website": "kingstontransit.ca",
            "senior_fare": "$2.25",
            "regular_fare": "$3.25",
            "mfap_pass": "Discounted monthly pass with MFAP card",
        },
    }
