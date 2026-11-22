import { analyze, plan } from "./stats.mjs";

const number = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });
const pct = value => number.format(100 * value) + "%";
const pp = value => number.format(100 * value) + " pp";

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
  return [
    number.format(perArm) + " visitors per arm",
    number.format(2 * perArm) + " visitors total · " + pct((baseline + lift) / 100) + " target conversion"
  ];
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
    "Two-sided p-value " + (estimate.p < .0001 ? "< 0.0001" : estimate.p.toFixed(4)),
    estimate.significant ? "Statistically significant at the selected threshold." : "Inconclusive at the selected threshold."
  ];
});
