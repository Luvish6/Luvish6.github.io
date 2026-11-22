import test from "node:test";
import assert from "node:assert/strict";
import { aggregateCsv, hillstromColumns, standardColumns, syntheticCsv } from "./csv.mjs";

const parse = (text, options) => aggregateCsv(new Blob([text]).stream(), options);

test("CSV handles BOM, CRLF, escaped quotes, comma and multiline fields across byte chunks", async () => {
  const data = '\uFEFFgroup,converted,note\r\ncontrol,1,"é, ""one"""\r\ntreatment,0,"two\r\nlines"';
  const bytes = new TextEncoder().encode(data);
  const stream = new ReadableStream({
    start(controller) {
      for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
      controller.close();
    }
  });
  const result = await aggregateCsv(stream);
  assert.equal(result.records, 2);
  assert.equal(result.control.conversions, 1);
  assert.equal(result.treatment.conversions, 0);
});

test("missing outcomes affect assignment counts and exclusions are explicit", async () => {
  const input = "segment,conversion\nNo E-Mail,1\nNo E-Mail, N/A\nMens E-Mail,0\n,0\nWomens E-Mail,1\n";
  const result = await parse(input, hillstromColumns);
  assert.deepEqual(result.control, { assigned: 2, visitors: 1, conversions: 1, missing: 1 });
  assert.deepEqual(result.treatment, { assigned: 1, visitors: 1, conversions: 0, missing: 0 });
  assert.equal(result.missingGroup, 1);
  assert.equal(result.excluded, 1);
  await assert.rejects(parse(input, { ...hillstromColumns, excludeOthers: false }), /unexpected group/);
});

test("malformed header, rows, encoding and outcomes fail with clear errors", async () => {
  await assert.rejects(parse("group,group\ncontrol,1"), /unique/);
  await assert.rejects(parse("arm,converted\ncontrol,1"), /mapped columns/);
  await assert.rejects(parse("group,converted\ncontrol,1,extra"), /column count/);
  await assert.rejects(parse("group,converted\ncontrol,2"), /outcome must/);
  await assert.rejects(parse('group,converted\ncontrol,"1'), /unclosed/);
  await assert.rejects(parse('group,converted\ncontrol,"1"oops'), /closing quote/);
  await assert.rejects(parse("group,converted\ncontrol,0\ntreatment,NA"), /Both mapped arms/);
  await assert.rejects(parse("", { ...standardColumns, treatment: "control" }), /distinct/);
  await assert.rejects(aggregateCsv(new Blob([Uint8Array.of(255)]).stream()), TypeError);
});

test("seeded synthetic fixture yields reproducible counts", async () => {
  const result = await aggregateCsv(syntheticCsv(10000).stream());
  assert.equal(result.records, 10000);
  assert.equal(result.control.conversions, 515);
  assert.equal(result.treatment.conversions, 622);
});
