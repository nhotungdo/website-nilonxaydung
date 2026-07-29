import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nilonxaydung.vn'
  
  const routes = [
    '',
    '/ve-chung-toi',
    '/dich-vu',
    '/cong-dung',
    '/lien-he',
    '/chinh-sach-bao-mat',
    '/danh-muc/bao-ho-lao-dong',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
 
  return routes
}
