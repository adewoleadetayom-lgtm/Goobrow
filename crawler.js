
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const MAX_PAGES = Number(process.env.MAX_PAGES || 100);
const MAX_DEPTH = Number(process.env.MAX_DEPTH || 2);
const REQUEST_TIMEOUT = 10000;
const DELAY_MS = 500;

const seeds = [
  "https://www.iana.org/",
  "https://www.wikipedia.org/",
  "https://developer.mozilla.org/",
  "https://www.w3.org/",
  "https://www.python.org/"
];

const indexFile = path.join(__dirname, "data", "index.json");

function normalizeUrl(raw, base) {
  try {
    const url = new URL(raw, base);

    if (!["http:", "https:"].includes(url.protocol)) return null;

    url.hash = "";

    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }

    return url.toString();
  } catch {
    return null;
  }
}

function isAllowed(url) {
  try {
    const u = new URL(url);

    if (!["http:", "https:"].includes(u.protocol)) return false;

    if (
      u.pathname.match(
        /\.(jpg|jpeg|png|gif|webp|svg|ico|mp3|mp4|avi|mov|zip|rar|7z|pdf|doc|docx|xls|xlsx|ppt|pptx)$/i
      )
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "GoobrowBot/1.0 (+local search crawler)"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const type = response.headers.get("content-type") || "";

    if (!type.includes("text/html")) {
      return null;
    }

    const html = await response.text();

    return {
      finalUrl: response.url || url,
      html
    };
  } finally {
    clearTimeout(timer);
  }
}

function extractPage(url, html) {
  const $ = cheerio.load(html);

  $("script,style,noscript,svg,iframe").remove();

  const title = $("title").first().text().replace(/\s+/g, " ").trim();

  const text = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20000);

  const links = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (!href) return;

    const normalized = normalizeUrl(href, url);

    if (normalized && isAllowed(normalized)) {
      links.push(normalized);
    }
  });

  return {
    url,
    title: title || url,
    text,
    links: [...new Set(links)]
  };
}

async function main() {
  fs.mkdirSync(path.dirname(indexFile), { recursive: true });

  let oldIndex = [];

  try {
    if (fs.existsSync(indexFile)) {
      oldIndex = JSON.parse(fs.readFileSync(indexFile, "utf8"));
    }
  } catch {
    oldIndex = [];
  }

  const indexMap = new Map();

  for (const page of oldIndex) {
    if (page && page.url) {
      indexMap.set(page.url, page);
    }
  }

  const queue = [];

  for (const seed of seeds) {
    const url = normalizeUrl(seed);

    if (url) {
      queue.push({
        url,
        depth: 0
      });
    }
  }

  const visited = new Set();

  let pagesVisited = 0;

  console.log("======================================");
  console.log("        GOOBROW WEB CRAWLER");
  console.log("======================================");
  console.log(`Maximum pages: ${MAX_PAGES}`);
  console.log(`Maximum depth: ${MAX_DEPTH}`);
  console.log(`Existing index: ${indexMap.size}`);
  console.log("");

  while (queue.length && pagesVisited < MAX_PAGES) {
    const current = queue.shift();

    if (!current) continue;

    const { url, depth } = current;

    if (visited.has(url)) continue;

    visited.add(url);

    console.log(
      `[${pagesVisited + 1}/${MAX_PAGES}] Crawling ${url}`
    );

    try {
      const pageResponse = await fetchPage(url);

      if (!pageResponse) {
        console.log("Skipped: non-HTML page");
        continue;
      }

      const page = extractPage(pageResponse.finalUrl, pageResponse.html);

      indexMap.set(page.url, {
        url: page.url,
        title: page.title,
        text: page.text,
        indexedAt: new Date().toISOString()
      });

      pagesVisited++;

      console.log(`Indexed: ${page.title}`);

      if (depth < MAX_DEPTH) {
        for (const link of page.links) {
          if (!visited.has(link) && !queue.some(item => item.url === link)) {
            queue.push({
              url: link,
              depth: depth + 1
            });
          }
        }
      }
    } catch (error) {
      console.log(`Skipped: ${error.message}`);
    }

    if (queue.length) {
      await sleep(DELAY_MS);
    }
  }

  const finalIndex = [...indexMap.values()];

  fs.writeFileSync(
    indexFile,
    JSON.stringify(finalIndex, null, 2)
  );

  console.log("");
  console.log("======================================");
  console.log("       GOOBROW CRAWL COMPLETE");
  console.log("======================================");
  console.log(`Pages visited: ${pagesVisited}`);
  console.log(`Pages in index: ${finalIndex.length}`);
  console.log(`Remaining queue: ${queue.length}`);
  console.log(`Index: ${indexFile}`);
}

main().catch(error => {
  console.error("Crawler error:", error);
  process.exit(1);
});
