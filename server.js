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

  const results = index
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
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
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
    totalResults: results.length,
    results
  });
});;;;


app.listen(PORT, () => {
  console.log(`Goobrow search server running at http://localhost:${PORT}`);
});
