# GitHub Copilot Instructions

This file provides instructions for GitHub Copilot coding agent when working on this repository.

## Project Overview

This is a music payment and download website built with Next.js 15, Supabase, and Stripe. The application allows users to browse music albums, purchase them via Stripe Checkout, and download their purchased albums using secure pre-signed URLs.

## Tech Stack

### Frontend
- **Next.js 15** with App Router (React Server Components by default)
- **React 19** 
- **TypeScript** (strict mode enabled)
- **Tailwind CSS v3** for styling

### Backend
- **Next.js API Routes** (serverless functions)
- **Supabase**:
  - PostgreSQL database with Row Level Security (RLS)
  - Authentication system
  - Storage with private buckets for album files
- **Stripe**: Payment processing with Checkout and webhooks

## Architecture

### Key Principles
1. **Server Components by Default**: Use React Server Components for all pages unless client interactivity is needed. Only mark components with `'use client'` when necessary.
2. **Type Safety**: TypeScript is used throughout. Database types are defined in `types/database.ts`.
3. **Security First**: Authentication via middleware, RLS policies, webhook signature verification, and private storage with pre-signed URLs.
4. **Serverless**: All API routes are serverless functions that auto-scale.

### Directory Structure
```
app/
├── albums/[id]/         # Dynamic album detail pages
├── admin/               # Admin dashboard (protected)
├── api/                 # API routes
│   ├── checkout/        # Stripe checkout session creation
│   ├── download/        # Generate pre-signed download URLs
│   ├── webhooks/stripe/ # Stripe webhook handler
│   └── admin/gallery/   # Gallery management API
├── auth/                # Auth callback handlers
├── downloads/           # User downloads page (protected)
├── gallery/             # Public gallery
├── login/               # Login page
├── signup/              # Signup page
├── layout.tsx           # Root layout with navigation
└── page.tsx             # Home page (album listing)

lib/
├── supabase.ts          # Client-side Supabase client
├── supabase-server.ts   # Server-side Supabase client
└── stripe.ts            # Stripe configuration

types/
└── database.ts          # TypeScript database schema types

middleware.ts            # Auth middleware (protects /admin and /downloads)
```

## Coding Guidelines

### TypeScript
- Always use TypeScript for new files
- Use proper type annotations
- Avoid `any` types - use proper types from `types/database.ts`
- Import types from Supabase and Stripe packages when needed

### React Components
- Use Server Components by default (no `'use client'` directive)
- Only add `'use client'` when you need:
  - Event handlers (onClick, onChange, etc.)
  - React hooks (useState, useEffect, etc.)
  - Browser APIs
  - Client-side libraries
- Use descriptive component and variable names
- Add comments only for complex logic

### API Routes
- Structure: `app/api/[feature]/route.ts`
- Export async functions: `GET`, `POST`, `PUT`, `DELETE`
- Always validate inputs
- Use `NextResponse.json()` for responses
- Handle errors gracefully with appropriate status codes
- Verify authentication when needed using Supabase server client

### Styling
- Use Tailwind CSS utility classes
- Follow existing color scheme:
  - Primary: `blue-600`
  - Background: `gray-50`
  - Text: `gray-900`
- Maintain responsive design with breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Use existing spacing and layout patterns from other pages

### Database
- Database schema is in `supabase-setup.sql`
- Always update TypeScript types in `types/database.ts` when schema changes
- Use Row Level Security (RLS) policies for data access control
- Server-side: Use `createServerSupabaseClient()` from `lib/supabase-server.ts`
- Client-side: Use `createClientSupabaseClient()` from `lib/supabase.ts`

### Authentication
- Protected routes are handled by `middleware.ts` (currently `/admin` and `/downloads`)
- To protect a new route, add it to the matcher in `middleware.ts`
- Always verify authentication in API routes that need it
- Use server-side Supabase client to get user: `await supabase.auth.getUser()`

### Payments
- Use Stripe Checkout for payments
- Create checkout sessions in `app/api/checkout/route.ts`
- Handle payment confirmations via webhooks in `app/api/webhooks/stripe/route.ts`
- Always verify webhook signatures before processing
- Record purchases in `purchases` table after successful payment

### File Downloads
- Files stored in private Supabase Storage bucket named `albums`
- Generate pre-signed URLs (1-hour validity) in `app/api/download/route.ts`
- Always verify user owns the album before generating URL
- Return URL to client, let browser handle download

## Testing

This project currently uses manual testing:
1. Test changes in browser at `http://localhost:3000`
2. Test authentication flows (signup, login, logout)
3. Test payment flows with Stripe test cards
4. Test download functionality for purchased albums
5. Test responsive design on mobile and desktop
6. Check for console errors or warnings

Before committing:
- Run `npm run lint` to check for linting errors
- Run `npm run build` to ensure build succeeds
- Test functionality manually

## Common Patterns

### Creating a New Page
```typescript
// app/new-page/page.tsx
export default async function NewPage() {
  // Server component - can fetch data here
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900">New Page</h1>
      </div>
    </div>
  )
}
```

### Creating a Client Component
```typescript
// components/InteractiveComponent.tsx
'use client'

import { useState } from 'react'

export default function InteractiveComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

### Creating an API Route
```typescript
// app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  
  // Verify authentication if needed
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Your logic here
  return NextResponse.json({ message: 'Success' })
}
```

### Fetching Data in Server Component
```typescript
// app/some-page/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function SomePage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: albums, error } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching albums:', error)
  }
  
  return (
    <div>
      {albums?.map(album => (
        <div key={album.id}>{album.title}</div>
      ))}
    </div>
  )
}
```

## Security Best Practices

1. **Never commit secrets**: Use environment variables for all API keys and secrets
2. **Verify webhooks**: Always verify Stripe webhook signatures before processing
3. **Protect routes**: Use middleware for route protection, verify auth in API routes
4. **Private storage**: Keep album files in private buckets, use pre-signed URLs
5. **RLS policies**: Enable and test Row Level Security policies in Supabase
6. **Input validation**: Validate all user inputs in API routes
7. **Service role key**: Only use `SUPABASE_SERVICE_ROLE_KEY` in server-side code, never expose to client

## Environment Variables

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (safe for client)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (safe for client)
- `STRIPE_SECRET_KEY`: Stripe secret key (server-only)
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret (server-only)
- `NEXT_PUBLIC_APP_URL`: Application URL (e.g., http://localhost:3000 for dev)

## Deployment

The application is designed for Vercel:
- Push to GitHub to trigger automatic deployment
- Configure environment variables in Vercel dashboard
- Update Stripe webhook URL to production domain
- Ensure Supabase redirect URLs include production domain

See `DEPLOYMENT.md` for complete deployment checklist.

## Additional Resources

- `README.md`: Setup instructions and project overview
- `ARCHITECTURE.md`: Detailed architecture documentation
- `CONTRIBUTING.md`: Contributing guidelines and common tasks
- `DEPLOYMENT.md`: Deployment checklist and procedures
- `supabase-setup.sql`: Database schema and RLS policies

## When Making Changes

1. **Understand the context**: Review existing code and documentation before making changes
2. **Follow patterns**: Match existing code style and patterns
3. **Test thoroughly**: Manual testing is required for all changes
4. **Update docs**: Update documentation if changing architecture or adding features
5. **Keep it simple**: Make minimal changes to achieve the goal
6. **Security first**: Always consider security implications of changes
