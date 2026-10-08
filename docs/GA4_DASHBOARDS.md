# Build dashboards and insights inside Google Analytics

Prerequisites: GA4 Web stream configured, ID in `config.js`, accepted visits confirmed in DebugView, Editor/Administrator access, custom definitions registered, processed data available. These instructions create reports in **your GA4 property**; the ZIP cannot pre-create cloud reports without access to your account.

Use an identical date range throughout. Keep debug traffic excluded from study data if you enabled an active developer filter. Every revenue label in your portfolio screenshots must say **simulated demo revenue**. Your dashboard may initially be empty; that's expected for a new property.

## 1. Create three saved detail reports

Open Reports → Library (bottom of Reports navigation). If Library is absent, verify the selected property and Editor permissions. Click Create new report → Create detail report. Choose the relevant template below. Alternatively open its built-in report → Customize report (pencil) → Save → Save as a new report. Built-ins may sit under Life cycle or business-objective collections; Library templates avoid that variation.

### A. Acquisition quality

Template: **Traffic acquisition**. Save name: `Desk & Day — Acquisition`.

1. In Customize report → Dimensions, keep **Session source / medium**, **Session default channel group**, **Session campaign**. Set Session source / medium as the default.
2. Metrics: Sessions, Engaged sessions, Engagement rate, Ecommerce purchases, Purchase revenue. Where available add Session key event rate and select purchase as the key event in the report selector. If that selector is unavailable, use the purchase metrics and your separately calculated rates instead.
3. Preserve useful bar/line charts.
4. Under Summary cards → Create new card: dimension Session source / medium; metrics Sessions and Purchase revenue; visualization Bar chart. Apply and save.

Question: which campaign attracts visits that lead to simulated orders? Explain that Purchase revenue is event attribution; session acquisition asks a session-scope question. Do not divide attributed revenue by acquisition users and call it LTV. No ad spend exists here, so ROAS and CAC cannot be measured.

### B. Product performance

Template: **Ecommerce purchases**. Save name: `Desk & Day — Products`.

1. Dimensions: Item name (default), Item ID, Item category.
2. Metrics: Items viewed, Items added to cart, Items purchased, Item revenue.
3. Summary card: Item name and Item revenue, Bar chart. Apply and save.

Question: which products attract attention but fewer cart actions? Counts are item quantities, not unique-user funnel counts. Direct catalogue Add buttons can create adds without a product detail view. Product ratio `items added / items viewed` is an action ratio, not a probability, and may exceed 100%. Item revenue excludes shipping/tax. Do not infer profit without cost data.

### C. Device experience

Template: **Tech details**. Save name: `Desk & Day — Devices`.

1. Dimensions: Device category (default), Browser, Operating system.
2. Metrics: Active users, Sessions, Engagement rate, Ecommerce purchases, Purchase revenue. Add available compatible metrics only; GA4 disables incompatible scope combinations.
3. Summary card: Device category and Sessions, Bar chart. Apply and save.

Question: is one device group worth investigating? Pair this report with the ordered device funnel in step 4, rather than calling purchases/sessions a user conversion rate. Device and campaign groups can contain different participant intent.

## 2. Publish a report collection and overview dashboard

This is the native GA4 dashboard-style surface: an overview report made from summary cards.

1. Reports → Library → Create new collection → Blank. Name: `Desk & Day Analytics`.
2. Create a topic named `Store performance`.
3. Drag the three saved detail reports from the right panel into that topic. Save the collection. Use its three-dot menu → Publish.
4. Return to Library → Create new report → **Create overview report**.
5. Click Add cards. Add the three custom cards saved above. A saved detail report must belong to a report collection for its custom cards to appear in the Summary Cards tab. If missing, check the report was saved, collection includes it, and reload.
6. Add any useful built-in compatible cards for users over time and key events/revenue. Do not add cards you cannot explain.
7. Arrange Acquisition → Products → Devices. Save name: `Desk & Day — Executive Overview`.
8. Edit the collection again. Drag this overview into the **overview report** slot under Store performance; save. Ensure collection remains published.
9. Open your new collection in Reports navigation. Set the study date range. Capture a screenshot once it contains real data.

