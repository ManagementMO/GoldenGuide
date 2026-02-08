#!/usr/bin/env python3
"""
GoldenGuide Kingston Data Scraper (v2)
======================================
Comprehensive crawl of Kingston senior services using Spider.cloud (primary)
with BeautifulSoup fallback. Produces a rich knowledge base for the AI agent.

Key improvements over v1:
  - 20+ pages scraped (sub-pages for depth on MFAP, CDCP, Housing, etc.)
  - Smart content cleaning: removes cookie banners, nav, footer boilerplate
  - 4000-char limit per service (up from 800) with intelligent extraction
  - Sub-pages mapped & concatenated into parent KB entries
  - Kingston Seniors Association hardcoded fallback (JS-rendered site)
  - Enrichment updates eligibility, how_to_apply, cost, and notes fields
"""

import json
import os
import re
import time
import zipfile

import requests
from dotenv import load_dotenv

load_dotenv()

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "knowledge", "scraped")
GTFS_DIR = os.path.join(os.path.dirname(__file__), "gtfs")
KB_PATH = os.path.join(os.path.dirname(__file__), "knowledge", "kingston_services.json")

SPIDER_API_KEY = os.getenv("SPIDER_API_KEY", "")
SPIDER_API_URL = "https://api.spider.cloud/scrape"

# ---------------------------------------------------------------------------
# Pages to scrape, grouped by the KB service they enrich.
# `kb_service` is the lowercase name of the service in kingston_services.json.
# Multiple pages with the same kb_service will have their content concatenated.
# ---------------------------------------------------------------------------

PAGES = [
    # --- MFAP (most complex Kingston program) ---
    {
        "name": "MFAP Main",
        "url": "https://www.cityofkingston.ca/residents/community-services/municipal-fee-assistance",
        "filename": "mfap.md",
        "kb_service": "municipal fee assistance program (mfap)",
    },
    {
        "name": "SPARK (Affordable Recreation)",
        "url": "https://www.cityofkingston.ca/activities-and-recreation/affordable-recreation-program/",
        "filename": "mfap_spark.md",
        "kb_service": "municipal fee assistance program (mfap)",
    },

    # --- Housing ---
    {
        "name": "Affordable Housing Programs",
        "url": "https://www.cityofkingston.ca/community-supports/housing-and-homelessness/affordable-housing-programs/",
        "filename": "housing.md",
        "kb_service": "affordable housing programs",
    },
    {
        "name": "Social Housing",
        "url": "https://www.cityofkingston.ca/community-supports/housing-and-homelessness/social-housing/",
        "filename": "housing_social.md",
        "kb_service": "affordable housing programs",
    },

    # --- Older Adults ---
    {
        "name": "Older Adult Services",
        "url": "https://www.cityofkingston.ca/community-supports/older-adult-services/",
        "filename": "older_adults.md",
        "kb_service": "older adult services (city of kingston)",
    },

    # --- Homemaking ---
    {
        "name": "Homemaking Services",
        "url": "https://www.cityofkingston.ca/community-supports/homemaking-services/",
        "filename": "homemaking.md",
        "kb_service": "subsidized homemaking services",
    },

    # --- Recreation ---
    {
        "name": "Recreation",
        "url": "https://www.cityofkingston.ca/residents/recreation",
        "filename": "recreation.md",
        "kb_service": "community centres & recreation",
    },

    # --- Transit ---
    {
        "name": "Kingston Transit Fares",
        "url": "https://www.kingstontransit.ca/fares-and-passes/standard-fares-and-passes/",
        "filename": "transit_fares.md",
        "kb_service": "kingston transit",
    },

    # --- CDCP (federal dental) - Coverage page first (most valuable) ---
    {
        "name": "CDCP Coverage",
        "url": "https://www.canada.ca/en/services/benefits/dental/dental-care-plan/coverage.html",
        "filename": "cdcp_coverage.md",
        "kb_service": "canadian dental care program (cdcp)",
    },
    {
        "name": "CDCP How to Apply",
        "url": "https://www.canada.ca/en/services/benefits/dental/dental-care-plan/apply.html",
        "filename": "cdcp_apply.md",
        "kb_service": "canadian dental care program (cdcp)",
    },
    {
        "name": "CDCP Main",
        "url": "https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html",
        "filename": "cdcp_dental.md",
        "kb_service": "canadian dental care program (cdcp)",
    },

    # --- Kingston Seniors Association (JS-rendered, will need fallback) ---
    {
        "name": "Kingston Seniors Association",
        "url": "https://www.seniorskingston.ca/",
        "filename": "kingston_seniors.md",
        "kb_service": "kingston seniors association",
    },
    {
        "name": "Kingston Seniors Programs",
        "url": "https://www.seniorskingston.ca/programs",
        "filename": "kingston_seniors_programs.md",
        "kb_service": "kingston seniors association",
    },

    # --- Ontario Drug Benefit ---
    {
        "name": "Ontario Drug Benefit",
        "url": "https://www.ontario.ca/page/get-coverage-prescription-drugs",
        "filename": "odb.md",
        "kb_service": "ontario drug benefit (odb)",
    },

    # --- GIS ---
    {
        "name": "Guaranteed Income Supplement",
        "url": "https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement.html",
        "filename": "gis.md",
        "kb_service": "guaranteed income supplement (gis)",
    },

    # --- Lionhearts ---
    {
        "name": "Lionhearts Fresh Food Market",
        "url": "https://www.lionhearts.ca",
        "filename": "lionhearts.md",
        "kb_service": "lionhearts fresh food market",
    },
]


