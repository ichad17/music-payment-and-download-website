import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

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

    // Generate a pre-signed URL for the file (valid for 1 hour)
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

    return NextResponse.json({ url: data.signedUrl })
  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
