import test from "node:test";
import assert from "node:assert/strict";
import { analyze, plan } from "./stats.mjs";

const control = { visitors: 4000, conversions: 400 };
const variant = { visitors: 4000, conversions: 480 };

// Reference values calculated independently with Python NormalDist.inv_cdf,
// math.erfc and Fraction using the formulas linked in the README.
test("reference sample size and planning sensitivity", () => {
  const count = plan(.1, .02, .05, .8);
  assert.equal(count, 3841);
  assert.ok(plan(.1, .01, .05, .8) > count);
  assert.ok(plan(.1, .02, .05, .9) > count);
  assert.equal(plan(.01, .01, .01, .9), 4395);
  assert.equal(plan(.65, .15, .20, .60), 42);
  assert.equal(plan(.001, .049, .05, .8), 162);
});

test("reference experiment estimates", () => {
  const result = analyze(control, variant, .05);
  assert.ok(Math.abs(result.relative - .2) < 1e-12);
  assert.ok(Math.abs(result.inference.p - .0042551269) < 2e-7);
  assert.ok(Math.abs(result.inference.lower - .006294259001) < 1e-7);
  assert.ok(Math.abs(result.inference.upper - .033705740999) < 1e-7);
  assert.equal(result.inference.significant, true);
});

test("unequal groups at 99% confidence match the reference", () => {
  const result = analyze({ visitors: 320, conversions: 45 }, { visitors: 710, conversions: 132 }, .01);
  assert.ok(Math.abs(result.inference.p - .074574720944) < 2e-7);
  assert.ok(Math.abs(result.inference.lower - (-.017319929955)) < 1e-7);
  assert.ok(Math.abs(result.inference.upper - .107900915871) < 1e-7);
  assert.equal(result.inference.significant, false);
});

test("equal rates and swapped arms", () => {
  assert.equal(analyze(control, control, .05).inference.p, 1);
  const reversed = analyze(variant, control, .05);
  assert.ok(reversed.difference < 0);
  assert.equal(reversed.inference.significant, true);
});

test("sparse and zero-baseline cases return descriptive results", () => {
  const result = analyze({ visitors: 20, conversions: 0 }, variant, .05);
  assert.equal(result.relative, null);
  assert.equal(result.inference, null);
  assert.equal(analyze({ visitors: 100, conversions: 10 }, { visitors: 1000, conversions: 20 }, .05).inference, null);
  assert.equal(analyze({ visitors: 100, conversions: 91 }, { visitors: 100, conversions: 50 }, .05).inference, null);
});

test("exactly ten observed and expected failures permit inference", () => {
  const arm = { visitors: 100, conversions: 90 };
  const { inference } = analyze(arm, arm, .05);
  assert.equal(inference.p, 1);
  assert.ok(Math.abs(inference.upper - .083154229461) < 1e-7);
  const roundingCase = { visitors: 77, conversions: 67 };
  assert.equal(analyze(roundingCase, roundingCase, .05).inference.p, 1);
});

test("large effects keep the p-value in range and preserve direction", () => {
  const result = analyze({ visitors: 10000, conversions: 2000 }, { visitors: 10000, conversions: 8000 }, .001);
  assert.ok(result.inference.p >= 0 && result.inference.p < 1e-100);
  assert.ok(result.inference.lower > 0);
  assert.equal(result.inference.significant, true);
});

test("invalid inputs fail with actionable errors", () => {
  assert.throws(() => plan(.1, 1, .05, .8), /target/);
  assert.throws(() => plan(.1, .02, .05, NaN), /Power/);
  assert.throws(() => analyze(control, { visitors: 2, conversions: 3 }, .05), /conversions/);
  assert.throws(() => analyze(control, { visitors: 4, conversions: 1.5 }, .05), /whole/);
  assert.throws(() => analyze(control, variant, NaN), /Significance/);
  assert.throws(() => plan(.1, 1e-10, .05, .8), /too many/);
  assert.throws(() => analyze(control, { visitors: Number.MAX_SAFE_INTEGER, conversions: 10 }, .05), /combined/);
});
