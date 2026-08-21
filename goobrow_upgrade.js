const fs=require("fs");

let s=fs.readFileSync("server.js","utf8");

if(!s.includes('app.get("/api/images"')){
const routes=`
app.get("/api/images",async(req,res)=>{
 const q=String(req.query.q||"").trim();
 if(!q)return res.json({images:[]});
 try{
  const u="https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch="+encodeURIComponent(q)+"&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*";
  const r=await fetch(u);
  const d=await r.json();
  const pages=d.query&&d.query.pages?Object.values(d.query.pages):[];
  const images=pages.map(p=>{
   const i=p.imageinfo&&p.imageinfo[0];
   if(!i||!i.thumburl)return null;
   return {title:String(p.title||"").replace(/^File:/,""),image:i.thumburl,source:i.url||i.thumburl};
  }).filter(Boolean);
  res.json({engine:"Goobrow",query:q,images});
 }catch(e){
  console.error("Image search:",e.message);
  res.json({engine:"Goobrow",query:q,images:[]});
 }
});

app.get("/api/news",async(req,res)=>{
 const q=String(req.query.q||"latest news").trim();
 try{
  const u="https://news.google.com/rss/search?q="+encodeURIComponent(q)+"&hl=en-NG&gl=NG&ceid=NG:en";
  const r=await fetch(u);
  const xml=await r.text();
  const results=[];
  xml.split("<item>").slice(1,13).forEach(x=>{
   const get=t=>(x.match(new RegExp("<"+t+">([\\\\s\\\\S]*?)</"+t+">","i"))||["",""])[1]
    .replace(/<!\\\\[CDATA\\\\[/g,"").replace(/\\\\]\\\\]>/g,"").trim();
   const title=get("title"),url=get("link"),date=get("pubDate");
   if(title&&url)results.push({title,url,date});
  });
  res.json({engine:"Goobrow",query:q,results});
 }catch(e){
  console.error("News search:",e.message);
  res.json({engine:"Goobrow",query:q,results:[]});
 }
});

`;

const marker='app.listen(PORT,()=>{';
if(s.includes(marker))s=s.replace(marker,routes+marker);
else{
 const marker2='app.listen(PORT, () => {';
 if(s.includes(marker2))s=s.replace(marker2,routes+marker2);
 else{
  console.error("Could not find app.listen");
  process.exit(1);
 }
}
fs.writeFileSync("server.js",s);
}

let h=fs.readFileSync("www/index.html","utf8");

if(!h.includes("Goobrow Menu")){
h=h.replace("</body>",`
<div id="goobrowMenu" style="position:fixed;top:0;left:-280px;width:280px;height:100%;background:#fff;box-shadow:2px 0 15px #999;z-index:9999;padding:70px 25px;font-family:Arial;transition:.25s">
<h2>Goobrow Menu</h2>
<a href="index.html" style="display:block;padding:18px 0;color:#222;text-decoration:none">🏠 Home</a>
<a href="results.html?q=&mode=web" style="display:block;padding:18px 0;color:#222;text-decoration:none">🔎 Web Search</a>
<a href="results.html?q=&mode=images" style="display:block;padding:18px 0;color:#222;text-decoration:none">🖼️ Images</a>
<a href="results.html?q=&mode=news" style="display:block;padding:18px 0;color:#222;text-decoration:none">📰 News</a>
<hr>
<h3>Extensions</h3>
<a href="#" style="display:block;padding:18px 0;color:#555;text-decoration:none">🧩 Extensions</a>
<a href="#" style="display:block;padding:18px 0;color:#555;text-decoration:none">⚙️ Settings</a>
</div>
<button id="menuButton" style="position:fixed;top:15px;left:15px;z-index:10000;border:0;background:#fff;font-size:25px;border-radius:50%;width:45px;height:45px;box-shadow:0 2px 8px #bbb">☰</button>
<script>
document.getElementById("menuButton").onclick=function(){
 const m=document.getElementById("goobrowMenu");
 m.style.left=m.style.left==="0px"?"-280px":"0px";
};
</script>
</body>`);
fs.writeFileSync("www/index.html",h);
}

let r=fs.readFileSync("www/results.html","utf8");

r=r.replace("</body>",`
<script>
const oldInput=document.getElementById("searchInput");
const oldResults=document.getElementById("results");
const p=new URLSearchParams(location.search);
const q=p.get("q")||"";
const mode=p.get("mode")||"web";

if(oldInput)oldInput.value=q;

function escapeHtml(x){
 const d=document.createElement("div");
 d.textContent=String(x||"");
 return d.innerHTML;
}

async function goobrowImages(){
 try{
  const response=await fetch("http://localhost:3001/api/images?q="+encodeURIComponent(q));
  const data=await response.json();
  oldResults.innerHTML="";
  if(!data.images||!data.images.length){
   oldResults.innerHTML="<p>No images found for <b>"+escapeHtml(q)+"</b>.</p>";
   return;
  }
  const grid=document.createElement("div");
  grid.className="images";
  grid.style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;width:100%";
  data.images.forEach(im=>{
   const card=document.createElement("div");
   card.style="border:1px solid #eee;border-radius:10px;overflow:hidden;background:#fff";
   card.innerHTML='<a href="'+escapeHtml(im.source)+'" target="_blank"><img src="'+escapeHtml(im.image)+'" loading="lazy" style="width:100%;height:180px;object-fit:cover;display:block"></a><div style="padding:8px;font-size:13px">'+escapeHtml(im.title)+'</div>';
   grid.appendChild(card);
  });
  oldResults.appendChild(grid);
 }catch(e){
  oldResults.innerHTML="<p>Goobrow image search is unavailable.</p>";
 }
}

async function goobrowNews(){
 try{
  const response=await fetch("http://localhost:3001/api/news?q="+encodeURIComponent(q));
  const data=await response.json();
  oldResults.innerHTML="";
  if(!data.results||!data.results.length){
   oldResults.innerHTML="<p>No news found.</p>";
   return;
  }
  data.results.forEach(n=>{
   const item=document.createElement("div");
   item.style="display:flex;gap:15px;margin-bottom:25px;padding-bottom:20px;border-bottom:1px solid #eee";
   item.innerHTML='<div style="width:120px;height:80px;background:#eee;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:30px">📰</div><div><h2 style="margin:0 0 8px;font-size:19px"><a href="'+escapeHtml(n.url)+'" target="_blank" style="color:#1a0dab;text-decoration:none">'+escapeHtml(n.title)+'</a></h2><small>'+escapeHtml(n.date)+'</small></div>';
   oldResults.appendChild(item);
  });
 }catch(e){
  oldResults.innerHTML="<p>Goobrow news is unavailable.</p>";
 }
}

if(q&&mode==="images")goobrowImages();
if(q&&mode==="news")goobrowNews();
</script>
</body>`);

r=r.replace("</head>",`
<style>
.images img{transition:.2s}
.images img:hover{transform:scale(1.03)}
@media(max-width:700px){
 .images{grid-template-columns:repeat(2,1fr)!important}
}
</style>
</head>`);

fs.writeFileSync("www/results.html",r);

console.log("GOOBROW UPGRADE COMPLETE");
