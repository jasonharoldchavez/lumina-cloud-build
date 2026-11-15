const test=require("node:test");const assert=require("node:assert/strict");const {elements,validate}=require("../www/js/elements.js");
test("element starter collection has unique valid atomic numbers and complete labels",()=>{assert.equal(validate(elements),true);assert.equal(new Set(elements.map(e=>e.z)).size,elements.length)});
test("element records explicitly label key physical properties",()=>{for(const e of elements){assert.ok(e.density);assert.ok(e.hardness);assert.ok(e.magnetism);assert.ok(e.conductivity)}});
test("element validation rejects duplicate atomic numbers",()=>{assert.throws(()=>validate([elements[0],{...elements[0]}]),/unique/)});
