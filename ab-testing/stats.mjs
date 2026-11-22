function tail(z) {
  const t = 1 / (1 + .2316419 * z);
  return Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI) * t *
    (.319381530 + t * (-.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
}

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

export function plan(baseline, lift, alpha, power) {
  validateAlpha(alpha);
  const target = baseline + lift;
  if (!(baseline > 0 && lift > 0 && target < 1 && target > baseline)) {
    throw new Error("Enter a positive baseline and lift with a target below 100%.");
  }
  if (!(power >= .6 && power <= .99)) throw new Error("Power must be 60–99%.");
  const threshold = quantile(1 - alpha / 2) * Math.sqrt(2 * variance((baseline + target) / 2));
  const separation = quantile(power) * Math.sqrt(variance(baseline) + variance(target));
  const perArm = Math.ceil(((threshold + separation) / lift) ** 2);
  if (!Number.isSafeInteger(2 * perArm)) throw new Error("The requested lift requires too many visitors.");
  return perArm;
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
  const result = { a, b, difference, relative: a === 0 ? null : difference / a, inference: null };
  // Compare expected counts by cross multiplication to preserve the exact cutoff.
  const minimum = 10n * BigInt(total);
  const sparse = [control, variant].some(({ visitors, conversions }) =>
    Math.min(conversions, visitors - conversions) < 10 ||
    BigInt(visitors) * BigInt(Math.min(successes, failures)) < minimum);
  if (sparse) return result;

  const error = Math.sqrt(pooled * (failures / total) * (1 / control.visitors + 1 / variant.visitors));
  const p = difference === 0 ? 1 : 2 * tail(Math.abs(difference) / error);
  const margin = quantile(1 - alpha / 2) *
    Math.sqrt(variance(a) / control.visitors + variance(b) / variant.visitors);
  result.inference = { p, lower: difference - margin, upper: difference + margin, significant: p < alpha };
  return result;
}
