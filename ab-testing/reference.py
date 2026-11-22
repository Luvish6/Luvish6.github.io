"""Independent numerical fixtures; requires Python and SciPy."""
import csv
import json
import math
import sys
from collections import Counter

from scipy.optimize import brentq
from scipy.stats import binomtest, chi2, norm


def readout(control, treatment, alpha=.05):
    ca, na = control
    cb, nb = treatment
    a, b = ca / na, cb / nb
    diff = b - a
    pooled = (ca + cb) / (na + nb)
    se = math.sqrt(pooled * (1 - pooled) * (1 / na + 1 / nb))
    a_ci = binomtest(ca, na).proportion_ci(1 - alpha, method="wilson")
    b_ci = binomtest(cb, nb).proportion_ci(1 - alpha, method="wilson")
    lower = diff - math.hypot(b - b_ci.low, a_ci.high - a)
    upper = diff + math.hypot(b_ci.high - b, a - a_ci.low)
    return {
        "rates": [a, b], "difference": diff, "relative": diff / a if a else None,
        "p": 2 * norm.sf(abs(diff) / se) if se else None,
        "interval": [lower, upper], "wilson": [list(a_ci), list(b_ci)],
    }


def design(base, lift, alpha, target_power, per_arm):
    target = base + lift
    average = (base + target) / 2
    null_sd = math.sqrt(2 * average * (1 - average))
    alt_sd = math.sqrt(base * (1 - base) + target * (1 - target))
    cutoff = norm.isf(alpha / 2) * null_sd
    shift = math.sqrt(per_arm) * lift
    return (math.ceil(((cutoff + norm.ppf(target_power) * alt_sd) / lift) ** 2),
            norm.sf((cutoff - shift) / alt_sd) + norm.cdf((-cutoff - shift) / alt_sd))


if __name__ == "__main__":
    cases = {
        "default": readout((400, 4000), (480, 4000)),
        "unequal": readout((45, 320), (132, 710), .01),
        "cutoff": readout((90, 100), (90, 100)),
        "all_zero": readout((0, 20), (0, 20)),
        "srm": chi2.sf((600 - 500) ** 2 / 500 + (400 - 500) ** 2 / 500, df=1),
        "design": design(.1, .02, .05, .8, 3841),
        "mde": brentq(lambda lift: design(.1, lift, .05, .8, 2000)[1] - .8, .0001, .5),
    }
    if len(sys.argv) > 1:
        assignments, conversions = Counter(), Counter()
        with open(sys.argv[1], encoding="utf-8-sig", newline="") as file:
            for row in csv.DictReader(file):
                assignments[row["segment"]] += 1
                conversions[row["segment"]] += int(row["conversion"])
        ca, cb = "No E-Mail", "Mens E-Mail"
        expected = (assignments[ca] + assignments[cb]) / 2
        cases["hillstrom"] = {
            "assignments": assignments, "conversions": conversions,
            "srm": chi2.sf(sum((assignments[arm] - expected) ** 2 / expected for arm in (ca, cb)), 1),
            **readout((conversions[ca], assignments[ca]), (conversions[cb], assignments[cb])),
        }
    print(json.dumps(cases, indent=2))
