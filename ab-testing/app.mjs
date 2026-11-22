import { analyze, designPower, minimumDetectableEffect, plan, practicalEffect, sampleRatio } from "./stats.mjs?v=3";
import { aggregateCsv, hillstromColumns, standardColumns, syntheticCsv } from "./csv.mjs?v=3";
import { drawIntervals, drawPower } from "./charts.mjs?v=3";

const number = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });
function formatRate(value) {
  const scaled = 100 * value;
  return scaled !== 0 && Math.abs(scaled) < .001 ? scaled.toExponential(2) : number.format(scaled);
}
const pct = value => formatRate(value) + "%";
const pp = value => formatRate(value) + " pp";
const pValue = value => value === 0 ? "< 1e−300" : value.toPrecision(5);
const powerChart = document.getElementById("power-chart");
const powerPoint = document.getElementById("power-point");
const powerDetail = document.getElementById("power-detail");
const intervalChart = document.getElementById("interval-chart");
const intervalView = document.getElementById("interval-view");
const intervals = document.getElementById("intervals");
let csvCounts;
let powerPoints;
let targetPower;

function renderPower() {
  const selected = Number(powerPoint.value);
  const point = powerPoints[selected];
  drawPower(powerChart.querySelector("canvas"), powerPoints, selected, targetPower, number);
  powerDetail.textContent = number.format(point.perArm) + " per arm · " + pct(point.power) + " estimated power";
  powerPoint.setAttribute("aria-valuetext", powerDetail.textContent);
}

powerPoint.addEventListener("input", renderPower);
function filterIntervals() {
  [...intervals.children].forEach((row, index) => {
    row.hidden = intervalView.value !== "all" && (index === 2) !== (intervalView.value === "lift");
  });
}
intervalView.addEventListener("change", filterIntervals);

function bind(id, chart, calculate) {
  const form = document.getElementById(id);
  const output = form.querySelector("output");
  form.addEventListener("input", () => {
    output.textContent = "";
    output.classList.remove("error");
    chart.hidden = true;
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const values = Object.fromEntries([...form.querySelectorAll("input")]
      .map(input => [input.name, input.valueAsNumber]));
    try {
      output.textContent = calculate(values).join("\n");
      output.classList.remove("error");
    } catch (error) {
      chart.hidden = true;
      output.textContent = error.message;
      output.classList.add("error");
    }
  });
  form.requestSubmit();
}

bind("planner", powerChart, ({ baseline, lift, alpha, power, budget }) => {
  const perArm = plan(baseline / 100, lift / 100, alpha / 100, power / 100);
  const target = (baseline + lift) / 100;
  const lines = [
    number.format(perArm) + " visitors per arm",
    number.format(2 * perArm) + " visitors total · " + pct(target) + " target conversion"
  ];
  if (perArm * Math.min(baseline / 100, 1 - target) < 10) {
    lines.push("At this sample size, at least one expected count is below 10. The normal approximation may be unreliable, and the readout may withhold inference.");
  }
  if (!Number.isNaN(budget)) {
    const mde = minimumDetectableEffect(baseline / 100, budget, alpha / 100, power / 100);
    lines.push("At " + number.format(budget) + " per arm, estimated power for the entered lift is " +
      pct(designPower(baseline / 100, lift / 100, budget, alpha / 100)) + ".");
    lines.push(mde === null ? "Target power is unattainable below 100% conversion at this budget." :
      "Minimum detectable positive lift at this budget: " + pp(mde) + ".");
    if (budget * Math.min(baseline / 100, 1 - target) < 10) {
      lines.push("At this budget the entered lift yields a sparse expected count.");
    }
  }
  targetPower = power / 100;
  const max = Math.max(31, 2 * perArm);
  powerPoints = Array.from({ length: 31 }, (_, index) => {
    const size = Math.max(1, Math.round(max * index / 30));
    return { perArm: size, power: designPower(baseline / 100, lift / 100, size, alpha / 100) };
  });
  powerPoint.value = "15";
  renderPower();
  powerChart.hidden = false;
  return lines;
});

