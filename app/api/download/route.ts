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

    const { albumId, filePath } = await request.json()

    // Verify that the user has purchased this album
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

    // Get album to check if it has R2 URL
    const { data: album, error: albumError } = await supabase
      .from('albums')
      .select('r2_url')
      .eq('id', albumId)
      .single()

    if (albumError) {
      console.error('Error fetching album:', albumError)
      return NextResponse.json(
        { error: 'Failed to fetch album information' },
        { status: 500 }
      )
    }

    let downloadUrl: string

    // If album has R2 URL, use R2 for download (new method)
    if (album?.r2_url) {
      try {
        downloadUrl = await generateR2DownloadUrl(album.r2_url, 3600)
      } catch (error) {
        console.error('Error generating R2 signed URL:', error)
        return NextResponse.json(
          { error: 'Failed to generate download link' },
          { status: 500 }
        )
      }
    } else {
      // Fall back to Supabase storage (legacy method)
      const { data, error } = await supabase.storage
        .from('albums')
        .createSignedUrl(filePath, 3600)

      if (error || !data) {
        console.error('Error creating signed URL:', error)
        return NextResponse.json(
          { error: 'Failed to generate download link' },
          { status: 500 }
        )
      }

      downloadUrl = data.signedUrl
    }

    return NextResponse.json({ url: downloadUrl })
  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
