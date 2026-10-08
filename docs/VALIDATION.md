# Validation record

Performed during project creation on October 8, 2026:

- JavaScript syntax checks passed for analytics, application and inspector files.
- Dependency-free DOM harness passed: catalogue rendering, no GA sends before consent/after decline, product selection, cart quantity changes, ordered checkout events, purchase value/delivery math, clearing cart, duplicate-submit guard, and no purchase on application initialization.
- Python metric script handles an empty template without inventing results. A controlled fixture checks rates/AOV and invalid ordered-funnel inputs.
- Static file references and ZIP contents checked.

Limitations:

- Full Playwright/browser rendering was not executed: the browser download was blocked/truncated by this execution environment. Responsive CSS is implemented but visual/browser QA must be run on the user's Mac. `tests/browser.cjs` is included for this purpose; it also checks search redaction, inspector totals and mobile overflow.
- No live GA4 property/ID was available, so Google event receipt and dashboard values were not verified. Local payload tests use a test ID/stub and prove only the code's event generation.
- No production GitHub deployment or cloud report creation was performed; account setup, publishing and validation steps are in SETUP_GUIDE.md.

On your Mac, keep the Python preview running, install Node LTS, then:

```bash
node tests/logic.cjs
npm install
npx playwright install chromium
npm test
```

Manual browser checks: mobile/desktop layout, keyboard focus and dialog Escape behavior, decline then accept, reopen Privacy settings, catalogue direct Add journey, detail-view journey, cart persistence, empty-cart disabled checkout, Standard/Express shipping, multiple deliberate orders with distinct IDs, order refresh without re-emission, and GA4 DebugView/Realtime receipt with your real ID.
