import { createServerSupabaseClient } from '@/lib/supabase-server'
import Image from 'next/image'

export default async function GalleryPage() {
  const supabase = await createServerSupabaseClient()
  
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
          <p className="text-xl text-gray-600">
            Explore our collection of photos
          </p>
        </div>

        {images && images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {image.title}
                  </h2>
                  {image.description && (
                    <p className="text-gray-600">{image.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">
              No images in gallery yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
