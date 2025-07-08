import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Play, Clock, Eye } from 'lucide-react'

interface VideoCardProps {
  id: string
  title: string
  description: string
  duration: string
  views: string
  category: string
  thumbnail?: string
}

// Mock data for demonstration
const mockVideos: VideoCardProps[] = [
  {
    id: '1',
    title: 'Amazing Nature Documentary',
    description: 'Explore the wonders of wildlife in this stunning documentary featuring rare species.',
    duration: '15:32',
    views: '2.3M',
    category: 'Documentary'
  },
  {
    id: '2',
    title: 'Tech Review: Latest Smartphone',
    description: 'In-depth review of the newest flagship phone with all the features you need to know.',
    duration: '12:45',
    views: '856K',
    category: 'Technology'
  },
  {
    id: '3',
    title: 'Cooking Masterclass',
    description: 'Learn professional cooking techniques from world-renowned chefs in this masterclass.',
    duration: '28:17',
    views: '1.2M',
    category: 'Cooking'
  },
  {
    id: '4',
    title: 'Travel Vlog: Japan Adventure',
    description: 'Join us on an incredible journey through Japan, exploring culture, food, and landmarks.',
    duration: '22:08',
    views: '3.1M',
    category: 'Travel'
  },
  {
    id: '5',
    title: 'Fitness Challenge: 30 Days',
    description: 'Transform your body in 30 days with this comprehensive fitness challenge and workout plan.',
    duration: '18:55',
    views: '945K',
    category: 'Fitness'
  },
  {
    id: '6',
    title: 'Music Production Tutorial',
    description: 'Create professional beats and melodies with this step-by-step music production guide.',
    duration: '35:42',
    views: '678K',
    category: 'Music'
  }
]

function VideoCard({ video }: { video: VideoCardProps }) {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg dark:hover:shadow-zinc-800/25">
      <CardHeader className="p-0">
        <div className="relative aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-t-lg overflow-hidden">
          {/* Thumbnail Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
            <Play className="h-12 w-12 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {video.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          {video.title}
        </CardTitle>
        <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
          {video.description}
        </CardDescription>
        
        <div className="flex items-center space-x-4 text-xs text-zinc-500 dark:text-zinc-500">
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{video.views} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{video.duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function VideoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
