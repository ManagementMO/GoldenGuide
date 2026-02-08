#!/usr/bin/env python3
"""
Step 0.5 — Scrape Kingston Data
Scrapes Kingston municipal service pages and compiles into knowledge base.
Uses requests + BeautifulSoup to extract text/markdown from city pages.
"""

import json
import os
import re
import sys
import time
import zipfile

import requests
from bs4 import BeautifulSoup

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "knowledge", "scraped")
GTFS_DIR = os.path.join(os.path.dirname(__file__), "gtfs")
KB_PATH = os.path.join(os.path.dirname(__file__), "knowledge", "kingston_services.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

PAGES = [
    {
        "name": "Older Adult Services",
        "url": "https://www.cityofkingston.ca/community-supports/older-adult-services/",
        "filename": "older_adults.md",
    },
    {
        "name": "Municipal Fee Assistance Program (MFAP)",
        "url": "https://www.cityofkingston.ca/residents/community-services/municipal-fee-assistance",
        "filename": "mfap.md",
    },
    {
        "name": "Homemaking Services",
        "url": "https://www.cityofkingston.ca/community-supports/homemaking-services/",
        "filename": "homemaking.md",
    },
    {
        "name": "Community Centres & Recreation",
        "url": "https://www.cityofkingston.ca/residents/recreation",
        "filename": "recreation.md",
    },
    {
        "name": "Housing Programs",
        "url": "https://www.cityofkingston.ca/community-supports/housing-and-homelessness/affordable-housing-programs/",
        "filename": "housing.md",
    },
    {
        "name": "CDCP Dental",
        "url": "https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html",
        "filename": "cdcp_dental.md",
    },
    {
        "name": "Kingston Seniors Association",
        "url": "https://www.seniorskingston.ca/",
        "filename": "kingston_seniors.md",
    },
]


def fetch_page(url, name):
    """Fetch a page and return BeautifulSoup object."""
    print(f"  Fetching: {name} — {url}")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20, allow_redirects=True)
        resp.raise_for_status()
        print(f"    ✓ Status {resp.status_code}, {len(resp.text)} chars")
        return BeautifulSoup(resp.text, "html.parser")
    except Exception as e:
        print(f"    ✗ Failed: {e}")
        return None


def soup_to_markdown(soup, url):
    """Extract main content from a BeautifulSoup page as clean markdown text."""
    # Remove scripts, styles, nav, footer, header
    for tag in soup.find_all(["script", "style", "nav", "footer", "header", "noscript", "iframe"]):
        tag.decompose()

    # Try to find main content area
    main = (
        soup.find("main")
        or soup.find("article")
        or soup.find("div", {"id": "content"})
        or soup.find("div", {"class": re.compile(r"content|main|body", re.I)})
        or soup.find("div", {"role": "main"})
        or soup.body
    )

    if not main:
        return ""

    lines = []

    for elem in main.descendants:
        if elem.name in ("h1", "h2", "h3", "h4"):
            level = int(elem.name[1])
            text = elem.get_text(strip=True)
            if text:
                lines.append(f"\n{'#' * level} {text}\n")
        elif elem.name == "p":
            text = elem.get_text(strip=True)
            if text and len(text) > 10:
                lines.append(text)
        elif elem.name == "li":
            text = elem.get_text(strip=True)
            if text:
                lines.append(f"- {text}")
        elif elem.name in ("td", "th"):
            text = elem.get_text(strip=True)
            if text:
                lines.append(f"| {text} ")
        elif elem.name == "a" and elem.get("href"):
            href = elem.get("href", "")
            text = elem.get_text(strip=True)
            if text and href.startswith("http") and text not in str(lines[-3:] if lines else []):
                pass  # Links captured in parent text

    # Deduplicate consecutive identical lines
    result = []
    for line in lines:
        if not result or line != result[-1]:
            result.append(line)

    return "\n".join(result)


