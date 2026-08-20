const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static("www"));

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

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);

  const results = index
    .map((page) => {
      const title = String(page.title || "");
      const text = String(page.text || "");
      const url = String(page.url || "");

      let score = 0;

      for (const word of words) {
        if (title.toLowerCase().includes(word)) score += 10;
        if (text.toLowerCase().includes(word)) score += 3;
        if (url.toLowerCase().includes(word)) score += 2;
      }

      return { page, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((item) => ({
      title: item.page.title,
      url: item.page.url,
      description: String(item.page.text || "").slice(0, 250)
    }));

  res.json({
    engine: "Goobrow",
    query,
    results
  });
});;


app.listen(PORT, () => {
  console.log(`Goobrow search server running at http://localhost:${PORT}`);
});
