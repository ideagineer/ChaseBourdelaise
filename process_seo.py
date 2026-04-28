#!/usr/bin/env python3
"""
process_seo.py — Applies complete SEO to all chasebourdelaise.com HTML files.
This version STRIPS any existing partial SEO injection before re-applying a
complete, correct block. It handles all 34 pages (skips nav/footer fragments).

Run after downloading all files:
  python3 process_seo.py
"""

import os, re, base64

BASE_URL = "https://www.chasebourdelaise.com"
OG_IMAGE = f"{BASE_URL}/images/og_image.png"

SKIP_FILES = {"nav.html", "footer.html", "author.html",
              "case-studies-preview.html", "insights-preview.html"}

JSON_LD = """\
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "name": "Chase Bourdelaise",
      "jobTitle": "Managing Director",
      "worksFor": {"@type": "Organization", "name": "Transwestern"},
      "url": "https://www.chasebourdelaise.com",
      "sameAs": ["https://www.linkedin.com/in/tenantadvisor/"],
      "telephone": "+12025911926",
      "email": "chase.bourdelaise@transwestern.com"
    },
    {
      "@type": "ProfessionalService",
      "name": "Chase Bourdelaise — Tenant Advisory & Portfolio Strategy",
      "url": "https://www.chasebourdelaise.com"
    }
  ]
}
</script>"""

CS = "Enterprise tenant representation by Chase Bourdelaise, Managing Director at Transwestern. Complex transactions across office, industrial, and portfolio strategy nationwide."

