import { useEffect } from 'react'
import type { Post } from '@/services/api'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  author?: string
  publishedAt?: string
  tags?: string[]
  post?: Post
}

export function SEOProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default function SEO({
  title = 'House31 - Latest News, Entertainment & Videos',
  description = 'Your trusted source for trending news, viral videos, and entertainment content. Stay updated with the latest stories and breaking news.',
  image = 'https://via.placeholder.com/1200x630?text=House31',
  url = 'http://localhost:5174',
  type = 'website',
  author,
  publishedAt,
  tags = [],
  post
}: SEOProps) {
  // If post is provided, override with post-specific data
  if (post) {
    title = `${post.title} | House31`
    description = post.excerpt
    image = post.featuredImage || image
    url = `${url}/post/${post.slug}`
    type = 'article'
    author = typeof post.author === 'string' ? post.author : post.author?.name
    publishedAt = post.publishedAt
    tags = post.tags || []
  }

  useEffect(() => {
    // Update document title
    document.title = title

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Primary Meta Tags
    updateMeta('description', description)
    updateMeta('keywords', tags.join(', '))
    updateMeta('robots', 'index, follow')
    updateMeta('language', 'English')
    updateMeta('author', author || 'House31')

    // Open Graph / Facebook
    updateProperty('og:type', type)
    updateProperty('og:url', url)
    updateProperty('og:title', title)
    updateProperty('og:description', description)
    updateProperty('og:image', image)
    updateProperty('og:image:width', '1200')
    updateProperty('og:image:height', '630')
    updateProperty('og:site_name', 'House31')

    // Twitter
    updateProperty('twitter:card', 'summary_large_image')
    updateProperty('twitter:url', url)
    updateProperty('twitter:title', title)
    updateProperty('twitter:description', description)
    updateProperty('twitter:image', image)
    updateProperty('twitter:site', '@house31')
    updateProperty('twitter:creator', author ? `@${author}` : '@house31')

    // Article specific tags
    if (type === 'article') {
      if (author) updateProperty('article:author', author)
      if (publishedAt) updateProperty('article:published_time', publishedAt)
      tags.forEach((tag) => {
        updateProperty('article:tag', tag)
      })
    }
  }, [title, description, image, url, type, author, publishedAt, tags])

  return null
}
