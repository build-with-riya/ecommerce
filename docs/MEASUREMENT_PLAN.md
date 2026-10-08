# Measurement plan

Goal: identify purchase-journey friction, product opportunities and acquisition quality in a demo store.

| Event | Exact trigger | Important parameters |
|---|---|---|
| `page_view` | Store load after prior consent; or first consent acceptance | page_title, sanitized page_location, sanitized page_referrer |
| `view_item_list` | Initial catalogue; filters/search settle; first consent acceptance | item_list_id, item_list_name, items with index |
| `select_item` | Open a product from the catalogue | item_list_id, item_list_name, items |
| `view_item` | Product detail dialog opens | currency, value, items |
| `add_to_cart` | Add button or quantity increase | currency, value, items: quantity added, not whole cart |
| `remove_from_cart` | Decrease quantity or remove line | currency, value, items: quantity removed |
| `view_cart` | Open bag | currency, value, all current cart items |
| `begin_checkout` | Continue from a nonempty bag | currency, value, cart items |
| `add_shipping_info` | Confirm delivery by submitting demo checkout | currency, value, items, shipping_tier |
| `add_payment_info` | Confirm demo method by submitting checkout | currency, value, items, payment_type |
| `purchase` | Successful demo checkout submission | transaction_id, currency, value, shipping, tax, items |
| `search` | Nonempty search settles for 600ms | search_term (catalogue words or `other`), result_count |
| `catalog_filter` | Category or sort change | filter_type, filter_value |

Every event has `demo_mode: portfolio`. `?debug=1` adds `debug_mode: true`. No `user_id` or personal checkout data is collected.

All items carry item_id, item_name, item_brand, item_category, item_list_id/name, price and quantity. Prices are INR numbers. Purchase `value` is the sum of price × quantity, excluding delivery and tax; delivery is `shipping`; demo tax is 0. Displayed order total = value + shipping. These demo prices are not a tax calculation for a real store.

Example order: backpack ₹1,499 + notebook ₹299 = `value:1798`; Express delivery = `shipping:149`; displayed total = ₹1,947. UUID transaction IDs begin `DEMO-`. Purchase is triggered by submission, never page load, so refreshing the confirmation cannot repeat a purchase. A later deliberate new order gets a new ID. A real store would need server-confirmed orders and server-side idempotency.

The catalogue has direct Add buttons, so some buyers never emit `view_item`. A closed product-detail funnel intentionally excludes those users. Compare a second `view_item_list → add_to_cart → begin_checkout → purchase` funnel to capture catalogue-direct shoppers; disclose the denominator difference.

Delivery/payment events occur immediately before purchase on final submission. They validate instrumentation but are not separately navigated screens, so do not claim meaningful abandonment between those two events. Use `begin_checkout → purchase` to measure checkout completion.

Consent model: no Google script or sending before acceptance; actions before acceptance are not replayed. First acceptance sends a fresh page view and catalogue view. Declining/revoking disables sending, clears the local log and reloads. Previously transmitted data and existing Google cookies are not automatically erased. Debug logs can remain local while analytics is declined because the visitor explicitly selected debug mode. Localhost sends nothing without debug mode. Inspector page never installs the Google tag.

Page_view is explicit (`send_page_view:false`). Disable history-based automatic page views, automatic search and form collection in Enhanced Measurement to avoid duplicates and unintended typed-text collection. Fragment links and dialogs do not send virtual page_view. Events measure those interactions instead. Unknown URL query fields and arbitrary search strings are not forwarded by this project's explicit events. Do not put PII in URLs, UTM labels or product names.

Metric scopes:
- Event count = trigger occurrences; repeat actions count repeatedly.
- Items viewed/added/purchased = item quantities at the relevant events, not unique people.
- Funnel counts = users meeting the ordered steps, not event totals or necessarily same-session conversions.
- Transactions/purchases = orders; purchase users = people. One user can order more than once.
- Session source/medium = acquisition of the session; first-user source is a different question.
- Device breakdown users may overlap across devices/time periods. Do not sum them blindly.

QA checklist: correct ID, consent accepted, one tag, unique transaction IDs, value excludes delivery, item IDs consistent through journey, debug enabled only for QA, no purchase on refresh, no tag requests after decline, manual Google receipt check, correct dates/timezone. Export screenshots and your measurement plan as evidence.
