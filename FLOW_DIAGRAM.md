# Application Flow Diagrams

## User Purchase Flow

```
┌─────────────┐
│   Browse    │
│   Albums    │
│   (Home)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Select    │
│   Album     │
│  (Detail)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Click     │─────▶│ Not Logged   │
│  Purchase   │      │   In?        │
└─────────────┘      └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Redirect to │
                     │   Login      │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  User Logs   │
                     │     In       │
                     └──────┬───────┘
                            │
       ┌────────────────────┘
       │
       ▼
┌─────────────┐
│   Create    │
│   Stripe    │
│  Checkout   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Redirect   │
│  to Stripe  │
│  Checkout   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    User     │
│  Completes  │
│   Payment   │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Stripe    │─────▶│   Webhook    │
│   Sends     │      │   Records    │
│  Webhook    │      │  Purchase    │
└─────────────┘      └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Redirect to │
                     │  Downloads   │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  User Can    │
                     │  Download    │
                     │  Album       │
                     └──────────────┘
```

## Download Flow

```
┌─────────────┐
│   User at   │
│  Downloads  │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Display    │
│  Purchased  │
│   Albums    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Click     │
│  Download   │
│   Button    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Request   │
│  /api/      │
│  download   │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Verify    │─────▶│ Check Auth   │
│    User     │      │ & Purchase   │
└─────────────┘      └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Generate    │
                     │  Pre-signed  │
                     │   URL (1hr)  │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Return URL  │
                     │  to Client   │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  User Opens  │
                     │  URL in New  │
                     │    Tab       │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Browser    │
                     │  Downloads   │
                     │   from       │
                     │  Supabase    │
                     └──────────────┘
```

## Authentication Flow

```
┌─────────────┐
│   Signup    │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Enter      │
│  Email &    │
│  Password   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Supabase   │
│  Creates    │
│  Account    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Sends      │
│  Email      │
│  Verification│
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   User      │─────▶│  Clicks Link │
│  Receives   │      │  in Email    │
│   Email     │      └──────┬───────┘
└─────────────┘             │
                            ▼
                     ┌──────────────┐
                     │  /auth/      │
                     │  callback    │
                     │  Verifies    │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Account     │
                     │  Confirmed   │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  User Can    │
                     │  Login       │
                     └──────────────┘
```

## Gallery Management Flow

```
┌─────────────┐
│  Admin      │
│  Dashboard  │
│  /admin     │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│ Middleware  │─────▶│ Check Auth   │
│  Protects   │      │ Status       │
│  Route      │      └──────┬───────┘
└─────────────┘             │
                            ▼
                     ┌──────────────┐
                     │ Load Gallery │
                     │   Images     │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Admin Adds   │
                     │ New Image    │
                     │ (Title, URL) │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ POST to      │
                     │ /api/admin/  │
                     │  gallery     │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Insert into  │
                     │  Database    │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Refresh Page │
                     │ Show New     │
                     │ Image        │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Public Can   │
                     │ View at      │
                     │ /gallery     │
                     └──────────────┘
```

## Database Schema

```
┌────────────────────┐
│      albums        │
├────────────────────┤
│ id (UUID)          │
│ title              │
│ artist             │
│ description        │
│ price              │
│ cover_image_url    │
│ file_path          │
│ created_at         │
└────────┬───────────┘
         │
         │ FK
         │
         ▼
┌────────────────────┐      ┌──────────────────┐
│    purchases       │◀─────│  auth.users      │
├────────────────────┤      │  (Supabase)      │
│ id (UUID)          │      └──────────────────┘
│ user_id (FK)       │
│ album_id (FK)      │
│ stripe_payment_id  │
│ amount             │
│ created_at         │
└────────────────────┘


┌────────────────────┐
│  gallery_images    │
├────────────────────┤
│ id (UUID)          │
│ title              │
│ description        │
│ image_url          │
│ display_order      │
│ created_at         │
└────────────────────┘
```

## Component Architecture

```
app/
├── layout.tsx (Root)
│   ├── Navigation Bar
│   │   ├── Logo/Home Link
│   │   ├── Albums Link
│   │   ├── Gallery Link
│   │   └── Auth Links
│   └── {children}
│
├── page.tsx (Home)
│   └── Album Grid
│       └── Album Cards
│
├── albums/[id]/
│   ├── page.tsx
│   │   ├── Album Details
│   │   └── CheckoutButton (client)
│   └── CheckoutButton.tsx
│       └── Stripe Integration
│
├── login/
│   └── page.tsx (client)
│       └── Login Form
│
├── signup/
│   └── page.tsx (client)
│       └── Signup Form
│
├── downloads/
│   ├── page.tsx
│   │   ├── Purchase List
│   │   └── DownloadButton (client)
│   └── DownloadButton.tsx
│       └── Download Logic
│
├── gallery/
│   └── page.tsx
│       └── Image Grid
│
├── admin/
│   ├── page.tsx
│   │   ├── Quick Links
│   │   └── GalleryManager (client)
│   └── GalleryManager.tsx
│       ├── Add Image Form
│       └── Image List
│
└── api/
    ├── checkout/
    │   └── route.ts (Stripe)
    ├── download/
    │   └── route.ts (Pre-signed URLs)
    ├── webhooks/stripe/
    │   └── route.ts (Webhook Handler)
    └── admin/gallery/
        └── route.ts (CRUD)
```

## Security Layers

```
┌─────────────────────────────────────┐
│         Browser (Client)            │
│  - Uses Next.js Image component     │
│  - Handles redirects                │
│  - Stores auth cookies              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Middleware                  │
│  - Checks authentication            │
│  - Protects /admin & /downloads     │
│  - Refreshes sessions               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Server Components/Routes       │
│  - Verifies auth server-side        │
│  - Checks purchase ownership        │
│  - Validates webhook signatures     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Supabase                    │
│  - Row Level Security (RLS)         │
│  - Auth management                  │
│  - Private storage buckets          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      External Services              │
│  - Stripe: Payment processing       │
│  - Supabase Storage: File hosting   │
└─────────────────────────────────────┘
```

## Data Flow: Purchase to Download

```
User Action          →  API Call           →  Database          →  Result
─────────────────────────────────────────────────────────────────────────────

1. Browse Albums    →  GET /              →  SELECT albums     →  List albums
2. View Album       →  GET /albums/[id]   →  SELECT album      →  Show details
3. Click Purchase   →  POST /api/checkout →  CHECK user_id     →  Create session
4. Pay on Stripe    →  (External)         →  -                 →  Process payment
5. Stripe Webhook   →  POST /api/webhook  →  INSERT purchase   →  Record sale
6. View Downloads   →  GET /downloads     →  SELECT purchases  →  Show owned
7. Click Download   →  POST /api/download →  VERIFY purchase   →  Generate URL
8. Download File    →  (Supabase Storage) →  -                 →  Get file
```

All flows are secured by authentication checks, purchase verification, and webhook signature validation.
