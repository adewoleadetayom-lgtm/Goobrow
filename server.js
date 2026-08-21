const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static("www"));

app.get("/api/suggestions", (req, res) => {
  const query = String(req.query.q || "")
    .trim()
    .toLowerCase();

  if (!query) {
    return res.json({
      suggestions: []
    });
  }

  const indexFile = path.join(
    __dirname,
    "data",
    "index.json"
  );

  let index = [];

  try {
    if (fs.existsSync(indexFile)) {
      index = JSON.parse(
        fs.readFileSync(indexFile, "utf8")
      );
    }
  } catch (error) {
    console.error(
      "Could not read Goobrow index:",
      error.message
    );
  }

  const suggestions = [];

  for (const page of index) {
    const title = String(page.title || "").trim();
    const url = String(page.url || "").trim();

    if (
      title.toLowerCase().includes(query) &&
      title
    ) {
      suggestions.push(title);
    }

    if (
      url.toLowerCase().includes(query) &&
      url
    ) {
      suggestions.push(url);
    }
  }

  const unique = [
    ...new Set(suggestions)
  ].slice(0, 8);

  res.json({
    suggestions: unique
  });
});

app.get("/api/search", (req, res) => {
  const query = String(req.query.q || "").trim();

  if (!query) {
    return res.status(400).json({
      error: "Please enter a search query."
    });
  }

  const indexFile = path.join(__dirname, "data", "index.json");
  let index = [];

  try {
    if (fs.existsSync(indexFile)) {
      index = JSON.parse(fs.readFileSync(indexFile, "utf8"));
    }
  } catch (error) {
    console.error("Could not read Goobrow index:", error.message);
  }

  const normalizedQuery = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = normalizedQuery
    .split(" ")
    .filter(word => word.length > 1);

  const pageNumber = Math.max(
    1,
    parseInt(req.query.page || "1", 10) || 1
  );

  const pageSize = 10;

  const rankedResults = index
    .map((page) => {
      const title = String(page.title || "");
      const text = String(page.text || "");
      const url = String(page.url || "");

      const titleLower = title.toLowerCase();
      const textLower = text.toLowerCase();
      const urlLower = url.toLowerCase();

      let score = 0;

      // Strong match for the complete search phrase.
      if (titleLower.includes(normalizedQuery)) {
        score += 40;
      }

      if (textLower.includes(normalizedQuery)) {
        score += 20;
      }

      if (urlLower.includes(normalizedQuery)) {
        score += 15;
      }

      // Score individual search words.
      for (const word of words) {
        if (titleLower.includes(word)) {
          score += 12;
        }

        if (textLower.includes(word)) {
          score += 4;
        }

        if (urlLower.includes(word)) {
          score += 3;
        }
      }

      // Small bonus for pages matching every word.
      const matchesEveryWord = words.length > 0 &&
        words.every(word =>
          titleLower.includes(word) ||
          textLower.includes(word) ||
          urlLower.includes(word)
        );

      if (matchesEveryWord) {
        score += 25;
      }

      return {
        page,
        score
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const totalResults = rankedResults.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalResults / pageSize)
  );

  const safePage = Math.min(pageNumber, totalPages);

  const results = rankedResults
    .slice(
      (safePage - 1) * pageSize,
      safePage * pageSize
    )
    .map(item => ({
      title: item.page.title,
      url: item.page.url,
      description: String(item.page.text || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 300)
    }));

  res.json({
    engine: "Goobrow",
    query,
    totalResults,
    page: safePage,
    pageSize,
    totalPages,
    results
  });
});;;;




async function goobrowFetchImage(url){
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),7000);
    const response=await fetch(url,{
      signal:controller.signal,
      headers:{
        "User-Agent":"Mozilla/5.0 (GoobrowBot/1.0)"
      }
    });
    clearTimeout(timer);

    if(!response.ok)return null;

    const html=await response.text();

    const patterns=[
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
    ];

    for(const pattern of patterns){
      const match=html.match(pattern);
      if(match&&match[1]){
        try{
          return new URL(match[1],url).href;
        }catch{}
      }
    }
  }catch{}
  return null;
}

app.get("/api/images", async (req,res)=>{
  const query=String(req.query.q||"").trim().toLowerCase();
  const pageNumber=Math.max(1,parseInt(req.query.page||"1",10)||1);
  const pageSize=12;

  if(!query){
    return res.json({
      engine:"Goobrow Images",
      query:"",
      totalResults:0,
      page:1,
      totalPages:0,
      results:[]
    });
  }

  const indexFile=path.join(__dirname,"data","index.json");
  let index=[];

  try{
    if(fs.existsSync(indexFile)){
      index=JSON.parse(fs.readFileSync(indexFile,"utf8"));
    }
  }catch(error){
    console.error("Could not read image index:",error.message);
  }

  const words=query.split(/\s+/).filter(w=>w.length>1);

  const candidates=index.map(page=>{
    const title=String(page.title||"");
    const text=String(page.text||"");
    const url=String(page.url||"");

    const tl=title.toLowerCase();
    const xl=text.toLowerCase();
    const ul=url.toLowerCase();

    let score=0;

    if(tl.includes(query))score+=40;
    if(xl.includes(query))score+=20;
    if(ul.includes(query))score+=10;

    for(const word of words){
      if(tl.includes(word))score+=12;
      if(xl.includes(word))score+=4;
      if(ul.includes(word))score+=2;
    }

    return {page,score};
  })
  .filter(x=>x.score>0)
  .sort((a,b)=>b.score-a.score)
  .slice(0,40);

  const results=[];

  for(const item of candidates){
    if(results.length>=40)break;

    const image=await goobrowFetchImage(item.page.url);

    if(image){
      results.push({
        title:item.page.title,
        url:item.page.url,
        image,
        description:String(item.page.text||"")
          .replace(/\s+/g," ")
          .trim()
          .slice(0,220)
      });
    }
  }

  const totalResults=results.length;
  const totalPages=Math.max(1,Math.ceil(totalResults/pageSize));
  const safePage=Math.min(pageNumber,totalPages);
  const start=(safePage-1)*pageSize;

  res.json({
    engine:"Goobrow Images",
    query,
    totalResults,
    page:safePage,
    pageSize,
    totalPages,
    results:results.slice(start,start+pageSize)
  });
});

app.get("/api/page-image",async(req,res)=>{
  const url=String(req.query.url||"").trim();

  if(!url){
    return res.status(400).json({error:"Missing URL"});
  }

  const image=await goobrowFetchImage(url);

  res.json({
    url,
    image:image||null
  });
});


app.listen(PORT, () => {
  console.log(`Goobrow search server running at http://localhost:${PORT}`);
});
