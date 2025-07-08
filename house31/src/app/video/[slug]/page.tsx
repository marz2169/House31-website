import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { OptimizedImage } from "@/components/OptimizedImage"
// import { AdSense } from "@/components/AdSense"

interface VideoData {
  id: number
  title: string
  views: string
  category: string
  slug: string
  thumbnail: string
  description: string
  publishedAt: string
  duration: string
  author: string
}

// Mock data for videos - in a real app this would come from your CMS/API
const videos: VideoData[] = [
  {
    id: 1,
    title: "AI-Powered Military Drones Transform Modern Warfare",
    views: "193K views",
    category: "MILITARY",
    slug: "ai-military-drones-warfare",
    thumbnail: "/api/placeholder/1200/630",
    description: "Explore how artificial intelligence is revolutionizing military technology and changing the landscape of modern warfare. This comprehensive analysis covers the latest AI-powered drone capabilities, their strategic implications, and the future of autonomous defense systems.",
    publishedAt: "2025-01-07",
    duration: "12:34",
    author: "House31"
  },
  {
    id: 2,
    title: "ChatGPT-5 Demo: Mind-Blowing AI Capabilities Revealed",
    views: "287K views",
    category: "AI",
    slug: "chatgpt-5-demo-capabilities",
    thumbnail: "/api/placeholder/1200/630",
    description: "Get an exclusive first look at ChatGPT-5's groundbreaking capabilities. From advanced reasoning to multimodal interactions, see how this AI breakthrough is set to transform technology and human-computer interaction.",
    publishedAt: "2025-01-06",
    duration: "15:42",
    author: "House31"
  },
  {
    id: 3,
    title: "SpaceX Mars Mission: Historic Launch Footage",
    views: "156K views",
    category: "SPACE",
    slug: "spacex-mars-mission-launch",
    thumbnail: "/api/placeholder/1200/630",
    description: "Witness history in the making as SpaceX launches its most ambitious Mars mission yet. Experience the incredible engineering achievement and the next giant leap for human space exploration.",
    publishedAt: "2025-01-05",
    duration: "18:27",
    author: "House31"
  },
  {
    id: 4,
    title: "Breaking: Navy Reveals Secret Submarine Technology",
    views: "89K views",
    category: "MILITARY",
    slug: "navy-submarine-technology",
    thumbnail: "/api/placeholder/1200/630",
    description: "Exclusive coverage of the Navy's latest submarine technology reveals. Discover the cutting-edge innovations that are keeping our nation secure beneath the waves.",
    publishedAt: "2025-01-04",
    duration: "10:15",
    author: "House31"
  }
]

async function getVideoBySlug(slug: string): Promise<VideoData | null> {
  return videos.find(video => video.slug === slug) || null
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const video = await getVideoBySlug(slug)

  if (!video) {
    return {
      title: 'Video Not Found - House31',
      description: 'The requested video could not be found.'
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://house31.com'
  const videoUrl = `${baseUrl}/video/${video.slug}`

  return {
    title: `${video.title} | House31`,
    description: video.description,
    keywords: [video.category.toLowerCase(), 'video', 'trending', 'viral', video.title.toLowerCase()],
    authors: [{ name: video.author }],
    creator: video.author,
    publisher: 'House31',
    alternates: {
      canonical: videoUrl,
    },
    openGraph: {
      type: 'video.other',
      title: video.title,
      description: video.description,
      url: videoUrl,
      siteName: 'House31',
      images: [
        {
          url: video.thumbnail.replace('/api/placeholder', `${baseUrl}/api/placeholder`),
          width: 1200,
          height: 630,
          alt: video.title,
        },
      ],
      videos: [
        {
          url: videoUrl,
          width: 1280,
          height: 720,
          type: 'video/mp4',
        },
      ],
    },
    twitter: {
      card: 'player',
      title: video.title,
      description: video.description,
      images: [video.thumbnail.replace('/api/placeholder', `${baseUrl}/api/placeholder`)],
      players: [
        {
          playerUrl: videoUrl,
          streamUrl: videoUrl,
          width: 1280,
          height: 720,
        },
      ],
    },
    other: {
      'video:duration': video.duration,
      'video:tag': video.category,
      'article:published_time': video.publishedAt,
      'article:author': video.author,
    },
  }
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params
  const video = await getVideoBySlug(slug)

  if (!video) {
    notFound()
  }

  // JSON-LD structured data for better SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail,
    uploadDate: video.publishedAt,
    duration: `PT${video.duration.replace(':', 'M')}S`,
    embedUrl: `https://house31.com/video/${video.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'House31',
      logo: {
        '@type': 'ImageObject',
        url: 'https://house31.com/logo.png',
      },
    },
    author: {
      '@type': 'Person',
      name: video.author,
    },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: parseInt(video.views.replace(/[^\d]/g, '')) * 1000,
    },
    category: video.category,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Video Player Section */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
              <OptimizedImage
                src={video.thumbnail}
                alt={video.title}
                width={1200}
                height={675}
                priority
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  ▶ Play Video
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                  {video.category}
                </span>
                <span>{video.views}</span>
                <span>•</span>
                <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {video.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {video.description}
              </p>
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex-1">
                  <div className="font-medium">{video.author}</div>
                  <div className="text-sm text-muted-foreground">Content Creator</div>
                </div>
                <Button variant="outline">Subscribe</Button>
                <Button variant="outline">👍 Like</Button>
                <Button variant="outline">🔗 Share</Button>
              </div>
            </div>

            {/* AdSense - Temporarily disabled for build */}
            {/* <div className="mb-8">
              <AdSense 
                adSlot="video-content-banner"
                adFormat="auto"
                className="w-full"
              />
            </div> */}

            {/* Related Videos */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Related Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos
                  .filter(v => v.id !== video.id)
                  .slice(0, 3)
                  .map((relatedVideo) => (
                    <Card key={relatedVideo.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardHeader className="p-0">
                        <div className="relative aspect-video overflow-hidden rounded-t-lg">
                          <OptimizedImage
                            src={relatedVideo.thumbnail}
                            alt={relatedVideo.title}
                            width={400}
                            height={225}
                            className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                            {relatedVideo.duration}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                            {relatedVideo.category}
                          </span>
                          <span>{relatedVideo.views}</span>
                        </div>
                        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                          <a href={`/video/${relatedVideo.slug}`}>
                            {relatedVideo.title}
                          </a>
                        </CardTitle>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

// Generate static params for popular videos
export async function generateStaticParams() {
  return videos.map((video) => ({
    slug: video.slug,
  }))
}
