# Complete ordered setup — MacBook Air M2

Estimated effort: 20–40 minutes to preview/publish/connect tracking, 1–2 hours to configure and check reports, then several days to recruit participants and collect observations. Google report processing adds waiting time. All orders and revenue in this project are simulated.

## 1. Extract and identify the project folder

Download the provided ZIP and double-click it in Finder. The extracted folder is `commerce-lab`. If it is inside another extracted folder, open the folder that actually contains `index.html`, `config.js`, `assets` and `docs`.

Place `commerce-lab` in Downloads for the commands below. Do not upload the ZIP as your website; upload its extracted files. Google Analytics requires an internet connection, a Google account and acceptance of its terms. Your existing GitHub account is sufficient for a public Pages project.

## 2. Prepare your Mac

Use Chrome for the examples. Install Visual Studio Code from https://code.visualstudio.com/ if you need a code editor; choose the Apple Silicon build. Open the `commerce-lab` folder in VS Code with File → Open Folder.

Open Terminal (Spotlight → Terminal). Check Python:

```bash
python3 --version
```

If unavailable, install Python 3 from https://www.python.org/downloads/macos/ using the macOS universal2 installer (supports Apple Silicon). Open a new Terminal and retry. Homebrew is not required. The website has no npm dependencies; Node.js is needed only for optional tests.

## 3. Run the store locally before analytics setup

```bash
cd ~/Downloads/commerce-lab
python3 -m http.server 8000
```

Keep Terminal running. Open http://localhost:8000/ in Chrome. Do not double-click `index.html` to use a `file://` URL.

Try category filters, search, product details, add/remove/quantity controls, and checkout. Accept or decline the consent choice. Orders are simulated. No address or card number is requested. Visit http://localhost:8000/index.html?debug=1 to record local diagnostic events even before you have a Measurement ID. Then open Tracking lab to inspect them.

Normal localhost visits deliberately do not send to Google. Debug localhost visits can send once you configure the ID and accept analytics. The placeholder ID causes no Google script to load. Ctrl+C stops the server. If port 8000 is busy, use `python3 -m http.server 8001` and change the URL. Optional test uses port 8000.

## 4. Create a GitHub repository and upload files

The easiest path avoids Terminal authentication:

1. Sign into https://github.com/.
2. Click + → New repository.
3. Name it `commerce-analytics-lab`; choose **Public**. Description: `E-commerce demo with GA4 funnel, acquisition and product analytics`.
4. Create the repository. You may initialize it with a README; the provided README should replace it when uploading.
5. On the repository page use the quick setup **uploading an existing file** link, or **Add file → Upload files**.
6. Drag the **contents** of `commerce-lab` into the upload area. The root must contain `index.html`, `config.js`, `inspector.html`, `README.md`, `assets/` and `docs/`, not an outer `commerce-lab/` directory.
7. Finder may hide `.nojekyll`. To reveal it use Command+Shift+Period, and include it. It bypasses Jekyll processing. `.gitignore` is optional for upload but useful for future Git use.
8. Commit to `main`. Confirm that `assets/app.js` is accessible in your repository and `index.html` is at its root.

Alternative: use GitHub Desktop from https://desktop.github.com/ to add/publish this local project and commit changes later. No command-line token is needed. Never commit passwords, Google API credentials, measurement-protocol API secrets or exported visitor data. The public `G-...` Measurement ID is designed to appear in website code.

## 5. Publish on GitHub Pages

In your repository:

1. Settings → Pages.
2. Build and deployment → Source → **Deploy from a branch**.
3. Branch: `main`; folder: **/(root)**; Save.
4. Wait for deployment. Check the repository's Actions tab if it fails. GitHub will display the live link in Pages settings.
5. Open `https://YOUR_USERNAME.github.io/commerce-analytics-lab/` using your actual username. Verify product/cart/checkout flows there.

Every asset path is relative (`./assets/...`), so project-subdirectory hosting works. No Vite base URL or npm build is required. A 404 usually means wrong repository name, deployment still pending, missing root `index.html`, or nested uploaded folder. Case in filenames matters.

This is public portfolio hosting. Use it as a demo, not a live commercial checkout. The project has no real payment flow.

## 6. Create Google Analytics from scratch

You need a GA4 **account → property → Web data stream**, not a Google Cloud project. No BigQuery, service account, billing setup, GTM or API secret is required for this version.

1. Visit https://analytics.google.com/ and sign in with your Google account.
2. Choose **Start measuring**. If an account already exists, use Admin → Create → Account or Property as appropriate.
3. Account name: `Portfolio Analytics`. Review the optional sharing choices and select what you intend to enable.
4. Property name: `Desk & Day — Demo`. Reporting timezone: India / Asia/Kolkata. Currency: Indian Rupee (INR).
5. Enter the business details honestly; for business objectives select the online-sales objective if offered. Finish creation and accept the applicable terms.
6. Choose **Web** as the data platform.
7. Website URL: your published GitHub Pages URL. Stream name: `Desk & Day website`.
8. Create the stream. Copy its **Measurement ID** beginning `G-`. Do not use the numeric Property ID or numeric Stream ID.
9. You can find the ID again in Admin → Data collection and modification → Data streams → your Web stream → Stream details. Navigation group names can vary by GA4 layout; the setting names remain searchable.

