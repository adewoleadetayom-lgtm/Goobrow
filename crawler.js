const http = require("http");
const https = require("https");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const INDEX_FILE = path.join(__dirname, "data", "index.json");
const MAX_PAGES = 20;
const MAX_PAGE_SIZE = 2_000_000;
const REQUEST_TIMEOUT = 15000;

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https://") ? https : http;

    const request = client.get(
      url,
      {
        headers: {
          "User-Agent": "GoobrowBot/1.0"
        }
      },
      (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          response.resume();

          const nextUrl = new URL(response.headers.location, url).href;

          return fetchPage(nextUrl)
            .then(resolve)
            .catch(reject);
        }

        if (response.statusCode !== 200) {
          response.resume();
          return reject(
            new Error(`HTTP ${response.statusCode}`)
          );
        }

        let body = "";

        response.setEncoding("utf8");

        response.on("data", (chunk) => {
          body += chunk;

          if (body.length > MAX_PAGE_SIZE) {
            response.destroy(
              new Error("Page is too large.")
            );
          }
        });

        response.on("end", () => {
          resolve(body);
        });
      }
    );

    request.setTimeout(REQUEST_TIMEOUT, () => {
      request.destroy(
        new Error("Request timed out.")
      );
    });

    request.on("error", reject);
  });
}

async function canCrawl(url) {
  try {
    const parsed = new URL(url);
    const robotsUrl =
      `${parsed.protocol}//${parsed.host}/robots.txt`;

    const robots = await fetchPage(robotsUrl);

    const lines = robots
      .split(/\r?\n/)
      .map((line) => line.trim());

    let appliesToGoobrow = false;
    let disallowed = [];

    for (const line of lines) {
      if (!line || line.startsWith("#")) continue;

      const separator = line.indexOf(":");
      if (separator === -1) continue;

      const key = line
        .slice(0, separator)
        .trim()
        .toLowerCase();

      const value = line
        .slice(separator + 1)
        .trim();

      if (key === "user-agent") {
        appliesToGoobrow =
          value === "*" ||
          value.toLowerCase() === "goobrowbot";
        continue;
      }

      if (appliesToGoobrow && key === "disallow") {
        disallowed.push(value);
      }
    }

    const pathname = parsed.pathname || "/";

    return !disallowed.some((rule) => {
      if (!rule) return false;
      return pathname.startsWith(rule);
    });
  } catch (_) {
    return true;
  }
}

async function indexPage(url) {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  $("script, style, noscript").remove();

  const title =
    $("title").first().text().trim();

  const text =
    $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 10000);

  const links = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (!href) return;

    try {
      const absolute =
        new URL(href, url);

      if (
        absolute.protocol === "http:" ||
        absolute.protocol === "https:"
      ) {
        absolute.hash = "";

        links.push(absolute.href);
      }
    } catch (_) {}
  });

  return {
    url,
    title: title || url,
    text,
    links: [...new Set(links)].slice(0, 100),
    indexedAt: new Date().toISOString()
  };
}

function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) {
    return [];
  }

  try {
    return JSON.parse(
      fs.readFileSync(INDEX_FILE, "utf8")
    );
  } catch (_) {
    return [];
  }
}

function saveIndex(index) {
  fs.mkdirSync(
    path.dirname(INDEX_FILE),
    { recursive: true }
  );

  fs.writeFileSync(
    INDEX_FILE,
    JSON.stringify(index, null, 2)
  );
}

async function crawl(seed) {
  const start = new URL(seed);

  const queue = [start.href];
  const visited = new Set();
  let index = loadIndex();

  while (
    queue.length > 0 &&
    visited.size < MAX_PAGES
  ) {
    const url = queue.shift();

    if (visited.has(url)) continue;

    visited.add(url);

    let parsed;

    try {
      parsed = new URL(url);
    } catch (_) {
      continue;
    }

    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      continue;
    }

    console.log(
      `[${visited.size}/${MAX_PAGES}] Crawling ${url}`
    );

    try {
      const allowed = await canCrawl(url);

      if (!allowed) {
        console.log("Skipped by robots.txt");
        continue;
      }

      const page = await indexPage(url);

      index = index.filter(
        (item) => item.url !== page.url
      );

      index.push(page);

      for (const link of page.links) {
        const linkUrl = new URL(link);

        if (
          linkUrl.protocol === start.protocol &&
          linkUrl.host === start.host &&
          !visited.has(linkUrl.href) &&
          !queue.includes(linkUrl.href)
        ) {
          queue.push(linkUrl.href);
        }
      }

      saveIndex(index);

      console.log(
        `Indexed: ${page.title || page.url}`
      );
    } catch (error) {
      console.log(
        `Skipped: ${error.message}`
      );
    }
  }

  saveIndex(index);

  console.log("");
  console.log("=== GOOBROW CRAWL COMPLETE ===");
  console.log(`Pages visited: ${visited.size}`);
  console.log(`Pages in index: ${index.length}`);
  console.log(`Index: ${INDEX_FILE}`);
}

const seed = process.argv[2];

if (!seed) {
  console.error(
    "Usage: node crawler.js https://example.com"
  );
  process.exit(1);
}

crawl(seed).catch((error) => {
  console.error(
    "Crawler error:",
    error.message
  );
  process.exit(1);
});