META = {
    # Root pages
    "index.html": (
        "Chase Bourdelaise — Tenant Advisory & Portfolio Strategy",
        "Managing Director at Transwestern. 18 years of complex tenant representation, portfolio strategy, and deal analytics for CFOs, COOs, and corporate real estate leaders nationwide.",
        f"{BASE_URL}/"),
    "tools.html": (
        None,
        "Proprietary real estate tools built from 18 years of enterprise transactions — NPV modeling, lease comparison, buyout analysis, and portfolio dashboards for CFOs and COOs.",
        f"{BASE_URL}/tools.html"),
    "contact.html": (
        None,
        "Contact Chase Bourdelaise, Managing Director at Transwestern. Tenant representation, portfolio strategy, and occupier advisory for CFOs, COOs, and real estate leaders.",
        f"{BASE_URL}/contact.html"),
    "brokers.html": (
        None,
        "Partner with Chase Bourdelaise on complex tenant representation and occupier strategy — national reach, local execution, and deal-level financial expertise for competitive pitches.",
        f"{BASE_URL}/brokers.html"),
    # Insights
    "insights/index.html": (
        None,
        "Original analysis on lease economics, CMBS risk, workplace strategy, and commercial real estate negotiation — built from 18 years of transactions, not theory.",
        f"{BASE_URL}/insights/"),
    "insights/landlord-ownership-mentality.html": (
        None,
        "Who owns the building changes everything at the negotiating table. A practitioner's guide to the motivations, metrics, and decision-making logic of every major landlord ownership type.",
        f"{BASE_URL}/insights/landlord-ownership-mentality.html"),
    "insights/cre-terminology-guide.html": (
        None,
        "Every commercial real estate term that matters — cap rates, NER, absorption, load factors, lease structures, and labor market metrics. Searchable, plain-English definitions.",
        f"{BASE_URL}/insights/cre-terminology-guide.html"),
    "insights/tenant-buyout-vs-subleasing.html": (
        None,
        "Two options for eliminating excess space. Very different financial consequences for your P&L, balance sheet, and EBITDA. A practitioner's framework for the decision.",
        f"{BASE_URL}/insights/tenant-buyout-vs-subleasing.html"),
    "insights/landlord-default-guide.html": (
        None,
        "Nearly $1.5T in CRE debt maturing. 15 things every tenant needs to know about landlord default, CMBS risk, and protecting your occupancy rights.",
        f"{BASE_URL}/insights/landlord-default-guide.html"),
    "insights/npv-commercial-real-estate.html": (
        None,
        "Two leases can look identical on paper and be worth completely different amounts of money. How to use net present value to evaluate commercial real estate decisions.",
        f"{BASE_URL}/insights/npv-commercial-real-estate.html"),
    "insights/office-lease-buyouts-subleasing-termination.html": (
        None,
        "The full spectrum of lease exit strategies — buyouts, subleases, restructures, and termination options — and when each one makes financial sense.",
        f"{BASE_URL}/insights/office-lease-buyouts-subleasing-termination.html"),
    "insights/considerations-covid-world-tenant.html": (
        None,
        "The frameworks for space utilization, portfolio flexibility, and lease structure that emerged from COVID and remain essential for today's occupiers.",
        f"{BASE_URL}/insights/considerations-covid-world-tenant.html"),
    "insights/great-pause-observations.html": (
        None,
        "What COVID-19 revealed about how we use space, what office is actually for, and where landlord exposure sits in a disrupted market.",
        f"{BASE_URL}/insights/great-pause-observations.html"),
    "insights/contact-center-covid-remote.html": (
        None,
        "Large footprints, specialized buildouts, workforce concentration — how contact center operators should think through real estate strategy in a remote and hybrid world.",
        f"{BASE_URL}/insights/contact-center-covid-remote.html"),
    "insights/real-estate-scenario-planning.html": (
        None,
        "How to stress-test real estate decisions against multiple business outcomes before committing. A framework for occupiers navigating uncertain market conditions.",
        f"{BASE_URL}/insights/real-estate-scenario-planning.html"),
    # Case studies structural
    "case-studies/index.html": (
        None,
        "Enterprise tenant representation and portfolio strategy across 150+ markets. Complex transactions for CFOs, COOs, and corporate real estate leaders.",
        f"{BASE_URL}/case-studies/"),
    "case-studies/case-studies.html": (
        None,
        "Complex transactions across office, industrial, life sciences, and HQ relocations — detailed case studies from Chase Bourdelaise's 18 years of enterprise deals.",
        f"{BASE_URL}/case-studies/case-studies.html"),
    "case-studies/clients.html": (
        None,
        "A selection of clients Chase Bourdelaise has represented across technology, life sciences, financial services, manufacturing, and logistics sectors.",
        f"{BASE_URL}/case-studies/clients.html"),
    "case-studies/transactions.html": (
        None,
        "Noteworthy transactions across markets, property types, and deal structures — new leases, renewals, subleases, buyouts, and portfolio strategies.",
        f"{BASE_URL}/case-studies/transactions.html"),
    # Case study individual pages
    "case-studies/astellas.html":               (None, CS, f"{BASE_URL}/case-studies/astellas.html"),
    "case-studies/casa-padel.html":              (None, CS, f"{BASE_URL}/case-studies/casa-padel.html"),
    "case-studies/createme.html":                (None, CS, f"{BASE_URL}/case-studies/createme.html"),
    "case-studies/corporate-restructuring.html": (None, CS, f"{BASE_URL}/case-studies/corporate-restructuring.html"),
    "case-studies/crown-castle.html":            (None, CS, f"{BASE_URL}/case-studies/crown-castle.html"),
    "case-studies/diagnostic-imaging.html":      (None, CS, f"{BASE_URL}/case-studies/diagnostic-imaging.html"),
    "case-studies/empire-moulding.html":         (None, CS, f"{BASE_URL}/case-studies/empire-moulding.html"),
    "case-studies/gebruder-weiss.html":          (None, CS, f"{BASE_URL}/case-studies/gebruder-weiss.html"),
    "case-studies/hormel.html":                  (None, CS, f"{BASE_URL}/case-studies/hormel.html"),
    "case-studies/hq-relocation-houston.html":   (None, CS, f"{BASE_URL}/case-studies/hq-relocation-houston.html"),
    "case-studies/lyte.html":                    (None, CS, f"{BASE_URL}/case-studies/lyte.html"),
    "case-studies/standard-bots.html":           (None, CS, f"{BASE_URL}/case-studies/standard-bots.html"),
    "case-studies/subjectwell.html":             (None, CS, f"{BASE_URL}/case-studies/subjectwell.html"),
    "case-studies/tradecraft.html":              (None, CS, f"{BASE_URL}/case-studies/tradecraft.html"),
    "case-studies/tranzonic.html":               (None, CS, f"{BASE_URL}/case-studies/tranzonic.html"),
    "case-studies/worldwide-express.html":       (None, CS, f"{BASE_URL}/case-studies/worldwide-express.html"),
    "case-studies/zimperium.html":               (None, CS, f"{BASE_URL}/case-studies/zimperium.html"),
    # Tools
    "tools/loi-provisions.html": (
        None,
        "60+ searchable LOI and RFP provisions — plain-English definitions, negotiating goals, model tenant language, and red flags. Built from 18 years of enterprise CRE transactions.",
        f"{BASE_URL}/tools/loi-provisions.html"),
}