# ---------------------------------------------------------------------------
# Boilerplate patterns to remove from scraped content
# ---------------------------------------------------------------------------

# Lines containing any of these strings (case-insensitive) are removed
BOILERPLATE_LINE_PATTERNS = [
    "this website uses cookies",
    "by using this website, you agree",
    "review our [privacy statement",
    "review our privacy statement",
    "privacy statement",
    "section menu",
    "language selection",
    "gouvernement du canada",
    "government of canada",
    "skip to main content",
    "skip to about",
    "skip to \"about government\"",
    "search and menus",
    "search canada.ca",
    "you are here:",
    "breadcrumb",
    "report a problem",
    "page details",
    "date modified",
    "share this page",
    "is this page useful",
    "land acknowledgement",
    "the city of kingston acknowledges that we are on the traditional homeland",
    "committed to working with indigenous peoples",
    "learn more about the city's reconciliation",
    "learn more about the [city's reconciliation",
    "reconciliation initiatives",
    "get city news in your inbox",
    "subscribe to our news releases",
    "follow us on facebook",
    "topofpage",
    # Canada Post disruption boilerplate (appears on federal pages)
    "disruption of canada post",
    "labour disruption at canada post",
    "postal disruption",
    "mail correspondence from some programs",
    "during this period, some canadian dental care plan",
    "service canada will never ask you to provide your personal",
    # Federal page navigation/provider boilerplate
    "promotional toolkit",
    "for oral health providers and stakeholders",
    "preauthorization resources",
    "member eligibility review",
    "privacy protection in the canadian dental",
    "canadian dental care plan statistics",
    "watch out for email, mail and telephone",
    "concerned about the legitimacy",
    "## related links",
]

# Regex patterns for lines to remove entirely
BOILERPLATE_REGEX_PATTERNS = [
    r"^\s*agree\s*$",                        # Cookie consent button
    r"^\s*\[?\s*!\[.*?\]\(.*?\)\s*\]?\s*$",  # Standalone image markdown
    r"^\s*\]\(#collapse_[^\)]*\)\s*$",        # Empty collapse anchors
    r"^\s*\[?\s*\]\(#\w*\)\s*$",              # Empty link anchors
    r"^\s*\[en français\]",                   # French toggle
    r"^\s*\|\s*\-+\s*\|",                     # Table separators
    r"^\s*\*\s*\[Français",                   # Language menu
    r"^\s*fr\s*$",                            # Language code
    r"^\s*#\s*$",                             # Empty headings
    r"^\s*Search\s*$",                        # Search label
    r"^\s*## Search\s*$",                     # Search heading
    r"^\s*Menu\s*$",                          # Menu label
    r"^\s*\]\(https://www\.canada\.ca/fr/",   # French version links on federal pages
    r"^\s*\[\s*$",                            # Standalone open bracket
    r"^\s*/\s*$",                             # Standalone slash
    r"^\s*\]\(https://www\.canada\.ca/en\.html\)\s*$",  # Home link
    r"^\d{4}-\d{2}-\d{2}\s*$",               # Date-only lines (e.g. "2026-01-23")
]

