// Shared validation for scraped contractor contacts.
//
// The first enrichment run produced 2,424 rows of which only ~12% were real:
// the crawler kept landing on license directories and lead-gen aggregators and
// recording THEIR contact details against hundreds of different contractors
// (info@floridacontractorcheck.com appeared 612 times; the most common "phone"
// was the DBPR switchboard). These rules are deliberately precision-first --
// a wrong phone number sold to a buyer is worse than a missing one.

// Aggregators, license lookups, lead-gen sites, chambers, government, and
// manufacturers -- anything that can plausibly rank for a contractor's name
// without being that contractor.
export const BLOCKED_HOST = new RegExp(
  [
    // social / general
    "yelp\\.", "facebook\\.", "instagram\\.", "linkedin\\.", "angi\\.",
    "homeadvisor\\.", "houzz\\.", "thumbtack\\.", "bbb\\.org", "yellowpages\\.",
    "mapquest\\.", "manta\\.com", "dnb\\.com", "dandb\\.com", "bizapedia\\.",
    "buildzoom\\.", "porch\\.com", "zoominfo\\.", "opencorporates\\.",
    "google\\.", "youtube\\.", "tiktok\\.", "twitter\\.", "x\\.com",
    "nextdoor\\.", "alignable\\.", "wikipedia\\.", "indeed\\.", "glassdoor\\.",
    "amazon\\.", "apple\\.", "bloomberg\\.", "crunchbase\\.", "superpages\\.",
    "duckduckgo\\.", "bing\\.com", "dochub\\.com", "scribd\\.",
    // license lookups / public record mirrors
    "myfloridalicense\\.", "sunbiz\\.org", "floridacontractorcheck\\.",
    "publicwarden\\.", "conductwarden\\.", "safer\\.fmcsa\\.dot\\.gov",
    "buzzfile\\.", "z1biz\\.", "businessyab\\.", "showmelocal\\.",
    "bestprosintown\\.", "merchantcircle\\.", "visualvisitor\\.",
    "claimspages\\.", "insurancexdate\\.",
    // lead-gen / quote farms / trade directories
    "thebluebook\\.", "licensedroofernearme\\.", "doineedhvac\\.",
    "rateyourplumber\\.", "ustcontractors\\.", "procore\\.", "experience\\.com",
    "hvacservice\\.io", "homeyou\\.", "leadiq\\.", "ehardhat\\.", "levelset\\.",
    "dbesource\\.", "floridaroof\\.", "southfloridacontractors\\.",
    "blockrenovation\\.", "americanhomequotes\\.", "mykukun\\.",
    "governmentbidders\\.", "towncontractors\\.", "callcharlie\\.",
    "doineedapro\\.", "tradeproof\\.", "aora-solar\\.",
    "floridaplumbingdirectory\\.", "floridaroofing\\.directory",
    "chamberofcommerce\\.", "logger\\.triares\\.",
    // manufacturers / franchises whose dealer pages rank for local names
    "gaf\\.com", "servpro\\.", "owenscorning\\.", "carrier\\.com",
    "trane\\.com", "lennox\\.",
    // structural patterns
    "\\.gov$", "\\.gov/", "\\.mil$", "chamber", "directory",
    "nearme", "near-me", "bidding", "\\bbids\\b", "members\\.",
  ].join("|"),
  "i"
);

// Words that are too common in this industry to prove a domain belongs to a
// specific business. "ROOFING" in a domain means nothing; "AHRENS" means a lot.
const GENERIC_TOKENS = new Set([
  "construction", "constructions", "contractor", "contractors", "contracting",
  "builder", "builders", "building", "buildings", "build", "development",
  "developers", "roofing", "roofer", "roofers", "roofs", "roof", "plumbing",
  "plumber", "plumbers", "electric", "electrical", "electricians",
  "electrician", "mechanical", "hvac", "heating", "cooling", "air",
  "conditioning", "refrigeration", "solar", "pools", "pool", "paving",
  "concrete", "masonry", "drywall", "flooring", "painting", "landscaping",
  "remodeling", "renovations", "restoration", "installations", "installation",
  "services", "service", "company", "companies", "corporation", "group",
  "associates", "enterprise", "enterprises", "industries", "systems",
  "solutions", "partners", "holdings", "management", "maintenance",
  "professional", "professionals", "quality", "custom", "premier", "elite",
  "advanced", "superior", "reliable", "affordable", "general", "united",
  "national", "american", "america", "usa", "florida", "south", "north",
  "east", "west", "central", "coast", "coastal", "gulf", "atlantic", "bay",
  "miami", "orlando", "tampa", "jacksonville", "naples", "sarasota",
  "clearwater", "lakeland", "pensacola", "gainesville", "ocala", "brevard",
  "homes", "home", "house", "residential", "commercial", "design", "designs",
  "works", "supply", "supplies", "products", "brothers", "family", "sons",
  "incorporated", "limited", "trust", "team", "best", "first", "star",
  "master", "masters", "expert", "experts",
]);

const CORP_SUFFIX = /\b(inc|llc|l\.l\.c|corp|corporation|co|ltd|lp|llp|pa|pl|the|and|of|dba|group)\b/gi;

