# Desk & Day — E-commerce Analytics Lab

A complete, dependency-free storefront for a data analyst portfolio. Built for GitHub Pages and GA4. Runs on MacBook Air M2 without Docker, a backend, or a paid hosting service.

**What is complete:** store, cart, demo checkout, consent-gated GA4 event code, tracking inspector, metric analysis script, QA test, dashboard recipes and case-study template.

**What you must configure:** your GitHub repository and Pages, your Google Analytics account/property/web stream, one Measurement ID, GA4 reports/explorations, and real consenting test participants. No GA4 property or cloud dashboard has been created for you. No fabricated visitors, results or business revenue are included.

## Start here, in order

1. Read [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md). It covers Mac setup → local store → GitHub Pages → GA4 → testing → dashboards → insights → resume evidence.
2. Change only the Measurement ID in `config.js` once your GA4 stream exists.
3. Use [docs/MEASUREMENT_PLAN.md](docs/MEASUREMENT_PLAN.md) as your event dictionary.
4. Create the dashboards described in [docs/GA4_DASHBOARDS.md](docs/GA4_DASHBOARDS.md).
5. Complete [docs/INSIGHTS_TEMPLATE.md](docs/INSIGHTS_TEMPLATE.md) after collecting data.

## Local preview

```bash
cd ~/Downloads/commerce-lab
python3 -m http.server 8000
```

Open http://localhost:8000/ in Chrome. If Python 3 is missing, follow the setup guide. Normal localhost traffic is not sent to GA4. To deliberately validate GA4 locally, use http://localhost:8000/index.html?debug=1 and accept analytics.

## Architecture

| Component | Purpose |
|---|---|
| HTML/CSS/JavaScript | Responsive catalogue, product dialogs, bag and checkout |
| `config.js` | Public GA4 Measurement ID and INR currency |
| `assets/analytics.js` | Consent, Google tag loading and event wrapper |
| `assets/app.js` | Product data, cart math, checkout and event triggers |
| `inspector.html` | Local diagnostics and CSV/JSON export; not a cross-user dashboard |
| GA4 web property | Collect consented visitor events and build cloud reports |
| GitHub Pages | Public static hosting from repository root |
| `docs/analyze_metrics.py` | Descriptive calculations from manually supplied GA4 exports |

Cart and diagnostic data live in this browser's localStorage. No login, payment gateway, inventory backend, fulfillment, GA4 API secrets, or machine learning. A classifier on a handful of demo visits would add little defensible analytical value.

The shop is a portfolio demo, not a commercial transaction service. Do not collect payment or sensitive information through it. GA4 tracking coverage depends on visitor consent and blockers.

## Optional automated QA

The store itself needs no Node packages. For tests only, install Node.js LTS, then:

```bash
npm install
npx playwright install chromium
# Keep the Python preview running in another Terminal tab.
npm test
```

Tests stub the Google tag. They validate browser behavior and event payloads; they do not prove Google received them.

## License

MIT. Product names/descriptions are original demo content. Product graphics use system emoji; their appearance depends on the device. Google Fonts load remotely with a system-font fallback. GA4 and fonts need internet access; the store remains usable if they are blocked.