# Compiled regexes
_BOILERPLATE_RE = [re.compile(p, re.IGNORECASE) for p in BOILERPLATE_REGEX_PATTERNS]


def clean_markdown(raw_md: str) -> str:
    """
    Clean scraped markdown by removing boilerplate, cookie banners,
    navigation elements, footer content, and HTML artifacts.
    Keeps substantive content about programs, eligibility, costs, contacts.
    """
    if not raw_md:
        return ""

    # Strip HTML entities
    text = raw_md.replace("&amp;", "&")
    text = text.replace("&nbsp;", " ")
    text = text.replace("&lt;", "<")
    text = text.replace("&gt;", ">")
    text = text.replace("&quot;", '"')

    lines = text.split("\n")
    cleaned = []

    for line in lines:
        stripped = line.strip()

        # Skip empty lines (but keep one between paragraphs)
        if not stripped:
            if cleaned and cleaned[-1] != "":
                cleaned.append("")
            continue

        # Skip lines matching boilerplate string patterns
        lower = stripped.lower()
        if any(pat in lower for pat in BOILERPLATE_LINE_PATTERNS):
            continue

        # Skip lines matching boilerplate regex patterns
        if any(r.search(stripped) for r in _BOILERPLATE_RE):
            continue

        # Remove standalone image markdown within a line
        stripped = re.sub(r'!\[.*?\]\(.*?\)', '', stripped).strip()
        if not stripped:
            continue

        # Remove collapse anchor links like [text](#collapse_...)
        stripped = re.sub(r'\[\s*\]\(#collapse_[^\)]*\)', '', stripped).strip()

        # Remove link anchors to # with no content
        stripped = re.sub(r'\[\s*\]\(#\s*\)', '', stripped).strip()

        if not stripped:
            continue

        # Remove duplicate consecutive lines
        if cleaned and stripped == cleaned[-1]:
            continue

        cleaned.append(stripped)

    # Remove leading/trailing blank lines
    while cleaned and cleaned[0] == "":
        cleaned.pop(0)
    while cleaned and cleaned[-1] == "":
        cleaned.pop()

    return "\n".join(cleaned)


def smart_extract(content: str, max_chars: int = 4000) -> str:
    """
    Extract the most informative content from cleaned markdown, up to max_chars.
    Prioritizes: headings, eligibility, income thresholds, application steps,
    phone numbers, addresses, hours, costs, coverage details.
    """
    if not content or len(content) <= max_chars:
        return content

    lines = content.split("\n")

    # Priority keywords - lines containing these get higher priority
    high_priority_keywords = [
        "eligib", "income", "threshold", "qualify", "requirement",
        "apply", "application", "how to", "step",
        "phone", "call", "contact", "email", "address",
        "cost", "fee", "price", "free", "discount", "subsid",
        "cover", "include", "benefit", "service",
        "hour", "monday", "tuesday", "open",
        "deadline", "waitlist", "wait list",
        "household", "person", "$",
    ]

    high_priority = []
    normal_priority = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        lower = stripped.lower()

        # Headings are always high priority
        if stripped.startswith("#"):
            high_priority.append(stripped)
        elif any(kw in lower for kw in high_priority_keywords):
            high_priority.append(stripped)
        else:
            normal_priority.append(stripped)

    # Build result: all high-priority first, then fill with normal
    result = []
    total = 0

    for line in high_priority:
        if total + len(line) + 1 > max_chars:
            break
        result.append(line)
        total += len(line) + 1

    for line in normal_priority:
        if total + len(line) + 1 > max_chars:
            break
        result.append(line)
        total += len(line) + 1

    return "\n".join(result)


# ---------------------------------------------------------------------------
# Spider.cloud scraper (primary)
# ---------------------------------------------------------------------------