bind("readout", intervalChart, ({ av, ac, bv, bc, alpha, allocation, meaningful }) => {
  const result = analyze({ visitors: av, conversions: ac }, { visitors: bv, conversions: bc }, alpha / 100);
  const lines = [
    "Control " + pct(result.a) + " · Treatment " + pct(result.b),
    "Absolute lift " + pp(result.difference),
    "Relative lift " + (result.relative === null ? "undefined (zero baseline)" : pct(result.relative)),
    pct(1 - alpha / 100) + " Newcombe lift interval " + pp(result.interval.lower) + " to " + pp(result.interval.upper)
  ];
  const srm = sampleRatio(csvCounts?.control.assigned ?? av, csvCounts?.treatment.assigned ?? bv, allocation / 100);
  lines.push(srm === null ? "SRM unavailable: expected assignment count below 5." :
    "Sample ratio mismatch (SRM) p-value " + pValue(srm.p) +
      (srm.flagged ? " · flagged. Investigate before interpreting lift." : " · no flag at 0.01."));
  const practical = practicalEffect(result.interval, meaningful / 100);
  const estimate = result.inference;
  if (estimate) {
    lines.push("Two-sided z-test p-value " + pValue(estimate.p),
      estimate.significant ? "Statistically significant at the selected threshold." : "Did not reach statistical significance.");
  } else {
    lines.push("Z-test withheld: each arm needs 10 observed and expected conversions and non-conversions.");
  }
  lines.push(practical);
  drawIntervals(intervals, result, pct, pp);
  filterIntervals();
  intervalChart.hidden = false;
  return lines;
});

const csvForm = document.getElementById("csv-form");
const csvStatus = document.getElementById("csv-status");
const readout = document.getElementById("readout");
const csvButtons = csvForm.querySelectorAll("button");

function setMapping(options) {
  for (const name of ["group", "outcome", "control", "treatment"]) csvForm.elements[name].value = options[name];
  csvForm.elements.excludeOthers.checked = Boolean(options.excludeOthers);
}

async function upload(file, options, label) {
  csvButtons.forEach(button => { button.disabled = true; });
  csvStatus.classList.remove("error");
  csvStatus.textContent = "Reading " + label + "…";
  try {
    const counts = await aggregateCsv(file.stream(), options);
    csvCounts = counts;
    const { control, treatment } = counts;
    readout.elements.av.value = control.visitors;
    readout.elements.ac.value = control.conversions;
    readout.elements.bv.value = treatment.visitors;
    readout.elements.bc.value = treatment.conversions;
    const report = [
      label + " · " + number.format(counts.records) + " data records",
      "Assigned control " + number.format(control.assigned) + " · treatment " + number.format(treatment.assigned),
      "Missing outcomes control " + number.format(control.missing) + " (" + pct(control.missing / control.assigned) +
        ") · treatment " + number.format(treatment.missing) + " (" + pct(treatment.missing / treatment.assigned) + ")",
      "Missing group " + number.format(counts.missingGroup) + " · other groups excluded " + number.format(counts.excluded)
    ];
    if (counts.missingGroup || control.missing || treatment.missing) {
      report.push("Check whether missingness differs by arm before interpreting the complete-case comparison.");
    }
    csvStatus.textContent = report.join("\n");
    readout.dispatchEvent(new Event("input"));
    readout.requestSubmit();
  } catch (error) {
    csvStatus.classList.add("error");
    csvStatus.textContent = error.message + " The readout still shows the previous inputs.";
  } finally {
    csvButtons.forEach(button => { button.disabled = false; });
  }
}

csvForm.addEventListener("submit", event => {
  event.preventDefault();
  const { file, excludeOthers, ...mapping } = Object.fromEntries(new FormData(csvForm));
  for (const name of Object.keys(mapping)) mapping[name] = mapping[name].trim();
  upload(file, { ...mapping, excludeOthers: Boolean(excludeOthers) }, file.name);
});
document.getElementById("hillstrom").addEventListener("click", () => {
  setMapping(hillstromColumns);
  csvStatus.classList.remove("error");
  csvStatus.textContent = "Hillstrom mapping selected. Choose the downloaded CSV and analyze it with a planned control share of 50%.";
});
document.getElementById("synthetic").addEventListener("click", () => {
  setMapping(standardColumns);
  readout.elements.allocation.value = 50;
  upload(syntheticCsv(10000), standardColumns, "Synthetic example");
});
readout.addEventListener("input", event => {
  if (csvCounts && ["av", "ac", "bv", "bc"].includes(event.target.name)) {
    csvCounts = undefined;
    csvStatus.textContent = "Readout was switched to manually entered counts.";
  }
});
