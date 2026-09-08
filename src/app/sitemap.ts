import type { MetadataRoute } from "next";
import { resources } from "@/lib/resources";
import { SEO_UPDATED_AT, SITE_URL } from "@/lib/seo";

const updatedAt = new Date(`${SEO_UPDATED_AT}T12:00:00Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  const corePages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/fl-contractors`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/fl-restaurants`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/fl-food-trucks`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/subscribe`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...[
      ["/resources", 0.8],
      ["/methodology", 0.8],
      ["/about", 0.6],
      ["/contact", 0.5],
      ["/privacy", 0.3],
      ["/terms", 0.3],
      ["/refund-policy", 0.3],
    ].map(([path, priority]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: priority as number,
    })),
  ];

  const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${SITE_URL}/resources/${resource.slug}`,
    lastModified: new Date(`${resource.updatedAt}T12:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...corePages, ...resourcePages];
}
