'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckoutButtonProps {
  albumId: string
  albumTitle: string
  price: number
  isAuthenticated: boolean
}

export default function CheckoutButton({
  albumId,
  albumTitle,
  price,
  isAuthenticated,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          albumId,
          albumTitle,
          price,
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : isAuthenticated ? 'Purchase Album' : 'Sign in to Purchase'}
    </button>
  )
}
