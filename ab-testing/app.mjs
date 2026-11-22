import { analyze, plan } from "./stats.mjs?v=2";

const number = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });
function formatRate(value) {
  const scaled = 100 * value;
  return scaled !== 0 && Math.abs(scaled) < .001 ? scaled.toExponential(2) : number.format(scaled);
}
const pct = value => formatRate(value) + "%";
const pp = value => formatRate(value) + " pp";

function bind(id, calculate) {
  const form = document.getElementById(id);
  const output = form.querySelector("output");
  form.addEventListener("input", () => {
    output.textContent = "";
    output.classList.remove("error");
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const values = Object.fromEntries([...form.querySelectorAll("input")]
      .map(input => [input.name, input.valueAsNumber]));
    try {
      output.textContent = calculate(values).join("\n");
      output.classList.remove("error");
    } catch (error) {
      output.textContent = error.message;
      output.classList.add("error");
    }
  });
  form.requestSubmit();
}

bind("planner", ({ baseline, lift, alpha, power }) => {
  const perArm = plan(baseline / 100, lift / 100, alpha / 100, power / 100);
  const target = (baseline + lift) / 100;
  const lines = [
    number.format(perArm) + " visitors per arm",
    number.format(2 * perArm) + " visitors total · " + pct(target) + " target conversion"
  ];
  if (perArm * Math.min(baseline / 100, 1 - target) < 10) {
    lines.push("At this sample size, at least one expected count is below 10. The normal approximation may be unreliable, and the readout may withhold inference.");
  }
  return lines;
});

bind("readout", ({ av, ac, bv, bc, alpha }) => {
  const result = analyze({ visitors: av, conversions: ac }, { visitors: bv, conversions: bc }, alpha / 100);
  const lines = [
    "Control " + pct(result.a) + " · Variant " + pct(result.b),
    "Absolute lift " + pp(result.difference),
    "Relative lift " + (result.relative === null ? "undefined (zero baseline)" : pct(result.relative))
  ];
  const estimate = result.inference;
  if (!estimate) return [...lines, "Inference requires at least 10 observed and expected conversions and non-conversions in each arm."];
  return [...lines,
    pct(1 - alpha / 100) + " confidence interval " + pp(estimate.lower) + " to " + pp(estimate.upper),
    "Two-sided p-value " + (estimate.p < .0001 ? "< 0.0001" : estimate.p.toPrecision(5)),
    estimate.significant ? "Statistically significant at the selected threshold." : "Did not reach statistical significance."
  ];
});
