(function(){
"use strict";
const $=s=>document.querySelector(s);
const canvas=$("#physics-canvas"),ctx=canvas.getContext("2d");
const mode=$("#physics-mode"),freq=$("#physics-frequency"),amp=$("#physics-amplitude"),harm=$("#physics-harmonics"),shape=$("#physics-shape"),material=$("#physics-material");
const materials={
"air":{name:"Air (reference medium)",density:1.2,speed:343,impedance:412},
"water":{name:"Water (reference medium)",density:998,speed:1480,impedance:1477000},
"aluminum":{name:"Aluminum (illustrative solid)",density:2700,speed:6320,impedance:17064000},
"steel":{name:"Steel (illustrative solid)",density:7850,speed:5960,impedance:46786000}
};
let phase=0,raf=0;
function draw(){
 const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,f=Number(freq.value),a=Number(amp.value),n=Number(harm.value),m=materials[material.value];
 ctx.clearRect(0,0,w,h);ctx.fillStyle="#091322";ctx.fillRect(0,0,w,h);
 ctx.strokeStyle="#31445f";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(w,cy);ctx.stroke();
 ctx.strokeStyle="#75e3c2";ctx.lineWidth=2.5;ctx.beginPath();
 for(let x=0;x<=w;x+=2){let t=x/w*Math.PI*8;let y=0;
 if(mode.value==="quantum"){
   const z=(x-w/2)/(w*.12),psi=Math.exp(-z*z/2);y=psi*psi*150;
 }else if(mode.value==="quadratic"){const z=(x-w/2)/(w/2);y=(z*z-.35)*a*170;}
 else if(mode.value==="transducer"){
   const z=x/w*2-1;const aperture=shape.value==="wide"?1:shape.value==="narrow"?.48:Math.max(.12,1-Math.abs(z));
   y=Math.sin(t*f+phase)*a*aperture*130;
 }else{
   for(let k=1;k<=n;k++)y+=Math.sin(t*f*k+phase*k)/k;
   y=y/(n?Array.from({length:n},(_,i)=>1/(i+1)).reduce((p,v)=>p+v,0):1)*a*150;
 }
 const py=cy-y;x===0?ctx.moveTo(x,py):ctx.lineTo(x,py);
 }ctx.stroke();
 ctx.fillStyle="#a6b5ca";ctx.font="14px system-ui";ctx.fillText(mode.value==="quantum"?"Illustrative probability-density profile":mode.value==="quadratic"?"y = x² − 0.35 (scaled)":mode.value==="transducer"?"Illustrative aperture-weighted acoustic waveform":"Harmonic partial-sum waveform",16,24);
}
function update(){
 const f=Number(freq.value),a=Number(amp.value),n=Number(harm.value),m=materials[material.value];
 $("#physics-frequency-value").textContent=f.toFixed(0)+" Hz";
 $("#physics-amplitude-value").textContent=a.toFixed(2);
 $("#physics-harmonics-value").textContent=n;
 const wavelength=m.speed/f;
 $("#physics-wavelength").textContent=wavelength>=1?wavelength.toFixed(3)+" m":(wavelength*1000).toFixed(1)+" mm";
 $("#physics-quarter").textContent=(wavelength/4>=1?(wavelength/4).toFixed(3)+" m":(wavelength/4*1000).toFixed(1)+" mm");
 $("#physics-impedance").textContent=m.impedance.toLocaleString()+" kg/(m²·s)";
 $("#physics-material-note").textContent=m.name+"; density "+m.density.toLocaleString()+" kg/m³; assumed wave speed "+m.speed.toLocaleString()+" m/s.";
 $("#physics-description").textContent=mode.value==="quantum"?"A dimensionless ground-state harmonic-oscillator probability-density shape. It is a mathematical illustration, not a device-scale transducer model.":mode.value==="quadratic"?"Explore a quadratic curve and how its shape changes with amplitude. This is a mathematical visualization.":mode.value==="transducer"?"A simplified aperture-weighted waveform. Geometry changes the plotted envelope; this is not a validated acoustic-field solver.": "A Fourier-style sum of harmonic components. Change the number of partials to see how the waveform changes.";
 draw();
}
[mode,freq,amp,harm,shape,material].forEach(el=>el.addEventListener("input",update));
$("#physics-play").addEventListener("click",()=>{if(raf){cancelAnimationFrame(raf);raf=0;$("#physics-play").textContent="Animate";return;}$("#physics-play").textContent="Pause";const tick=()=>{phase+=.035;draw();raf=requestAnimationFrame(tick);};tick();});
$("#physics-save").addEventListener("click",()=>{try{const key="maker-arcade-saved-v1",items=JSON.parse(localStorage.getItem(key)||"[]");items.unshift({id:Date.now()+"-"+Math.random().toString(36).slice(2),title:"Physics & Signals · "+mode.selectedOptions[0].text,summary:"Frequency "+freq.value+" Hz; "+nSummary()+" harmonics; "+materials[material.value].name,savedAt:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(items.slice(0,100)));$("#status").textContent="Physics & Signals settings saved locally.";$("#saved-count").textContent=String(Math.min(items.length,100));}catch(e){$("#status").textContent="Could not save; local storage may be unavailable."; }});
function nSummary(){return harm.value;}
$("#physics-export").addEventListener("click",()=>{const link=document.createElement("a");link.download="maker-arcade-physics-signal.png";link.href=canvas.toDataURL("image/png");link.click();});
update();
})();