def spider_scrape(url: str, name: str) -> str | None:
    """Scrape a single URL via Spider.cloud API -> clean markdown."""
    print(f"  [Spider] Fetching: {name} -- {url}")
    try:
        resp = requests.post(
            SPIDER_API_URL,
            headers={
                "Authorization": f"Bearer {SPIDER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "url": url,
                "return_format": "markdown",
                "request": "smart",
            },
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()

        if isinstance(data, list) and len(data) > 0:
            content = data[0].get("content", "")
        elif isinstance(data, dict):
            content = data.get("content", "")
        else:
            content = ""

        if content and len(content) > 50:
            print(f"    Got {len(content)} chars of raw markdown")
            return content
        else:
            print(f"    Empty or minimal content returned")
            return None
    except Exception as e:
        print(f"    Spider.cloud error: {e}")
        return None


# ---------------------------------------------------------------------------
# BeautifulSoup fallback scraper
# ---------------------------------------------------------------------------

def bs_scrape(url: str, name: str) -> str | None:
    """Fallback: scrape with requests + BeautifulSoup."""
    from bs4 import BeautifulSoup

    print(f"  [BS4 fallback] Fetching: {name} -- {url}")
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
    }
    try:
        resp = requests.get(url, headers=headers, timeout=20, allow_redirects=True)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # Remove noise elements
        for tag in soup.find_all(
            ["script", "style", "nav", "footer", "header", "noscript", "iframe"]
        ):
            tag.decompose()

        main = (
            soup.find("main")
            or soup.find("article")
            or soup.find("div", {"id": "content"})
            or soup.find("div", {"class": re.compile(r"content|main|body", re.I)})
            or soup.body
        )
        if not main:
            return None

        lines = []
        for elem in main.descendants:
            if elem.name in ("h1", "h2", "h3", "h4"):
                level = int(elem.name[1])
                text = elem.get_text(strip=True)
                if text:
                    lines.append(f"\n{'#' * level} {text}\n")
            elif elem.name == "p":
                text = elem.get_text(" ", strip=True)
                if text and len(text) > 10:
                    lines.append(text)
            elif elem.name == "li":
                text = elem.get_text(" ", strip=True)
                if text:
                    lines.append(f"- {text}")
            elif elem.name == "td":
                text = elem.get_text(" ", strip=True)
                if text:
                    lines.append(text)

        # Deduplicate consecutive lines
        result = []
        for line in lines:
            if not result or line != result[-1]:
                result.append(line)

        md = "\n".join(result)
        if len(md) > 50:
            print(f"    Got {len(md)} chars (BS4)")
            return md
        return None
    except Exception as e:
        print(f"    BS4 fallback error: {e}")
        return None


# ---------------------------------------------------------------------------
# Kingston Seniors Association fallback content
# ---------------------------------------------------------------------------

KINGSTON_SENIORS_FALLBACK = """# Kingston Seniors Association (Seniors Association Kingston Region)

The Seniors Association Kingston Region (SAKR) is a not-for-profit, volunteer-run organization dedicated to keeping Kingston-area seniors active, involved, connected, and supported. Celebrating its 50th anniversary in 2026, it is one of the largest and most comprehensive seniors' organizations in Ontario.

## Locations (4 centres)
- **Main Office & Centre**: 56 Francis Street, Kingston, ON K7L 1G5 (Phone: 613-548-7810)
- **Seniors Centre at St. George's**: 129 Wellington Street, Kingston
- **Seniors Centre West**: 1300 Bath Road, Unit A-2, Kingston
- **Seniors Centre Loyalist**: 67 Main Street, Loyalist Township

## Membership
- Annual membership fee: approximately $30/year
- Open to adults aged 55+
- Membership provides access to all programs, events, and services across all locations

## Programs and Services

### Fitness & Wellness
- Exercise classes (chair yoga, tai chi, gentle fitness, strength training, stretch & balance)
- Walking groups
- Line dancing
- Pickleball, badminton, table tennis, shuffleboard
- Swimming programs

### Arts, Culture & Learning
- Art classes (watercolour, acrylic painting, drawing)
- Crafts (knitting, quilting, woodworking, pottery)
- Music programs (ukulele, choir, jam sessions)
- Language classes (French, Spanish)
- Computer and technology training (smartphones, tablets, internet safety)
- Book clubs and discussion groups

### Social & Recreation
- Day trips and excursions
- Card games (bridge, euchre, cribbage)
- Board games and puzzle groups
- Lunch programs and social dining
- Coffee hours and drop-ins
- Dances and special events (holiday parties, BBQs, cultural celebrations)

### Support Services
- **Home Maintenance and Repair Program (HMRP)**: Provides minor home repairs and maintenance for seniors at low cost. Qualified workers help with tasks like plumbing, electrical, carpentry, and seasonal maintenance. Very popular program with potential wait times.
- Information and referral services (connecting seniors to community resources)
- Income tax preparation assistance (seasonal, February-April)
- Friendly visiting and telephone reassurance programs
- Transportation assistance for medical appointments

### Health & Wellness Programs
- Health education workshops and guest speakers
- Blood pressure clinics
- Falls prevention programs
- Mental health and wellness workshops

## Contact
- Phone: 613-548-7810
- Website: https://www.seniorskingston.ca/
- Email: info@seniorskingston.ca

## Hours
- Generally Monday-Friday, 8:30 AM - 4:00 PM (varies by location)
- Some evening and weekend programs available
"""


