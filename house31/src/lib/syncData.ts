import { readFile } from 'fs/promises'
import { join } from 'path'

interface FacebookPost {
  id: string
  title: string
  thumbnailUrl: string
  description: string
  videoLink: string
  postDate: string
  postUrl: string
  type: 'video' | 'link'
}

interface TrendingVideo {
  id: number
  title: string
  views: string
  category: string
  slug: string
  thumbnail: string
  videoLink?: string
  postUrl?: string
  postDate?: string
  description?: string
}

interface SyncData {
  posts: FacebookPost[]
  syncedAt: string
  source: 'facebook'
}

export async function getFacebookSyncData(): Promise<SyncData | null> {
  try {
    const dataDir = join(process.cwd(), 'data')
    const syncFile = join(dataDir, 'facebook-sync.json')
    
    const data = await readFile(syncFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading Facebook sync data:', error)
    return null
  }
}

export async function getTrendingVideos(): Promise<TrendingVideo[]> {
  try {
    const dataDir = join(process.cwd(), 'data')
    const trendingFile = join(dataDir, 'trending-videos.json')
    
    const data = await readFile(trendingFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading trending videos:', error)
    
    // Return fallback mock data if file doesn't exist
    return [
      {
        id: 1,
        title: "AI-Powered Military Drones Transform Modern Warfare",
        views: "193K views",
        category: "MILITARY",
        slug: "ai-military-drones-warfare",
        thumbnail: "https://picsum.photos/400/225?random=1"
      },
      {
        id: 2,
        title: "ChatGPT-5 Demo: Mind-Blowing AI Capabilities Revealed",
        views: "287K views",
        category: "AI",
        slug: "chatgpt-5-demo-capabilities",
        thumbnail: "https://picsum.photos/400/225?random=2"
      },
      {
        id: 3,
        title: "SpaceX Mars Mission: Historic Launch Footage",
        views: "156K views",
        category: "SPACE",
        slug: "spacex-mars-mission-launch",
        thumbnail: "https://picsum.photos/400/225?random=3"
      },
      {
        id: 4,
        title: "Breaking: Navy Reveals Secret Submarine Technology",
        views: "89K views",
        category: "MILITARY",
        slug: "navy-submarine-technology",
        thumbnail: "https://picsum.photos/400/225?random=4"
      },
      {
        id: 5,
        title: "Neural Networks Breakthrough: Scientists Achieve AGI",
        views: "445K views",
        category: "AI",
        slug: "neural-networks-agi-breakthrough",
        thumbnail: "https://picsum.photos/400/225?random=5"
      },
      {
        id: 6,
        title: "International Space Station: Exclusive Tour",
        views: "234K views",
        category: "SPACE",
        slug: "iss-exclusive-tour",
        thumbnail: "https://picsum.photos/400/225?random=6"
      }
    ]
  }
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return date.toLocaleDateString()
}

export function generateViewCount(): string {
  const views = Math.floor(Math.random() * 500 + 50)
  return `${views}K views`
}