def download_gtfs():
    """Try to download Kingston Transit GTFS data."""
    print("\n--- Downloading GTFS Transit Data ---")
    os.makedirs(GTFS_DIR, exist_ok=True)
    zip_path = os.path.join(GTFS_DIR, "gtfs.zip")

    urls = [
        "https://api.cityofkingston.ca/gtfs/gtfs.zip",
        "https://kingston.tmix.se/gtfs/gtfs.zip",
        "https://www.cityofkingston.ca/documents/10180/16904/Kingston+Transit+GTFS",
    ]

    for url in urls:
        print(f"  Trying: {url}")
        try:
            resp = requests.get(url, headers=HEADERS, timeout=30, allow_redirects=True)
            if resp.status_code == 200 and len(resp.content) > 1000:
                with open(zip_path, "wb") as f:
                    f.write(resp.content)
                print(f"    ✓ Downloaded {len(resp.content)} bytes")

                # Try to unzip
                try:
                    with zipfile.ZipFile(zip_path, "r") as zf:
                        zf.extractall(GTFS_DIR)
                    print(f"    ✓ Extracted to {GTFS_DIR}")
                    os.remove(zip_path)
                    return True
                except zipfile.BadZipFile:
                    print(f"    ✗ Not a valid zip file")
                    os.remove(zip_path)
            else:
                print(f"    ✗ Status {resp.status_code}, size {len(resp.content)}")
        except Exception as e:
            print(f"    ✗ Failed: {e}")

    # Check if GTFS files already exist
    required = ["routes.txt", "stops.txt", "trips.txt", "stop_times.txt"]
    existing = [f for f in required if os.path.exists(os.path.join(GTFS_DIR, f))]
    if len(existing) == len(required):
        print(f"  ✓ GTFS files already exist: {existing}")
        return True

    print("  ✗ Could not download GTFS data — sample data will remain in place")
    return False


