import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GalleryManager from './GalleryManager'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get gallery images
  const { data: images, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching gallery images:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your music store and gallery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Links
            </h2>
            <div className="space-y-2">
              <Link
                href="/downloads"
                className="block text-blue-600 hover:text-blue-800"
              >
                View My Downloads
              </Link>
              <Link
                href="/gallery"
                className="block text-blue-600 hover:text-blue-800"
              >
                View Public Gallery
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Instructions
            </h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Database Setup:</strong> Create tables in Supabase:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>albums</li>
                <li>purchases</li>
                <li>gallery_images</li>
              </ul>
              <p className="mt-2">
                <strong>Storage:</strong> Create an &quot;albums&quot; bucket in Supabase Storage.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Gallery Management
          </h2>
          <GalleryManager images={images || []} />
        </div>
      </div>
    </div>
  )
}
