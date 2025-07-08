import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { OptimizedImage } from "@/components/OptimizedImage"
import { AdSense } from "@/components/AdSense"
import { getTrendingVideos } from "@/lib/syncData"

interface TrendingVideo {
  id: number
  title: string
  views: string
  category: string
  slug: string
  thumbnail: string
}

// Mock data for trending videos
const mockTrendingVideos: TrendingVideo[] = [
  {
    id: 1,
    title: "AI-Powered Military Drones Transform Modern Warfare",
    views: "193K views",
    category: "MILITARY",
    slug: "ai-military-drones-warfare",
    thumbnail: "/api/placeholder/320/200"
  },
  {
    id: 2,
    title: "ChatGPT-5 Demo: Mind-Blowing AI Capabilities Revealed",
    views: "287K views",
    category: "AI",
    slug: "chatgpt-5-demo-capabilities",
    thumbnail: "/api/placeholder/320/200"
  },
  {
    id: 3,
    title: "SpaceX Mars Mission: Historic Launch Footage",
    views: "156K views",
    category: "SPACE",
    slug: "spacex-mars-mission-launch",
    thumbnail: "/api/placeholder/320/200"
  },
  {
    id: 4,
    title: "Breaking: Navy Reveals Secret Submarine Technology",
    views: "89K views",
    category: "MILITARY",
    slug: "navy-submarine-technology",
    thumbnail: "/api/placeholder/320/200"
  },
  {
    id: 5,
    title: "Neural Networks Breakthrough: Scientists Achieve AGI",
    views: "445K views",
    category: "AI",
    slug: "neural-networks-agi-breakthrough",
    thumbnail: "/api/placeholder/320/200"
  },
  {
    id: 6,
    title: "International Space Station: Exclusive Tour",
    views: "234K views",
    category: "SPACE",
    slug: "iss-exclusive-tour",
    thumbnail: "/api/placeholder/320/200"
  }
]

const CategoryChip = ({ category }: { category: string }) => {
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'MILITARY':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
      case 'AI':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'SPACE':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
    }
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md border ${getCategoryStyles(category)} transition-all duration-200`}>
      #{category}
    </span>
  )
}

export async function TrendingVideos() {
  // Get trending videos from synced data or fallback to mock data
  const trendingVideos = await getTrendingVideos()

  return (
    <div className="flex-1">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          🔥 Trending on H31
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The most watched stories and breaking news from our community
        </p>
      </div>

      {/* Trending Videos Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {trendingVideos.map((video) => (
            <Link 
              key={video.id} 
              href={`/video/${video.slug}`}
              className="group block"
            >
              <Card className="overflow-hidden border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300 h-full">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <OptimizedImage
                    src={`https://picsum.photos/400/225?random=${video.id}&blur=2`}
                    alt={video.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder="blur"
                  />
                  
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-black text-lg ml-1">▶</span>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    {Math.floor(Math.random() * 10 + 3)}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                  </div>
                </div>

                {/* Content */}
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm md:text-base font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {video.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs md:text-sm text-muted-foreground font-medium">
                      {video.views}
                    </span>
                    <CategoryChip category={video.category} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Link 
            href="/videos" 
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            View All Trending Videos
            <span className="ml-2">→</span>
          </Link>
        </div>

        {/* AdSense Advertisement */}
        <div className="mt-12">
          <AdSense 
            adSlot="9876543210"
            adFormat="horizontal"
            className="min-h-[120px] max-w-full"
            fallbackCTA={{
              title: "Explore More Content",
              description: "Discover our latest videos and trending stories.",
              buttonText: "Browse Videos",
              buttonLink: "/videos"
            }}
          />
        </div>
    </div>
  )
}
