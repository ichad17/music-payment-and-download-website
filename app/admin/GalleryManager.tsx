'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface GalleryImage {
  id: string
  title: string
  description: string | null
  image_url: string
  display_order: number
}

export default function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          image_url: imageUrl,
          display_order: images.length,
        }),
      })

      if (response.ok) {
        setTitle('')
        setDescription('')
        setImageUrl('')
        router.refresh()
      } else {
        alert('Failed to add image')
      }
    } catch (error) {
      console.error('Error adding image:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('An error occurred')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Image'}
        </button>
      </form>

      {images && images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="border rounded-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={image.image_url}
                  alt={image.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {image.description}
                  </p>
                )}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No images in gallery yet.</p>
      )}
    </div>
  )
}
