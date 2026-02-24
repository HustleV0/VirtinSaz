import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/settings/"],
    },
    sitemap: "https://vofino.ir/sitemap.xml",
    host: "https://vofino.ir",
  }
}