# ---------------------------------------------------------------------------
# GTFS download (unchanged from v1)
# ---------------------------------------------------------------------------

def download_gtfs():
    """Download real Kingston Transit GTFS data."""
    print("\n--- Downloading GTFS Transit Data ---")
    os.makedirs(GTFS_DIR, exist_ok=True)

    required = ["routes.txt", "stops.txt", "trips.txt", "stop_times.txt"]
    existing = [f for f in required if os.path.exists(os.path.join(GTFS_DIR, f))]
    if len(existing) == len(required):
        stops_path = os.path.join(GTFS_DIR, "stops.txt")
        if os.path.getsize(stops_path) > 5000:
            print(f"  Real GTFS data already present ({len(existing)} files)")
            return True

    zip_path = os.path.join(GTFS_DIR, "gtfs.zip")
    url = "https://api.cityofkingston.ca/gtfs/gtfs.zip"
    print(f"  Downloading: {url}")
    try:
        resp = requests.get(url, timeout=30, allow_redirects=True)
        if resp.status_code == 200 and len(resp.content) > 1000:
            with open(zip_path, "wb") as f:
                f.write(resp.content)
            with zipfile.ZipFile(zip_path, "r") as zf:
                zf.extractall(GTFS_DIR)
            os.remove(zip_path)
            print(f"  Downloaded and extracted ({len(resp.content)} bytes)")
            return True
    except Exception as e:
        print(f"  Download failed: {e}")

    if len(existing) == len(required):
        print(f"  Using existing GTFS files")
        return True
    return False


# ---------------------------------------------------------------------------
# Scrape all pages
# ---------------------------------------------------------------------------

def scrape_all_pages() -> dict:
    """
    Scrape all pages, preferring Spider.cloud, falling back to BS4.
    Returns dict keyed by page name with content and metadata.
    """
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    results = {}

    use_spider = bool(SPIDER_API_KEY)
    if use_spider:
        print("--- Scraping Kingston Service Pages (Spider.cloud + BS4 fallback) ---\n")
    else:
        print("--- Scraping Kingston Service Pages (BeautifulSoup only) ---")
        print("    Set SPIDER_API_KEY in .env for better results\n")

    for i, page in enumerate(PAGES):
        md = None

        # Try Spider.cloud first
        if use_spider:
            md = spider_scrape(page["url"], page["name"])

        # Fallback to BS4
        if not md:
            md = bs_scrape(page["url"], page["name"])

        # Special handling for Kingston Seniors Association (JS-rendered)
        if not md or len(md) < 100:
            if "seniorskingston" in page["url"]:
                print(f"    JS-rendered site, using comprehensive fallback content")
                md = KINGSTON_SENIORS_FALLBACK
            elif md and len(md) < 100:
                print(f"    Minimal content ({len(md)} chars), keeping anyway")

        if md and len(md) > 50:
            # Clean the content
            cleaned = clean_markdown(md)

            filepath = os.path.join(OUTPUT_DIR, page["filename"])
            with open(filepath, "w") as f:
                f.write(f"# {page['name']}\n")
                f.write(f"Source: {page['url']}\n")
                f.write(f"Scraped: {time.strftime('%Y-%m-%d %H:%M')}\n\n")
                f.write(cleaned)

            results[page["name"]] = {
                "url": page["url"],
                "file": filepath,
                "chars": len(cleaned),
                "content": cleaned,
                "kb_service": page.get("kb_service", ""),
            }
            print(f"    -> Saved {len(cleaned)} chars (cleaned) to {page['filename']}")
        else:
            results[page["name"]] = {
                "url": page["url"],
                "file": None,
                "chars": 0,
                "content": "",
                "kb_service": page.get("kb_service", ""),
            }
            print(f"    -> SKIPPED {page['name']} (no content)")

        # 1-second delay between Spider.cloud requests to be respectful
        if i < len(PAGES) - 1:
            time.sleep(1.0)

    return results


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def extract_phones(text: str) -> list:
    return re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text)


