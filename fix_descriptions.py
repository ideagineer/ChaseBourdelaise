#!/usr/bin/env python3
"""
fix_descriptions.py — Two jobs:
  1. Updates all meta descriptions to 110-160 chars
  2. Generates og_image.html — open in browser, screenshot at 1200x630, save as images/og_image.png

Run from your repo root:
  python3 fix_descriptions.py
"""

import os, re

# ---------------------------------------------------------------------------
# 1. UPDATED META DESCRIPTIONS (all under 160 chars)
# ---------------------------------------------------------------------------

DESCRIPTIONS = {
    "index.html": "Managing Director at Transwestern. 18 years of tenant representation, portfolio strategy, and deal analytics for CFOs and COOs nationwide.",
    "tools.html": "Proprietary CRE tools built from 18 years of enterprise deals — NPV modeling, lease comparison, buyout analysis, and portfolio dashboards.",
    "contact.html": "Contact Chase Bourdelaise, Managing Director at Transwestern. Tenant representation and portfolio strategy for CFOs, COOs, and real estate leaders.",
    "brokers.html": "Partner with Chase Bourdelaise on complex tenant representation — national reach, local execution, and deal-level financial expertise.",

    "insights/index.html": "Original analysis on lease economics, CMBS risk, and workplace strategy — built from 18 years of enterprise transactions, not theory.",
    "insights/landlord-ownership-mentality.html": "Who owns the building changes everything at the negotiating table. A practitioner's guide to every major landlord ownership type.",
    "insights/cre-terminology-guide.html": "Every CRE term that matters — cap rates, NER, load factors, lease structures, and labor metrics. Plain-English definitions, searchable.",
    "insights/tenant-buyout-vs-subleasing.html": "Two options for eliminating excess space with very different P&L, balance sheet, and EBITDA consequences. A practitioner's framework.",
    "insights/landlord-default-guide.html": "Nearly $1.5T in CRE debt maturing. 15 things every tenant needs to know about landlord default, CMBS risk, and protecting occupancy rights.",
    "insights/npv-commercial-real-estate.html": "Two leases can look identical and be worth completely different amounts. How to use net present value in commercial real estate decisions.",
    "insights/office-lease-buyouts-subleasing-termination.html": "The full spectrum of lease exit strategies — buyouts, subleases, restructures, and termination options — and when each makes financial sense.",
    "insights/considerations-covid-world-tenant.html": "Space utilization, portfolio flexibility, and lease structure frameworks that emerged from COVID and remain essential for today's occupiers.",
    "insights/great-pause-observations.html": "What COVID-19 revealed about how we use space, what office is actually for, and where landlord exposure sits in a disrupted market.",
    "insights/contact-center-covid-remote.html": "Large footprints, specialized buildouts, workforce concentration — real estate strategy for contact centers in a remote and hybrid world.",
    "insights/real-estate-scenario-planning.html": "How to stress-test real estate decisions against multiple business outcomes before committing — a framework for uncertain market conditions.",

    "case-studies/index.html": "Enterprise tenant representation and portfolio strategy across 150+ markets — complex transactions for CFOs, COOs, and real estate leaders.",
    "case-studies/case-studies.html": "Complex transactions across office, industrial, life sciences, and HQ relocations — case studies from 18 years of enterprise deals.",
    "case-studies/clients.html": "A selection of clients Chase Bourdelaise has represented across technology, life sciences, financial services, manufacturing, and logistics.",
    "case-studies/transactions.html": "Noteworthy transactions across markets, property types, and deal structures — leases, renewals, subleases, buyouts, and portfolio strategies.",

    "case-studies/astellas.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/casa-padel.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/createme.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/corporate-restructuring.html": "$18.3M NPV savings across 17 states in 18 months — a corporate disposition program executed concurrent with a major divestiture.",
    "case-studies/crown-castle.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/diagnostic-imaging.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/empire-moulding.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/gebruder-weiss.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/hormel.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/hq-relocation-houston.html": "Enterprise HQ relocation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/lyte.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/standard-bots.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/subjectwell.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/tradecraft.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/tranzonic.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",
    "case-studies/worldwide-express.html": "$5M annual EBITDA improvement through portfolio strategy — M&A integration, HQ relocation, and 40+ locations rightsized across 91 markets.",
    "case-studies/zimperium.html": "Enterprise tenant representation case study by Chase Bourdelaise, Managing Director at Transwestern.",

    "tools/loi-provisions.html": "60+ searchable LOI and RFP provisions — plain-English definitions, negotiating goals, model tenant language, and red flags.",
}

SKIP = {"nav.html", "footer.html", "author.html",
        "insights-preview.html", "case-studies-preview.html"}


