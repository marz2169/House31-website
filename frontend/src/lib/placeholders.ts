/**
 * Generates placeholder images as data URIs to avoid external dependencies
 */

export function generatePlaceholder(
  width: number,
  height: number,
  text?: string,
  backgroundColor = '#e5e7eb',
  textColor = '#6b7280'
): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    // Fallback to a simple data URI if canvas is not available
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${backgroundColor}"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="${textColor}" font-family="Arial, sans-serif" font-size="14">${text || `${width}x${height}`}</text>
      </svg>
    `)}`
  }

  canvas.width = width
  canvas.height = height

  // Fill background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)

  // Add text
  if (text || (width && height)) {
    const displayText = text || `${width}×${height}`
    ctx.fillStyle = textColor
    ctx.font = '14px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(displayText, width / 2, height / 2)
  }

  return canvas.toDataURL('image/png')
}

/**
 * Generates a placeholder URL compatible with via.placeholder.com format
 */
export function createPlaceholderUrl(
  width: number,
  height: number,
  text?: string,
  backgroundColor?: string,
  textColor?: string
): string {
  return generatePlaceholder(width, height, text, backgroundColor, textColor)
}

/**
 * Replaces via.placeholder.com URLs with local data URIs
 */
export function replacePlaceholderUrl(url: string): string {
  // Check if it's a placeholder URL
  const placeholderMatch = url.match(/(?:via\.placeholder\.com|placeholder\.com)\/(\d+)x(\d+)/)
  
  if (!placeholderMatch) {
    return url
  }

  const width = parseInt(placeholderMatch[1])
  const height = parseInt(placeholderMatch[2])

  // Extract text from URL parameters
  const urlParams = new URLSearchParams(url.split('?')[1] || '')
  const text = urlParams.get('text') || `${width}×${height}`

  return generatePlaceholder(width, height, text)
}

/**
 * Get a reliable placeholder image URL using picsum.photos
 */
export function getReliablePlaceholder(
  width: number,
  height: number,
  seed?: number | string
): string {
  // Use picsum.photos as primary service
  const baseUrl = 'https://picsum.photos';
  const dimensions = `${width}/${height}`;
  
  if (seed !== undefined) {
    return `${baseUrl}/${dimensions}?random=${seed}`;
  }
  
  return `${baseUrl}/${dimensions}`;
}

/**
 * Get category-specific placeholder with fallbacks
 */
export function getCategoryPlaceholder(
  category: string,
  width: number,
  height: number,
  index?: number
): string {
  // Create a more unique seed by combining category, index, and random factor
  const uniqueSeed = index !== undefined 
    ? Math.abs((category + index.toString()).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0)) + index * 17 + Math.floor(Date.now() / 86400000) // Changes daily
    : Math.abs(category.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0));
  
  // Try picsum first with unique seed
  try {
    return getReliablePlaceholder(width, height, uniqueSeed);
  } catch {
    // Fallback to generated placeholder
    return generatePlaceholder(width, height, category.charAt(0).toUpperCase() + category.slice(1));
  }
}

/**
 * Generate diverse mock data for different categories
 */
