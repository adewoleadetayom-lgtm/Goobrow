const https = require("https");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const INDEX_FILE = path.join(__dirname, "data", "index.json");

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "GoobrowBot/1.0 (+https://goobrow.example)"
        }
      },
      (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          response.resume();
          return fetchPage(new URL(response.headers.location, url).href)
            .then(resolve)
            .catch(reject);
        }

        if (response.statusCode !== 200) {
          response.resume();
          return reject(
            new Error(`HTTP ${response.statusCode} while fetching ${url}`)
          );
        }

        let body = "";

        response.setEncoding("utf8");

        response.on("data", (chunk) => {
          body += chunk;

          if (body.length > 2_000_000) {
            response.destroy(
              new Error("Page is too large for the local crawler.")
            );
          }
        });

        response.on("end", () => {
          resolve(body);
        });
      }
    );

    request.setTimeout(15000, () => {
      request.destroy(new Error("Request timed out."));
    });

    request.on("error", reject);
  });
}

async function indexPage(url) {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  $("script, style, noscript").remove();

  const title = $("title").first().text().trim();

  const text = $("body")
    .text(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 10000);

  const links = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (!href) return;

    try {
      const absolute = new URL(href, url);

      if (
        absolute.protocol === "http:" ||
        absolute.protocol === "https:"
      ) {
        links.push(absolute.href);
      }
    } catch (_) {
      // Ignore invalid links.
    }
  });

  return {
    url,
    title: title || url,
    text,
    links: [...new Set(links)].slice(0, 100),
    indexedAt: new Date().toISOString()
  };
}

async function main() {
  const target = process.argv[2];

  if (!target) {
    console.error("Usage: node crawler.js https://example.com");
    process.exit(1);
  }

  const parsed = new URL(target);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed.");
  }

  const page = await indexPage(parsed.href);

  fs.mkdirSync(path.dirname(INDEX_FILE), { recursive: true });

  let index = [];

  if (fs.existsSync(INDEX_FILE)) {
    try {
      index = JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
    } catch (_) {
      index = [];
    }
  }

  index = index.filter((item) => item.url !== page.url);
  index.push(page);

  fs.writeFileSync(
    INDEX_FILE,
    JSON.stringify(index, null, 2)
  );

  console.log("Goobrow indexed:");
  console.log(`Title: ${page.title}`);
  console.log(`URL: ${page.url}`);
  console.log(`Characters: ${page.text.length}`);
  console.log(`Links found: ${page.links.length}`);
  console.log(`Saved to: ${INDEX_FILE}`);
}

main().catch((error) => {
  console.error("Crawler error:", error.message);
  process.exit(1);
});
