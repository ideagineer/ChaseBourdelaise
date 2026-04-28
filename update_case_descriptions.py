#!/usr/bin/env python3
"""
update_case_descriptions.py
Run from your repo root: python3 update_case_descriptions.py

Updates the meta description, og:description, and twitter:description on all
case study pages with accurate, specific content derived from each case study.
All descriptions are 110-160 characters.
"""

import os, re

DESCRIPTIONS = {
    # -----------------------------------------------------------------------
    # FLAGSHIP CASE STUDIES
    # -----------------------------------------------------------------------
    "case-studies/worldwide-express.html": (
        "$5M annual EBITDA improvement through M&A integration, HQ relocation, and "
        "rightsizing 40+ locations across 91 markets for Worldwide Express."
    ),
    "case-studies/corporate-restructuring.html": (
        "$18.3M NPV savings across 17 states in 18 months — 10 lease buyouts and 7 "
        "subleases executed concurrent with a corporate divestiture."
    ),
    "case-studies/astellas.html": (
        "$500M in cumulative real estate savings across a 5.8M SF, 62-country global "
        "portfolio for a confidential Life Sciences pharmaceutical client."
    ),

    # -----------------------------------------------------------------------
    # SITE SELECTION / LABOR ANALYTICS
    # -----------------------------------------------------------------------
    "case-studies/casa-padel.html": (
        "Custom Opportunity Index built from first principles to rank all 380 U.S. "
        "metros for padel facility expansion — no domestic track record to model against."
    ),
    "case-studies/createme.html": (
        "Labor catchment model and commute analysis to site a prototype factory in the "
        "SF Bay Area maximizing specialized engineering talent access for CreateMe."
    ),
    "case-studies/lyte.html": (
        "National market screen identifying optimal U.S. expansion markets for Lyte "
        "based on demographic, labor, and real estate cost analysis."
    ),
    "case-studies/tradecraft.html": (
        "Market identification and site selection analysis for Tradecraft — locating "
        "the right market and submarket for a specialized operational requirement."
    ),
    "case-studies/standard-bots.html": (
        "Labor availability and facility analysis for Standard Bots — identifying "
        "markets with the right mix of manufacturing talent and industrial real estate."
    ),
    "case-studies/hormel.html": (
        "Hiring feasibility analysis for Hormel — evaluating labor market depth and "
        "talent pipeline before committing to a real estate decision."
    ),
    "case-studies/hq-relocation-houston.html": (
        "Headquarters relocation advisory in the Houston market — site selection, "
        "labor analysis, and lease negotiation for a complex HQ transaction."
    ),

    # -----------------------------------------------------------------------
    # TRANSACTION / PORTFOLIO
    # -----------------------------------------------------------------------
    "case-studies/crown-castle.html": (
        "Portfolio advisory and tenant representation for Crown Castle — complex "
        "lease strategy across multiple markets for a national telecom occupier."
    ),
    "case-studies/diagnostic-imaging.html": (
        "Real estate strategy and transaction execution for a diagnostic imaging "
        "healthcare provider — specialized space requirements across multiple markets."
    ),
    "case-studies/empire-moulding.html": (
        "Industrial site selection and tenant representation for Empire Moulding — "
        "locating and securing the right manufacturing and distribution footprint."
    ),
    "case-studies/gebruder-weiss.html": (
        "U.S. market entry and industrial real estate strategy for Gebruder Weiss — "
        "logistics network advisory for an international freight and logistics operator."
    ),
    "case-studies/subjectwell.html": (
        "Tenant representation and lease strategy for SubjectWell — office advisory "
        "for a growing healthcare technology company navigating a complex market."
    ),
    "case-studies/tranzonic.html": (
        "Portfolio strategy and industrial tenant representation for Tranzonic — "
        "multi-market advisory for a national industrial products distributor."
    ),
    "case-studies/zimperium.html": (
        "Office tenant representation and lease negotiation for Zimperium — "
        "right-sizing and market strategy for a high-growth cybersecurity company."
    ),
}


def update_file(path, desc):
    if not os.path.exists(path):
        print(f"  NOT FOUND: {path}")
        return False

    with open(path, "r", encoding="utf-8", errors="replace") as f:
        html = f.read()

    original = html

    # Update <meta name="description">
    tag = f'<meta name="description" content="{desc}"/>'
    if re.search(r'<meta\s+name="description"', html, re.IGNORECASE):
        html = re.sub(
            r'<meta\s+name="description"\s+content="[^"]*"[^>]*/?>',
            tag, html, flags=re.IGNORECASE
        )
    # Update og:description
    og = f'<meta property="og:description" content="{desc}"/>'
    html = re.sub(
        r'<meta\s+property="og:description"\s+content="[^"]*"[^>]*/?>',
        og, html, flags=re.IGNORECASE
    )
    # Update twitter:description
    tw = f'<meta name="twitter:description" content="{desc}"/>'
    html = re.sub(
        r'<meta\s+name="twitter:description"\s+content="[^"]*"[^>]*/?>',
        tw, html, flags=re.IGNORECASE
    )

    if html == original:
        print(f"  — no change: {path}")
        return False

    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  ✓ {path} ({len(desc)} chars)")
    return True


def main():
    repo_root = os.getcwd()
    updated = 0

    print("Updating case study descriptions...\n")
    for relpath, desc in DESCRIPTIONS.items():
        full = os.path.join(repo_root, relpath)
        if update_file(full, desc):
            updated += 1

    print(f"\nDone — {updated} files updated.")
    print("\nNext: git add -A && git commit -m 'Update case study meta descriptions' && git push")


if __name__ == "__main__":
    main()