export function generateMockPosts(category: 'news' | 'entertainment' | 'videos', count: number = 9) {
  const mockData = {
    news: {
      titles: [
        "Breaking: Major Economic Policy Changes Announced",
        "Global Climate Summit Reaches Historic Agreement", 
        "Technology Innovation Transforms Healthcare Sector",
        "International Trade Relations Show Positive Trends",
        "Education Reform Initiative Gains Momentum",
        "Infrastructure Development Project Approved",
        "Scientific Breakthrough in Renewable Energy",
        "Social Media Regulation Updates Introduced",
        "Space Exploration Mission Sets New Records"
      ],
      excerpts: [
        "Government officials announce sweeping changes to economic policies that could reshape the financial landscape...",
        "World leaders unite in unprecedented climate action agreement with binding commitments for carbon reduction...",
        "Revolutionary medical technology promises to transform patient care and treatment outcomes globally...",
        "New trade partnerships signal stronger international cooperation and economic recovery prospects...",
        "Comprehensive education reforms aim to modernize curriculum and improve student outcomes nationwide...",
        "Multi-billion dollar infrastructure investment will create jobs and improve transportation networks...",
        "Scientists achieve major milestone in clean energy technology that could revolutionize power generation...",
        "New regulations for social media platforms focus on user privacy and content moderation standards...",
        "Historic space mission achieves groundbreaking discoveries about distant galaxies and cosmic phenomena..."
      ]
    },
    entertainment: {
      titles: [
        "Award-Winning Director Announces New Film Project",
        "Streaming Platform Unveils Exclusive Series Lineup",
        "Music Festival Returns with Star-Studded Performance",
        "Hollywood Studio Announces Major Franchise Reboot",
        "Celebrity Chef Opens Revolutionary Restaurant",
        "Broadway Musical Adaptation Heads to Silver Screen",
        "Documentary Film Wins International Recognition",
        "Gaming Industry Celebrates Record-Breaking Release",
        "Fashion Week Showcases Sustainable Design Trends"
      ],
      excerpts: [
        "Acclaimed filmmaker reveals ambitious new project featuring an ensemble cast and groundbreaking cinematography...",
        "Popular streaming service announces exclusive content partnerships with renowned creators and studios...",
        "Annual music celebration returns with diverse lineup featuring both established and emerging artists...",
        "Major entertainment studio plans fresh take on beloved franchise with modern storytelling approach...",
        "Celebrity culinary expert introduces innovative dining concept combining technology and gastronomy...",
        "Tony Award-winning musical receives film adaptation treatment from renowned production company...",
        "Independent documentary earns critical acclaim and international film festival recognition worldwide...",
        "Video game industry celebrates successful launch of highly anticipated interactive entertainment experience...",
        "Fashion industry leaders demonstrate commitment to environmental sustainability through innovative designs..."
      ]
    },
    videos: {
      titles: [
        "Exclusive Behind-the-Scenes: Movie Production Journey",
        "Viral Challenge Takes Social Media by Storm",
        "Documentary Series: Wildlife Conservation Efforts", 
        "Tech Review: Latest Gadgets and Innovations",
        "Travel Vlog: Hidden Gems Around the World",
        "Cooking Masterclass: Professional Chef Techniques",
        "Fitness Tutorial: Complete Home Workout Guide",
        "Educational Content: Science Experiments Explained",
        "Music Video Premiere: Rising Artist Showcase"
      ],
      excerpts: [
        "Go behind the cameras to see how blockbuster movies are made, featuring interviews with cast and crew...",
        "New social media phenomenon captures millions of participants worldwide with creative and entertaining content...",
        "Comprehensive look at global conservation efforts and their impact on endangered species protection...",
        "In-depth analysis of cutting-edge technology products and their practical applications for consumers...",
        "Discover amazing destinations off the beaten path with insider tips and local cultural insights...",
        "Professional culinary techniques demonstrated step-by-step for home cooking enthusiasts...",
        "Complete fitness routine designed for all skill levels with modifications and safety guidelines...",
        "Complex scientific concepts made accessible through engaging demonstrations and clear explanations...",
        "Talented emerging musician debuts original composition with stunning visual storytelling and production..."
      ]
    }
  };

  const categoryData = mockData[category as keyof typeof mockData];
  if (!categoryData) {
    throw new Error(`Unknown category: ${category}`);
  }

  return Array.from({ length: count }, (_, i) => ({
    _id: `${category}-${i + 1}-${Date.now()}`,
    title: categoryData.titles[i % categoryData.titles.length],
    content: 'Full article content...',
    excerpt: categoryData.excerpts[i % categoryData.excerpts.length],
    category,
    slug: `${category}-story-${i + 1}-${Date.now()}`,
    featuredImage: getCategoryPlaceholder(category, 400, category === 'videos' ? 225 : 200, i + 1),
    videoUrl: category === 'videos' ? getVideoUrl(i) : undefined,
    author: getAuthorName(category),
    publishedAt: new Date(Date.now() - i * (category === 'news' ? 7200000 : category === 'entertainment' ? 10800000 : 86400000)).toISOString(),
    createdAt: new Date(Date.now() - i * (category === 'news' ? 7200000 : category === 'entertainment' ? 10800000 : 86400000)).toISOString(),
    updatedAt: new Date(Date.now() - i * (category === 'news' ? 7200000 : category === 'entertainment' ? 10800000 : 86400000)).toISOString(),
    tags: getTags(category),
  }));
}

function getVideoUrl(index: number): string {
  const videoUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://vimeo.com/90509568',
    'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    'https://www.youtube.com/watch?v=9bZkp7q19f0',
    'https://vimeo.com/148751763'
  ];
  return videoUrls[index % videoUrls.length];
}

function getAuthorName(category: string): string {
  const authors = {
    news: ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Thompson'],
    entertainment: ['Jessica Parker', 'Ryan Mitchell', 'Amanda Foster', 'Chris Morgan'],
    videos: ['Alex Turner', 'Maya Patel', 'Jordan Williams', 'Taylor Brooks']
  };
  
  const categoryAuthors = authors[category as keyof typeof authors] || authors.news;
  return categoryAuthors[Math.floor(Math.random() * categoryAuthors.length)];
}

function getTags(category: string): string[] {
  const tags = {
    news: ['breaking', 'news', 'important', 'current-events'],
    entertainment: ['entertainment', 'celebrity', 'hollywood', 'trending'],
    videos: ['video', 'entertainment', 'trending', 'must-watch']
  };
  
  return tags[category as keyof typeof tags] || tags.news;
}