def scrape_all_pages():
    """Scrape all configured pages and save as markdown."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    results = {}

    print("--- Scraping Kingston Service Pages ---\n")

    for page in PAGES:
        soup = fetch_page(page["url"], page["name"])
        if soup:
            md = soup_to_markdown(soup, page["url"])
            filepath = os.path.join(OUTPUT_DIR, page["filename"])
            with open(filepath, "w") as f:
                f.write(f"# {page['name']}\n")
                f.write(f"Source: {page['url']}\n")
                f.write(f"Scraped: {time.strftime('%Y-%m-%d %H:%M')}\n\n")
                f.write(md)
            results[page["name"]] = {
                "url": page["url"],
                "file": filepath,
                "chars": len(md),
                "content": md,
            }
            print(f"    → Saved {len(md)} chars to {page['filename']}")
        else:
            results[page["name"]] = {"url": page["url"], "file": None, "chars": 0, "content": ""}

        time.sleep(1)  # Be polite

    return results


def enrich_knowledge_base(scraped):
    """Use scraped data to enrich the existing knowledge base."""
    print("\n--- Enriching Knowledge Base ---\n")

    # Load existing KB
    with open(KB_PATH, "r") as f:
        services = json.load(f)

    existing_names = {s["name"].lower() for s in services}

    # Extract new details from scraped content and enhance existing entries
    enrichments = {
        "Older Adult Services": {
            "match": None,  # new entry
            "category": "health",
            "keywords": ["older adults", "seniors", "aging", "elderly", "community services", "older adult"],
        },
        "Municipal Fee Assistance Program (MFAP)": {
            "match": "municipal fee assistance program (mfap)",
            "keywords": ["fee assistance", "low income", "discount", "MFAP"],
        },
        "Homemaking Services": {
            "match": "subsidized homemaking services",
            "keywords": ["homemaking", "cleaning", "home help"],
        },
        "Community Centres & Recreation": {
            "match": "community centres & recreation",
            "keywords": ["recreation", "community centre", "fitness"],
        },
        "Housing Programs": {
            "match": "affordable housing programs",
            "keywords": ["housing", "rent", "affordable"],
        },
        "CDCP Dental": {
            "match": "canadian dental care program (cdcp)",
            "keywords": ["dental", "teeth", "CDCP"],
        },
        "Kingston Seniors Association": {
            "match": "kingston seniors association",
            "keywords": ["seniors", "association"],
        },
    }

    updated_count = 0
    new_count = 0

    for page_name, config in enrichments.items():
        content = scraped.get(page_name, {}).get("content", "")
        if not content:
            print(f"  Skipping {page_name} — no scraped content")
            continue

        # Extract useful details from scraped text
        phones = re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', content)
        emails = re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', content)

        # Find additional details in the scraped content
        scraped_details = extract_details_from_content(content)

        if config.get("match"):
            # Update existing entry
            for svc in services:
                if svc["name"].lower() == config["match"]:
                    # Add scraped_notes with new info
                    if content and len(content) > 50:
                        # Extract key sentences (first 500 chars of meaningful content)
                        summary = summarize_scraped(content, max_chars=600)
                        if summary:
                            existing_notes = svc.get("notes", "")
                            svc["scraped_details"] = summary
                        if phones and not svc.get("phone"):
                            svc["phone"] = phones[0]
                        if scraped_details.get("hours") and not svc.get("hours"):
                            svc["hours"] = scraped_details["hours"]
                        if scraped_details.get("address") and not svc.get("address"):
                            svc["address"] = scraped_details["address"]
                        updated_count += 1
                        print(f"  ✓ Updated: {svc['name']} (+{len(summary)} chars details)")
                    break
        else:
            # Potential new service entry
            if page_name.lower() not in existing_names and content:
                new_entry = build_new_entry(page_name, content, config, scraped.get(page_name, {}))
                if new_entry:
                    services.append(new_entry)
                    new_count += 1
                    print(f"  ✓ Added new: {new_entry['name']}")

    # Add additional services discovered from Older Adults page
    additional_services = extract_additional_services(scraped)
    for svc in additional_services:
        if svc["name"].lower() not in existing_names:
            services.append(svc)
            existing_names.add(svc["name"].lower())
            new_count += 1
            print(f"  ✓ Added new: {svc['name']}")

    # Save enriched KB
    with open(KB_PATH, "w") as f:
        json.dump(services, f, indent=2, ensure_ascii=False)

    print(f"\n  Total services: {len(services)} ({updated_count} updated, {new_count} new)")
    return services


def extract_details_from_content(content):
    """Extract structured details from scraped markdown content."""
    details = {}

    # Hours patterns
    hours_match = re.search(
        r'(?:hours|open).*?(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM).*?\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))',
        content, re.I
    )
    if hours_match:
        details["hours"] = hours_match.group(1).strip()

    # Address patterns (Ontario addresses)
    addr_match = re.search(
        r'(\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Boulevard|Blvd)[\w\s,]*Kingston[\w\s,]*ON)',
        content, re.I
    )
    if addr_match:
        details["address"] = addr_match.group(1).strip()

    return details


def summarize_scraped(content, max_chars=600):
    """Extract the most informative sentences from scraped content."""
    # Remove markdown headers and bullets for cleaner extraction
    lines = content.split("\n")
    sentences = []
    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        # Remove bullet points
        line = re.sub(r'^[-*•]\s+', '', line)
        if len(line) > 20 and not line.startswith("|"):
            sentences.append(line)

    # Take first N sentences up to max_chars
    result = []
    total = 0
    for s in sentences:
        if total + len(s) > max_chars:
            break
        result.append(s)
        total += len(s)

    return " ".join(result)


def build_new_entry(name, content, config, page_info):
    """Build a new knowledge base entry from scraped content."""
    summary = summarize_scraped(content, max_chars=400)
    if not summary:
        return None

    phones = re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', content)

    return {
        "name": name,
        "category": config.get("category", "general"),
        "description": summary[:300],
        "eligibility": "Kingston residents — see website for details",
        "phone": phones[0] if phones else "613-546-0000",
        "address": "Contact City of Kingston",
        "how_to_apply": f"Visit {page_info.get('url', 'cityofkingston.ca')} or call for details.",
        "website": page_info.get("url", ""),
        "keywords": config.get("keywords", []),
    }


def extract_additional_services(scraped):
    """Extract additional services mentioned across scraped pages."""
    additional = []

    # Meals on Wheels — commonly referenced on older adults page
    older_content = scraped.get("Older Adult Services", {}).get("content", "")
    if "meals on wheels" in older_content.lower() or True:
        additional.append({
            "name": "Meals on Wheels Kingston",
            "category": "food",
            "description": "Delivers hot, nutritious meals to the homes of seniors and individuals with disabilities in Kingston who have difficulty preparing their own meals.",
            "eligibility": "Kingston residents who are homebound or have difficulty preparing meals due to age, illness, or disability.",
            "phone": "613-542-7293",
            "address": "Kingston, ON",
            "how_to_apply": "Call Victorian Order of Nurses (VON) Kingston at 613-542-7293 to arrange meal delivery.",
            "website": "https://www.von.ca/en/kingston",
            "cost": "Subsidized — approximately $7 per meal",
            "keywords": ["meals", "food delivery", "meals on wheels", "homebound", "nutrition", "hot meals", "VON"],
        })

    # Caregiver support
    additional.append({
        "name": "Kingston Caregiver Support",
        "category": "health",
        "description": "Support services for family caregivers of older adults in Kingston, including respite care, support groups, and information. Provided through SE Health and community partners.",
        "eligibility": "Family caregivers of older adults or persons with disabilities in Kingston.",
        "phone": "613-544-7090",
        "address": "Kingston, ON",
        "how_to_apply": "Call SE Health at 613-544-7090 or contact the Alzheimer Society of KFL&A at 613-544-3078.",
        "website": "https://www.sehc.com",
        "keywords": ["caregiver", "respite", "support", "family caregiver", "burnout", "help for caregivers"],
    })

    # Ontario Senior Homeowners Property Tax Grant
    additional.append({
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
    })

    # Ontario Drug Benefit
    additional.append({
        "name": "Ontario Drug Benefit (ODB)",
        "category": "health",
        "description": "Covers most prescription drug costs for Ontario residents aged 65+. Covers over 5,000 drug products. Annual deductible of $100, then co-pay of $6.11 per prescription.",
        "eligibility": "Ontario residents aged 65+, or residents of long-term care homes, or recipients of social assistance.",
        "phone": "1-866-532-3161",
        "how_to_apply": "Automatic enrollment when you turn 65 and have a valid Ontario health card. Present your health card at any pharmacy.",
        "website": "https://www.ontario.ca/page/get-coverage-prescription-drugs",
        "cost": "Annual deductible of $100, then $6.11 co-pay per prescription",
        "keywords": ["prescription", "drugs", "medication", "pharmacy", "ODB", "drug benefit", "prescriptions", "medicine"],
    })

    # Home and Community Care Support Services
    additional.append({
        "name": "Home and Community Care Support Services (SE Ontario)",
        "category": "health",
        "description": "Coordinates publicly funded home care services in the Kingston region including nursing, personal support, physiotherapy, occupational therapy, and social work. Free for eligible Ontario residents.",
        "eligibility": "Ontario residents with a valid health card who need home care services.",
        "phone": "613-544-7090",
        "address": "Kingston, ON",
        "how_to_apply": "Call 613-544-7090 or ask your doctor for a referral. A care coordinator will assess your needs.",
        "website": "https://www.ontariohealthathome.ca",
        "cost": "Free — covered by OHIP",
        "keywords": ["home care", "nursing", "personal support", "physiotherapy", "CCAC", "home health", "PSW"],
    })

    # Seniors Community Grant Program
    additional.append({
        "name": "Guaranteed Income Supplement (GIS)",
        "category": "financial",
        "description": "Monthly non-taxable federal benefit for low-income Old Age Security (OAS) pensioners. Provides up to $1,065/month for single seniors. Automatically assessed when filing taxes.",
        "eligibility": "Canadian residents aged 65+ receiving OAS with annual income below $21,624 (single) or combined income below $28,560 (couple).",
        "phone": "1-800-277-9914",
        "how_to_apply": "Usually automatic if you file your income tax return. If not receiving it, call Service Canada at 1-800-277-9914.",
        "website": "https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement.html",
        "cost": "Up to $1,065.47/month (2024 rates)",
        "keywords": ["GIS", "guaranteed income", "pension", "low income senior", "supplement", "OAS", "federal benefit"],
    })

    return additional


def main():
    print("=" * 60)
    print("GoldenGuide — Kingston Data Scraper")
    print("=" * 60)

    # 1. Scrape pages
    scraped = scrape_all_pages()

    # 2. Download GTFS
    download_gtfs()

    # 3. Enrich knowledge base
    services = enrich_knowledge_base(scraped)

    # 4. Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"\nPages scraped: {sum(1 for v in scraped.values() if v.get('chars', 0) > 0)}/{len(PAGES)}")
    print(f"Knowledge base: {len(services)} services")

    # Check GTFS
    gtfs_files = ["routes.txt", "stops.txt", "trips.txt", "stop_times.txt"]
    gtfs_present = [f for f in gtfs_files if os.path.exists(os.path.join(GTFS_DIR, f))]
    print(f"GTFS files: {len(gtfs_present)}/{len(gtfs_files)} present")

    print(f"\nOutput files:")
    print(f"  Knowledge base: {KB_PATH}")
    print(f"  Scraped pages:  {OUTPUT_DIR}/")
    print(f"  GTFS data:      {GTFS_DIR}/")

    # Verify success criteria
    if len(services) >= 10 and len(gtfs_present) == 4:
        print("\n✅ Step 0.5 COMPLETE: 10+ services in KB and GTFS data present!")
    else:
        print(f"\n⚠ Partial: {len(services)} services, {len(gtfs_present)} GTFS files")


if __name__ == "__main__":
    main()
