# A/B Testing Analysis Toolkit

Plan a two-arm conversion experiment and analyze visitor and conversion counts. The planner reports equal per-arm and total sample sizes. The readout reports conversion rates, absolute and relative lift, a two-sided p-value, and a confidence interval. Inputs stay in the browser.

## Setup

From the portfolio repository root, run `python -m http.server 5517` and open `http://localhost:5517/ab-testing/`. Run `node --test ab-testing/stats.test.mjs` with Node.js 20+.

## Stack and methods

HTML, CSS, and JavaScript modules with no runtime dependencies. Planning uses a normal approximation for two independent proportions. Analysis uses a pooled z-test and an unpooled Wald interval for the difference. The readout suppresses inference if any arm has fewer than 10 observed or expected successes or failures. Use independent randomized visitors, one binary outcome per visitor, and a fixed endpoint.

## Deployment

Push the portfolio to its GitHub Pages publishing branch. The demo is served at `/ab-testing/` with no build step or secrets.
