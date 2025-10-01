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

    const { title, description, image_url, display_order } = await request.json()

    const { error } = await supabase.from('gallery_images').insert({
      title,
      description,
      image_url,
      display_order,
    })

    if (error) {
      console.error('Error adding image:', error)
      return NextResponse.json(
        { error: 'Failed to add image' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Gallery add error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting image:', error)
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Gallery delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
