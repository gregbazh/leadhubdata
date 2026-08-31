const siteUrl = "https://www.leadhubdata.com";
const key = process.env.INDEXNOW_KEY || "606f5d14327345869f3bafe1e3df05a1";
const keyLocation = `${siteUrl}/${key}.txt`;

const sitemapResponse = await fetch(`${siteUrl}/sitemap.xml`, { redirect: "follow" });
if (!sitemapResponse.ok) {
  throw new Error(`Unable to read sitemap: ${sitemapResponse.status}`);
}

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => new URL(url).host === "www.leadhubdata.com");

if (!urlList.length) throw new Error("The sitemap did not contain any LeadHubData URLs");

const response = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "www.leadhubdata.com",
    key,
    keyLocation,
    urlList,
  }),
});

if (!response.ok) {
  throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow (${response.status}).`);
