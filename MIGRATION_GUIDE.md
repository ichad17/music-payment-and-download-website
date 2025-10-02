# Migration Guide: Supabase Storage to Cloudflare R2

This guide walks you through migrating from Supabase Storage to Cloudflare R2 for hosting music files.

## Why Migrate to R2?

- **Cost Savings**: Cloudflare R2 offers free egress (data transfer out), while Supabase charges for downloads
- **Scalability**: R2 is designed for high-volume data storage and delivery
- **Performance**: Cloudflare's global CDN ensures fast downloads worldwide
- **Individual Tracks**: New architecture supports downloading individual tracks with descriptions

## Prerequisites

- [ ] Cloudflare account
- [ ] Access to Supabase project
- [ ] Existing music files in Supabase Storage (if migrating)

## Step 1: Set Up Cloudflare R2

### 1.1 Create R2 Bucket

1. Log in to your Cloudflare dashboard
2. Navigate to R2 Object Storage
3. Click "Create bucket"
4. Enter a bucket name (e.g., `music-files`)
5. Select a location (or use auto)
6. Click "Create bucket"

### 1.2 Generate API Tokens

1. In R2 dashboard, click "Manage R2 API Tokens"
2. Click "Create API token"
3. Give it a name (e.g., `music-app-access`)
4. Set permissions:
   - Object Read
   - Object Write
5. (Optional) Apply to specific buckets only
6. Click "Create API token"
7. **Save the credentials**:
   - Access Key ID
   - Secret Access Key
   - Note your Account ID from the R2 overview page

### 1.3 (Optional) Configure Custom Domain

For better performance and branding:

1. Go to your bucket settings
2. Click "Connect Domain"
3. Enter your custom domain (e.g., `files.yourdomain.com`)
4. Add the required DNS records to your domain
5. Wait for verification

## Step 2: Update Environment Variables

Add the following to your `.env.local` file:

```env
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=your_bucket_name_here
R2_PUBLIC_URL=https://your-custom-domain.com  # Optional, or use R2 dev URL
```

If deploying to Vercel, add these as environment variables in your project settings.

## Step 3: Update Database Schema

Run the updated `supabase-setup.sql` in your Supabase SQL Editor to:
- Add `r2_url` column to the `albums` table
- Create the new `tracks` table
- Set up proper indexes and RLS policies

The migration is backward compatible - existing albums with `file_path` will continue to work.

## Step 4: Upload Files to R2

### Option A: Manual Upload via Dashboard

1. Go to your R2 bucket in Cloudflare dashboard
2. Click "Upload"
3. Upload your album files and individual tracks
4. Note the object keys (file paths) for each upload

### Option B: Programmatic Upload (Recommended for Bulk)

```bash
# Install AWS CLI or use wrangler CLI
npm install -g wrangler

# Configure wrangler
wrangler r2 bucket create music-files

# Upload files
wrangler r2 object put music-files/albums/album-name.zip --file ./local-path/album-name.zip
```

### File Organization Recommendation

```
r2-bucket/
├── albums/
│   ├── album-1.zip
│   ├── album-2.zip
│   └── album-3.zip
└── tracks/
    ├── album-1/
    │   ├── 01-track-name.mp3
    │   ├── 02-track-name.mp3
    │   └── 03-track-name.mp3
    └── album-2/
        ├── 01-track-name.mp3
        └── 02-track-name.mp3
```

## Step 5: Update Database Records

### 5.1 Update Existing Albums

For each album, update the `r2_url` field with the R2 object key:

```sql
UPDATE albums 
SET r2_url = 'albums/your-album.zip'
WHERE id = 'album-uuid-here';
```

### 5.2 Add Track Records

For each album, add individual tracks:

```sql
INSERT INTO tracks (album_id, title, description, track_number, r2_url)
VALUES 
  ('album-uuid', 'Track 1 Name', 'Description of track 1', 1, 'tracks/album-name/01-track.mp3'),
  ('album-uuid', 'Track 2 Name', 'Description of track 2', 2, 'tracks/album-name/02-track.mp3'),
  ('album-uuid', 'Track 3 Name', 'Description of track 3', 3, 'tracks/album-name/03-track.mp3');
```

## Step 6: Test Downloads

1. Deploy your updated application
2. Purchase a test album (or use existing purchase)
3. Navigate to `/downloads`
4. Verify:
   - Album download works
   - Individual track downloads work
   - Download URLs are pre-signed and time-limited
   - Unauthorized users cannot access downloads

## Step 7: (Optional) Migrate Existing Files

If you have existing files in Supabase Storage:

1. Download all files from Supabase Storage
2. Upload them to R2 using the methods above
3. Update database records with new R2 URLs
4. Test thoroughly before removing files from Supabase
5. Once confirmed working, delete files from Supabase to save costs

### Download Script Example

```javascript
// Download from Supabase
const { data, error } = await supabase.storage
  .from('albums')
  .download('path/to/file.zip')

// Save locally, then upload to R2
```

## Troubleshooting

### Downloads Return 403 Forbidden

- Check that R2 API credentials are correct
- Verify the bucket name matches
- Ensure the object key in database matches actual file in R2

### Pre-signed URLs Expire Immediately

- Check server time is synchronized
- Verify R2 credentials have not expired
- Ensure AWS SDK is properly configured

### Cannot Find Tracks

- Verify tracks table was created successfully
- Check that `album_id` foreign keys are correct
- Ensure track `r2_url` values point to existing files

### Legacy Albums Not Working

The system automatically falls back to Supabase Storage for albums without `r2_url`:
- Verify Supabase credentials are still valid
- Check that `file_path` values are correct
- Ensure Supabase storage bucket still exists

## Rollback Plan

If you need to rollback:

1. The `file_path` column still exists in the albums table
2. Albums without `r2_url` automatically use Supabase Storage
3. Simply don't populate `r2_url` field to continue using Supabase
4. Remove R2 environment variables to disable R2 functionality

## Cost Comparison

### Supabase Storage
- Storage: ~$0.021/GB/month
- Egress: ~$0.09/GB
- Example: 100GB storage + 1TB downloads = $90.10/month

### Cloudflare R2
- Storage: $0.015/GB/month
- Egress: **$0.00** (free)
- Example: 100GB storage + 1TB downloads = $1.50/month

**Potential savings**: ~$88/month for this example workload

## Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS SDK S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

## Support

If you encounter issues during migration:
1. Check the troubleshooting section above
2. Review the [README.md](README.md) for general setup
3. Open an issue on GitHub with details about your problem
