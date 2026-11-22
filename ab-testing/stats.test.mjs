import test from "node:test";
import assert from "node:assert/strict";
import { analyze, designPower, minimumDetectableEffect, plan, practicalEffect, sampleRatio } from "./stats.mjs";

const control = { visitors: 4000, conversions: 400 };
const variant = { visitors: 4000, conversions: 480 };

// Numerical fixtures match the independent SciPy calculations in reference.py.
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
  assert.ok(Math.abs(result.interval.lower - .006287901969) < 1e-8);
  assert.ok(Math.abs(result.interval.upper - .033727105361) < 1e-8);
  assert.ok(Math.abs(result.rates[0].lower - .091083391243) < 1e-8);
  assert.equal(result.inference.significant, true);
});

test("unequal groups at 99% confidence match the reference", () => {
  const result = analyze({ visitors: 320, conversions: 45 }, { visitors: 710, conversions: 132 }, .01);
  assert.ok(Math.abs(result.inference.p - .074574720944) < 2e-7);
  assert.ok(Math.abs(result.interval.lower - (-.021734682406)) < 1e-8);
  assert.ok(Math.abs(result.interval.upper - .104169615742) < 1e-8);
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
  const zero = analyze({ visitors: 20, conversions: 0 }, { visitors: 20, conversions: 0 }, .05);
  assert.equal(zero.inference, null);
  assert.ok(Math.abs(zero.interval.upper - .161125158053) < 1e-8);
});

test("exactly ten observed and expected failures permit inference", () => {
  const arm = { visitors: 100, conversions: 90 };
  const { inference, interval } = analyze(arm, arm, .05);
  assert.equal(inference.p, 1);
  assert.ok(Math.abs(interval.upper - .086802544775) < 1e-8);
  const roundingCase = { visitors: 77, conversions: 67 };
  assert.equal(analyze(roundingCase, roundingCase, .05).inference.p, 1);
});

test("large effects keep the p-value in range and preserve direction", () => {
  const result = analyze({ visitors: 10000, conversions: 2000 }, { visitors: 10000, conversions: 8000 }, .001);
  assert.ok(result.inference.p >= 0 && result.inference.p < 1e-100);
  assert.ok(result.interval.lower > 0);
  assert.equal(result.inference.significant, true);
});

test("two-sided design power and MDE agree with independent SciPy calculations", () => {
  assert.ok(Math.abs(designPower(.1, .02, 3841, .05) - .800016528616) < 1e-7);
  assert.ok(Math.abs(designPower(.1, 0, 3841, .05) - .05) < 1e-7);
  assert.ok(Math.abs(minimumDetectableEffect(.1, 2000, .05, .8) - .028156208598) < 1e-8);
  assert.equal(minimumDetectableEffect(.98, 10, .05, .8), null);
});

test("SRM matches chi-square reference and withholds sparse assignment checks", () => {
  const srm = sampleRatio(600, 400, .5);
  assert.ok(Math.abs(srm.p / 2.53962858947e-10 - 1) < 2e-7);
  assert.equal(srm.flagged, true);
  assert.deepEqual(sampleRatio(700, 300, .7), { p: 1, flagged: false });
  assert.equal(sampleRatio(3, 2, .5), null);
  assert.throws(() => sampleRatio(50, 50, 1), /SRM/);
});

test("Hillstrom counts match independent real-data z-test and lift interval", () => {
  const result = analyze({ visitors: 21306, conversions: 122 }, { visitors: 21307, conversions: 267 }, .05);
  assert.ok(Math.abs(result.inference.p / 1.523223500596e-13 - 1) < 2e-7);
  assert.ok(Math.abs(result.interval.lower - .005014344671) < 1e-8);
  assert.ok(Math.abs(result.interval.upper - .008640723397) < 1e-8);
  assert.match(practicalEffect(result.interval, .005), /supports a gain/);
  assert.match(practicalEffect(result.interval, .007), /uncertain/);
  assert.match(practicalEffect(result.interval, .01), /practically small/);
  assert.match(practicalEffect({ lower: -.02, upper: -.015 }, .01), /supports a loss/);
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