The collection's Publish button publishes report navigation to people with property access; it does not publish a public web dashboard or grant GA4 access to GitHub visitors. Put aggregated screenshots in your portfolio, or explicitly grant GA4 viewer access if needed. Never expose credentials.

## 3. Create the purchase funnel

Explore → Funnel exploration. Rename: `Desk & Day — Product Detail Funnel`.

1. Variables → Date range: the study dates.
2. Variables → Dimensions (+): import Device category. Optionally import Event name for other analysis tabs.
3. Tab settings → Technique: Funnel exploration; visualization: Standard funnel.
4. Keep **Make open funnel OFF** (a closed funnel: users must start at the first step).
5. Steps → pencil/Edit. Create these step names and conditions:

| Step | Include condition |
|---|---|
| Product detail | Event name exactly matches `view_item` |
| Added to bag | Event name exactly matches `add_to_cart` |
| Checkout started | Event name exactly matches `begin_checkout` |
| Demo order | Event name exactly matches `purchase` |

6. For transitions choose **indirectly followed by** so intervening actions are allowed. Do not choose directly followed by: cart views, scrolls and other events can occur between steps.
7. Optional timing constraint: set each later transition to **within 30 minutes** and document it. This bounds adjacent steps, not necessarily one session or 30 minutes end to end. Omit it if unavailable and disclose there is no transition limit. Keep settings consistent when comparing dates.
8. Apply. Drag Device category into Breakdown. Do not add user segments that remove part of the study unless clearly labeled.
9. Show elapsed time if helpful. Inspect entrants, completions, abandonment count/rate at each step. Hover/click for exact counts.
10. Save is automatic for explorations. Share read-only within the property if desired; viewers need property access. Export a screenshot/image and CSV using the exploration controls.

Create a second exploration by duplicating this funnel and replacing only the first event with `view_item_list`. Name: `Desk & Day — Catalogue Funnel`. This includes people using direct catalogue Add buttons. The product-detail funnel intentionally covers a different journey.

The summary funnel tracks users completing ordered events over the exploration range; it is not automatically a same-session funnel. Multiple products and repeated visits can contribute to a user journey. Don't interpret it as an item-level path or sum device groups as if all users are mutually exclusive.

## 4. Device diagnostic analysis

Use the Device category breakdown in the product-detail and catalogue funnels. Record counts for all four stages for mobile and desktop.

| Metric | Formula | Interpretation |
|---|---|---|
| Detail → cart rate | Step 2 users / Step 1 users | Detail-funnel transition |
| Cart → checkout rate | Step 3 users / Step 2 users | Continued intent |
| Checkout completion | Step 4 users / Step 3 users | User checkout transition |
| Detail → purchase rate | Step 4 users / Step 1 users | Closed detail-funnel completion |
| Stage abandonment | (Previous users − next users) / previous users | Conditional stage loss |

Use the **largest absolute loss** to identify where many people stop; conditional loss rates show severity. A tiny stage can have 100% loss with little absolute impact. Record numerator/denominator next to every percent. For N=0 use N/A. For small samples, describe observations and usability follow-ups; do not claim significance or causation.

Hypothesis example, **not a finding**: if mobile checkout completion appears lower, inspect button visibility, delivery fee clarity and interaction errors. Ask participants where they got stuck. A device difference alone cannot prove the cause.

## 5. Create a product Free form exploration

Explore → Blank; name `Desk & Day — Product Opportunity`.

1. Variables → Dimensions: Item name, Item category; import.
2. Variables → Metrics: Items viewed, Items added to cart, Items purchased, Item revenue; import.
3. Settings → Rows: Item name. Values: all four metrics. Visualization: Table. Show all six products.
4. Add a second tab or duplicate; use Item category as Rows if category-level analysis is useful.
5. Set the same date range; export.

