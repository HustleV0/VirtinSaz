import { MetadataRoute } from 'next'
import { api } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vofino.ir'
  
  // Static routes
  const staticRoutes = [
    '',
    '/login',
    '/signup',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic sites
  try {
    const sites = await api.get('/sites/site/sitemap/')
    const dynamicRoutes = sites.map((site: any) => ({
      url: `${baseUrl}/preview/${site.slug}`,
      lastModified: new Date(site.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...dynamicRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}
