# Music Payment and Download Website

A full-stack music album sales platform built with Next.js 15 (App Router), Supabase, Cloudflare R2, and Stripe. Features secure authentication, auth-gated downloads using pre-signed URLs, payment processing with automatic account provisioning, individual track downloads, and an admin gallery for photo management.

## Features

- 🎵 **Album Marketplace**: Browse and purchase music albums
- 🔐 **Secure Authentication**: Email/password authentication via Supabase
- 💳 **Stripe Checkout**: Secure payment processing with Stripe
- 📥 **Secure Downloads**: Auth-gated downloads using pre-signed URLs from Cloudflare R2
- 🎼 **Individual Track Downloads**: Download entire albums or individual tracks
- 📝 **Track Descriptions**: Each track can have its own description
- 🎨 **Admin Gallery**: Manage photo gallery with add/delete functionality
- ⚡ **Automatic Provisioning**: Stripe webhook automatically records purchases
- 🚀 **Production Ready**: Optimized for Vercel deployment
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Checkout + Webhooks
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cloudflare account (for R2)
- Stripe account

### 1. Clone the Repository

```bash
git clone https://github.com/ichad17/music-payment-and-download-website.git
cd music-payment-and-download-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-setup.sql`
3. Get your API keys from Settings → API

### 3.5. Set Up Cloudflare R2

1. Log in to your Cloudflare dashboard
2. Go to R2 → Create bucket
3. Name your bucket (e.g., `music-files`)
4. Create API token:
   - Go to R2 → Manage R2 API Tokens
   - Create API token with read and write permissions
   - Save the Access Key ID and Secret Access Key
5. Note your Account ID from the R2 dashboard
6. (Optional) Set up a custom domain for public access:
   - Go to your bucket settings → Connect Domain
   - Follow the instructions to connect a custom domain

### 4. Set Up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Get your API keys from Developers → API keys
3. Set up a webhook endpoint:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy the webhook signing secret

### 5. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cloudflare R2
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_PUBLIC_URL=your_r2_public_url

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
music-payment-and-download-website/
├── app/
│   ├── albums/[id]/         # Album detail pages
│   ├── admin/               # Admin dashboard
│   ├── api/
│   │   ├── checkout/        # Stripe checkout endpoint
│   │   ├── download/        # Album download (R2 pre-signed URL)
│   │   ├── download-track/  # Individual track download
│   │   ├── webhooks/stripe/ # Stripe webhook handler
│   │   └── admin/gallery/   # Gallery management API
│   ├── auth/                # Auth callback handlers
│   ├── downloads/           # User downloads page
│   ├── gallery/             # Public gallery
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── layout.tsx           # Root layout with nav
│   ├── page.tsx             # Home page (album listing)
│   └── globals.css          # Global styles
├── lib/
│   ├── supabase.ts          # Client-side Supabase client
│   ├── supabase-server.ts   # Server-side Supabase client
│   ├── stripe.ts            # Stripe configuration
│   └── r2.ts                # Cloudflare R2 client
├── types/
│   └── database.ts          # TypeScript database types
├── middleware.ts            # Auth middleware
├── supabase-setup.sql       # Database schema
└── next.config.js           # Next.js configuration
```

## Database Schema

### Albums Table
- `id` (UUID): Primary key
- `title` (TEXT): Album title
- `artist` (TEXT): Artist name
- `description` (TEXT): Album description
- `price` (NUMERIC): Price in USD
- `cover_image_url` (TEXT): Cover image URL
- `file_path` (TEXT): Path to file in Supabase Storage (legacy)
- `r2_url` (TEXT): Cloudflare R2 object key for album download

### Tracks Table
- `id` (UUID): Primary key
- `album_id` (UUID): Reference to albums
- `title` (TEXT): Track title
- `description` (TEXT): Track description
- `track_number` (INTEGER): Track number/order
- `r2_url` (TEXT): Cloudflare R2 object key for track download

### Purchases Table
- `id` (UUID): Primary key
- `user_id` (UUID): Reference to auth.users
- `album_id` (UUID): Reference to albums
- `stripe_payment_intent_id` (TEXT): Stripe payment reference
- `amount` (NUMERIC): Purchase amount

### Gallery Images Table
- `id` (UUID): Primary key
- `title` (TEXT): Image title
- `description` (TEXT): Image description
- `image_url` (TEXT): Image URL
- `display_order` (INTEGER): Display order

## Key Features Explained

### Secure Downloads with Cloudflare R2

When a user clicks download, the system:
1. Verifies the user is authenticated
2. Checks if the user purchased the album
3. Generates a temporary pre-signed URL from R2 (valid for 1 hour)
4. Returns the URL to the client

This ensures only authorized users can download purchased content while keeping costs low with R2's free egress.

### Individual Track Downloads

- Albums can have multiple tracks with descriptions
- Users who purchase an album can download individual tracks
- Each track has its own pre-signed URL for secure, authorized access
- Track listings appear on both album detail pages and the downloads page

### Stripe Webhook Integration

The webhook at `/api/webhooks/stripe`:
1. Verifies the webhook signature
2. Listens for `checkout.session.completed` events
3. Automatically creates a purchase record
4. Links the user to their purchased album

### Authentication Flow

- Sign up creates a new user account
- Email confirmation is required (configurable in Supabase)
- Middleware protects `/admin` and `/downloads` routes
- Session is managed via cookies

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
2. Update Stripe webhook URL to `https://your-domain.com/api/webhooks/stripe`
3. Update Supabase redirect URLs in Authentication settings
4. Configure R2 environment variables in Vercel project settings

## Usage

### Adding Albums

1. Upload album files to your Cloudflare R2 bucket
2. Add album records to Supabase database with the R2 object key in `r2_url`
3. (Optional) Add individual tracks to the `tracks` table with their own R2 URLs
4. Each track can have a `description` field for additional information

### Managing Gallery

1. Sign in to your account
2. Go to `/admin`
3. Use the Gallery Management section to add/remove images

### Testing Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Any future expiration date and CVC

## Troubleshooting

### Webhook not working

- Check webhook secret is correct
- Verify webhook URL is accessible
- Check Stripe dashboard for webhook logs

### Downloads not working

- Verify R2 credentials are correct in environment variables
- Check R2 object keys match the `r2_url` values in database
- Ensure user has purchased the album
- Check R2 bucket permissions and CORS settings if needed
- For legacy albums: Verify Supabase storage bucket exists and is named `albums`

### Build errors

- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions, please open an issue on GitHub.