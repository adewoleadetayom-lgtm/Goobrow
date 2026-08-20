const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

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

  res.json({
    engine: "Goobrow",
    query,
    results: [
      {
        title: `Search results for ${query}`,
        url: "#",
        description: "Goobrow search results will appear here."
      }
    ]
  });
});


app.listen(PORT, () => {
  console.log(`Goobrow search server running at http://localhost:${PORT}`);
});
