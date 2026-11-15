(function(){
"use strict";
const places=[
{id:"writing-sumer",name:"Southern Mesopotamia",country:"Present-day Iraq",lat:31.3,lon:45.6,event:"Early written records in Sumer",precision:"Regional location; approximate coordinates."},
{id:"gutenberg",name:"Mainz",country:"Present-day Germany",lat:50.0,lon:8.27,event:"Movable-type printing in Europe",precision:"City-level location."},
{id:"principia",name:"London",country:"England",lat:51.5072,lon:-0.1276,event:"Newton's Principia published",precision:"City-level location."},
{id:"periodic-table",name:"Saint Petersburg",country:"Russia",lat:59.9343,lon:30.3351,event:"Mendeleev's periodic system",precision:"City-level location."}
];
function project(lat,lon,w=720,h=360){return{x:(lon+180)/360*w,y:(90-lat)/180*h}}
function render(){
const svg=document.getElementById("history-map"),list=document.getElementById("history-place-list");
if(!svg||!list)return;
svg.replaceChildren();list.replaceChildren();
const ns="http://www.w3.org/2000/svg";
const make=(tag,attrs)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,String(v)));return el};
svg.setAttribute("viewBox","0 0 720 360");svg.setAttribute("role","img");svg.setAttribute("aria-label","Schematic world coordinate grid with markers for four historical locations. It is not a geographic basemap.");
for(let lat=-60;lat<=60;lat+=30){const y=project(lat,0).y;svg.append(make("line",{x1:0,y1:y,x2:720,y2:y,class:"map-grid"}))}
for(let lon=-180;lon<=180;lon+=60){const x=project(0,lon).x;svg.append(make("line",{x1:x,y1:0,x2:x,y2:360,class:"map-grid"}))}
places.forEach(p=>{
const xy=project(p.lat,p.lon),g=make("g",{class:"map-point",tabindex:"0",role:"button","aria-label":p.name+", "+p.country+": "+p.event});
const circle=make("circle",{cx:xy.x,cy:xy.y,r:8});const title=make("title");title.textContent=p.name+" — "+p.event;circle.append(title);g.append(circle);
const label=make("text",{x:xy.x+11,y:xy.y-9});label.textContent=p.name;g.append(label);
const activate=()=>{document.querySelectorAll(".place-card").forEach(c=>c.classList.toggle("selected",c.dataset.id===p.id));const card=list.querySelector('[data-id="'+p.id+'"]');if(card)card.scrollIntoView({behavior:"smooth",block:"nearest"})};
g.addEventListener("click",activate);g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate()}});svg.append(g);
const card=document.createElement("article");card.className="card place-card";card.dataset.id=p.id;
const h=document.createElement("h3");h.textContent=p.name+" — "+p.country;
const ev=document.createElement("p");ev.textContent=p.event;
const detail=document.createElement("p");detail.className="draft-meta";detail.textContent=p.precision+" Coordinates: "+p.lat.toFixed(3)+", "+p.lon.toFixed(3)+".";
card.append(h,ev,detail);list.append(card);
});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render);else render();
if(typeof module!=="undefined"&&module.exports)module.exports={places,project};
})();