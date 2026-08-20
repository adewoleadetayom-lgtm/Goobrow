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

  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  function makeSnippet(text) {
    const clean = String(text || "")
      .replace(/\s+/g, " ")
      .trim();

    const lower = clean.toLowerCase();

    let position = -1;

    for (const word of words) {
      const found = lower.indexOf(word);

      if (found !== -1) {
        position = found;
        break;
      }
    }

    if (position === -1) {
      return clean.slice(0, 250);
    }

    const start = Math.max(0, position - 80);

    return clean.slice(
      start,
      start + 300
    );
  }

  const results = index
    .map((page) => {
      const title = String(page.title || "");
      const text = String(page.text || "");
      const url = String(page.url || "");

      const lowerTitle =
        title.toLowerCase();

      const lowerText =
        text.toLowerCase();

      const lowerUrl =
        url.toLowerCase();

      let score = 0;
      let matchedWords = 0;

      for (const word of words) {
        let matched = false;

        if (lowerTitle.includes(word)) {
          score += 30;
          matched = true;
        }

        if (lowerText.includes(word)) {
          score += 5;
          matched = true;
        }

        if (lowerUrl.includes(word)) {
          score += 10;
          matched = true;
        }

        if (matched) {
          matchedWords++;
        }
      }

      if (matchedWords === words.length) {
        score += 20;
      }

      return {
        page,
        score,
        matchedWords
      };
    })
    .filter(
      (item) => item.score > 0
    )
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return (
        b.matchedWords -
        a.matchedWords
      );
    })
    .slice(0, 20)
    .map((item) => ({
      title: item.page.title,
      url: item.page.url,
      description: makeSnippet(
        item.page.text
      )
    }));

  res.json({
    engine: "Goobrow",
    query,
    totalResults: results.length,
    results
  });
});;;


app.listen(PORT, () => {
  console.log(`Goobrow search server running at http://localhost:${PORT}`);
});
