import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Only the marketing and documentation surfaces are worth crawling.
 *
 * `/api/*` is disallowed because the routes are intended to be called by the
 * app, not indexed — an indexed streaming endpoint is noise in search results
 * and an invitation to scrape. `/chat` is deliberately *allowed*: it is a
 * public demo and a real entry point for a visitor who searches for it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
