import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DownloadButton from './DownloadButton'

export default async function DownloadsPage() {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all purchases for the user
  const { data: purchases, error } = await supabase
    .from('purchases')
    .select('*, albums(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching purchases:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Downloads
        </h1>

        {purchases && purchases.length > 0 ? (
          <div className="space-y-6">
            {purchases.map((purchase: any) => (
              <div
                key={purchase.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {purchase.albums.title}
                    </h2>
                    <p className="text-gray-600">{purchase.albums.artist}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Purchased on{' '}
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <DownloadButton
                    albumId={purchase.album_id}
                    albumTitle={purchase.albums.title}
                    filePath={purchase.albums.file_path}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You haven&apos;t purchased any albums yet.
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Browse Albums →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
