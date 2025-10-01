# Music Payment and Download Website

A full-stack music album sales platform built with Next.js 15 (App Router), Supabase, and Stripe. Features secure authentication, auth-gated downloads using pre-signed URLs, payment processing with automatic account provisioning, and an admin gallery for photo management.

## Features

- 🎵 **Album Marketplace**: Browse and purchase music albums
- 🔐 **Secure Authentication**: Email/password authentication via Supabase
- 💳 **Stripe Checkout**: Secure payment processing with Stripe
- 📥 **Secure Downloads**: Auth-gated downloads using pre-signed URLs from Supabase Storage
- 🎨 **Admin Gallery**: Manage photo gallery with add/delete functionality
- ⚡ **Automatic Provisioning**: Stripe webhook automatically records purchases
- 🚀 **Production Ready**: Optimized for Vercel deployment
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Payments**: Stripe Checkout + Webhooks
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
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
3. Create a storage bucket named `albums`:
   - Go to Storage → Create bucket
   - Name: `albums`
   - Make it private (not public)
4. Get your API keys from Settings → API

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
│   │   ├── download/        # Pre-signed URL generator
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
│   └── stripe.ts            # Stripe configuration
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
- `file_path` (TEXT): Path to file in Supabase Storage

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

### Secure Downloads with Pre-signed URLs

When a user clicks download, the system:
1. Verifies the user is authenticated
2. Checks if the user purchased the album
3. Generates a temporary pre-signed URL (valid for 1 hour)
4. Returns the URL to the client

This ensures only authorized users can download purchased content.

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

## Usage

### Adding Albums

1. Add albums directly in Supabase database or create an admin UI
2. Upload album files to the `albums` storage bucket
3. Reference the file path in the `file_path` column

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

- Verify storage bucket exists and is named `albums`
- Check file paths match between database and storage
- Ensure user has purchased the album

### Build errors

- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions, please open an issue on GitHub.