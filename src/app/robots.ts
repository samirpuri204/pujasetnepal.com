import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Both pages are meant to be found, so there is nothing to exclude. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
