# Contributing Guide

Thank you for your interest in contributing to this project! This guide will help you get started.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ichad17/music-payment-and-download-website.git
   cd music-payment-and-download-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase and Stripe credentials
   - See README.md for detailed setup instructions

4. **Run development server**
   ```bash
   npm run dev
   ```

## Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Run `npm run lint` before committing
- **Formatting**: Follow existing code patterns
- **Components**: Use descriptive names and add comments for complex logic

## Making Changes

### Adding a New Page

1. Create a new directory under `app/`
2. Add a `page.tsx` file
3. Use Server Components by default
4. Add `'use client'` only if client interactivity is needed

Example:
```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1>New Page</h1>
      </div>
    </div>
  )
}
```

### Adding a New API Route

1. Create a new directory under `app/api/`
2. Add a `route.ts` file
3. Export async functions for HTTP methods

Example:
```typescript
// app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello' })
}
```

### Database Changes

1. Update the SQL schema in `supabase-setup.sql`
2. Update TypeScript types in `types/database.ts`
3. Test the changes locally with Supabase

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme:
  - Primary: blue-600
  - Background: gray-50
  - Text: gray-900
- Maintain responsive design with `sm:`, `md:`, `lg:` breakpoints

## Testing

While this project doesn't have automated tests yet, please:
1. Test your changes manually in the browser
2. Test authentication flows
3. Test payment flows with Stripe test cards
4. Check responsive design on mobile

## Commit Messages

Use clear, descriptive commit messages:
- `feat: Add user profile page`
- `fix: Resolve download button not working`
- `docs: Update README with new setup steps`
- `style: Fix layout issues on mobile`

## Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Create a Pull Request

### Pull Request Checklist

- [ ] Code follows existing style
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes tested manually
- [ ] Documentation updated if needed
- [ ] No console errors or warnings

## Common Tasks

### Adding a New Field to Albums

1. Update Supabase table:
   ```sql
   ALTER TABLE albums ADD COLUMN new_field TEXT;
   ```

2. Update TypeScript types:
   ```typescript
   // types/database.ts
   albums: {
     Row: {
       // ... existing fields
       new_field: string | null
     }
   }
   ```

3. Update UI to display/edit the field

### Adding Admin Features

1. Add UI in `app/admin/page.tsx` or create new admin page
2. Protect with middleware (already configured)
3. Create API route in `app/api/admin/`
4. Verify authentication in API route

### Integrating New Payment Methods

The current implementation uses Stripe Checkout. To add other payment methods:
1. Update `app/api/checkout/route.ts` to support new method
2. Add payment method selection in UI
3. Update webhook handler to process new method
4. Test thoroughly with test credentials

## Getting Help

- **Issues**: Check existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Read ARCHITECTURE.md for technical details

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).
