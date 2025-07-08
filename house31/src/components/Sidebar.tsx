import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { OptimizedImage } from "@/components/OptimizedImage"
// import { AdSense } from "@/components/AdSense"

// Mock data for trending tags
const trendingTags = [
  { name: "#AI", count: "1.2K", href: "/tags/ai" },
  { name: "#Conspiracy", count: "892", href: "/tags/conspiracy" },
  { name: "#Wealth", count: "743", href: "/tags/wealth" },
  { name: "#Military", count: "654", href: "/tags/military" },
  { name: "#Tech", count: "567", href: "/tags/tech" },
  { name: "#Politics", count: "432", href: "/tags/politics" },
  { name: "#Space", count: "398", href: "/tags/space" },
  { name: "#Economy", count: "321", href: "/tags/economy" }
]

// Mock data for most viewed posts
const mostViewedPosts = [
  {
    id: 1,
    title: "AI Revolution: ChatGPT-5 Changes Everything",
    views: "212K views",
    thumbnail: "/api/placeholder/80/60",
    href: "/posts/ai-revolution-chatgpt5"
  },
  {
    id: 2,
    title: "Secret Military Technology Leaked",
    views: "189K views",
    thumbnail: "/api/placeholder/80/60",
    href: "/posts/secret-military-tech"
  },
  {
    id: 3,
    title: "Billionaire's Hidden Investment Strategy",
    views: "156K views",
    thumbnail: "/api/placeholder/80/60",
    href: "/posts/billionaire-investment"
  },
  {
    id: 4,
    title: "Mars Colony Plans Finally Revealed",
    views: "134K views",
    thumbnail: "/api/placeholder/80/60",
    href: "/posts/mars-colony-plans"
  }
]

export function Sidebar() {
  return (
    <aside className="hidden md:block w-80 space-y-6">
      {/* Trending Tags Cloud */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            🔥 Trending Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag, index) => (
              <Link key={index} href={tag.href}>
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200 text-xs px-2 py-1"
                >
                  {tag.name}
                  <span className="ml-1 text-xs opacity-70">{tag.count}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Viewed This Week */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            📈 Most Viewed This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mostViewedPosts.map((post, index) => (
            <Link key={post.id} href={post.href} className="block group">
              <div className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-12 bg-muted rounded-md overflow-hidden relative">
                  <OptimizedImage
                    src={`https://picsum.photos/80/60?random=${post.id + 20}&blur=1`}
                    alt={post.title}
                    width={80}
                    height={60}
                    className="w-full h-full object-cover"
                    placeholder="blur"
                  />
                  {/* Ranking Badge */}
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                    #{index + 1}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.views}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* AdSense Advertisement - Temporarily disabled */}
      {/* <AdSense 
        adSlot="1234567890"
        adFormat="rectangle"
        className="min-h-[250px]"
        fallbackCTA={{
          title: "Support House31",
          description: "Help us keep bringing you the latest news and exclusive content.",
          buttonText: "Subscribe Now",
          buttonLink: "/subscribe"
        }}
      /> */}

      {/* Newsletter Signup */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            📬 Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Get daily drops from H31 straight to your inbox
          </p>
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="Enter your email"
              className="w-full"
            />
            <Button className="w-full" size="sm">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            No spam, unsubscribe anytime
          </p>
        </CardContent>
      </Card>
    </aside>
  )
}
