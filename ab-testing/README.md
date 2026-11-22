# A/B Testing Analysis Toolkit

Plan and analyze two-arm conversion experiments from row-level CSVs or aggregate counts. Explore conversion rates and confidence intervals, absolute and relative lift, sample-size and power curves, and the minimum detectable effect (MDE) for a traffic budget. Check assignment balance and compare the lift interval with a practical threshold. Files stay in the browser.

## Setup

From the portfolio repository root, run `python -m http.server 5517` and open `http://localhost:5517/ab-testing/` in a current browser. Run `node --test ab-testing/stats.test.mjs ab-testing/csv.test.mjs` with Node.js 22+. See [RESULTS.md](RESULTS.md) for the real public dataset, benchmark and reference commands.

## CSV format

Use a UTF-8, comma-delimited file with a header and one row per independent assigned visitor. The default columns are `group` and `converted`, with arm labels `control` and `treatment`. Map other headers and labels in the form. Blank, NA, N/A, NULL and NaN values are reported as missing. Missing outcomes are excluded from rate denominators but retained for SRM. Missing group labels cannot be allocated to an arm. Unknown groups fail validation unless explicitly excluded. Outcomes in the chosen arms must be 0, 1, or missing. The app does not verify visitor uniqueness. Check that outcome missingness and group exclusions do not bias the comparison.

## Stack and methods

HTML, CSS, and JavaScript modules with no runtime dependencies. Use independent randomized visitors, a single binary outcome, fixed endpoint, and one comparison at a time. Repeated looks, clustered visitors and multiple comparisons require other methods.

- **Planning.** Equal allocation, positive absolute effect, two-sided normal approximation. The initial sample size rounds up a closed-form estimate using the dominant rejection tail. The plotted power and MDE use both rejection tails, so the curve may cross target power slightly earlier. MDE is the smallest positive effect reaching target power in this approximation. Sparse projected counts can make the approximation unreliable. [Sample-size approximation](https://support.minitab.com/en-us/minitab/help-and-how-to/statistics/power-and-sample-size/how-to/hypothesis-tests/power-and-sample-size-for-2-proportions/methods-and-formulas/methods-and-formulas/) · [Two-sided power](https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.power_proportions_2indep.html)
- **Lift and uncertainty.** Two-sided pooled z-test, Wilson intervals for individual rates, and a Newcombe interval for treatment minus control. The z-test is withheld when any observed or null-expected outcome cell is below 10. The score-based intervals remain available and approximate in sparse settings. The pooled p-value and Newcombe interval can disagree near the significance cutoff. [Pooled test](https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/binotest.htm) · [Newcombe interval](https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.confint_proportions_2indep.html)
- **Diagnostics.** Pearson SRM test on assignments with one degree of freedom, flagged at p < 0.01 and withheld if either expected assignment count is below five. Manual visitor counts double as assignment counts. An SRM flag calls for investigation, while a pass cannot rule out data quality issues. Practical significance compares the lift interval with a user-specified meaningful effect in percentage points. Choose the threshold before seeing results. The practical assessment is an interval interpretation.

## Deployment

Push the portfolio to its GitHub Pages publishing branch. The demo is served at `/ab-testing/` with no build step or secrets.
