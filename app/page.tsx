import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  
  const { data: albums, error } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching albums:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Music Store
          </h1>
          <p className="text-xl text-gray-600">
            Discover and purchase exclusive music albums
          </p>
        </div>

        {albums && albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/albums/${album.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {album.cover_image_url ? (
                  <div className="relative h-64 w-full">
                    <Image
                      src={album.cover_image_url}
                      alt={album.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-64 w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-6xl">♪</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {album.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{album.artist}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {album.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ${album.price}
                    </span>
                    <span className="text-blue-600 hover:text-blue-800">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">
              No albums available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
