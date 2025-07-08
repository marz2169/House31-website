# House31 Facebook Sync Integration

## Overview
This integration automatically syncs Facebook posts from the House31 page to the Next.js website every 4 hours using n8n workflow automation.

## Components

### 1. n8n Workflow (`n8n-workflow-house31-facebook-sync.json`)
**Nodes:**
1. **Schedule Trigger** - Runs every 4 hours
2. **Facebook Get Posts** - Fetches latest 5 posts from Facebook Page
3. **Process Posts** - Filters and transforms data
4. **Filter: Has Content** - Only processes posts with videos/links
5. **Send to Next.js API** - POSTs data to `/api/sync`
6. **Log to Google Sheets** - Optional backup logging
7. **Log Success/No Content** - Workflow completion logging

### 2. Next.js API Endpoint (`/api/sync`)
- **POST**: Receives and processes Facebook data
- **GET**: Returns current sync status
- Validates incoming data
- Updates trending videos content
- Creates backup files

### 3. Data Management
- **facebook-sync.json** - Latest sync data
- **facebook-sync-backup.json** - Previous sync backup
- **trending-videos.json** - Processed data for homepage

## Setup Instructions

### Prerequisites
- n8n instance (cloud or self-hosted)
- Facebook Developer App with Page access
- Google Sheets (optional for logging)

### 1. Facebook App Setup
1. Create Facebook Developer App
2. Add Facebook Login product
3. Get Page Access Token with permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_read_user_content`

### 2. Environment Variables
Copy `.env.template` to `.env.local` and fill in:

```bash
# Facebook
FACEBOOK_PAGE_ID=your_facebook_page_id
FACEBOOK_ACCESS_TOKEN=your_access_token

# API
NEXTJS_API_URL=http://localhost:3004
API_SECRET_KEY=your_secure_random_key

# Google Sheets (Optional)
GOOGLE_SHEET_ID=your_sheet_id
```

### 3. n8n Setup
1. Import workflow JSON into n8n
2. Configure credentials:
   - **Facebook Graph API**: Add access token
   - **Google Sheets** (optional): OAuth2 setup
3. Set environment variables in n8n:
   - `FACEBOOK_PAGE_ID`
   - `NEXTJS_API_URL`
   - `API_SECRET_KEY`
   - `GOOGLE_SHEET_ID` (optional)

### 4. Google Sheets Setup (Optional)
Create sheet with headers:
- A1: "Sync Date"
- B1: "Title"
- C1: "Type"
- D1: "Post Date" 
- E1: "URL"
- F1: "Description"

## Data Flow

```
Facebook Page
    ↓ (Every 4 hours)
n8n Workflow
    ↓ (Fetches 5 latest posts)
Facebook Graph API
    ↓ (Filters video/link posts)
Data Processing
    ↓ (POST to /api/sync)
Next.js API
    ↓ (Updates files)
Homepage Content
    ↓ (Optional backup)
Google Sheets
```

## Data Structure

### Facebook Post (Input)
```typescript
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
```

### Trending Video (Output)
```typescript
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
```

## API Endpoints

### POST /api/sync
Receives Facebook post data from n8n workflow.

**Request:**
```json
{
  "posts": [
    {
      "id": "post_id",
      "title": "Post Title",
      "thumbnailUrl": "https://...",
      "description": "Post description",
      "videoLink": "https://...",
      "postDate": "2025-01-08T12:00:00Z",
      "postUrl": "https://facebook.com/...",
      "type": "video"
    }
  ],
  "source": "facebook",
  "workflowId": "house31-facebook-sync"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully synced 3 posts",
  "syncedAt": "2025-01-08T12:00:00Z",
  "posts": 3
}
```

### GET /api/sync
Returns current sync status.

**Response:**
```json
{
  "success": true,
  "posts": [...],
  "syncedAt": "2025-01-08T12:00:00Z",
  "source": "facebook",
  "postsCount": 3
}
```

## Monitoring & Troubleshooting

### n8n Workflow Logs
- Check execution history in n8n
- Monitor for Facebook API rate limits
- Verify credential validity

### Next.js API Logs
- Check server logs for API errors
- Verify data directory permissions
- Monitor file write operations

### Common Issues

1. **Facebook API Rate Limits**
   - Reduce sync frequency
   - Check app permissions

2. **Missing Posts**
   - Verify Facebook page has public posts
   - Check post types (videos/links only)

3. **API Connection Errors**
   - Verify NEXTJS_API_URL is correct
   - Check API_SECRET_KEY matches

## File Structure
```
house31/
├── src/app/api/sync/route.ts      # API endpoint
├── src/lib/syncData.ts            # Data utilities
├── src/components/TrendingVideos.tsx  # Updated component
├── data/
│   ├── facebook-sync.json         # Latest sync
│   ├── facebook-sync-backup.json  # Backup
│   ├── trending-videos.json       # Processed data
│   └── README.md                  # Data docs
├── n8n-workflow-house31-facebook-sync.json  # Workflow
└── .env.template                  # Environment template
```

## Security Considerations
- Store sensitive tokens in environment variables
- Use API_SECRET_KEY for endpoint authentication
- Regularly rotate Facebook access tokens
- Monitor API usage and logs

## Maintenance
- Facebook tokens may need periodic renewal
- Monitor workflow execution success rate
- Regular backup verification
- Update workflow if Facebook API changes