Explain item scope and direct Add behavior. Use the ordered user funnel for conversion rates. Do not divide item purchases by unrelated active users. No margin, refunds, stockouts or repeat-customer LTV is measured by this store.

## 6. Create a measurement-quality Free form exploration

Explore → Blank; name `Desk & Day — Tracking Quality`.

1. Dimensions: Event name, Demo mode. Metrics: Event count, Total users. Import.
2. Rows: Event name. Values: Event count, Total users.
3. Filter: Demo mode exactly matches `portfolio` if that custom dimension is processed. Google's automatically generated events may lack this parameter and be excluded; that is expected.
4. Check purchase exists, expected checkout events exist, and the date range matches your study.
5. Create a second tab for Event name = `catalog_filter`; Rows Filter type, Columns Filter value; Value Event count. Use it as an interaction table rather than a causal filter-effect report.

Counts do not have to be identical: repeat cart actions, interrupted checkouts, consent loss and blockers occur. In this implementation shipping/payment confirmations fire on order submission, so their counts should be close to purchase under stable consent; investigate large mismatches as a QA signal. Google-generated automatic events are absent from the local inspector.

## 7. Reconcile and fill the analysis CSV

`metrics_summary.csv` expects four **closed detail-funnel user counts**, then orders and item revenue for the **same user cohort and date range**. Do not take all store purchases if some came from direct Add and did not enter the detail funnel.

To align order metrics:

1. In the detail funnel, create a user segment from the users at the final completed step using the contextual segment action where available (select the final-step bar/row → Create segment).
2. If that action is unavailable, Variables → Segments (+) → Custom user segment. Add a sequence requiring event_name `view_item`, indirectly followed by `add_to_cart`, then `begin_checkout`, then `purchase`. Use across-session sequence scope and match timing constraints to your funnel; add a 30-minute step limit only if your funnel has it. Name it `Detail funnel completers`.
3. In a Free form tab apply that segment. Metrics: Ecommerce purchases and Item revenue; inspect totals for the same range. For device rows add Device category as Rows, but keep the user-scope overlap caveat.
4. This reports orders by users in the completer cohort, not necessarily only the exact order that completed each funnel. If the users make multiple orders, report that definition; for precise per-funnel transaction attribution you need an event-level export/query, which this lightweight project does not implement.
5. Copy the counts and totals to the matching CSV rows. Leave unused segments blank. Don't sum Mobile/Desktop to derive All; copy the actual All total.

If you can't align the segment, do not force a combined CSV interpretation. Analyze stage rates from the funnel and separately report **overall store AOV = all item revenue / all purchases** with its own date range and population. The script is optional; GA4 screenshots and a clear evidence-based narrative remain the main deliverable.

## 8. Produce an honest case study

Follow INSIGHTS_TEMPLATE.md. Structure: question → data quality → actual observation → plausible hypothesis → proposed test. Example format: "[X] of [Y] users who started checkout completed a demo order ([rate]%). [Stage] had the largest absolute loss. I recommend [specific usability test]." Fill actual values only.

No statistical uplift, prediction model, customer LTV or revenue improvement has been established. Controlled pilot traffic and a demo checkout are useful for showing measurement design and analysis skills when disclosed accurately.

## Official references

- Overview creation: https://support.google.com/analytics/answer/13823841
- Summary cards: https://support.google.com/analytics/answer/13819308
- Navigation collections: https://support.google.com/analytics/answer/10460557
- Funnel exploration: https://support.google.com/analytics/answer/9327974
- E-commerce explorations: https://support.google.com/analytics/answer/12216232
- Custom definitions: https://support.google.com/analytics/answer/14239696

Menus/metric labels can evolve; use GA4 setting search and compatible metric pickers. Blank values should trigger a configuration/date/filter check, not invented metrics.
