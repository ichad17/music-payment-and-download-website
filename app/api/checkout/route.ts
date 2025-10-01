import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
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

    const { albumId, albumTitle, price } = await request.json()

    // Check if album exists
    const { data: album, error: albumError } = await supabase
      .from('albums')
      .select('*')
      .eq('id', albumId)
      .single()

    if (albumError || !album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: albumTitle,
              description: `Music album: ${albumTitle}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/downloads?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/albums/${albumId}?canceled=true`,
      metadata: {
        userId: user.id,
        albumId,
      },
      customer_email: user.email,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