export function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

function nameTokens(name) {
  return [...new Set(
    (name || "")
      .toLowerCase()
      .replace(CORP_SUFFIX, " ")
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 3)
  )];
}

// A domain belongs to a business only if two things hold: it contains one of
// the business's distinctive words, and the business name explains most of the
// domain. The second half is what separates actionbuildersinc.com from
// amatoarchitecture.com -- a different company that merely shares a surname
// with AMATO CONTRACTING. Registrable label only, so a directory hosting
// "/ahrens-companies" can't sneak through on the path.
const MIN_LABEL_COVERAGE = 0.6;

export function domainMatchesName(name, host) {
  if (!host) return false;
  const label = host.split(".").slice(0, -1).join("").replace(/[^a-z0-9]/g, "");
  if (!label) return false;

  const tokens = nameTokens(name);
  const matched = tokens.filter((t) => label.includes(t));
  const distinctive = matched.filter((t) => t.length >= 5 && !GENERIC_TOKENS.has(t));
  if (!distinctive.length) return false;

  const covered = matched.reduce((n, t) => n + t.length, 0);
  if (covered / label.length < MIN_LABEL_COVERAGE) return false;

  // One matching word out of several is how "INNOVATIVE MECHANICAL SERVICES"
  // became innovativeos.com (an office supplier). Either the name accounts for
  // half its own words, or the single match has to essentially be the domain.
  if (matched.length / tokens.length >= 0.5) return true;
  return distinctive.length === 1 && covered / label.length >= 0.9;
}

// Final confirmation that the site belongs to this business: its own words
// should appear on its own pages. Catches the namesakes that survive the
// domain gate -- a consultancy at kearney.com never says "Kearney Construction".
export function pageMentionsBusiness(html, name) {
  const text = (html || "").replace(/<[^>]+>/g, " ").toLowerCase();
  if (!text.trim()) return false;
  const tokens = nameTokens(name).filter((t) => t.length >= 4);
  if (!tokens.length) return false;
  return tokens.every((t) => text.includes(t));
}

const JUNK_EMAIL = /example\.|sentry\.|wixpress\.|godaddy\.|yourdomain|no-?reply|donotreply|@\d+x\.|\.(png|jpe?g|gif|webp|svg)$/i;

// An email is only trustworthy if it lives on the same domain as the site we
// matched to this business. That single rule removes every support@duck.com,
// press@gaf.com, and support@construction.com in the current file.
export function cleanEmail(email, host) {
  const e = (email || "").trim().toLowerCase();
  if (!e || !e.includes("@") || JUNK_EMAIL.test(e)) return "";
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(e)) return "";
  const emailHost = e.split("@")[1];
  if (!host) return "";
  const root = (h) => h.split(".").slice(-2).join(".");
  return root(emailHost) === root(host) ? e : "";
}

// Switchboards and placeholders observed in the first run: the DBPR customer
// line, the FMCSA line, and 555 numbers.
const BAD_PHONES = new Set(["8504871395", "2023663477", "8007002733"]);

export function cleanPhone(phone) {
  let d = (phone || "").replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length !== 10) return "";
  if (BAD_PHONES.has(d)) return "";
  if (d.slice(3, 6) === "555") return "";
  if (/^(\d)\1{9}$/.test(d)) return "";
  if (d.startsWith("0") || d.startsWith("1")) return "";
  // Website-template placeholders: 123-4567 and friends.
  if (/^(0123456789|1234567890)$/.test(d) || d.slice(3) === "1234567") return "";
  // Second digit of a real area code is never 9.
  if (d[1] === "9") return "";
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

// A name match alone can land on an out-of-state namesake ("Action Builders"
// exists in several states). The licensee is Florida-licensed, so the real
// site should say so somewhere -- via its city, "Florida", or an FL area code.
const FL_AREA_CODES = new Set([
  "239", "305", "321", "352", "386", "407", "448", "561", "656", "689",
  "727", "754", "772", "786", "813", "850", "863", "904", "941", "954",
]);

export function looksFlorida({ html, city, phone }) {
  const digits = (phone || "").replace(/\D/g, "").replace(/^1/, "");
  if (digits.length === 10 && FL_AREA_CODES.has(digits.slice(0, 3))) return true;
  const h = (html || "").toLowerCase();
  if (!h) return false;
  if (/\bflorida\b/.test(h) || /,\s*fl\b/.test(h) || /\bfl\s+3\d{4}\b/.test(h)) return true;
  const c = (city || "").trim().toLowerCase();
  return c.length > 3 && h.includes(c);
}

// Full gate for one candidate. Returns null when the match isn't defensible.
export function validateContact({ name, website, email, phone }) {
  const host = hostOf(website);
  if (!host || BLOCKED_HOST.test(host)) return null;
  if (!domainMatchesName(name, host)) return null;
  const cleanedEmail = cleanEmail(email, host);
  const cleanedPhone = cleanPhone(phone);
  if (!cleanedEmail && !cleanedPhone) return null;
  return { website: `https://${host}`, email: cleanedEmail, phone: cleanedPhone, host };
}
