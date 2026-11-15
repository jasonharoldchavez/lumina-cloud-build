const test=require("node:test");
const assert=require("node:assert/strict");
const {places,project}=require("../www/js/geography.js");
test("historical places have unique ids and valid coordinates",()=>{
 assert.equal(new Set(places.map(p=>p.id)).size,places.length);
 for(const p of places){assert.ok(p.lat>=-90&&p.lat<=90);assert.ok(p.lon>=-180&&p.lon<=180)}
});
test("schematic projection maps geographic bounds to SVG bounds",()=>{
 assert.deepEqual(project(90,-180),{x:0,y:0});
 assert.deepEqual(project(-90,180),{x:720,y:360});
 assert.deepEqual(project(0,0),{x:360,y:180});
});
test("every timeline place is represented by a matching historical place id",()=>{
 const {entries}=require("../www/js/timeline.js");
 const ids=new Set(places.map(p=>p.id));
 for(const e of entries)assert.ok(ids.has(e.id),"Missing map location for "+e.id);
});