def update_descriptions():
    repo_root = os.getcwd()
    updated = skipped = 0

    for relpath, desc in DESCRIPTIONS.items():
        src = os.path.join(repo_root, relpath)
        if not os.path.exists(src):
            print(f"  NOT FOUND: {relpath}")
            continue

        with open(src, "r", encoding="utf-8", errors="replace") as f:
            html = f.read()

        # Replace existing description tag
        new_tag = f'<meta name="description" content="{desc}"/>'
        if re.search(r'<meta\s+name="description"', html, re.IGNORECASE):
            new_html = re.sub(
                r'<meta\s+name="description"\s+content="[^"]*"[^>]*/?>',
                new_tag, html, flags=re.IGNORECASE
            )
        else:
            new_html = html  # no tag to replace; SEO block already handles it

        # Also update og:description
        new_og = f'<meta property="og:description" content="{desc}"/>'
        new_html = re.sub(
            r'<meta\s+property="og:description"\s+content="[^"]*"[^>]*/?>',
            new_og, new_html, flags=re.IGNORECASE
        )

        # Also update twitter:description
        new_tw = f'<meta name="twitter:description" content="{desc}"/>'
        new_html = re.sub(
            r'<meta\s+name="twitter:description"\s+content="[^"]*"[^>]*/?>',
            new_tw, new_html, flags=re.IGNORECASE
        )

        if new_html != html:
            with open(src, "w", encoding="utf-8") as f:
                f.write(new_html)
            chars = len(desc)
            print(f"  ✓ {relpath} ({chars} chars)")
            updated += 1
        else:
            skipped += 1

    print(f"\nDescriptions — {updated} updated, {skipped} unchanged\n")


# ---------------------------------------------------------------------------
# 2. OG IMAGE HTML — open in browser, screenshot at exactly 1200x630
# ---------------------------------------------------------------------------

OG_IMAGE_HTML = """\
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background: #051C2C;
    font-family: Georgia, 'Times New Roman', serif;
    display: flex;
    align-items: stretch;
  }

  .left {
    flex: 1;
    padding: 72px 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid rgba(255,255,255,0.08);
  }

  .top { }

  .label {
    font-family: 'Courier New', monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .label::before {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: #2251FF;
    flex-shrink: 0;
  }

  h1 {
    font-size: 52px;
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -1.5px;
    color: #fff;
    margin-bottom: 24px;
  }

  .tagline {
    font-size: 17px;
    font-style: italic;
    font-weight: 400;
    color: rgba(255,255,255,0.42);
    line-height: 1.6;
    max-width: 440px;
    padding-left: 16px;
    border-left: 1px solid rgba(255,255,255,0.12);
  }

  .bottom {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .name {
    font-size: 18px;
    font-weight: 600;
    color: rgba(255,255,255,0.88);
    letter-spacing: -0.3px;
  }
  .title {
    font-family: 'Courier New', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin-top: 4px;
  }
  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
  }
  .url {
    font-family: 'Courier New', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.22);
  }

  .right {
    width: 280px;
    padding: 72px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 32px;
  }

  .stat {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding-bottom: 28px;
  }
  .stat:last-child { border-bottom: none; padding-bottom: 0; }

  .stat-n {
    font-size: 36px;
    font-weight: 600;
    color: #fff;
    line-height: 1;
    letter-spacing: -1px;
  }
  .stat-n sup {
    font-size: 18px;
    color: #2251FF;
    vertical-align: super;
  }
  .stat-l {
    font-family: 'Courier New', monospace;
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin-top: 6px;
  }

  .cta {
    display: inline-block;
    margin-top: 8px;
    padding: 9px 20px;
    border: 1px solid rgba(255,255,255,0.2);
    font-family: 'Courier New', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }
</style>
</head>
<body>
  <div class="left">
    <div class="top">
      <div class="label">Tenant Advisory &amp; Portfolio Strategy</div>
      <h1>Corporate real estate<br/>strategy that changes<br/>how your deal ends.</h1>
      <p class="tagline">"The strategist other brokers call when the deal matters."</p>
    </div>
    <div class="bottom">
      <div>
        <div class="name">Chase Bourdelaise</div>
        <div class="title">Managing Director · Transwestern</div>
      </div>
      <div class="dot"></div>
      <div class="url">chasebourdelaise.com</div>
    </div>
  </div>

  <div class="right">
    <div class="stat">
      <div class="stat-n">18<sup>+</sup></div>
      <div class="stat-l">Years in CRE</div>
    </div>
    <div class="stat">
      <div class="stat-n">10M<sup>+</sup></div>
      <div class="stat-l">Sq Ft Transacted</div>
    </div>
    <div class="stat">
      <div class="stat-n">150<sup>+</sup></div>
      <div class="stat-l">Markets Executed</div>
    </div>
    <div class="cta">Work With Me →</div>
  </div>
</body>
</html>
"""


def generate_og_image():
    out_path = os.path.join(os.getcwd(), "og_image.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(OG_IMAGE_HTML)
    print(f"  ✓ og_image.html written to {out_path}")
    print()
    print("  Next steps for the OG image:")
    print("  1. Open og_image.html in Chrome")
    print("  2. Set zoom to 100% (Cmd/Ctrl + 0)")
    print("  3. Screenshot exactly the 1200x630 card")
    print("     (Chrome DevTools > device toolbar > set 1200x630 makes this easy)")
    print("  4. Save as images/og_image.png in your repo")
    print()


if __name__ == "__main__":
    print("=== Updating meta descriptions ===")
    update_descriptions()
    print("=== Generating OG image template ===")
    generate_og_image()
    print("Done.")