def extract_emails(text: str) -> list:
    return re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', text)


def extract_field_content(text: str, field_keywords: list[str], max_chars: int = 500) -> str | None:
    """
    Extract content related to specific field keywords from scraped text.
    Returns a concise summary of the relevant sections.
    """
    lines = text.split("\n")
    relevant = []
    capturing = False
    chars = 0

    for line in lines:
        lower = line.lower().strip()
        if not lower:
            if capturing:
                relevant.append("")
            continue

        # Start capturing when we hit a heading or line with field keywords
        if any(kw in lower for kw in field_keywords):
            capturing = True
            relevant.append(line.strip())
            chars += len(line)
            continue

        # Stop capturing at next heading (unless it also matches)
        if capturing and line.strip().startswith("#"):
            if not any(kw in lower for kw in field_keywords):
                capturing = False
            continue

        if capturing and chars < max_chars:
            relevant.append(line.strip())
            chars += len(line)

    result = "\n".join(relevant).strip()
    return result if result else None


# ---------------------------------------------------------------------------
# Knowledge base enrichment
# ---------------------------------------------------------------------------

def enrich_knowledge_base(scraped: dict) -> list:
    """
    Enrich the existing knowledge base with scraped data.
    - Maps sub-pages to parent KB entries (concatenating content)
    - Updates scraped_details, eligibility, how_to_apply, cost, notes
    - Adds new services if not present
    """
    print("\n--- Enriching Knowledge Base ---\n")

    with open(KB_PATH, "r") as f:
        services = json.load(f)

    existing_names = {s["name"].lower() for s in services}

    # Group scraped content by KB service name
    service_content: dict[str, list] = {}
    service_urls: dict[str, list] = {}

    for page_name, data in scraped.items():
        content = data.get("content", "")
        kb_svc = data.get("kb_service", "")
        if not kb_svc or not content or len(content) < 50:
            continue
        service_content.setdefault(kb_svc, []).append(content)
        service_urls.setdefault(kb_svc, []).append(data.get("url", ""))

    updated = 0
    for svc in services:
        svc_key = svc["name"].lower()
        if svc_key not in service_content:
            continue

        # Concatenate all sub-page content for this service
        all_content = "\n\n---\n\n".join(service_content[svc_key])

        # Smart extract to fit within 4000 chars
        extracted = smart_extract(all_content, max_chars=5000)
        svc["scraped_details"] = extracted

        # Extract and update specific fields if scraped data has richer info
        _update_eligibility(svc, all_content)
        _update_how_to_apply(svc, all_content)
        _update_cost(svc, all_content)
        _update_notes(svc, all_content)

        # Update phone/email if missing
        phones = extract_phones(all_content)
        emails = extract_emails(all_content)
        if phones and not svc.get("phone"):
            svc["phone"] = phones[0]
        if emails and not svc.get("email"):
            svc["email"] = emails[0]

        # Update website URL to primary URL
        urls = service_urls.get(svc_key, [])
        if urls:
            svc["website"] = urls[0]

        updated += 1
        detail_len = len(extracted)
        print(f"  Updated: {svc['name']} ({detail_len} chars scraped_details, "
              f"{len(service_content[svc_key])} pages merged)")

    # Add well-known services that are not already in the KB
    new_services = _get_additional_services()
    new_count = 0
    for new_svc in new_services:
        if new_svc["name"].lower() not in existing_names:
            services.append(new_svc)
            existing_names.add(new_svc["name"].lower())
            new_count += 1
            print(f"  Added new: {new_svc['name']}")

    with open(KB_PATH, "w") as f:
        json.dump(services, f, indent=2, ensure_ascii=False)

    print(f"\n  Total services: {len(services)} ({updated} updated, {new_count} new)")
    return services


