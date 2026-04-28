# ChaseBourdelaise.com — SEO Fix Package

## What was wrong with the previous script

The old `seo_inject.py` had a critical bug:
```python
if 'property="og:title"' in html:
    return html, False  # <-- SKIPPED 19 files that had partial tags
```

Files that received a partial injection in a prior run (partial OG tags, missing
canonical / JSON-LD / robots / theme-color) were silently skipped forever.

## What the new script does differently

`process_seo.py` **strips any existing SEO tags first**, then injects a
complete, correct block on every file, every run. It is safe to run multiple
times — you'll always get a clean result.

## Every HTML page now gets

- `<meta name="description">` — sharpened, page-specific copy
- OG tags: title, description, image, url, type
- Twitter Card tags: card, title, description, image  
- `<link rel="canonical">` — correct absolute URL
- `<meta name="robots" content="index, follow">`
- `<meta name="theme-color" content="#051C2C">`
- JSON-LD structured data (Person + ProfessionalService schema)

## How to run

1. Drop `process_seo.py` into the **root of your repo** (same folder as `index.html`)
2. Run: `python3 process_seo.py`
3. It writes updated files to a `site_out/` folder (no in-place edits)
4. Review, then copy `site_out/` contents back to your repo

## Files in this package

| File | Purpose |
|------|---------|
| `process_seo.py` | Fixed SEO injector — run from repo root |
| `sitemap.xml` | Complete sitemap for Google Search Console |
| `robots.txt` | Deploy to repo root |

## Deploy checklist

- [ ] Run `python3 process_seo.py` from repo root
- [ ] Copy `site_out/` files to repo (replacing originals)
- [ ] Copy `sitemap.xml` to repo root
- [ ] Copy `robots.txt` to repo root
- [ ] Push to GitHub
- [ ] Submit `sitemap.xml` URL to Google Search Console
- [ ] Verify SEO tags at https://www.opengraph.xyz/url/https://www.chasebourdelaise.com

## Skip list (correctly not processed)

nav.html, footer.html, author.html, insights-preview.html, case-studies-preview.html
