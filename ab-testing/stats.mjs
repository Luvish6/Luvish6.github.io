function tail(z) {
  if (z === 0) return .5;
  // Complementary error function approximation (Numerical Recipes, §6.2).
  const x = z / Math.SQRT2;
  const t = 1 / (1 + .5 * x);
  const coefficients = [.17087277, -.82215223, 1.48851587, -1.13520398,
    .27886807, -.18628806, .09678418, .37409196, 1.00002368];
  const polynomial = coefficients.reduce((value, coefficient) => value * t + coefficient);
  return .5 * t * Math.exp(-x * x - 1.26551223 + t * polynomial);
}

const cdf = z => z < 0 ? tail(-z) : 1 - tail(z);

function quantile(p) {
  let low = 0;
  let high = 8;
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    if (tail(mid) > 1 - p) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

const variance = p => p * (1 - p);

function validateAlpha(alpha) {
  if (!(alpha >= .001 && alpha <= .20)) throw new Error("Significance must be 0.1–20%.");
}

function validatePower(power) {
  if (!(power >= .6 && power <= .99)) throw new Error("Power must be 60–99%.");
}

function planningErrors(baseline, target) {
  return {
    nullSD: Math.sqrt(2 * variance((baseline + target) / 2)),
    alternativeSD: Math.sqrt(variance(baseline) + variance(target))
  };
}

export function plan(baseline, lift, alpha, power) {
  validateAlpha(alpha);
  const target = baseline + lift;
  if (!(baseline > 0 && lift > 0 && target < 1 && target > baseline)) {
    throw new Error("Enter a positive baseline and lift with a target below 100%.");
  }
  validatePower(power);
  const { nullSD, alternativeSD } = planningErrors(baseline, target);
  const threshold = quantile(1 - alpha / 2) * nullSD;
  const separation = quantile(power) * alternativeSD;
  const perArm = Math.ceil(((threshold + separation) / lift) ** 2);
  if (!Number.isSafeInteger(2 * perArm)) throw new Error("The requested lift requires too many visitors.");
  return perArm;
}

export function designPower(baseline, lift, perArm, alpha) {
  validateAlpha(alpha);
  if (!(baseline > 0 && baseline < 1 && lift >= 0 && baseline + lift <= 1) ||
      !Number.isSafeInteger(perArm) || perArm < 1) {
    throw new Error("Power requires a valid baseline, target and whole per-arm sample size.");
  }
  const { nullSD, alternativeSD } = planningErrors(baseline, baseline + lift);
  const cutoff = quantile(1 - alpha / 2) * nullSD;
  const shift = Math.sqrt(perArm) * lift;
  return cdf((shift - cutoff) / alternativeSD) + tail((shift + cutoff) / alternativeSD);
}

export function minimumDetectableEffect(baseline, perArm, alpha, power) {
  validatePower(power);
  let low = 0;
  let high = 1 - baseline;
  if (designPower(baseline, high, perArm, alpha) <= power) return null;
  for (let i = 0; i < 48; i++) {
    const mid = (low + high) / 2;
    if (designPower(baseline, mid, perArm, alpha) < power) low = mid;
    else high = mid;
  }
  return high;
}

export function sampleRatio(control, treatment, expectedControl) {
  const total = control + treatment;
  if (!Number.isSafeInteger(total) || total < 1 || !Number.isSafeInteger(control) || control < 0 ||
      !Number.isSafeInteger(treatment) || treatment < 0 || !(expectedControl > 0 && expectedControl < 1)) {
    throw new Error("SRM requires whole assignment counts and an expected control share between 0% and 100%.");
  }
  if (total * Math.min(expectedControl, 1 - expectedControl) < 5) return null;
  const z = (control - total * expectedControl) / Math.sqrt(total * variance(expectedControl));
  const p = 2 * tail(Math.abs(z));
  return { p, flagged: p < .01 };
}

function wilson(rate, count, z) {
  const prior = z * z / count;
  const center = rate + prior / 2;
  const margin = z * Math.sqrt((variance(rate) + prior / 4) / count);
  const lower = rate === 0 ? 0 : (center - margin) / (1 + prior);
  const upper = rate === 1 ? 1 : (center + margin) / (1 + prior);
  return { lower, upper };
}

export function practicalEffect(interval, threshold) {
  if (!(threshold > 0 && threshold < 1)) throw new Error("Meaningful lift must be between 0 and 100 pp.");
  if (interval.lower >= threshold) return "Interval supports a gain of at least the meaningful threshold.";
  if (interval.upper <= -threshold) return "Interval supports a loss of at least the meaningful threshold.";
  if (interval.lower > -threshold && interval.upper < threshold) {
    return "Interval lies within the practically small range.";
  }
  return "Practical importance is uncertain at this threshold.";
}

export function analyze(control, variant, alpha) {
  validateAlpha(alpha);
  for (const { visitors, conversions } of [control, variant]) {
    if (!Number.isSafeInteger(visitors) || visitors < 1 || !Number.isSafeInteger(conversions) ||
        conversions < 0 || conversions > visitors) {
      throw new Error("Each arm needs a positive whole visitor count and conversions between zero and that count.");
    }
  }
  const a = control.conversions / control.visitors;
  const b = variant.conversions / variant.visitors;
  const difference = b - a;
  const total = control.visitors + variant.visitors;
  if (!Number.isSafeInteger(total)) throw new Error("The combined visitor count is too large.");
  const successes = control.conversions + variant.conversions;
  const failures = total - successes;
  const pooled = successes / total;
  const z = quantile(1 - alpha / 2);
  const rates = [wilson(a, control.visitors, z), wilson(b, variant.visitors, z)];
  const [aCI, bCI] = rates;
  // Newcombe's independent Wilson-score interval for treatment minus control.
  const interval = {
    lower: difference - Math.hypot(b - bCI.lower, aCI.upper - a),
    upper: difference + Math.hypot(bCI.upper - b, a - aCI.lower)
  };
  const result = { a, b, rates, difference, interval, relative: a === 0 ? null : difference / a, inference: null };
  // Compare expected counts by cross multiplication to preserve the exact cutoff.
  const minimum = 10n * BigInt(total);
  const sparse = [control, variant].some(({ visitors, conversions }) =>
    Math.min(conversions, visitors - conversions) < 10 ||
    BigInt(visitors) * BigInt(Math.min(successes, failures)) < minimum);
  if (sparse) return result;

  const error = Math.sqrt(pooled * (failures / total) * (1 / control.visitors + 1 / variant.visitors));
  const p = difference === 0 ? 1 : 2 * tail(Math.abs(difference) / error);
  result.inference = { p, significant: p < alpha };
  return result;
}
