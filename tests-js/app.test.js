const test = require("node:test");
const assert = require("node:assert/strict");
const { parseSequence, density, circularOrbitSpeed, wavePoints } = require("../www/js/app.js");

test("pattern sequence reports deterministic descriptive statistics", () => {
  const result = parseSequence("2, 4, 6, 8, 10");
  assert.equal(result.count, 5);
  assert.equal(result.mean, 6);
  assert.equal(result.min, 2);
  assert.equal(result.max, 10);
  assert.ok(Math.abs(result.standardDeviation - Math.sqrt(8)) < 1e-12);
});

test("pattern sequence rejects malformed, non-finite, and excessive input", () => {
  for (const value of ["", "1", "1,,2", "1,wat", "1,NaN", "1,Infinity", Array(502).fill("1").join(",")]) {
    assert.throws(() => parseSequence(value));
  }
});

test("density uses mass divided by positive volume", () => {
  assert.equal(density(100, 50), 2);
  assert.equal(density(0, 50), 0);
  for (const args of [[-1, 1], [1, 0], [1, -1], ["bad", 2], [1, Infinity]]) assert.throws(() => density(...args));
});

test("orbit speed model is finite and decreases as radius increases", () => {
  const near = circularOrbitSpeed(7000, 5.972e24);
  const far = circularOrbitSpeed(14000, 5.972e24);
  assert.ok(Number.isFinite(near) && near > 0);
  assert.ok(far < near);
  assert.throws(() => circularOrbitSpeed(0, 1));
  assert.throws(() => circularOrbitSpeed(1, Infinity));
});

test("wave points stay in bounds and respond to frequency/amplitude", () => {
  const points = wavePoints(2, 0.7);
  assert.ok(points.length > 100);
  assert.ok(points.every(([x,y]) => x >= 0 && x <= 600 && y >= 0 && y <= 180));
  assert.ok(Math.max(...points.map(p => p[1])) < 100);
  assert.throws(() => wavePoints(11, 0.5));
});
