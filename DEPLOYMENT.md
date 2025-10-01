# Deployment Checklist

Follow these steps to deploy your music album sales site to production.

## Pre-Deployment

### 1. Supabase Setup

- [ ] Create a production Supabase project
- [ ] Run `supabase-setup.sql` in SQL Editor
- [ ] Create `albums` storage bucket (private)
- [ ] Configure RLS policies (included in SQL file)
- [ ] Get production API keys from Settings → API
- [ ] Configure email templates in Authentication → Email Templates
- [ ] Set redirect URLs in Authentication → URL Configuration

### 2. Stripe Setup

- [ ] Switch from test mode to live mode in Stripe dashboard
- [ ] Get live API keys from Developers → API keys
- [ ] Create webhook endpoint for production URL
- [ ] Select `checkout.session.completed` event
- [ ] Copy webhook signing secret
- [ ] Test webhook delivery

### 3. Environment Variables

Create production environment variables:

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key

# Stripe (Live Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App URL (Production)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Deployment to Vercel

### Option 1: GitHub Integration (Recommended)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add environment variables**
   - Go to Project Settings → Environment Variables
   - Add all production environment variables
   - Select "Production" environment

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Note your production URL

### Option 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Add environment variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   # ... add all other variables
   ```

## Post-Deployment

### 1. Update Configurations

- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Update Stripe webhook URL to `https://your-domain.com/api/webhooks/stripe`
- [ ] Update Supabase redirect URLs to production domain
- [ ] Configure custom domain in Vercel (optional)

### 2. Add Content

- [ ] Upload album files to Supabase Storage
- [ ] Add albums to database via SQL or create admin UI
- [ ] Add initial gallery images
- [ ] Test complete purchase flow

### 3. Test Production

- [ ] Sign up with real email
- [ ] Verify email confirmation works
- [ ] Browse albums
- [ ] Test Stripe Checkout with test card (use test mode temporarily)
- [ ] Verify purchase is recorded
- [ ] Test download functionality
- [ ] Check admin dashboard
- [ ] Test gallery management
- [ ] Verify webhook is receiving events
- [ ] Check all pages load correctly
- [ ] Test mobile responsiveness

### 4. Switch to Live Mode

- [ ] Switch Stripe to live mode
- [ ] Update Stripe API keys in Vercel
- [ ] Test with real payment (small amount)
- [ ] Verify purchase and download work
- [ ] Monitor Stripe dashboard for events

## Security Checklist

- [ ] All API keys are in environment variables (not in code)
- [ ] Service role key is only used in server-side code
- [ ] Webhook signatures are verified
- [ ] RLS policies are enabled in Supabase
- [ ] Auth middleware protects sensitive routes
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Storage buckets are private (not public)
- [ ] Pre-signed URLs have limited validity

## Monitoring

### Vercel Analytics
- [ ] Enable Vercel Analytics in project settings
- [ ] Monitor page load times
- [ ] Check error rates

### Stripe Dashboard
- [ ] Monitor successful payments
- [ ] Check webhook delivery status
- [ ] Review failed payments

### Supabase Dashboard
- [ ] Monitor database usage
- [ ] Check storage usage
- [ ] Review auth logs

## Database Seeding (Optional)

Add sample data for testing:

```sql
-- Add a sample album
INSERT INTO albums (title, artist, description, price, file_path, cover_image_url)
VALUES (
  'Best Album Ever',
  'Amazing Artist',
  'This is the best album you will ever hear.',
  19.99,
  'albums/best-album.zip',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
);

-- Add gallery images
INSERT INTO gallery_images (title, description, image_url, display_order)
VALUES 
  ('Studio Session', 'Behind the scenes in the studio', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800', 0),
  ('Live Performance', 'Concert highlights', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', 1);
```

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

### Webhook Not Working
- Verify webhook URL is correct
- Check webhook secret matches
- Review Stripe webhook logs
- Ensure endpoint is accessible publicly

### Authentication Issues
- Check Supabase redirect URLs
- Verify email templates are configured
- Check NEXT_PUBLIC_APP_URL is correct

### Downloads Not Working
- Verify storage bucket exists and is named `albums`
- Check file paths in database match storage
- Ensure user has purchased the album
- Check pre-signed URL generation

## Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Monitor Core Web Vitals
- [ ] Optimize images (already using Next.js Image)
- [ ] Review bundle size
- [ ] Enable Vercel Edge Functions (if needed)

## Maintenance

### Regular Tasks
- Monitor error logs in Vercel
- Check Stripe payment success rate
- Review Supabase usage and costs
- Update dependencies monthly
- Back up database regularly

### Scaling Considerations
- Supabase automatically scales
- Vercel serverless functions auto-scale
- Monitor costs as traffic grows
- Consider CDN for large files
- Optimize database queries if needed

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Stripe webhook logs
3. Check Supabase dashboard for errors
4. Consult the troubleshooting section in README.md
5. Open an issue on GitHub

## Success!

Once all checklist items are complete:
- ✅ Your site is live and secure
- ✅ Payments are working
- ✅ Downloads are functional
- ✅ Users can sign up and purchase albums

Start promoting your music and generating sales!
