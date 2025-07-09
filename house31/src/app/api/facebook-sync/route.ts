import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

// House31 content categories and keywords for automatic filtering
const CONTENT_CATEGORIES = {
  MILITARY: {
    keywords: ['military', 'army', 'navy', 'air force', 'defense', 'weapon', 'drone', 'submarine', 'fighter jet', 'tank', 'soldier', 'war', 'combat', 'special forces', 'marines'],
    priority: 'high'
  },
  AI: {
    keywords: ['artificial intelligence', 'ai', 'machine learning', 'chatgpt', 'openai', 'gpt', 'neural network', 'automation', 'robot', 'algorithm', 'deep learning', 'tech breakthrough'],
    priority: 'high'
  },
  CONSPIRACY: {
    keywords: ['conspiracy', 'secret', 'classified', 'cover up', 'leaked', 'hidden', 'government secret', 'area 51', 'ufo', 'illuminati', 'deep state', 'whistleblower'],
    priority: 'high'
  },
  SPACE: {
    keywords: ['space', 'nasa', 'spacex', 'mars', 'moon', 'satellite', 'rocket', 'astronaut', 'galaxy', 'planet', 'space station', 'space exploration'],
    priority: 'medium'
  },
  TECH: {
    keywords: ['technology', 'tech', 'innovation', 'breakthrough', 'quantum', 'computer', 'software', 'cyber', 'digital', 'internet', 'gadget', 'startup'],
    priority: 'medium'
  },
  VIRAL: {
    keywords: ['viral', 'trending', 'breaking news', 'exclusive', 'shocking', 'amazing', 'incredible', 'unbelievable', 'mind-blowing', 'game changer'],
    priority: 'high'
  }
}

interface FacebookPost {
  id: string
  message?: string
  story?: string
  link?: string
  picture?: string
  full_picture?: string
  created_time: string
  permalink_url?: string
  attachments?: {
    data: Array<{
      type: string
      media?: { image?: { src: string } }
      target?: { url: string }
      title?: string
      description?: string
    }>
  }
}

interface ProcessedPost {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoLink?: string
  postDate: string
  postUrl: string
  type: string
  category: string
  slug: string
  views: string
  priority: string
}