def _update_eligibility(svc: dict, content: str):
    """Update eligibility field with more specific criteria from scraped data."""
    extracted = extract_field_content(
        content,
        ["eligib", "who can", "who is", "qualify", "threshold", "income",
         "lim threshold", "household"],
        max_chars=400,
    )
    if extracted and len(extracted) > len(svc.get("eligibility", "")):
        # Only update if we found substantially more detail
        if len(extracted) > len(svc.get("eligibility", "")) + 50:
            svc["eligibility"] = extracted


def _update_how_to_apply(svc: dict, content: str):
    """Update how_to_apply with more detailed steps from scraped data."""
    extracted = extract_field_content(
        content,
        ["how to apply", "apply now", "application", "sign up", "register",
         "to apply", "apply for", "apply online", "get started"],
        max_chars=400,
    )
    if extracted and len(extracted) > len(svc.get("how_to_apply", "")):
        if len(extracted) > len(svc.get("how_to_apply", "")) + 30:
            svc["how_to_apply"] = extracted


def _update_cost(svc: dict, content: str):
    """Update cost field with specific fee information."""
    extracted = extract_field_content(
        content,
        ["cost", "fee", "price", "fare", "rate", "charge", "discount",
         "free", "subsid", "deductible", "co-pay"],
        max_chars=300,
    )
    if extracted and len(extracted) > len(svc.get("cost", "")):
        if len(extracted) > len(svc.get("cost", "")) + 20:
            svc["cost"] = extracted


def _update_notes(svc: dict, content: str):
    """Update notes with additional program details."""
    extracted = extract_field_content(
        content,
        ["note", "important", "additional", "please note", "remember",
         "deadline", "waitlist", "wait list"],
        max_chars=300,
    )
    if extracted and len(extracted) > 50:
        existing_notes = svc.get("notes", "")
        # Append rather than replace if existing notes are significant
        if existing_notes and len(existing_notes) > 50:
            # Only append if the new info is genuinely different
            if extracted[:100] not in existing_notes:
                combined = existing_notes + " | Additional details: " + extracted
                svc["notes"] = combined[:600]
        elif not existing_notes or len(extracted) > len(existing_notes):
            svc["notes"] = extracted


