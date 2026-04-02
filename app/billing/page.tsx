import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string }
}) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Billing</h1>

      {/* Success banner */}
      {searchParams.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 mb-6 text-sm">
          🎉 Payment successful! Your subscription is now active.
        </div>
      )}

      {subscription ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Active Subscription</h2>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              {subscription.status}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Price ID</span>
              <span className="font-mono text-xs text-gray-400">
                {subscription.stripe_price_id}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Renews on</span>
              <span className="font-medium">
                {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Customer ID</span>
              <span className="font-mono text-xs text-gray-400">
                {subscription.stripe_customer_id}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href="/products"
              className="text-sm text-gray-500 hover:text-black underline transition"
            >
              Change plan →
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-gray-500 mb-4">You don't have an active subscription.</p>
          <Link
            href="/products"
            className="bg-black text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            View Plans
          </Link>
        </div>
      )}
    </main>
  )}