// Categorize content based on keywords
function categorizeContent(text: string): { category: string; priority: string; confidence: number } {
  const lowercaseText = text.toLowerCase()
  let bestMatch = { category: 'GENERAL', priority: 'low', confidence: 0 }

  for (const [category, config] of Object.entries(CONTENT_CATEGORIES)) {
    const matches = config.keywords.filter(keyword => 
      lowercaseText.includes(keyword.toLowerCase())
    ).length

    const confidence = matches / config.keywords.length
    
    if (confidence > bestMatch.confidence) {
      bestMatch = {
        category,
        priority: config.priority,
        confidence
      }
    }
  }

  // Require at least 10% keyword match to categorize
  return bestMatch.confidence >= 0.1 ? bestMatch : { category: 'GENERAL', priority: 'low', confidence: 0 }
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

// Generate realistic view counts based on category and time
function generateViewCount(category: string, createdTime: string): string {
  const hoursSincePost = (Date.now() - new Date(createdTime).getTime()) / (1000 * 60 * 60)
  const baseViews = category === 'MILITARY' || category === 'AI' || category === 'CONSPIRACY' ? 50000 : 20000
  const viewGrowthPerHour = Math.random() * 1000 + 500
  const totalViews = Math.floor(baseViews + (hoursSincePost * viewGrowthPerHour))
  
  if (totalViews >= 1000000) {
    return `${(totalViews / 1000000).toFixed(1)}M views`
  } else if (totalViews >= 1000) {
    return `${Math.floor(totalViews / 1000)}K views`
  }
  return `${totalViews} views`
}

// Process Facebook posts into House31 format
function processFacebookPost(post: FacebookPost): ProcessedPost | null {
  const content = `${post.message || ''} ${post.story || ''}`.trim()
  
  if (!content) return null

  // Categorize the content
  const { category, priority } = categorizeContent(content)
  
  // Skip posts that don't match House31's niche
  if (category === 'GENERAL') return null

  // Extract title (first sentence or truncated message)
  const title = content.split('.')[0].slice(0, 80) || content.slice(0, 80)
  
  // Get description
  const description = content.slice(0, 200) + (content.length > 200 ? '...' : '')
  
  // Get thumbnail
  const thumbnailUrl = post.full_picture || post.picture || `https://picsum.photos/400/225?random=${Math.floor(Math.random() * 1000)}`
  
  // Determine if it's a video post
  const isVideo = post.attachments?.data?.[0]?.type === 'video_inline' || content.toLowerCase().includes('video')
  
  return {
    id: post.id,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description,
    thumbnailUrl,
    videoLink: isVideo ? post.link : undefined,
    postDate: post.created_time,
    postUrl: post.permalink_url || `https://facebook.com/post/${post.id}`,
    type: isVideo ? 'video' : 'link',
    category,
    slug: generateSlug(title),
    views: generateViewCount(category, post.created_time),
    priority
  }
}

// Save data to files
async function saveData(data: unknown, filename: string) {
  const dataDir = join(process.cwd(), 'data')
  
  try {
    await mkdir(dataDir, { recursive: true })
  } catch {
    // Directory might already exist
  }
  
  const filePath = join(dataDir, filename)
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

// Load existing data
async function loadData(filename: string) {
  try {
    const dataDir = join(process.cwd(), 'data')
    const filePath = join(dataDir, filename)
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.posts || !Array.isArray(body.posts)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected posts array.' },
        { status: 400 }
      )
    }

    // Process Facebook posts
    const processedPosts = body.posts
      .map((post: FacebookPost) => processFacebookPost(post))
      .filter((post: ProcessedPost | null): post is ProcessedPost => post !== null)
      .sort((a: ProcessedPost, b: ProcessedPost) => {
        // Sort by priority and then by date
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority
        }
        
        return new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
      })
      .slice(0, 12) // Keep top 12 posts

    // Create backup of current data
    const currentData = await loadData('facebook-sync.json')
    if (currentData) {
      await saveData(currentData, 'facebook-sync-backup.json')
    }

    // Save new sync data
    const syncData = {
      posts: processedPosts,
      syncedAt: new Date().toISOString(),
      source: 'facebook',
      categoryCounts: processedPosts.reduce((counts: Record<string, number>, post: ProcessedPost) => {
        counts[post.category] = (counts[post.category] || 0) + 1
        return counts
      }, {})
    }

    await saveData(syncData, 'facebook-sync.json')

    // Update trending videos for homepage
    const trendingVideos = processedPosts
      .filter((post: ProcessedPost) => post.type === 'video')
      .slice(0, 6)
      .map((post: ProcessedPost, index: number) => ({
        id: index + 1,
        title: post.title,
        views: post.views,
        category: post.category,
        slug: post.slug,
        thumbnail: post.thumbnailUrl
      }))

    await saveData(trendingVideos, 'trending-videos.json')

    return NextResponse.json({
      success: true,
      processed: processedPosts.length,
      categories: syncData.categoryCounts,
      message: `Successfully processed ${processedPosts.length} posts matching House31's content niche`
    })

  } catch (error) {
    console.error('Facebook sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error during sync' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const syncData = await loadData('facebook-sync.json')
    
    if (!syncData) {
      return NextResponse.json({
        synced: false,
        message: 'No sync data available'
      })
    }

    return NextResponse.json({
      synced: true,
      lastSync: syncData.syncedAt,
      postCount: syncData.posts?.length || 0,
      categories: syncData.categoryCounts || {},
      posts: syncData.posts?.slice(0, 5) || [] // Return first 5 posts as preview
    })

  } catch (error) {
    console.error('Error reading sync data:', error)
    return NextResponse.json(
      { error: 'Error reading sync data' },
      { status: 500 }
    )
  }
}
