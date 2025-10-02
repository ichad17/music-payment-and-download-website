import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import CheckoutButton from './CheckoutButton'

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  
  const { data: album, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !album) {
    notFound()
  }

  // Get tracks for this album
  const { data: tracks } = await supabase
    .from('tracks')
    .select('*')
    .eq('album_id', id)
    .order('track_number', { ascending: true })

  // Check if user already purchased this album
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let hasPurchased = false
  if (user) {
    const { data: purchase } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('album_id', album.id)
      .single()

    hasPurchased = !!purchase
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              {album.cover_image_url ? (
                <div className="relative h-96 md:h-full w-full">
                  <Image
                    src={album.cover_image_url}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-96 md:h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-9xl">♪</span>
                </div>
              )}
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {album.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">{album.artist}</p>
              <p className="text-gray-700 mb-8">{album.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-blue-600">
                  ${album.price}
                </span>
              </div>
              {hasPurchased ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded mb-4">
                  <p className="font-semibold">You own this album!</p>
                  <p className="text-sm mt-2">
                    <a
                      href="/downloads"
                      className="text-green-800 hover:underline"
                    >
                      Go to Downloads →
                    </a>
                  </p>
                </div>
              ) : (
                <CheckoutButton
                  albumId={album.id}
                  albumTitle={album.title}
                  price={album.price}
                  isAuthenticated={!!user}
                />
              )}
            </div>
          </div>

          {tracks && tracks.length > 0 && (
            <div className="border-t border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Track List
              </h2>
              <div className="space-y-3">
                {tracks.map((track: any) => (
                  <div
                    key={track.id}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="text-lg font-medium text-gray-500 min-w-[2rem]">
                      {track.track_number}.
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {track.title}
                      </h3>
                      {track.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {track.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
