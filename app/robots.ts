import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/types";

/** robots.txt minimale — niente Host (non standard per Google). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/pubblica/grazie"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
