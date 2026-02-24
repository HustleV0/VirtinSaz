import { MetadataRoute } from "next"
import { api } from "@/lib/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vofino.ir"

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/pricing",
    "/blog",
    "/careers",
    "/login",
    "/register",
    "/privacy",
    "/terms",
    "/refund",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }))

  try {
    const sites = await api.get("/sites/site/sitemap/")
    const dynamicRoutes = sites.map((site: any) => ({
      url: `${baseUrl}/preview/${site.slug}`,
      lastModified: new Date(site.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...dynamicRoutes]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return staticRoutes
  }
}
