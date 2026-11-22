export const standardColumns = Object.freeze({
  group: "group", outcome: "converted", control: "control", treatment: "treatment"
});

export const hillstromColumns = Object.freeze({
  group: "segment", outcome: "conversion", control: "No E-Mail", treatment: "Mens E-Mail", excludeOthers: true
});

const missing = value => /^(?:|na|n\/a|null|nan)$/i.test(value);

// Aggregate as each record completes. Quoting state and unfinished fields survive chunk boundaries.
export async function aggregateCsv(stream, options = standardColumns) {
  const { group, outcome, control, treatment, excludeOthers = false } = options;
  if (!group || !outcome || group === outcome || !control || !treatment ||
      control === treatment || missing(control) || missing(treatment)) {
    throw new Error("Enter distinct column names and distinct, non-missing arm labels.");
  }
  const emptyArm = () => ({ assigned: 0, visitors: 0, conversions: 0, missing: 0 });
  const counts = { control: emptyArm(), treatment: emptyArm(), records: 0, missingGroup: 0, excluded: 0 };
  let width = 0;
  let groupIndex;
  let outcomeIndex;
  let row = [];
  let field = "";
  let state = "plain";
  let skipLF = false;
  let record = 1;
  const fail = message => { throw new Error("CSV record " + record + ": " + message); };

  function endField() {
    if (row.length >= 1024) fail("too many columns (limit 1,024).");
    row.push(field.trim());
    field = "";
    state = "plain";
  }

  function endRow() {
    endField();
    if (!(row.length === 1 && row[0] === "")) {
      if (!width) {
        if (row.some(value => !value) || new Set(row).size !== row.length) {
          fail("headers must be nonempty and unique.");
        }
        groupIndex = row.indexOf(group);
        outcomeIndex = row.indexOf(outcome);
        if (groupIndex < 0 || outcomeIndex < 0) fail("mapped columns were not found in the header.");
        width = row.length;
      } else {
        if (row.length !== width) fail("column count differs from the header.");
        counts.records++;
        const label = row[groupIndex];
        const value = row[outcomeIndex];
        const arm = label === control ? counts.control : label === treatment ? counts.treatment : null;
        if (missing(label)) counts.missingGroup++;
        else if (arm) {
          arm.assigned++;
          if (missing(value)) arm.missing++;
          else {
            if (value !== "0" && value !== "1") fail("outcome must be 0, 1, or missing.");
            arm.visitors++;
            if (value === "1") arm.conversions++;
          }
        } else if (excludeOthers) counts.excluded++;
        else fail("unexpected group label. Check your mapping or enable exclusion of other groups.");
      }
    }
    record++;
    row = [];
  }

  const decoder = new TextDecoderStream("utf-8", { fatal: true });
  for await (const chunk of stream.pipeThrough(decoder)) {
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk[i];
      if (skipLF) {
        skipLF = false;
        if (char === "\n") continue;
      }
      if (state === "quoted") {
        if (char === '"') state = "closed";
        else field += char;
      } else if (state === "closed" && char === '"') {
        field += char;
        state = "quoted";
      } else if (char === ",") endField();
      else if (char === "\n" || char === "\r") {
        endRow();
        skipLF = char === "\r";
      } else if (state === "closed") fail("unexpected character after a closing quote.");
      else if (char === '"') {
        if (field) fail("unexpected quote in an unquoted field.");
        state = "quoted";
      } else field += char;
      if (field.length > 65536) fail("field exceeds 65,536 characters.");
    }
  }
  if (state === "quoted") fail("unclosed quoted field.");
  if (row.length || field || state === "closed") endRow();
  if (!counts.control.visitors || !counts.treatment.visitors) {
    throw new Error("Both mapped arms need at least one non-missing binary outcome.");
  }
  return counts;
}

export function syntheticCsv(rows) {
  const records = ["group,converted\n"];
  let seed = 123456789;
  for (let i = 0; i < rows; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const treatment = i % 2 === 1;
    const converted = seed / 2 ** 32 < (treatment ? .12 : .10);
    records.push((treatment ? "treatment" : "control") + "," + Number(converted) + "\n");
  }
  return new Blob(records, { type: "text/csv" });
}
