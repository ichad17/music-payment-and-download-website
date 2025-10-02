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

  // Get tracks for all purchased albums
  const albumIds = purchases?.map((p: any) => p.album_id) || []
  let tracksMap: Record<string, any[]> = {}
  
  if (albumIds.length > 0) {
    const { data: tracks } = await supabase
      .from('tracks')
      .select('*')
      .in('album_id', albumIds)
      .order('track_number', { ascending: true })
    
    // Group tracks by album_id
    if (tracks) {
      tracksMap = tracks.reduce((acc: Record<string, any[]>, track: any) => {
        if (!acc[track.album_id]) {
          acc[track.album_id] = []
        }
        acc[track.album_id].push(track)
        return acc
      }, {})
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Downloads
        </h1>

        {purchases && purchases.length > 0 ? (
          <div className="space-y-6">
            {purchases.map((purchase: any) => {
              const albumTracks = tracksMap[purchase.album_id] || []
              
              return (
                <div
                  key={purchase.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
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
                      variant="album"
                    />
                  </div>

                  {albumTracks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Individual Tracks
                      </h3>
                      <div className="space-y-2">
                        {albumTracks.map((track: any) => (
                          <div
                            key={track.id}
                            className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">
                                  {track.track_number}.
                                </span>
                                <h4 className="font-medium text-gray-900">
                                  {track.title}
                                </h4>
                              </div>
                              {track.description && (
                                <p className="text-sm text-gray-600 mt-1 ml-6">
                                  {track.description}
                                </p>
                              )}
                            </div>
                            <DownloadButton
                              albumId={purchase.album_id}
                              trackId={track.id}
                              trackTitle={track.title}
                              variant="track"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
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
