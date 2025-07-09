import { NextRequest, NextResponse } from 'next/server'

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

async function fetchFacebookPosts(): Promise<FacebookPost[]> {
  const pageId = process.env.FACEBOOK_PAGE_ID
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN

  if (!pageId || !accessToken) {
    throw new Error('Facebook credentials not configured')
  }

  const fields = [
    'id',
    'message',
    'story', 
    'link',
    'picture',
    'full_picture',
    'created_time',
    'permalink_url',
    'attachments{type,media,target,title,description}'
  ].join(',')

  const url = `https://graph.facebook.com/v18.0/${pageId}/posts?fields=${fields}&limit=20&access_token=${accessToken}`

  const response = await fetch(url)
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Facebook API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.data || []
}

export async function GET(request: NextRequest) {
  // Verify this is a cron job request
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Starting Facebook sync cron job...')
    
    // Fetch latest posts from Facebook
    const facebookPosts = await fetchFacebookPosts()
    
    if (facebookPosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new posts to sync',
        processed: 0
      })
    }

    // Send posts to our sync API for processing
    const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/facebook-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        posts: facebookPosts,
        source: 'cron',
        timestamp: new Date().toISOString()
      })
    })

    if (!syncResponse.ok) {
      throw new Error(`Sync API error: ${syncResponse.status}`)
    }

    const syncResult = await syncResponse.json()

    console.log(`Facebook sync completed: ${syncResult.processed} posts processed`)

    return NextResponse.json({
      success: true,
      message: 'Facebook sync completed successfully',
      processed: syncResult.processed,
      categories: syncResult.categories,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Facebook sync cron error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Also allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
