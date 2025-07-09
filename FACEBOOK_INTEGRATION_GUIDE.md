# Facebook Page Integration Setup for House31

## 🎯 Overview
This guide will help you connect your Facebook page to automatically sync viral content to your House31 website based on your niche (AI, military, conspiracy, space, tech).

## 📋 Prerequisites

### 1. Facebook Developer Account
- Facebook Business/Personal account with page admin access
- Facebook Developer account (free)

### 2. Facebook Page Requirements
- Must be a public Facebook page
- You must be an admin of the page
- Page should post content related to House31's niche

## 🚀 Step-by-Step Setup

### Step 1: Create Facebook App

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/
   - Click "My Apps" → "Create App"

2. **Select App Type**
   - Choose "Business"
   - App Name: "House31 Content Sync"
   - Contact Email: your email

3. **Add Products**
   - Add "Facebook Login for Business"
   - Add "Marketing API" (for page access)

### Step 2: Configure App Permissions

1. **In App Dashboard:**
   - Go to "App Review" → "Permissions and Features"
   - Request these permissions:
     - `pages_show_list` (approved automatically)
     - `pages_read_engagement` (requires review)
     - `pages_read_user_content` (requires review)

2. **For Development (Immediate Access):**
   - Add your Facebook account as a test user
   - Use your personal account to generate tokens

### Step 3: Generate Page Access Token

#### Option A: Using Graph API Explorer (Quick Setup)
1. Go to: https://developers.facebook.com/tools/explorer/
2. Select your app from dropdown
3. Generate User Access Token with permissions:
   - `pages_show_list`
   - `pages_read_engagement` 
   - `pages_read_user_content`
4. Make GET request to: `/me/accounts`
5. Copy the `access_token` for your page from response

#### Option B: Programmatic Token Generation
```javascript
// Use this in your browser console on Facebook
// After logging into Facebook as page admin

fetch('https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_USER_TOKEN')
  .then(response => response.json())
  .then(data => {
    console.log('Your pages:', data);
    // Look for your page and copy its access_token
  });
```

### Step 4: Configure Environment Variables

Add these to your Vercel environment variables:

```env
# Facebook Integration
FACEBOOK_PAGE_ID=your_page_id_here
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_here
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here

# Webhook Security (optional)
FACEBOOK_WEBHOOK_SECRET=your_random_secret_string
```

### Step 5: Set Up Automation

#### Option A: n8n Workflow (Recommended)
1. **Install n8n** (cloud or self-hosted)
2. **Import the workflow:**
   ```bash
   # Use the provided n8n-workflow-house31-facebook-sync.json
   ```
3. **Configure nodes:**
   - Set Facebook credentials
   - Set your website API endpoint
   - Configure schedule (every 2-4 hours)

#### Option B: Vercel Cron Jobs
Add to your `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/facebook-sync/cron",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

## 🔧 Content Filtering Rules

The integration automatically filters Facebook posts based on these categories:

### High Priority Categories
- **MILITARY**: military, army, navy, defense, weapons, drones
- **AI**: artificial intelligence, machine learning, ChatGPT, automation
- **CONSPIRACY**: secrets, classified, leaked, government, Area 51
- **VIRAL**: trending, breaking news, exclusive, shocking

### Medium Priority Categories  
- **SPACE**: NASA, SpaceX, Mars, rockets, space exploration
- **TECH**: technology, innovation, quantum, cyber, digital

### Content Requirements
- Posts must contain relevant keywords (minimum 10% match)
- Must have text content (not just images)
- Automatically generates engaging titles and descriptions
- Creates SEO-friendly slugs for URLs

## 📊 Testing Your Integration

### 1. Test API Endpoint
```bash
# Test the sync endpoint
curl -X GET https://your-domain.com/api/facebook-sync

# Should return current sync status
```

### 2. Manual Sync Test
```bash
# POST test data to trigger sync
curl -X POST https://your-domain.com/api/facebook-sync \
  -H "Content-Type: application/json" \
  -d '{"posts": [...]}'
```

### 3. Check Data Files
- `/data/facebook-sync.json` - Latest synced posts
- `/data/trending-videos.json` - Processed video content
- `/data/facebook-sync-backup.json` - Previous sync backup

## 🔐 Security Considerations

### Page Access Token Security
- Never commit tokens to GitHub
- Use environment variables only
- Tokens expire - set up refresh mechanism
- Monitor token usage in Facebook Developer console

### Rate Limiting
- Facebook allows 200 calls per hour per app
- Sync every 4 hours to stay within limits
- Monitor API usage in Facebook Analytics

### Content Moderation
- Review synced content regularly
- Set up manual approval for sensitive topics
- Monitor for policy violations

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid Access Token"**
   - Token expired - regenerate in Graph API Explorer
   - Wrong permissions - check page admin status
   - App not approved - submit for review

2. **"No Posts Found"**
   - Page has no recent posts
   - Posts don't match content filters
   - Privacy settings blocking access

3. **"Sync Not Working"**
   - Check environment variables
   - Verify API endpoint is accessible
   - Check n8n workflow logs

### Debug Steps
1. Test Facebook API directly in Graph API Explorer
2. Check Vercel function logs
3. Verify data files are being created
4. Test with manual API calls

## 📈 Content Optimization Tips

### For Better Sync Results
1. **Use relevant hashtags** in Facebook posts
2. **Include keywords** from House31's niche categories
3. **Post videos and links** (not just text)
4. **Use engaging titles** that match viral content style
5. **Post regularly** (2-3 times per day)

### Content Ideas That Sync Well
- Breaking military tech news
- AI breakthrough announcements  
- Space exploration updates
- Conspiracy theory discussions
- Viral tech trends

## 🎯 Expected Results

After setup, your website will automatically:
- ✅ Sync new Facebook posts every 4 hours
- ✅ Filter content to match House31's niche
- ✅ Create video pages with proper SEO
- ✅ Generate trending content for homepage
- ✅ Maintain backup of all synced data

## 📞 Support

If you need help with the integration:
1. Check Facebook Developer documentation
2. Test API endpoints manually
3. Review n8n workflow logs
4. Verify environment variables are correct

---

**Next Steps:** Once Facebook integration is working, consider adding:
- Instagram sync (similar API)
- Twitter/X integration
- YouTube channel sync
- Manual content upload interface
