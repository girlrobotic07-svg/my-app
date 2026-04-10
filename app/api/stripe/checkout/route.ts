import { stripe } from '@/lib/stripe'
import { createSupabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServer()

  // Make sure the user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { priceId } = await request.json()

  if (!priceId) {
    return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email ?? undefined,         // pre-fill email on checkout
      client_reference_id: user.id,       // link session back to our user
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products?canceled=true`,
      metadata: { userId: user.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout session error:', error)
    
    // Return a more descriptive error message if available
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}