import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { generateR2DownloadUrl } from '@/lib/r2'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { trackId, albumId } = await request.json()

    // Verify that the user has purchased the album
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('album_id', albumId)
      .single()

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'You have not purchased this album' },
        { status: 403 }
      )
    }

    // Get track information
    const { data: track, error: trackError } = await supabase
      .from('tracks')
      .select('r2_url')
      .eq('id', trackId)
      .eq('album_id', albumId)
      .single()

    if (trackError || !track) {
      console.error('Error fetching track:', trackError)
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      )
    }

    // Generate pre-signed URL for the track (valid for 1 hour)
    try {
      const downloadUrl = await generateR2DownloadUrl(track.r2_url, 3600)
      return NextResponse.json({ url: downloadUrl })
    } catch (error) {
      console.error('Error generating R2 signed URL:', error)
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Track download error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
