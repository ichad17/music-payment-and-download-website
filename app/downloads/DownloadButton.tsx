'use client'

import { useState } from 'react'

interface DownloadButtonProps {
  albumId: string
  albumTitle: string
  filePath: string
}

export default function DownloadButton({
  albumId,
  albumTitle,
  filePath,
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ albumId, filePath }),
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
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      {loading ? 'Generating...' : 'Download'}
    </button>
  )
}
