const baseUrl = (process.env.SEO_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const productionOrigin = "https://www.leadhubdata.com";
const requiredPaths = [
  "/",
  "/fl-contractors",
  "/fl-restaurants",
  "/subscribe",
  "/resources",
  "/methodology",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/refund-policy",
];

function matches(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function fail(message) {
  throw new Error(message);
}

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "user-agent": "OAI-SearchBot/1.0" },
    redirect: "follow",
  });
  const body = await response.text();
  if (!response.ok) fail(`${path} returned ${response.status}`);
  return { response, body };
}

const { body: robots } = await request("/robots.txt");
if (!robots.includes("OAI-SearchBot") || !robots.includes("Sitemap:")) {
  fail("robots.txt is missing the OAI-SearchBot group or sitemap reference");
}

const { body: sitemap } = await request("/sitemap.xml");
const sitemapUrls = matches(sitemap, /<loc>([^<]+)<\/loc>/g);
const sitemapPaths = sitemapUrls.map((url) => new URL(url).pathname);

for (const path of requiredPaths) {
  if (!sitemapPaths.includes(path)) fail(`sitemap.xml is missing ${path}`);
}

await request("/llms.txt");
await request("/606f5d14327345869f3bafe1e3df05a1.txt");

const titles = new Map();
const crawlPaths = [...new Set(sitemapPaths)];
const publicLinks = new Set();

for (const path of crawlPaths) {
  const { body } = await request(path);
  const title = matches(body, /<title>([^<]+)<\/title>/gi)[0];
  const description = matches(body, /<meta[^>]+name="description"[^>]+content="([^"]+)"/gi)[0]
    || matches(body, /<meta[^>]+content="([^"]+)"[^>]+name="description"/gi)[0];
  const canonical = matches(body, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/gi)[0]
    || matches(body, /<link[^>]+href="([^"]+)"[^>]+rel="canonical"/gi)[0];
  const h1Count = (body.match(/<h1(?:\s|>)/gi) || []).length;
  const jsonLdPayloads = matches(
    body,
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  );

  if (!title) fail(`${path} has no title`);
  if (!description) fail(`${path} has no meta description`);
  if (!canonical) fail(`${path} has no canonical URL`);
  if (new URL(canonical).origin !== productionOrigin) fail(`${path} canonical uses the wrong origin`);
  if (new URL(canonical).pathname !== path) fail(`${path} canonical points to ${canonical}`);
  if (h1Count !== 1) fail(`${path} has ${h1Count} H1 elements`);
  if (jsonLdPayloads.length < 1) fail(`${path} has no JSON-LD`);
  for (const payload of jsonLdPayloads) {
    try {
      JSON.parse(payload);
    } catch (error) {
      fail(`${path} has invalid JSON-LD: ${error.message}`);
    }
  }
  if (titles.has(title)) fail(`${path} duplicates the title from ${titles.get(title)}`);
  titles.set(title, path);

  for (const href of matches(body, /<a[^>]+href="([^"]+)"/gi)) {
    const url = new URL(href, productionOrigin);
    if (url.origin === productionOrigin && !url.pathname.startsWith("/api/")) {
      publicLinks.add(url.pathname);
    }
  }
}

for (const path of publicLinks) {
  await request(path);
}

console.log(`SEO validation passed for ${crawlPaths.length} sitemap pages and ${publicLinks.size} internal links at ${baseUrl}.`);