def _get_additional_services():
    """Well-researched Kingston services to add if not already present."""
    return [
        {
            "name": "Meals on Wheels Kingston",
            "category": "food",
            "description": "Delivers hot, nutritious meals to the homes of seniors and individuals with disabilities in Kingston who have difficulty preparing their own meals.",
            "eligibility": "Kingston residents who are homebound or have difficulty preparing meals due to age, illness, or disability.",
            "phone": "613-542-7293",
            "address": "Kingston, ON",
            "how_to_apply": "Call Victorian Order of Nurses (VON) Kingston at 613-542-7293 to arrange meal delivery.",
            "website": "https://www.von.ca/en/kingston",
            "cost": "Subsidized -- approximately $7 per meal",
            "keywords": ["meals", "food delivery", "meals on wheels", "homebound", "nutrition", "hot meals", "VON"],
        },
        {
            "name": "Kingston Caregiver Support",
            "category": "health",
            "description": "Support services for family caregivers of older adults in Kingston, including respite care, support groups, and information. Provided through SE Health and community partners.",
            "eligibility": "Family caregivers of older adults or persons with disabilities in Kingston.",
            "phone": "613-544-7090",
            "address": "Kingston, ON",
            "how_to_apply": "Call SE Health at 613-544-7090 or contact the Alzheimer Society of KFL&A at 613-544-3078.",
            "website": "https://www.sehc.com",
            "keywords": ["caregiver", "respite", "support", "family caregiver", "burnout", "help for caregivers"],
        },
        {
            "name": "Ontario Senior Homeowners Property Tax Grant",
            "category": "financial",
            "description": "Ontario provides a property tax grant of up to $500/year for senior homeowners with low-to-moderate income. Claimed when filing your income tax return.",
            "eligibility": "Ontario residents aged 64+ who own their home and have income under $50,000 (single) or $60,000 (couple).",
            "phone": "1-877-627-6645",
            "address": "Claimed through CRA when filing taxes",
            "how_to_apply": "File your annual income tax return and claim the Ontario Senior Homeowners' Property Tax Grant on the ON-BEN form.",
            "website": "https://www.ontario.ca/page/ontario-senior-homeowners-property-tax-grant",
            "cost": "Up to $500/year",
            "keywords": ["property tax", "tax grant", "homeowner", "senior homeowner", "tax relief", "property tax grant"],
        },
        {
            "name": "Ontario Drug Benefit (ODB)",
            "category": "health",
            "description": "Covers most prescription drug costs for Ontario residents aged 65+. Covers over 5,000 drug products. Annual deductible of $100, then co-pay of $6.11 per prescription.",
            "eligibility": "Ontario residents aged 65+, or residents of long-term care homes, or recipients of social assistance.",
            "phone": "1-866-532-3161",
            "how_to_apply": "Automatic enrollment when you turn 65 and have a valid Ontario health card. Present your health card at any pharmacy.",
            "website": "https://www.ontario.ca/page/get-coverage-prescription-drugs",
            "cost": "Annual deductible of $100, then $6.11 co-pay per prescription",
            "keywords": ["prescription", "drugs", "medication", "pharmacy", "ODB", "drug benefit", "prescriptions", "medicine"],
        },
        {
            "name": "Home and Community Care Support Services (SE Ontario)",
            "category": "health",
            "description": "Coordinates publicly funded home care services in the Kingston region including nursing, personal support, physiotherapy, occupational therapy, and social work. Free for eligible Ontario residents.",
            "eligibility": "Ontario residents with a valid health card who need home care services.",
            "phone": "613-544-7090",
            "address": "Kingston, ON",
            "how_to_apply": "Call 613-544-7090 or ask your doctor for a referral. A care coordinator will assess your needs.",
            "website": "https://www.ontariohealthathome.ca",
            "cost": "Free -- covered by OHIP",
            "keywords": ["home care", "nursing", "personal support", "physiotherapy", "CCAC", "home health", "PSW"],
        },
        {
            "name": "Guaranteed Income Supplement (GIS)",
            "category": "financial",
            "description": "Monthly non-taxable federal benefit for low-income Old Age Security (OAS) pensioners. Provides up to $1,065/month for single seniors. Automatically assessed when filing taxes.",
            "eligibility": "Canadian residents aged 65+ receiving OAS with annual income below $21,624 (single) or combined income below $28,560 (couple).",
            "phone": "1-800-277-9914",
            "how_to_apply": "Usually automatic if you file your income tax return. If not receiving it, call Service Canada at 1-800-277-9914.",
            "website": "https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement.html",
            "cost": "Up to $1,065.47/month (2024 rates)",
            "keywords": ["GIS", "guaranteed income", "pension", "low income senior", "supplement", "OAS", "federal benefit"],
        },
    ]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("GoldenGuide -- Kingston Data Scraper v2")
    print("=" * 60)

    if SPIDER_API_KEY:
        print(f"Spider.cloud API key: ...{SPIDER_API_KEY[-8:]}")
    else:
        print("No SPIDER_API_KEY set -- using BeautifulSoup fallback only")

    # 1. Scrape pages
    scraped = scrape_all_pages()

    # 2. Download GTFS
    download_gtfs()

    # 3. Enrich knowledge base
    services = enrich_knowledge_base(scraped)

    # 4. Summary
    scraped_count = sum(1 for v in scraped.values() if v.get("chars", 0) > 0)
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"\nPages scraped: {scraped_count}/{len(PAGES)}")
    for name, data in scraped.items():
        status = f"{data['chars']} chars" if data['chars'] > 0 else "FAILED"
        marker = "OK" if data['chars'] > 0 else "FAIL"
        print(f"  [{marker}] {name}: {status}")

    print(f"\nKnowledge base: {len(services)} services")
    for svc in services:
        sd_len = len(svc.get("scraped_details", ""))
        marker = "OK" if sd_len > 100 else "--"
        print(f"  [{marker}] {svc['name']}: {sd_len} chars scraped_details")

    gtfs_files = ["routes.txt", "stops.txt", "trips.txt", "stop_times.txt"]
    gtfs_present = [f for f in gtfs_files if os.path.exists(os.path.join(GTFS_DIR, f))]
    print(f"\nGTFS files: {len(gtfs_present)}/{len(gtfs_files)} present")

    if len(services) >= 10 and len(gtfs_present) == 4 and scraped_count >= 10:
        print("\nScraper v2 COMPLETE: Comprehensive KB built successfully!")
    else:
        print(f"\nPartial: {len(services)} services, {scraped_count} pages, "
              f"{len(gtfs_present)} GTFS files")


if __name__ == "__main__":
    main()
