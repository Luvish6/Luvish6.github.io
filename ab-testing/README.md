# A/B Testing Analysis Toolkit

Plan a two-arm conversion experiment and analyze visitor and conversion counts. The planner reports equal per-arm and total sample sizes. The readout reports conversion rates, absolute and relative lift, a two-sided p-value, and a confidence interval. Inputs stay in the browser.

## Setup

From the portfolio repository root, run `python -m http.server 5517` and open `http://localhost:5517/ab-testing/`. Run `node --test ab-testing/stats.test.mjs` with Node.js 20+.

## Stack and methods

HTML, CSS, and JavaScript modules with no runtime dependencies. Planning uses a normal approximation for two independent proportions. Analysis uses a pooled z-test and an unpooled Wald interval for the difference. The readout suppresses inference if any arm has fewer than 10 observed or expected successes or failures. Use independent randomized visitors, one binary outcome per visitor, and a fixed endpoint.

Sample sizes are approximate and rounded up. Low expected counts trigger a planning warning. The significance decision uses the unrounded p-value. Near the threshold, the Wald interval and pooled test can disagree about zero because they use different standard errors.

References for the [sample-size approximation](https://support.minitab.com/en-us/minitab/help-and-how-to/statistics/power-and-sample-size/how-to/hypothesis-tests/power-and-sample-size-for-2-proportions/methods-and-formulas/methods-and-formulas/), [pooled test](https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/binotest.htm), and [Wald interval](https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/diffprop.htm).

## Deployment

Push the portfolio to its GitHub Pages publishing branch. The demo is served at `/ab-testing/` with no build step or secrets.
