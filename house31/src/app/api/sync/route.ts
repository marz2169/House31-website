import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
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

interface SyncData {
  posts: FacebookPost[]
  syncedAt: string
  source: 'facebook'
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming data
    const data = await request.json()
    
    // Validate the data structure
    if (!data.posts || !Array.isArray(data.posts)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected posts array.' },
        { status: 400 }
      )
    }

    // Validate each post has required fields
    const validPosts = data.posts.filter((post: any) => 
      post.title && 
      post.description && 
      post.postDate &&
      (post.videoLink || post.postUrl)
    )

    if (validPosts.length === 0) {
      return NextResponse.json(
        { error: 'No valid posts found in the data.' },
        { status: 400 }
      )
    }

    // Create sync data object
    const syncData: SyncData = {
      posts: validPosts,
      syncedAt: new Date().toISOString(),
      source: 'facebook'
    }

    // Define file paths
    const dataDir = join(process.cwd(), 'data')
    const syncFile = join(dataDir, 'facebook-sync.json')
    const backupFile = join(dataDir, 'facebook-sync-backup.json')

    try {
      // Create data directory if it doesn't exist
      await writeFile(join(dataDir, '.gitkeep'), '')
    } catch (error) {
      // Directory might already exist, continue
    }

    try {
      // Read existing data for backup
      const existingData = await readFile(syncFile, 'utf-8')
      await writeFile(backupFile, existingData)
    } catch (error) {
      // No existing file, continue
      console.log('No existing sync file found, creating new one')
    }

    // Write new sync data
    await writeFile(syncFile, JSON.stringify(syncData, null, 2))

    // Update the trending videos data (mock data replacement)
    try {
      const trendingFile = join(dataDir, 'trending-videos.json')
      
      // Transform Facebook posts to trending video format
      const trendingVideos = validPosts.slice(0, 6).map((post: FacebookPost, index: number) => ({
        id: index + 1,
        title: post.title,
        views: `${Math.floor(Math.random() * 300 + 50)}K views`,
        category: extractCategory(post.description),
        slug: generateSlug(post.title),
        thumbnail: post.thumbnailUrl || `https://picsum.photos/400/225?random=${index + 1}`,
        videoLink: post.videoLink,
        postUrl: post.postUrl,
        postDate: post.postDate,
        description: post.description
      }))

      await writeFile(trendingFile, JSON.stringify(trendingVideos, null, 2))
    } catch (error) {
      console.error('Error updating trending videos:', error)
    }

    // Log success
    console.log(`Successfully synced ${validPosts.length} posts from Facebook`)

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${validPosts.length} posts`,
      syncedAt: syncData.syncedAt,
      posts: validPosts.length
    })

  } catch (error) {
    console.error('Error in sync endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error during sync' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'data')
    const syncFile = join(dataDir, 'facebook-sync.json')
    
    const data = await readFile(syncFile, 'utf-8')
    const syncData = JSON.parse(data)
    
    return NextResponse.json({
      success: true,
      ...syncData,
      postsCount: syncData.posts?.length || 0
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'No sync data found' },
      { status: 404 }
    )
  }
}

// Helper functions
function extractCategory(description: string): string {
  const categories = ['AI', 'MILITARY', 'SPACE', 'TECH', 'POLITICS', 'ECONOMY']
  const desc = description.toUpperCase()
  
  for (const category of categories) {
    if (desc.includes(category) || desc.includes(category.toLowerCase())) {
      return category
    }
  }
  
  // Default category based on keywords
  if (desc.includes('ARTIFICIAL') || desc.includes('ROBOT') || desc.includes('MACHINE')) return 'AI'
  if (desc.includes('ARMY') || desc.includes('DEFENSE') || desc.includes('WAR')) return 'MILITARY'
  if (desc.includes('NASA') || desc.includes('ROCKET') || desc.includes('SATELLITE')) return 'SPACE'
  if (desc.includes('TECHNOLOGY') || desc.includes('INNOVATION')) return 'TECH'
  
  return 'TECH' // Default fallback
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 50)
}