def strip_existing_seo(html):
    """Remove any existing SEO tags that were previously injected."""
    # Remove SEO injector comment block and everything up to next </head>-adjacent tag
    html = re.sub(r'<!-- SEO injected by seo_inject\.py -->.*?(?=\n</head>)', '',
                  html, flags=re.DOTALL | re.IGNORECASE)
    # Remove Open Graph comment block
    html = re.sub(r'<!-- Open Graph / Link Preview -->.*?(?=\n</head>)', '',
                  html, flags=re.DOTALL | re.IGNORECASE)
    # Remove individual OG/twitter/canonical/robots/theme-color meta tags (line by line)
    patterns = [
        r'<meta\s+property="og:[^"]*"[^>]*/?>',
        r'<meta\s+name="twitter:[^"]*"[^>]*/?>',
        r'<link\s+rel="canonical"[^>]*/?>',
        r'<meta\s+name="robots"[^>]*/?>',
        r'<meta\s+name="theme-color"[^>]*/?>',
        r'<script\s+type="application/ld\+json">.*?</script>',
    ]
    for pat in patterns:
        html = re.sub(pat, '', html, flags=re.DOTALL | re.IGNORECASE)
    # Clean up blank lines created by removal
    html = re.sub(r'\n{3,}', '\n\n', html)
    return html


def seo_block(title, desc, canon):
    return f"""<!-- SEO: Chase Bourdelaise | chasebourdelaise.com -->
<meta name="description" content="{desc}"/>
<meta property="og:title" content="{title}"/>
<meta property="og:description" content="{desc}"/>
<meta property="og:image" content="{OG_IMAGE}"/>
<meta property="og:url" content="{canon}"/>
<meta property="og:type" content="website"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="{title}"/>
<meta name="twitter:description" content="{desc}"/>
<meta name="twitter:image" content="{OG_IMAGE}"/>
<link rel="canonical" href="{canon}"/>
<meta name="robots" content="index, follow"/>
<meta name="theme-color" content="#051C2C"/>
{JSON_LD}"""


def process_file(relpath, html):
    """Strip old SEO, inject fresh complete block, update meta description."""
    if os.path.basename(relpath) in SKIP_FILES:
        return html, False

    if "</head>" not in html:
        return html, False

    # Strip any prior SEO injection
    html = strip_existing_seo(html)

    og_title_override, desc, canon = META.get(relpath, (None, None, None))
    if not canon:
        # Fallback for any file not in META table
        canon = BASE_URL + "/" + relpath.replace("\\", "/")
        desc = desc or "Chase Bourdelaise, Managing Director at Transwestern. Tenant representation and portfolio strategy."

    title_m = re.search(r"<title>(.*?)</title>", html, re.DOTALL | re.IGNORECASE)
    page_title = title_m.group(1).strip() if title_m else "Chase Bourdelaise"
    og_title = og_title_override or page_title

    # Replace or insert meta description
    if desc:
        if re.search(r'<meta\s+name="description"', html, re.IGNORECASE):
            html = re.sub(
                r'<meta\s+name="description"\s+content="[^"]*"[^>]*/?>',
                f'<meta name="description" content="{desc}"/>',
                html, flags=re.IGNORECASE
            )
        # (if no existing meta description tag, the seo_block already adds one)

    block = seo_block(og_title, desc or page_title, canon)
    html = html.replace("</head>", block + "\n</head>", 1)
    return html, True


def main():
    src_dir = "/home/claude/site"
    out_dir = "/home/claude/site_out"

    processed = skipped = errors = 0

    for dirpath, dirnames, filenames in os.walk(src_dir):
        dirnames[:] = [d for d in dirnames if d not in {".git", "__pycache__"}]
        for fname in filenames:
            if not fname.endswith(".html"):
                continue
            src = os.path.join(dirpath, fname)
            rel = os.path.relpath(src, src_dir).replace("\\", "/")

            try:
                with open(src, "r", encoding="utf-8", errors="replace") as f:
                    html = f.read()
            except Exception as e:
                print(f"  ERROR reading {rel}: {e}")
                errors += 1
                continue

            new_html, changed = process_file(rel, html)

            dst = os.path.join(out_dir, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)

            try:
                with open(dst, "w", encoding="utf-8") as f:
                    f.write(new_html)
                status = "✓ updated" if changed else "— copied (skip)"
                print(f"  {status}: {rel}")
                if changed:
                    processed += 1
                else:
                    skipped += 1
            except Exception as e:
                print(f"  ERROR writing {rel}: {e}")
                errors += 1

    print(f"\nDone — {processed} updated, {skipped} skipped/copied, {errors} errors")


if __name__ == "__main__":
    main()
