const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "../www/index.html"), "utf8");

function extractJson(pattern, label) {
  const match = html.match(pattern);
  assert.ok(match, label + " JSON data block not found");
  return JSON.parse(match[1]);
}

const quests = extractJson(/const QUESTS = (\\{[\\s\\S]*?\\});\\s*const TIMELINE =/, "ChronoQuest");
const timeline = extractJson(/const TIMELINE = (\\[[\\s\\S]*?\\]);\\s*const GROUPS =/, "Timeways");
const fieldIds = [...html.matchAll(/\\{id:'([^']+)',title:/g)].map(match => match[1]);

test("every Living Atlas field has a category-tailored mission", () => {
  assert.equal(fieldIds.length, 44);
  assert.equal(new Set(fieldIds).size, 44);
  assert.deepEqual(Object.keys(quests).sort(), [...fieldIds].sort());
  for (const [id, q] of Object.entries(quests)) {
    assert.ok(q[0] && q[1] && Array.isArray(q[2]) && q[2].length === 4);
    assert.ok(Number.isInteger(q[3]) && q[3] >= 0 && q[3] < 4);
    assert.ok(q[4]);
    assert.equal(new Set(q[2]).size, 4, "duplicate choices for " + id);
  }
});

test("Timeways has 14 chronologically ordered and sourced milestones", () => {
  assert.equal(timeline.length, 14);
  assert.equal(new Set(timeline.map(item => item.id)).size, 14);
  assert.deepEqual([...timeline].sort((a,b) => a.year-b.year).map(x=>x.id), timeline.map(x=>x.id));
  for (const item of timeline) {
    assert.ok(Number.isInteger(item.year) && item.date && item.title && item.summary && item.source);
    assert.match(item.url, /^https:\\/\\//);
  }
});

test("learning progress is local-only and the page exposes both new game areas", () => {
  assert.match(html, /id="atlasQuestBoard"/);
  assert.match(html, /id="atlasTimeways"/);
  assert.match(html, /living-atlas\\.chronoquest\\.v1/);
  assert.match(html, /connect-src 'none'/);
});
