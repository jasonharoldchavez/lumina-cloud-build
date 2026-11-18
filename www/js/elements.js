(function(){
"use strict";
const elements=typeof module!=="undefined"&&module.exports?require("./elements-data.js"):window.LIVING_ATLAS_ELEMENTS;
function validate(items){
 if(!Array.isArray(items)||items.length!==118)throw new Error("Element data must contain all 118 confirmed elements.");
 const ids=new Set();
 for(const e of items){
  if(!Number.isInteger(e.z)||e.z<1||e.z>118||ids.has(e.z))throw new Error("Atomic numbers must be unique integers from 1 to 118.");
  ids.add(e.z);
  for(const k of ["s","name","category","phase"])if(typeof e[k]!=="string"||!e[k].trim())throw new Error("Missing "+k+" for element "+e.z);
  for(const k of ["atomicMass","densityGcm3","meltingK","boilingK","mohsHardness","magneticSusceptibilityVolume","electricalConductivitySm","thermalConductivityWmK","electronegativityPauling","yearDiscovered"]){
   if(e[k]!==null&&e[k]!==undefined&&typeof e[k]!=="number")throw new Error("Invalid "+k+" for element "+e.z);
   if(typeof e[k]==="number"&&!Number.isFinite(e[k]))throw new Error("Non-finite "+k+" for element "+e.z);
  }
 }
 for(let z=1;z<=118;z++)if(!ids.has(z))throw new Error("Missing atomic number "+z+".");
 return true;
}
const display=(v,unit)=>v===null||v===undefined?"Not available in the selected data source":String(v)+(unit?" "+unit:"");
function yearLabel(v){if(v===null||v===undefined)return "Not available";if(v==="Ancient")return "Known since antiquity";if(v<0)return "Approximately "+Math.abs(v)+" BCE (source estimate)";return v+" CE"}
function render(){
 const grid=document.getElementById("element-grid"),detail=document.getElementById("element-detail"),
 search=document.getElementById("element-search"),filter=document.getElementById("element-category");
 if(!grid||!detail||!search)return;
 if(filter&&filter.options.length===1){[...new Set(elements.map(e=>e.category).filter(Boolean))].sort().forEach(category=>{const option=document.createElement("option");option.value=category;option.textContent=category.replace(/-/g," ");filter.append(option)})}
 const q=search.value.trim().toLowerCase(),cat=filter?filter.value:"all";
 const filtered=elements.filter(e=>(cat==="all"||e.category===cat)&&[e.name,e.s,e.category,String(e.z),e.discoveredBy||"",e.discoveryLocation||""].join(" ").toLowerCase().includes(q));
 grid.replaceChildren();
 filtered.forEach(e=>{
  const b=document.createElement("button");b.type="button";b.className="element-tile";b.setAttribute("aria-label",e.name+", atomic number "+e.z);
  const z=document.createElement("small");z.textContent=e.z;
  const sym=document.createElement("strong");sym.textContent=e.s;
  const n=document.createElement("span");n.textContent=e.name;
  const group=document.createElement("small");group.textContent=e.category;
  b.append(z,sym,n,group);b.addEventListener("click",()=>show(e));grid.append(b);
 });
 const count=document.getElementById("element-count");
 if(count)count.textContent=filtered.length+" of 118 elements";
 if(!filtered.length){const p=document.createElement("p");p.textContent="No matching elements.";grid.append(p)}
 if(!filtered.includes(elements.find(e=>e.z===Number(detail.dataset.selected))))show(filtered[0]||null);
}
function show(e){
 const root=document.getElementById("element-detail");if(!root)return;root.replaceChildren();
 if(!e){root.textContent="Select an element to inspect its properties.";delete root.dataset.selected;return}
 root.dataset.selected=String(e.z);
 const h=document.createElement("h3");h.textContent=e.name+" ("+e.s+")";
 const sub=document.createElement("p");sub.className="eyebrow";sub.textContent="Atomic number "+e.z+" · "+e.category+" · "+e.phase+" · Period "+(e.period??"unknown")+" · Group "+(e.group??"unknown");root.append(h,sub);
 const fields=[
 ["Atomic mass",display(e.atomicMass,"u")],["Density",display(e.densityGcm3,"g/cm³")],
 ["Mohs hardness",display(e.mohsHardness,"Mohs")],["Magnetic behavior",e.magneticType||"Not available in the selected data source"],
 ["Electrical type",e.electricalType||"Not available in the selected data source"],
 ["Electrical conductivity",display(e.electricalConductivitySm,"S/m")],
 ["Thermal conductivity",display(e.thermalConductivityWmK,"W/(m·K)")],
 ["Melting point",display(e.meltingK,"K")],["Boiling point",display(e.boilingK,"K")],
 ["Electron configuration",e.electronConfiguration||"Not available"],
 ["Pauling electronegativity",display(e.electronegativityPauling,"")],
 ["Discovery attributed to",e.discoveredBy||"No individual discoverer attributed in the source"],
 ["Discovery location",e.discoveryLocation||"Not available"],
 ["Discovery year",yearLabel(e.yearDiscovered)]
 ];
 fields.forEach(([label,value])=>{const p=document.createElement("p");const b=document.createElement("strong");b.textContent=label+": ";p.append(b,document.createTextNode(value));root.append(p)});
 if(e.z>=104){const note=document.createElement("p");note.className="notice";note.textContent="For superheavy elements (atomic number 104 and above), many physical properties are theoretical predictions rather than direct measurements. Treat listed values accordingly.";root.append(note)}
 if(e.referenceUrl){const a=document.createElement("a");a.href=e.referenceUrl;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Open general element reference";root.append(a)}
 const source=document.createElement("p");source.className="draft-meta";source.textContent="Dataset attribution: see data/ELEMENT-DATA-ATTRIBUTION.md. Missing data is not inferred.";root.append(source);
}
validate(elements);
if(typeof document!=="undefined"){
 const init=()=>{const search=document.getElementById("element-search"),filter=document.getElementById("element-category");if(search){search.addEventListener("input",render);if(filter)filter.addEventListener("change",render);render();show(elements[0])}};
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
}
if(typeof module!=="undefined"&&module.exports)module.exports={elements,validate,yearLabel};
})();