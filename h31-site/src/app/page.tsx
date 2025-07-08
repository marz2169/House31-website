import { Navbar } from '../components/navbar'
import { VideoGrid } from '../components/video-grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Latest Videos
          </h1>
          <p className="text-muted-foreground">
            Discover trending content and stay up to date
          </p>
        </div>
        <VideoGrid />
      </main>
    </div>
  )
}