## 7. Configure the stream to match this code

Inside the Web stream, open Enhanced measurement → its gear/settings:

- Page views: expand advanced settings and disable **Page changes based on browser history events**. This store uses hash links/dialogs, and the code explicitly sends page_view with `send_page_view:false`.
- Disable **Site search** and **Form interactions**. This project sends its own search event and collects no form field values.
- Scroll/outbound-click/download measurement may stay on. Those are extra Google-generated events and will not appear in the local wrapper log.

Admin → Data collection and modification → Data retention → Event data retention → **14 months**. This supports longer exploration access; it does not create historical data. If your screen groups settings differently, search Admin for Data retention.

Keep Google Signals/advertising features off unless you intentionally need them. The code denies advertising storage and personalization. Do not add a separate pasted Google tag or GTM container: `assets/analytics.js` already loads the tag after acceptance.

## 8. Insert your Measurement ID and republish

Edit `config.js` in VS Code:

```js
window.STORE_CONFIG = Object.freeze({
  measurementId: 'G-YOURACTUALID',
  currency: 'INR',
  storeName: 'Desk & Day',
});
```

Replace only the quoted placeholder with your real ID. Keep `G-` and the quotes. No secret is required. Save it.

For the browser-upload route, also update GitHub: open `config.js` in the repository → pencil icon → change the ID → Commit changes to `main`. Keep the local copy in sync. For GitHub Desktop, commit the edited local file and Push origin.

Wait for Pages deployment and hard refresh Chrome (Command+Shift+R). Open the published `config.js` URL to confirm it contains the correct ID. Refresh any storefront tabs that were opened before the update.

## 9. Validate actual GA4 collection

1. Open the live URL with `?debug=1`, for example `https://YOUR_USERNAME.github.io/commerce-analytics-lab/index.html?debug=1`.
2. Accept analytics. If you previously declined, use the footer Privacy settings button.
3. Open your GA4 property in another tab. Admin → Data display → DebugView. Check the property name/ID matches the configured stream.
4. Open the backpack product; add it; close details; add a notebook; open bag; continue to checkout; choose Express; place one demo order.
5. Look for `view_item`, `add_to_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase` in DebugView. Select events to inspect parameters/items.
6. For this order, expect purchase `value=1798`, `shipping=149`, `currency=INR`, two item entries, and a `DEMO-...` transaction ID. Order display is ₹1,947. Delivery is separate from item revenue.
7. Refresh: purchase should not re-fire. Open bag: it should be empty.
8. Check Reports → Realtime for your active visit/events. Some UI labels use Realtime overview.
9. Open Tracking lab: compare the locally queued payload. It cannot prove Google delivery.
10. Test decline in a fresh private session. Open Chrome DevTools (Command+Option+I) → Network; filter `gtag` / `collect`. On a fresh declined session, this project should not download gtag.js or send explicit GA events.

If events are missing: verify ID, consent, correct property, disable ad/privacy blockers only for your own QA, check connectivity, and verify `?debug=1`. Normal localhost is muted. A blocked tag produces a toast, but tracking can also fail silently; inspect Network for `google-analytics.com/g/collect` or related Google collection requests. A successful HTTP response alone is not a substitute for checking event parameters in GA4.

Allow processing time before regular reports/explorations; e-commerce reports commonly appear after about 24 hours, and custom dimensions can take 24–48 hours. Dates/timezone and filters can also hide events.

Create developer traffic filter: Admin → Data collection and modification → Data filters → Create filter → Developer traffic → Exclude. Keep **Testing** initially, confirm the classification, then switch to Active before the participant study if you want debug visits excluded. Active exclusions cannot restore filtered data later. DebugView remains useful; report data excludes debug visits when the active filter applies. Do not expect your excluded debug orders to appear in normal dashboards.

## 10. Create custom definitions before the study

Admin → Data display → Custom definitions → Create custom dimensions. Scope **Event** for all:

| Display name | Event parameter |
|---|---|
| Demo mode | `demo_mode` |
| Filter type | `filter_type` |
| Filter value | `filter_value` |
| Search result count | `result_count` |
| Delivery tier | `shipping_tier` |
| Demo payment type | `payment_type` |

Result count is a small categorical dimension here, not a custom numeric metric. You may omit it if you do not need search analysis. Do not create redundant dimensions for predefined Item name, Item ID, Item category, Transaction ID or currency. Do not register high-cardinality transaction IDs as custom dimensions. Custom definitions do not backfill old events into the custom dimension. Wait for processing after new events are collected.

