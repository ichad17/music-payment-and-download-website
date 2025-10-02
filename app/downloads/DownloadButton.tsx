'use client'

import { useState } from 'react'

interface DownloadButtonProps {
  albumId: string
  albumTitle?: string
  filePath?: string
  trackId?: string
  trackTitle?: string
  variant?: 'album' | 'track'
}

export default function DownloadButton({
  albumId,
  albumTitle,
  filePath,
  trackId,
  trackTitle,
  variant = 'album',
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)

    try {
      const endpoint = variant === 'track' ? '/api/download-track' : '/api/download'
      const body = variant === 'track' 
        ? { trackId, albumId }
        : { albumId, filePath }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.url) {
        // Open download URL in new tab
        window.open(data.url, '_blank')
      } else {
        alert('Error generating download link')
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('An error occurred while downloading')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
    >
      {loading ? 'Generating...' : variant === 'track' ? 'Download Track' : 'Download Album'}
    </button>
  )
}
