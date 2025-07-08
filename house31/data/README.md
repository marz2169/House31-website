# Data Directory

This directory contains synchronized data from external sources:

- `facebook-sync.json` - Latest Facebook posts sync
- `facebook-sync-backup.json` - Backup of previous sync
- `trending-videos.json` - Processed trending videos for homepage
- `.gitkeep` - Ensures directory is tracked in git

## API Endpoints

- `POST /api/sync` - Receives data from n8n workflow
- `GET /api/sync` - Returns current sync status and data
