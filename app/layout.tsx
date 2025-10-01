import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Music Album Store',
  description: 'Buy and download exclusive music albums',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold">
                  Music Store
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="hover:text-gray-300">
                  Albums
                </Link>
                <Link href="/gallery" className="hover:text-gray-300">
                  Gallery
                </Link>
                {user ? (
                  <>
                    <Link href="/downloads" className="hover:text-gray-300">
                      My Downloads
                    </Link>
                    <Link href="/admin" className="hover:text-gray-300">
                      Admin
                    </Link>
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="hover:text-gray-300"
                      >
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="hover:text-gray-300">
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
