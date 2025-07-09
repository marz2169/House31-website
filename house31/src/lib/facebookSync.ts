import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Enhanced content categorization with more specific keywords for House31
export const HOUSE31_CATEGORIES = {
  MILITARY: {
    keywords: [
      // Military tech & equipment
      'military', 'army', 'navy', 'air force', 'marines', 'defense', 'pentagon',
      'weapon', 'missile', 'drone', 'submarine', 'fighter jet', 'tank', 'aircraft carrier',
      'stealth', 'radar', 'sonar', 'satellite', 'reconnaissance', 'surveillance',
      // Operations & personnel  
      'special forces', 'navy seals', 'green beret', 'delta force', 'combat', 'war',
      'battlefield', 'strategic', 'tactical', 'classified operation', 'military exercise',
      // Emerging tech
      'hypersonic', 'laser weapon', 'electromagnetic', 'cyber warfare', 'space force'
    ],
    priority: 'high',
    boost: 1.5
  },
  AI: {
    keywords: [
      // AI Companies & Products
      'artificial intelligence', 'ai', 'machine learning', 'deep learning',
      'chatgpt', 'gpt-4', 'gpt-5', 'openai', 'anthropic', 'claude', 'google ai',
      'neural network', 'transformer', 'llm', 'large language model',
      // AI Applications
      'automation', 'robot', 'robotics', 'autonomous', 'algorithm', 'computer vision',
      'natural language', 'speech recognition', 'generative ai', 'ai breakthrough',
      // AI Ethics & Impact
      'ai safety', 'ai regulation', 'superintelligence', 'artificial general intelligence',
      'ai takeover', 'technological singularity', 'ai consciousness'
    ],
    priority: 'high',
    boost: 1.4
  },
  CONSPIRACY: {
    keywords: [
      // Government & Secrets
      'conspiracy', 'secret', 'classified', 'top secret', 'cover up', 'coverup',
      'leaked', 'whistleblower', 'insider', 'government secret', 'deep state',
      'shadow government', 'illuminati', 'new world order', 'globalist',
      // UFOs & Aliens
      'ufo', 'uap', 'alien', 'extraterrestrial', 'area 51', 'roswell',
      'close encounter', 'abduction', 'disclosure', 'pentagon ufo',
      // Other conspiracies
      'false flag', 'mind control', 'surveillance state', 'social credit',
      'population control', 'agenda', 'psyop', 'disinformation'
    ],
    priority: 'high',
    boost: 1.3
  },
  SPACE: {
    keywords: [
      // Space Agencies & Companies
      'nasa', 'spacex', 'blue origin', 'boeing space', 'lockheed martin',
      'roscosmos', 'esa', 'jaxa', 'isro', 'space force',
      // Missions & Exploration
      'mars', 'moon', 'jupiter', 'saturn', 'venus', 'asteroid', 'comet',
      'space station', 'iss', 'artemis', 'perseverance', 'rover',
      'space exploration', 'space colonization', 'terraforming',
      // Technology
      'rocket', 'spacecraft', 'satellite', 'space telescope', 'hubble', 'james webb',
      'launch', 'orbit', 'landing', 'reusable rocket', 'starship'
    ],
    priority: 'medium',
    boost: 1.2
  },
  TECH: {
    keywords: [
      // Breakthrough Technologies
      'quantum computing', 'quantum computer', 'quantum supremacy', 'fusion energy',
      'nuclear fusion', 'breakthrough', 'innovation', 'revolutionary',
      // Computing & Internet
      'supercomputer', 'blockchain', 'cryptocurrency', 'bitcoin', 'ethereum',
      'metaverse', 'virtual reality', 'vr', 'augmented reality', 'ar',
      // Biotech & Science
      'crispr', 'gene editing', 'bioengineering', 'nanotechnology', 'biotechnology',
      'longevity', 'life extension', 'anti-aging', 'stem cell'
    ],
    priority: 'medium',
    boost: 1.1
  },
  VIRAL: {
    keywords: [
      // Viral indicators
      'viral', 'trending', 'breaking news', 'breaking', 'exclusive', 'leaked video',
      'shocking', 'amazing', 'incredible', 'unbelievable', 'mind-blowing',
      'game changer', 'never before seen', 'first time ever', 'historic',
      // Engagement words
      'watch this', 'you wont believe', 'must see', 'goes viral', 'internet breaks',
      'everyone is talking', 'social media explodes', 'video surfaces'
    ],
    priority: 'high',
    boost: 1.6
  }
}

