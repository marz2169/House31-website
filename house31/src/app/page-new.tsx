import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* New Sticky Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Welcome Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Welcome to <span className="text-primary">House31</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your premier destination for breaking news, trending stories, and compelling content from around the world.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle className="text-xl">Breaking News</CardTitle>
                <CardDescription>
                  Stay ahead with real-time updates on global events and trending stories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our team delivers the latest news as it happens, keeping you informed about what matters most.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎥</span>
                </div>
                <CardTitle className="text-xl">Video Content</CardTitle>
                <CardDescription>
                  Engaging video stories and documentaries from expert journalists.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Experience immersive storytelling through our high-quality video content and exclusive interviews.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <CardTitle className="text-xl">Global Coverage</CardTitle>
                <CardDescription>
                  Comprehensive reporting from every corner of the world.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  From local stories to international affairs, we bring you diverse perspectives on global events.
                </p>
              </CardContent>
            </Card>

          </div>

          {/* Call to Action Section */}
          <div className="text-center bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Stay Informed?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join millions of readers who trust House31 for their daily news and entertainment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold">
                Explore Stories
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold">
                Subscribe to Updates
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
