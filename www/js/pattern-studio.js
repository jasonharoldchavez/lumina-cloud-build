(function () {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const canvas = () => $("#design-canvas");
  let seed = 17;
  const palettes = [
    ["#75e3c2","#9aaeff","#f4c879","#f08eb2"],
    ["#8bd5ff","#b8a1ff","#f5a6d8","#f7d794"],
    ["#a5e6a1","#65c8c0","#f1d27a","#f39b83"],
    ["#f7a8a8","#f5d18c","#a8c8ff","#c6a8f5"]
  ];
  function rand(n) { const x=Math.sin(seed++ * 127.1)*43758.5453; return (x-Math.floor(x))*n; }
  function draw() {
    const c=canvas(); if(!c) return;
    const ctx=c.getContext("2d"), w=c.width, h=c.height, cx=w/2, cy=h/2;
    const kind=$("#design-kind").value, complexity=Number($("#design-complexity").value), scale=Number($("#design-scale").value);
    const colors=palettes[Number($("#design-palette").value)];
    ctx.clearRect(0,0,w,h); ctx.fillStyle="#091322"; ctx.fillRect(0,0,w,h);
    ctx.lineCap="round"; ctx.lineJoin="round";
    const stroke=(i)=>colors[i%colors.length];
    if(kind==="mandala" || kind==="rosette") {
      const layers=complexity, petals=kind==="mandala"?8+complexity*2:6+complexity;
      for(let l=layers;l>0;l--){ const r=(Math.min(w,h)*.43)*(l/layers)*scale;
        for(let i=0;i<petals;i++){ const a=i*Math.PI*2/petals+(l%2)*Math.PI/petals;
          ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.strokeStyle=stroke(i+l);ctx.lineWidth=1.5+(layers-l)*.25;
          ctx.beginPath();ctx.ellipse(r*.55,0,r*.45,Math.max(5,r*.22),0,0,Math.PI*2);ctx.stroke();
          ctx.beginPath();ctx.arc(0,0,r*.16,0,Math.PI*2);ctx.stroke();ctx.restore();
        }
      }
      ctx.fillStyle=stroke(0);ctx.beginPath();ctx.arc(cx,cy,5+complexity,0,Math.PI*2);ctx.fill();
    } else if(kind==="tessellation") {
      const size=24+scale*18, rows=Math.ceil(h/size)+2, cols=Math.ceil(w/size)+2;
      for(let y=-1;y<rows;y++)for(let x=-1;x<cols;x++){const px=x*size+(y%2)*size/2,py=y*size;
        ctx.fillStyle=stroke((x+y+Math.floor(rand(2)))%4);ctx.globalAlpha=.12;
        ctx.beginPath();ctx.moveTo(px+size/2,py);ctx.lineTo(px+size,py+size/2);ctx.lineTo(px+size/2,py+size);ctx.lineTo(px,py+size/2);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
        ctx.strokeStyle=stroke(0);ctx.lineWidth=1;ctx.stroke();
      }
    } else if(kind==="spiral") {
      for(let arm=0;arm<Math.max(2,complexity);arm++){ctx.beginPath();ctx.strokeStyle=stroke(arm);ctx.lineWidth=2;
        for(let t=0;t<Math.PI*8;t+=.035){const r=t*scale*2.3,x=cx+Math.cos(t+arm*2*Math.PI/complexity)*r,y=cy+Math.sin(t+arm*2*Math.PI/complexity)*r;t===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
    } else if(kind==="fractal") {
      function branch(x,y,len,angle,depth){if(depth<=0||len<2)return;const nx=x+Math.cos(angle)*len,ny=y+Math.sin(angle)*len;
        ctx.strokeStyle=stroke(depth);ctx.lineWidth=Math.max(1,depth*.55);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(nx,ny);ctx.stroke();
        branch(nx,ny,len*.69,angle-.48,depth-1);branch(nx,ny,len*.69,angle+.48,depth-1);}
      branch(cx,h-18,Math.min(h*.28,w*.24)*scale,-Math.PI/2,Math.min(10,complexity+3));
    } else if(kind==="orbit") {
      for(let i=1;i<=complexity+2;i++){ctx.save();ctx.translate(cx,cy);ctx.rotate(i*.37);ctx.strokeStyle=stroke(i);ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(0,0,35+i*25*scale,16+i*13*scale,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle=stroke(i);ctx.beginPath();ctx.arc(35+i*25*scale,0,3+i%3,0,Math.PI*2);ctx.fill();ctx.restore();}
      ctx.fillStyle="#fff1b8";ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();
    } else if(kind==="interference") {
      for(let y=0;y<h;y+=3){ctx.beginPath();for(let x=0;x<=w;x+=3){const a=Math.sin(x*.035*scale+seed*.01)+Math.sin(y*.045*scale+x*.012);const yy=y+a*complexity*2.4;x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.strokeStyle=stroke(Math.floor(y/12));ctx.globalAlpha=.65;ctx.stroke();ctx.globalAlpha=1;}
    } else {
      const step=24+scale*16;
      for(let y=step/2;y<h;y+=step)for(let x=step/2;x<w;x+=step){const r=4+rand(step*.35);ctx.strokeStyle=stroke(Math.floor(rand(4)));ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(x-r*1.8,y);ctx.lineTo(x+r*1.8,y);ctx.moveTo(x,y-r*1.8);ctx.lineTo(x,y+r*1.8);ctx.stroke();}
    }
    $("#complexity-value").textContent=String(complexity);$("#scale-value").textContent=scale.toFixed(1)+"×";
  }
  function init(){
    if(!canvas())return;
    ["#design-kind","#design-complexity","#design-scale","#design-palette"].forEach(s=>$(s).addEventListener("input",draw));
    $("#random-design").addEventListener("click",()=>{seed=Math.floor(Math.random()*100000);$("#design-kind").selectedIndex=Math.floor(Math.random()*$("#design-kind").options.length);$("#design-palette").selectedIndex=Math.floor(Math.random()*4);draw();});
    $("#download-design").addEventListener("click",()=>{const a=document.createElement("a");a.download="maker-arcade-design.png";a.href=canvas().toDataURL("image/png");a.click();});
    $("#save-design").addEventListener("click",()=>{try{const key="maker-arcade-saved-v1",items=JSON.parse(localStorage.getItem(key)||"[]");items.unshift({id:Date.now()+"-"+Math.random().toString(36).slice(2),title:"Pattern Studio · "+$("#design-kind").selectedOptions[0].text,summary:"Complexity "+$("#design-complexity").value+", scale "+$("#design-scale").value+"×, palette "+(Number($("#design-palette").value)+1),savedAt:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(items.slice(0,100)));$("#status").textContent="Design saved in your local notebook.";$("#saved-count").textContent=String(Math.min(items.length,100));}catch(_){$("#status").textContent="Could not save this design; device storage may be unavailable."; }});
    draw();
  }
  document.addEventListener("DOMContentLoaded",init);
})();