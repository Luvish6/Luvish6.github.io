# Reproducible experiment and benchmark results

## Real public experiment · Hillstrom email challenge

Kevin Hillstrom's 2008 MineThatData challenge describes a randomized three-arm email experiment with 64,000 customers and outcomes measured over two weeks. This exploratory replay compares **Mens E-Mail** with **No E-Mail**, using the purchase `conversion` indicator. It excludes 21,387 Womens E-Mail rows. There were zero missing group or outcome values in the chosen arms. The raw CSV is fetched separately and is not stored in this repository. [Original challenge](https://blog.minethatdata.com/2008/03/minethatdata-e-mail-analytics-and-data.html) · [TensorFlow Datasets catalog](https://www.tensorflow.org/datasets/catalog/hillstrom) · [CSV mirror](https://raw.githubusercontent.com/W-Tran/uplift-modelling/master/data/hillstrom/Kevin_Hillstrom_MineThatData_E-MailAnalytics_DataMiningChallenge_2008.03.20.csv)

| Arm | Customers | Conversions | Conversion rate |
| --- | ---: | ---: | ---: |
| No E-Mail | 21,306 | 122 | 0.5726% |
| Mens E-Mail | 21,307 | 267 | 1.2531% |

- **42,613 customers** across the two selected arms. Observed lift **+0.6805 percentage points** (**+118.84%** relative), **95% Newcombe CI [0.5014, 0.8641] pp**. Two-sided pooled z-test **p = 1.5232 × 10⁻¹³**.
- Equal allocation SRM **p = 0.99613**, above the 0.01 flag threshold. This check is conditional on membership in the two selected arms.
- The lift interval sits above a 0.5 pp practical threshold. That threshold is illustrative and was not prespecified by the original study. The result describes this contrast and does not establish profitability or generalize to other campaigns.

## Synthetic CSV performance · 15 timed runs

Windows x64, AMD Ryzen 7 7840HS, Node.js v22.15.0. A seeded generator produces two-column CSVs with balanced assignment and nominal conversion probabilities of 10% and 12%. Each size uses five fresh Node processes. Timing begins after opening the file and includes streamed file reads, decoding, validation, aggregation, lift inference and SRM. It excludes fixture generation, process startup and browser rendering. Memory is the process-wide peak RSS, including Node overhead. These single-machine measurements are not browser timings or speedup claims.

| Synthetic rows | File bytes | Median elapsed (range), ms | Median peak RSS (range), MiB |
| ---: | ---: | ---: | ---: |
| 10,000 | 110,016 | 31.5 (28.7–37.5) | 40.94 (40.69–41.27) |
| 100,000 | 1,100,016 | 70.2 (68.3–84.8) | 42.41 (42.36–42.59) |
| 1,000,000 | 11,000,016 | 494.2 (459.3–518.0) | 54.57 (54.50–54.68) |

## Correctness and reproduction

All **15 tests** passed. Independent SciPy 1.15.2 calculations use normal survival functions, Wilson intervals, a chi-square survival function and Brent root finding. In a reference design with a 10% baseline, two-sided α = 0.05 and 80% target power, a +2 pp effect requires **3,841 per arm** by the closed-form planner (estimated power **80.0017%**). With **2,000 per arm**, the numerically solved MDE is **2.8156 pp**. These are design calculations, not observed effects.

From the portfolio repository root, run the commands below. For the browser demo, choose **Use Hillstrom mapping**, upload the file and use a 50% planned control share.

```sh
node --test ab-testing/stats.test.mjs ab-testing/csv.test.mjs
node ab-testing/benchmark.mjs
curl -fL "https://raw.githubusercontent.com/W-Tran/uplift-modelling/master/data/hillstrom/Kevin_Hillstrom_MineThatData_E-MailAnalytics_DataMiningChallenge_2008.03.20.csv" -o hillstrom.csv
node ab-testing/benchmark.mjs --hillstrom hillstrom.csv
python ab-testing/reference.py hillstrom.csv
```

Use `curl.exe` if PowerShell resolves `curl` to an alias. Expected SHA-256 for the mirrored CSV is `27bab8c5d3669f26ec08ebb50a0a78317542f29501156f2e2af6781fab4cd7e2`. The Python reference script requires SciPy. Only stage source and documentation if reproducing the analysis in this checkout.