export interface FacebookPost {
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

export interface ProcessedPost {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoLink?: string
  postDate: string
  postUrl: string
  type: 'video' | 'link' | 'image'
  category: string
  slug: string
  views: string
  priority: string
  score: number
}

// Advanced content categorization with scoring
export function categorizeContent(text: string): { 
  category: string
  priority: string
  score: number
  confidence: number 
} {
  const lowercaseText = text.toLowerCase()
  let bestMatch = { 
    category: 'GENERAL', 
    priority: 'low', 
    score: 0, 
    confidence: 0 
  }

  for (const [category, config] of Object.entries(HOUSE31_CATEGORIES)) {
    const matches = config.keywords.filter(keyword => 
      lowercaseText.includes(keyword.toLowerCase())
    )
    
    const matchCount = matches.length
    const confidence = matchCount / config.keywords.length
    const score = matchCount * config.boost
    
    if (score > bestMatch.score && confidence >= 0.08) { // Lower threshold for better matching
      bestMatch = {
        category,
        priority: config.priority,
        score,
        confidence
      }
    }
  }

  return bestMatch
}

// Enhanced slug generation
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .slice(0, 60) // Limit length
}

// Realistic view count generation with more variety
export function generateViewCount(category: string, createdTime: string, score: number): string {
  const hoursSincePost = Math.max(1, (Date.now() - new Date(createdTime).getTime()) / (1000 * 60 * 60))
  
  // Base views based on category and content score
  const categoryMultipliers = {
    MILITARY: 2.5,
    AI: 2.2,
    CONSPIRACY: 2.8,
    VIRAL: 3.0,
    SPACE: 1.8,
    TECH: 1.5,
    GENERAL: 1.0
  }
  
  const multiplier = categoryMultipliers[category as keyof typeof categoryMultipliers] || 1
  const baseViews = Math.floor((20000 + (score * 5000)) * multiplier)
  const viewGrowthPerHour = Math.random() * 800 + 200
  const totalViews = Math.floor(baseViews + (Math.sqrt(hoursSincePost) * viewGrowthPerHour))
  
  if (totalViews >= 1000000) {
    return `${(totalViews / 1000000).toFixed(1)}M views`
  } else if (totalViews >= 1000) {
    return `${Math.floor(totalViews / 1000)}K views`
  }
  return `${totalViews} views`
}

// Enhanced post processing
export function processFacebookPost(post: FacebookPost): ProcessedPost | null {
  const content = `${post.message || ''} ${post.story || ''}`.trim()
  
  if (!content || content.length < 20) return null

  // Categorize and score the content
  const { category, priority, score, confidence } = categorizeContent(content)
  
  // Skip posts that don't match House31's niche (require minimum relevance)
  if (category === 'GENERAL' || confidence < 0.05) return null

  // Enhanced title extraction
  let title = content.split(/[.!?]/)[0].trim()
  if (title.length < 20) {
    title = content.split(' ').slice(0, 12).join(' ')
  }
  title = title.slice(0, 100)
  
  // Enhanced description
  const description = content.length > 150 
    ? content.slice(0, 147) + '...'
    : content
  
  // Better thumbnail selection
  const thumbnailUrl = post.full_picture 
    || post.picture 
    || post.attachments?.data?.[0]?.media?.image?.src
    || `https://picsum.photos/400/225?random=${Math.abs(parseInt(post.id.split('_')[1] || '1000') || 1000)}`
  
  // Determine post type more accurately
  const hasVideo = post.attachments?.data?.some(att => att.type === 'video_inline') 
    || content.toLowerCase().includes('video')
    || content.toLowerCase().includes('watch')
    
  const hasLink = !!post.link || post.attachments?.data?.some(att => att.target?.url)
  
  const type: 'video' | 'link' | 'image' = hasVideo ? 'video' : hasLink ? 'link' : 'image'
  
  return {
    id: post.id,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description,
    thumbnailUrl,
    videoLink: hasVideo ? (post.link || post.attachments?.data?.[0]?.target?.url) : undefined,
    postDate: post.created_time,
    postUrl: post.permalink_url || `https://facebook.com/post/${post.id}`,
    type,
    category,
    slug: generateSlug(title),
    views: generateViewCount(category, post.created_time, score),
    priority,
    score
  }
}

// File operations
export async function saveToDataFile(data: unknown, filename: string): Promise<void> {
  const dataDir = join(process.cwd(), 'data')
  
  try {
    await mkdir(dataDir, { recursive: true })
  } catch {
    // Directory might already exist
  }
  
  const filePath = join(dataDir, filename)
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

export async function loadFromDataFile(filename: string): Promise<unknown> {
  try {
    const dataDir = join(process.cwd(), 'data')
    const filePath = join(dataDir, filename)
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

// Facebook API helper
export async function fetchFacebookPosts(
  pageId: string, 
  accessToken: string, 
  limit: number = 20
): Promise<FacebookPost[]> {
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

  const url = `https://graph.facebook.com/v18.0/${pageId}/posts?fields=${fields}&limit=${limit}&access_token=${accessToken}`

  const response = await fetch(url)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Facebook API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  return data.data || []
}
