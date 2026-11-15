(function () {
  "use strict";
  const entries = [
    {id:"writing-sumer",year:-3150,date:"c. 3150 BCE",title:"Early written records in Sumer",field:"Communication",place:"Southern Mesopotamia (present-day Iraq)",summary:"Clay tablets from Sumer preserve some of the earliest known written records. Early signs developed in administrative settings, including the tracking of goods and obligations.",people:"Many unnamed scribes and administrators; not a single inventor.",certainty:"Approximate date; the development of writing was gradual.",sources:[{label:"Wiley, From the origins of writing to Gutenberg (excerpt)",url:"https://catalogimages.wiley.com/images/db/pdf/9780471783909.excerpt.pdf"}]},
    {id:"gutenberg",year:1450,date:"c. 1450s CE",title:"Movable-type printing spreads in Europe",field:"Communication",place:"Mainz, present-day Germany",summary:"Johannes Gutenberg's press combined movable metal type, ink, and a press mechanism. Printing had much earlier histories in East Asia; Gutenberg's system helped transform book production in Europe.",people:"Johannes Gutenberg and a wider network of printers, craftspeople, and financiers.",certainty:"The European press developed over time; printing with movable type existed in China and Korea earlier.",sources:[{label:"Cambridge Companion to the History of the Book — chronology",url:"https://assets.cambridge.org/97811070/23734/frontmatter/9781107023734_frontmatter.pdf"}]},
    {id:"principia",year:1687,date:"1687 CE",title:"Newton's Principia is published",field:"Mathematics & physics",place:"London, England",summary:"Philosophiæ Naturalis Principia Mathematica presented mathematical treatments of motion and universal gravitation. Edmond Halley helped bring the manuscript through publication; Newton's work built on earlier investigations and correspondence.",people:"Isaac Newton; Edmond Halley; earlier contributors including Robert Hooke and many others.",certainty:"Publication year is documented; the development of the ideas predates publication.",sources:[{label:"The Royal Society — Principia",url:"https://royalsociety.org/blog/2014/07/principia/"},{label:"The Royal Society — history",url:"https://royalsociety.org/about-us/who-we-are/history/"}]},
    {id:"periodic-table",year:1869,date:"1869 CE",title:"Mendeleev announces a periodic system",field:"Chemistry",place:"Saint Petersburg, Russian Empire",summary:"Dmitri Mendeleev formulated and published a periodic arrangement of the known elements, leaving gaps and predicting properties of elements not yet discovered. Earlier chemists had also identified patterns and proposed classifications.",people:"Dmitri Mendeleev, alongside earlier and contemporary contributors including Lavoisier, Döbereiner, Newlands, Odling, and Lothar Meyer.",certainty:"The Royal Society of Chemistry dates Mendeleev's discovery to February 1869 and notes the preceding work.",sources:[{label:"Royal Society of Chemistry — Development of the periodic table",url:"https://periodic-table.rsc.org/history/about"},{label:"Royal Society of Chemistry — Finding the periodic table",url:"https://www.rsc.org/news/2019/january/finding-the-periodic-table"}]}
  ];
  function validate(items) {
    if (!Array.isArray(items)) throw new TypeError("Timeline entries must be an array.");
    const ids = new Set();
    for (const item of items) {
      if (!item || typeof item.id !== "string" || ids.has(item.id)) throw new Error("Each timeline entry needs a unique id.");
      ids.add(item.id);
      if (!Number.isInteger(item.year)) throw new Error("Each timeline entry needs an integer year (BCE years are negative).");
      if (!item.date || !item.title || !item.summary || !Array.isArray(item.sources) || !item.sources.length) throw new Error("Each timeline entry needs a date, title, summary, and at least one source.");
      for (const source of item.sources) {
        const u = new URL(source.url);
        if (u.protocol !== "https:") throw new Error("Timeline sources must use HTTPS.");
      }
    }
    return true;
  }
  function sortEntries(items) { return [...items].sort((a,b) => a.year-b.year || a.title.localeCompare(b.title)); }
  function render(root, items, query, field) {
    const q = (query || "").trim().toLowerCase();
    const filtered = sortEntries(items).filter(e => (!field || field === "all" || e.field === field) && (!q || [e.title,e.date,e.field,e.place,e.summary,e.people].join(" ").toLowerCase().includes(q)));
    root.replaceChildren();
    if (!filtered.length) { const p=document.createElement("p");p.className="empty-state";p.textContent="No timeline entries match that search.";root.append(p);return; }
    filtered.forEach(e => {
      const card=document.createElement("article");card.className="card timeline-card";
      const date=document.createElement("p");date.className="eyebrow";date.textContent=e.date+" · "+e.field;
      const h=document.createElement("h3");h.textContent=e.title;
      const place=document.createElement("p");place.className="timeline-place";place.textContent="Place: "+e.place;
      const summary=document.createElement("p");summary.textContent=e.summary;
      const people=document.createElement("p");people.textContent="People and contributions: "+e.people;
      const certainty=document.createElement("p");certainty.className="notice";certainty.textContent="Date and context: "+e.certainty;
      const sources=document.createElement("div");sources.className="source-list";
      const strong=document.createElement("strong");strong.textContent="Sources";sources.append(strong);
      e.sources.forEach(s=>{const a=document.createElement("a");a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=s.label;sources.append(a)});
      card.append(date,h,place,summary,people,certainty,sources);root.append(card);
    });
  }
  validate(entries);
  if (typeof document !== "undefined") {
    const root=document.getElementById("knowledge-timeline");
    if (root) {
      const search=document.getElementById("timeline-search"),filter=document.getElementById("timeline-field");
      const update=()=>render(root,entries,search.value,filter.value);
      search.addEventListener("input",update);filter.addEventListener("change",update);update();
    }
  }
  if (typeof module !== "undefined" && module.exports) module.exports={entries,validate,sortEntries};
})();