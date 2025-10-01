# Architecture Overview

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router for modern routing
- **React 19**: Latest React with improved server components
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS v3**: Utility-first CSS framework for styling

### Backend
- **Next.js API Routes**: Serverless functions for backend logic
- **Supabase**: 
  - PostgreSQL database for data storage
  - Auth system for user authentication
  - Storage for file hosting with pre-signed URLs
- **Stripe**: Payment processing with checkout and webhooks

## Key Architecture Decisions

### 1. Server Components by Default
All pages use React Server Components by default for optimal performance. Client components are explicitly marked with `'use client'` directive only when needed for interactivity.

### 2. Auth Middleware
The `middleware.ts` file protects sensitive routes (`/admin`, `/downloads`) by checking authentication status before allowing access. This prevents unauthorized users from accessing protected content.

### 3. Secure File Downloads
Files are stored in private Supabase Storage buckets. Downloads work through:
1. User requests download
2. Server verifies user authentication and purchase
3. Server generates temporary pre-signed URL (1-hour validity)
4. User downloads file directly from Supabase Storage

This ensures only authorized users can access purchased content.

### 4. Webhook-Based Purchase Recording
Stripe payments use webhooks for reliability:
1. User completes payment on Stripe Checkout
2. Stripe sends webhook event to `/api/webhooks/stripe`
3. Server verifies webhook signature
4. Server records purchase in database

This approach is more reliable than client-side confirmation.

### 5. Type Safety
- TypeScript throughout the application
- Database types defined in `types/database.ts`
- Strict type checking enabled

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── albums/[id]/       # Dynamic album pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Auth handlers
│   ├── downloads/         # User downloads
│   ├── gallery/           # Public gallery
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Client-side Supabase
│   ├── supabase-server.ts # Server-side Supabase
│   └── stripe.ts          # Stripe configuration
├── types/                 # TypeScript types
│   └── database.ts        # Database schema types
└── middleware.ts          # Auth middleware
```

## Data Flow

### Purchase Flow
1. User browses albums on home page
2. User clicks album to view details
3. User clicks "Purchase Album"
4. If not authenticated, redirect to login
5. If authenticated, create Stripe Checkout session
6. Redirect user to Stripe Checkout
7. User completes payment
8. Stripe sends webhook to server
9. Server records purchase in database
10. User redirected to downloads page
11. User can download purchased album

### Download Flow
1. User navigates to `/downloads`
2. Middleware checks authentication
3. Server fetches user's purchases from database
4. User clicks download button
5. Client sends request to `/api/download`
6. Server verifies purchase
7. Server generates pre-signed URL
8. Server returns URL to client
9. Client opens download in new tab

### Gallery Management Flow
1. User navigates to `/admin`
2. Middleware checks authentication
3. Server fetches existing gallery images
4. User adds new image with URL, title, description
5. Client sends POST to `/api/admin/gallery`
6. Server inserts into database
7. Page refreshes to show new image
8. Public can view gallery at `/gallery`

## Security Considerations

### Authentication
- All authentication handled by Supabase Auth
- Sessions stored in secure cookies
- Middleware protects sensitive routes

### Payment Security
- No credit card data touches our servers
- Stripe Checkout handles all payment details
- Webhook signatures verified before processing

### File Access
- Files stored in private Supabase Storage buckets
- Pre-signed URLs have limited validity (1 hour)
- Purchase verification before generating URLs

### API Security
- Server-side validation for all operations
- Row Level Security (RLS) enabled in Supabase
- Service role key used only in secure server contexts

## Deployment

The application is designed for deployment on Vercel:
- Zero-configuration deployment
- Automatic HTTPS
- Edge network for global performance
- Environment variables configured in Vercel dashboard

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `NEXT_PUBLIC_APP_URL`: Application URL

## Scalability

The architecture is built to scale:
- Serverless functions auto-scale with traffic
- Supabase handles database scaling
- Stripe handles payment processing at scale
- Static pages cached by CDN
- Server components reduce client JavaScript
