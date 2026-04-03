import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

// Use service role key here — bypasses RLS to write subscription data
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // add this to .env.local
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  // Verify the request is genuinely from Stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: `Webhook error: ${error.message}` },
      { status: 400 }
    )
  }

  // Handle specific Stripe events
  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      if (!userId) break

      // Fetch the full subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      // Save subscription to our database
      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: subscription.items.data[0].price.id,
        status: subscription.status,
        current_period_end: new Date(
          (subscription as any).current_period_end * 1000
        ).toISOString(),
      }, { onConflict: 'user_id' })

      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      // Update subscription status in our database
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: subscription.status,
          stripe_price_id: subscription.items.data[0].price.id,
          current_period_end: new Date(
            (subscription as any).current_period_end * 1000
          ).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)

      break
    }
  }

  return NextResponse.json({ received: true })
}