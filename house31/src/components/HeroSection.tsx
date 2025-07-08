import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { OptimizedImage } from "@/components/OptimizedImage"

interface FeaturedPost {
  id: number
  title: string
  description: string
  category: string
  thumbnail: string
  slug: string
}

// Mock data for featured posts
const featuredPosts: FeaturedPost[] = [
  {
    id: 1,
    title: "Breaking: Military Technology Advances in 2025",
    description: "Latest developments in defense technology and their impact on modern warfare strategies. Discover how AI is revolutionizing military operations.",
    category: "MILITARY",
    thumbnail: "/api/placeholder/400/250",
    slug: "military-tech-2025"
  },
  {
    id: 2,
    title: "AI Revolution: ChatGPT-5 Changes Everything",
    description: "The newest AI model is transforming how we work, learn, and interact with technology. Explore the groundbreaking capabilities and implications.",
    category: "AI",
    thumbnail: "/api/placeholder/400/250",
    slug: "chatgpt-5-revolution"
  },
  {
    id: 3,
    title: "Space Exploration: Mars Mission Update",
    description: "NASA's latest Mars rover discoveries reveal unexpected findings about the red planet. See what scientists have uncovered in this exclusive report.",
    category: "SPACE",
    thumbnail: "/api/placeholder/400/250",
    slug: "mars-mission-update"
  }
]

const CategoryBadge = ({ category }: { category: string }) => {
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'MILITARY':
        return 'bg-red-500 hover:bg-red-600 shadow-red-500/25'
      case 'AI':
        return 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/25'
      case 'SPACE':
        return 'bg-purple-500 hover:bg-purple-600 shadow-purple-500/25'
      default:
        return 'bg-gray-500 hover:bg-gray-600 shadow-gray-500/25'
    }
  }

  return (
    <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg ${getCategoryStyles(category)} transition-all duration-200`}>
      {category}
    </span>
  )
}

export function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/20 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Featured Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest breaking news and trending stories from around the world. 
            Discover what's shaping our future today.
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {featuredPosts.map((post, index) => (
            <Card 
              key={post.id} 
              className={`group hover:shadow-2xl hover:shadow-primary/5 hover:scale-[1.03] transition-all duration-500 border-border bg-card/50 backdrop-blur-sm overflow-hidden ${
                index === 1 ? 'md:transform md:translate-y-4' : ''
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <OptimizedImage
                  src={`https://picsum.photos/400/250?random=${post.id + 10}&blur=1`}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={index === 0}
                  placeholder="blur"
                />
                
                {/* Category Badge - Positioned over thumbnail */}
                <div className="absolute top-4 left-4">
                  <CategoryBadge category={post.category} />
                </div>

                {/* Featured Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    Featured
                  </span>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0 pb-6">
                <CardDescription className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                  {post.description}
                </CardDescription>
                
                <Link href={`/videos/${post.id}`} className="block">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300"
                    size="default"
                  >
                    <span className="mr-2">▶</span>
                    Watch Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link href="/videos">
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              View All Stories
              <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