`purchase` is normally treated as a key event by GA4. Verify Admin → Data display → Key events. If absent, create/mark `purchase` as a key event. Keep only purchase as the primary success outcome for this demo; labeling every cart action as success makes conversion interpretation confusing.

## 11. Build dashboards and collect a small real study

Follow [GA4_DASHBOARDS.md](GA4_DASHBOARDS.md) in order: detail reports → overview dashboard → funnel explorations → device/product/acquisition analysis. These are created inside your GA4 property; there is no script here that automatically creates cloud explorations.

Run a short consenting participant study with classmates/friends, ideally using both mobile and desktop. Aim for 20–50 genuine participants as a useful usability pilot, not a statistically representative business sample. Do not manufacture 1,000 visits with a bot or present repeated self-clicks as real customers.

Ask participants to explore the store and behave naturally; allow them to abandon. If everyone is told to buy, the funnel only measures task completion under instruction. Document the exact prompt. Tell participants all payments are simulated and explain the analytics choice. No communication is sent by this project.

Use labeled campaign links when sharing, substituting your live base:

```text
https://YOUR_USERNAME.github.io/commerce-analytics-lab/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio_pilot
https://YOUR_USERNAME.github.io/commerce-analytics-lab/?utm_source=campus&utm_medium=referral&utm_campaign=portfolio_pilot
```

Use fresh sessions for attribution QA: changing UTM labels during an existing session can complicate interpretation. Do not insert names, emails or phone numbers in UTM values. For study visits omit `debug=1`. Obtain the participant's consent; Google Analytics cannot report non-consenting visits from this implementation. Let data accumulate over 7–14 days if feasible. Small samples support hypotheses, not broad performance claims.

## 12. Export, calculate insights and prepare resume evidence

1. Use a consistent date range in every report. Export GA4 report CSVs and funnel screenshots using the export/share controls. Funnel exploration supports CSV/image export depending on the current UI.
2. Keep exported participant data/screenshots private when appropriate; put aggregated, non-identifying evidence in your GitHub `docs/`.
3. Fill `docs/metrics_summary.csv`: closed product-view-funnel user counts for All/Mobile/Desktop; orders and item revenue restricted to users completing that same funnel (see dashboard guide). Use plain numbers, no ₹ symbol or thousands separators. If you cannot align cohorts, skip AOV or report it separately; don't combine mismatched populations.
4. Run:

```bash
cd ~/Downloads/commerce-lab
python3 docs/analyze_metrics.py docs/metrics_summary.csv
```

5. Read generated `docs/insights.md`. It computes descriptive stage conversion/drop-off and demo average order value, not causal effects. The empty starter CSV outputs "No results". There are no invented findings.
6. Complete `docs/INSIGHTS_TEMPLATE.md` with actual observations, limitations and a proposed next test.
7. Add your live website link, event dictionary, 3–5 GA4 screenshots, methodology and case study to your README. Commit changes. Replace screenshots if underlying results change.

Resume bullet you can use after configuration: **Built a GitHub Pages e-commerce demo with consent-gated GA4 tracking across product, cart and checkout journeys; validated event payloads and created acquisition, product and funnel reports.** Add participant counts, findings and recommendations only after collecting the evidence.

Suggested interview sequence: business question → measurement design → tracking QA → dashboard → observed loss → recommendation → proposed experiment → limitations. A real analyst should explain why user funnels, item counts and order totals use different denominators.

## Maintenance

- Modify products/prices in `assets/app.js`; keep stable item IDs across versions.
- Edit the brand in HTML and product item_brand consistently if renaming.
- Price and cart changes alter metrics; document deployment dates and measurement changes.
- Clear local cart/log through browser site storage if needed. That does not delete GA4 cloud history.
- If replacing a GA4 property, update config, custom definitions and dashboards for the new property.
- This project has no backend and no API fetch for aggregate GA4 reports. Do not add GA API secrets to make a public-browser dashboard; an authenticated server or controlled export workflow is needed.

## Primary documentation (checked October 2026)

- GA4 setup: https://support.google.com/analytics/answer/9304153
- Measurement ID: https://support.google.com/analytics/answer/9539598
- E-commerce events and value semantics: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtag
- Purchase reporting: https://developers.google.com/analytics/devguides/collection/ga4/set-up-ecommerce
- DebugView: https://support.google.com/analytics/answer/7201382
- Developer traffic: https://support.google.com/analytics/answer/13296662
- Custom definitions: https://support.google.com/analytics/answer/14239696
- Data retention: https://support.google.com/analytics/answer/7667196
- GitHub Pages source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

GA4 menus differ with business objective and interface updates. Use the named setting or Admin search if the exact left-navigation grouping differs.
