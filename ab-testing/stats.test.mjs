import test from "node:test";
import assert from "node:assert/strict";
import { analyze, plan } from "./stats.mjs";

const control = { visitors: 4000, conversions: 400 };
const variant = { visitors: 4000, conversions: 480 };

test("reference sample size and planning sensitivity", () => {
  const count = plan(.1, .02, .05, .8);
  assert.equal(count, 3841);
  assert.ok(plan(.1, .01, .05, .8) > count);
  assert.ok(plan(.1, .02, .05, .9) > count);
});

test("reference experiment estimates", () => {
  const result = analyze(control, variant, .05);
  assert.ok(Math.abs(result.relative - .2) < 1e-12);
  assert.ok(Math.abs(result.inference.p - .0042551269) < 2e-7);
  assert.ok(Math.abs(result.inference.lower - .00629) < .00002);
  assert.ok(Math.abs(result.inference.upper - .03371) < .00002);
  assert.equal(result.inference.significant, true);
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
});

test("invalid inputs fail with actionable errors", () => {
  assert.throws(() => plan(.1, 1, .05, .8), /target/);
  assert.throws(() => plan(.1, .02, .05, NaN), /Power/);
  assert.throws(() => analyze(control, { visitors: 2, conversions: 3 }, .05), /conversions/);
  assert.throws(() => analyze(control, { visitors: 4, conversions: 1.5 }, .05), /whole/);
  assert.throws(() => analyze(control, variant, NaN), /Significance/);
});
