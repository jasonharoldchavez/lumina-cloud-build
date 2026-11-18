const test = require("node:test");
const assert = require("node:assert/strict");
const {entries, validate, sortEntries} = require("../www/js/timeline.js");

test("curated timeline entries have unique ids, dates and HTTPS sources", () => {
  assert.equal(validate(entries), true);
});
test("timeline sorts BCE before CE without mutating the source array", () => {
  const sorted = sortEntries(entries);
  assert.ok(sorted[0].year < 0);
  assert.ok(sorted.at(-1).year > sorted[0].year);
  assert.notEqual(sorted, entries);
});
test("timeline rejects duplicate ids and missing sources", () => {
  assert.throws(() => validate([{...entries[0]}, {...entries[0]}]), /unique id/);
  assert.throws(() => validate([{...entries[0], sources:[]}]), /source/);
});
test("timeline rejects non-HTTPS source links", () => {
  assert.throws(() => validate([{...entries[0], sources:[{label:"bad",url:"http://example.com"}]}]), /HTTPS/);
});
