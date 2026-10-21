(function () {
  "use strict";
  const STORAGE_KEY = "maker-arcade-saved-v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let currentLab = null;

  function parseSequence(value) {
    if (typeof value !== "string" || !value.trim()) throw new Error("Enter at least two comma-separated numbers.");
    const parts = value.split(",").map(part => part.trim());
    if (parts.length < 2 || parts.some(part => part === "")) throw new Error("Enter at least two comma-separated numbers.");
    const values = parts.map(Number);
    if (values.some(value => !Number.isFinite(value))) throw new Error("Every entry must be a finite number.");
    if (values.length > 500) throw new Error("Use 500 values or fewer for this local prototype.");
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
    return { count: values.length, mean, min: Math.min(...values), max: Math.max(...values), standardDeviation: Math.sqrt(variance), values };
  }

  function density(mass, volume) {
    const m = Number(mass), v = Number(volume);
    if (!Number.isFinite(m) || m < 0) throw new Error("Mass must be a finite number greater than or equal to zero.");
    if (!Number.isFinite(v) || v <= 0) throw new Error("Volume must be a finite number greater than zero.");
    return m / v;
  }

  function circularOrbitSpeed(radiusKm, centralMassKg) {
    const r = Number(radiusKm) * 1000;
    const mass = Number(centralMassKg);
    if (!Number.isFinite(r) || r <= 0 || !Number.isFinite(mass) || mass <= 0) throw new Error("Radius and central mass must be positive finite numbers.");
    const gravitationalConstant = 6.67430e-11;
    return Math.sqrt(gravitationalConstant * mass / r);
  }

  function wavePoints(frequency, amplitude, width = 600, height = 180) {
    const f = Number(frequency), a = Number(amplitude);
    if (!Number.isFinite(f) || f < 0.1 || f > 10 || !Number.isFinite(a) || a < 0 || a > 1) throw new Error("Frequency or amplitude is outside the supported range.");
    const points = [];
    for (let x = 0; x <= width; x += 4) {
      const y = height / 2 - Math.sin((x / width) * Math.PI * 2 * f) * a * (height * 0.42);
      points.push([x, y]);
    }
    return points;
  }

  function getSaved() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.id === "string" && typeof item.title === "string" && typeof item.summary === "string") : [];
    } catch (_) { return []; }
  }

  function setStatus(message) { $("#status").textContent = message; }

  function switchView(name) {
    $$(".view").forEach(view => view.classList.toggle("hidden", view.id !== "view-" + name));
    $$(".tab").forEach(tab => {
      const active = tab.dataset.view === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    if (name === "saved") renderSaved();
    window.scrollTo(0, 0);
  }

  function saveResult(title, summary) {
    const items = getSaved();
    items.unshift({ id: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8), title, summary, savedAt: new Date().toISOString() });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 100)));
      $("#saved-count").textContent = String(Math.min(items.length, 100));
      setStatus("Saved on this device.");
    } catch (_) { setStatus("Could not save. Device storage may be unavailable or full."); }
  }

  function renderSaved() {
    const items = getSaved();
    $("#saved-count").textContent = String(items.length);
    $("#saved-empty").classList.toggle("hidden", items.length > 0);
    const list = $("#saved-list");
    list.replaceChildren();
    items.forEach(item => {
      const article = document.createElement("article"); article.className = "card saved-item";
      const details = document.createElement("div");
      const title = document.createElement("h3"); title.textContent = item.title;
      const summary = document.createElement("p"); summary.textContent = item.summary + " · " + new Date(item.savedAt).toLocaleString();
      details.append(title, summary);
      const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "Delete"; remove.setAttribute("aria-label", "Delete " + item.title);
      remove.addEventListener("click", () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(getSaved().filter(entry => entry.id !== item.id))); renderSaved(); setStatus("Saved item deleted."); });
      article.append(details, remove); list.append(article);
    });
  }

  function shell(title, subtitle, body) {
    $("#lab-content").innerHTML = '<div class="card lab-panel"><p class="eyebrow">INTERACTIVE LAB</p><h2>' + title + '</h2><p>' + subtitle + '</p>' + body + '</div>';
  }

  function openLab(name) {
    currentLab = name;
    switchView("lab");
    if (name === "wave") {
      shell("Wave & Tone", "A simple sine-wave model. Frequency is shown in cycles across the plot; this is a visual model, not an audio output.", '<div class="control"><label for="wave-frequency">Frequency <output id="frequency-value">2.0</output></label><input id="wave-frequency" type="range" min="0.1" max="10" step="0.1" value="2"></div><div class="control"><label for="wave-amplitude">Amplitude <output id="amplitude-value">0.70</output></label><input id="wave-amplitude" type="range" min="0" max="1" step="0.05" value="0.7"></div><canvas class="chart" id="wave-canvas" width="600" height="180" aria-label="Wave plot"></canvas><div class="result-box"><div class="result-label">Model description</div><div id="wave-summary">2 cycles across the plot at 70% amplitude.</div></div><div class="save-row"><button class="primary" id="save-lab">Save result</button></div>');
      const draw = () => {
        const frequency = Number($("#wave-frequency").value), amplitude = Number($("#wave-amplitude").value);
        $("#frequency-value").textContent = frequency.toFixed(1); $("#amplitude-value").textContent = amplitude.toFixed(2);
        const canvas = $("#wave-canvas"), context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height); context.strokeStyle = "#2a3b54"; context.lineWidth = 1;
        context.beginPath(); context.moveTo(0, canvas.height / 2); context.lineTo(canvas.width, canvas.height / 2); context.stroke();
        context.strokeStyle = "#7de0c3"; context.lineWidth = 3; context.beginPath();
        wavePoints(frequency, amplitude, canvas.width, canvas.height).forEach(([x,y], index) => index ? context.lineTo(x,y) : context.moveTo(x,y)); context.stroke();
        $("#wave-summary").textContent = frequency.toFixed(1) + " cycles across the plot at " + Math.round(amplitude * 100) + "% amplitude.";
      };
      $("#wave-frequency").addEventListener("input", draw); $("#wave-amplitude").addEventListener("input", draw); draw();
      $("#save-lab").addEventListener("click", () => saveResult("Wave & Tone", $("#wave-summary").textContent));
    } else if (name === "matter") {
      shell("Matter & Density", "Density = mass ÷ volume. Choose units that are consistent with one another.", '<div class="control"><label for="mass">Mass (grams)</label><input id="mass" type="number" min="0" step="any" value="100"></div><div class="control"><label for="volume">Volume (mL)</label><input id="volume" type="number" min="0.001" step="any" value="50"></div><div class="result-box"><div class="result-label">Calculated density</div><div class="result-number" id="density-value">2.00 g/mL</div><div id="density-note" class="result-label">Mass divided by volume.</div></div><div class="save-row"><button class="primary" id="save-lab">Save result</button></div>');
      const calculate = () => { try { const value = density($("#mass").value, $("#volume").value); $("#density-value").textContent = value.toPrecision(5) + " g/mL"; $("#density-note").textContent = "Using " + $("#mass").value + " g ÷ " + $("#volume").value + " mL."; $("#density-value").dataset.result = $("#density-note").textContent; } catch (error) { $("#density-value").textContent = "Check inputs"; $("#density-note").textContent = error.message; } };
      $("#mass").addEventListener("input", calculate); $("#volume").addEventListener("input", calculate); calculate();
      $("#save-lab").addEventListener("click", () => saveResult("Matter & Density", $("#density-note").textContent + " Result: " + $("#density-value").textContent));
    } else if (name === "orbit") {
      shell("Orbit Bench", "For a circular orbit in a two-body Newtonian approximation: v = √(GM/r). This ignores atmosphere, other bodies, and relativistic effects.", '<div class="control"><label for="orbit-radius">Orbital radius (km)</label><input id="orbit-radius" type="number" min="1" step="any" value="7000"></div><div class="control"><label for="orbit-mass">Central mass (kg)</label><input id="orbit-mass" type="number" min="1" step="any" value="5.972e24"></div><div class="result-box"><div class="result-label">Circular orbital speed (model)</div><div class="result-number" id="orbit-speed">—</div><div id="orbit-note" class="result-label">Results depend on the values entered.</div></div><div class="save-row"><button class="primary" id="save-lab">Save result</button></div>');
      const calculate = () => { try { const speed = circularOrbitSpeed($("#orbit-radius").value, $("#orbit-mass").value); $("#orbit-speed").textContent = (speed / 1000).toFixed(3) + " km/s"; $("#orbit-note").textContent = "Radius: " + $("#orbit-radius").value + " km; central mass: " + $("#orbit-mass").value + " kg."; } catch (error) { $("#orbit-speed").textContent = "Check inputs"; $("#orbit-note").textContent = error.message; } };
      $("#orbit-radius").addEventListener("input", calculate); $("#orbit-mass").addEventListener("input", calculate); calculate();
      $("#save-lab").addEventListener("click", () => saveResult("Orbit Bench", $("#orbit-note").textContent + " Model speed: " + $("#orbit-speed").textContent));
    } else if (name === "pattern") {
      shell("Pattern Forge", "Paste a comma-separated numeric sequence. Summary statistics are descriptive only; they do not infer causes or predict future values.", '<div class="control"><label for="sequence">Numeric sequence</label><textarea id="sequence" spellcheck="false">2, 4, 6, 8, 10</textarea></div><button class="primary" id="analyze-sequence">Analyze sequence</button><p id="sequence-error" role="alert" class="result-label"></p><div class="stat-grid" id="sequence-stats"></div><div class="save-row"><button class="secondary" id="save-lab">Save result</button></div>');
      const analyze = () => { try { const result = parseSequence($("#sequence").value); $("#sequence-error").textContent = ""; const values = [["Count", result.count], ["Mean", result.mean.toPrecision(5)], ["Minimum", result.min], ["Maximum", result.max], ["Std. deviation", result.standardDeviation.toPrecision(5)]]; const stats = $("#sequence-stats"); stats.replaceChildren(); values.forEach(([label,value]) => { const item = document.createElement("div"); item.className = "stat"; const strong = document.createElement("strong"); strong.textContent = String(value); const span = document.createElement("span"); span.textContent = label; item.append(strong,span); stats.append(item); }); return result; } catch (error) { $("#sequence-error").textContent = error.message; $("#sequence-stats").replaceChildren(); return null; } };
      $("#analyze-sequence").addEventListener("click", analyze); analyze();
      $("#save-lab").addEventListener("click", () => { const result = analyze(); if (result) saveResult("Pattern Forge", "n=" + result.count + "; mean=" + result.mean.toPrecision(5) + "; min=" + result.min + "; max=" + result.max); });
    } else {
      setStatus("Unknown lab.");
    }
  }

  if (typeof document === "undefined") {
    if (typeof module !== "undefined" && module.exports) module.exports = { parseSequence, density, circularOrbitSpeed, wavePoints };
    return;
  }

  document.addEventListener("click", event => {
    const tab = event.target.closest("[data-view]");
    if (tab) { switchView(tab.dataset.view); setStatus(""); return; }
    const go = event.target.closest("[data-go]");
    if (go) { switchView(go.dataset.go); return; }
    const lab = event.target.closest("[data-open-lab]");
    if (lab) { openLab(lab.dataset.openLab); setStatus(""); return; }
  });
  $("#back-to-labs").addEventListener("click", () => switchView("labs"));
  $("#clear-saved").addEventListener("click", () => { if (getSaved().length && window.confirm("Delete all saved experiments on this device?")) { localStorage.removeItem(STORAGE_KEY); renderSaved(); setStatus("Saved experiments cleared."); } });
  $("#saved-count").textContent = String(getSaved().length);

  if (typeof module !== "undefined" && module.exports) module.exports = { parseSequence, density, circularOrbitSpeed, wavePoints };
})();
