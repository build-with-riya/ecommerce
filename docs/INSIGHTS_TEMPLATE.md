# Evidence-based portfolio case study

Status: fill after collecting consented visits and verifying GA4. Do not publish blank values as findings.

## Business question
Which stage of the purchase journey loses the most users, and which device/product/channel should be investigated first?

## Data and quality
- Observation period: [start–end], timezone Asia/Kolkata.
- Participants / sessions: [actual number]; recruitment: [method].
- Scope: demo store; no real payment or commercial revenue.
- Consent: only accepted visitors measured; declined traffic is missing.
- Exclusions: [debug sessions / your own QA]. State if QA remains included.
- Reconcile purchase transaction IDs and item totals using DebugView during QA.
- Flag repeated participants, blockers, reporting thresholds, small samples, and cohort overlap.

## Findings
| Question | Actual numerator/denominator | Finding | Recommended next step |
|---|---|---|---|
| Largest funnel loss | [users at consecutive stages] | [descriptive result] | [specific usability test] |
| Mobile versus desktop | [buyers / product viewers per device] | [observed difference] | [inspect flow on mobile] |
| Product opportunity | [items viewed / items added / items purchased] | [result; item metrics count quantity] | [test product detail clarity] |
| Acquisition quality | [sessions, purchases, simulated revenue by source/medium] | [result] | [compare audience intent; no paid spend/ROAS] |

## Decision and experiment proposal
Hypothesis: [a specific change] may improve [stage transition] because [observed friction].
Primary metric: [numerator/denominator]. Guardrails: [errors / order value].
Randomization unit: visitor. Predefine sample size and minimum detectable effect; run a real randomized experiment only with adequate traffic. This project does not implement an A/B test or establish causal uplift.

## Resume bullet after completion
Built and instrumented a GitHub Pages e-commerce demo with GA4 recommended events; validated [actual event count] event types and built funnel, acquisition, and product reports to analyze [actual sample size] consented visits and recommend [actual evidence-based action].

## Interview explanation
I owned the measurement plan, not just a dashboard. I defined item and user metric scopes, implemented consent-gated events, validated purchase payloads and transaction IDs, then used GA4 funnels to locate drop-offs. Revenue was simulated, and I reported sample-size and consent limitations. I proposed a specific experiment rather than claiming that a descriptive difference proved an improvement.
