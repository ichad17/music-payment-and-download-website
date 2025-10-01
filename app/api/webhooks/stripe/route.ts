import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
}

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin()
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Get metadata
    const userId = session.metadata?.userId
    const albumId = session.metadata?.albumId
    const paymentIntentId = session.payment_intent as string

    if (!userId || !albumId) {
      console.error('Missing metadata in checkout session')
      return NextResponse.json(
        { error: 'Missing metadata' },
        { status: 400 }
      )
    }

    // Record the purchase in the database
    const { error } = await supabaseAdmin.from('purchases').insert({
      user_id: userId,
      album_id: albumId,
      stripe_payment_intent_id: paymentIntentId,
      amount: (session.amount_total || 0) / 100, // Convert from cents to dollars
    })

    if (error) {
      console.error('Error recording purchase:', error)
      return NextResponse.json(
        { error: 'Failed to record purchase' },
        { status: 500 }
      )
    }

    console.log('Purchase recorded successfully:', { userId, albumId })
  }

  return NextResponse.json({ received: true })
}
