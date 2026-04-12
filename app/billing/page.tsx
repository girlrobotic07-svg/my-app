import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RefreshButton from '@/components/RefreshButton'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('current_period_end', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Orders & Billing</h1>
          <p className="text-slate-500 font-medium font-inter">Manage your recent transactions and order status.</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 hover:bg-slate-50 transition shadow-sm"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Success banner */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl px-6 py-4 mb-10 text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          🎉 Payment successful! Your order has been placed successfully.
        </div>
      )}

      {orders && orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.stripe_subscription_id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-accent transition-colors">Order Summary</h2>
                    <p className="text-xs text-slate-400 font-mono">{order.stripe_subscription_id}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest
                  ${order.status === 'active' || order.status === 'succeeded'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'}`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-6 border-y border-slate-50">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference ID</span>
                  <p className="text-sm font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg truncate">
                    {order.stripe_price_id}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Date</span>
                  <p className="text-sm font-bold text-slate-900">
                    {new Date(order.current_period_end).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Identity</span>
                  <p className="text-sm font-mono text-slate-600 truncate">
                    {order.stripe_customer_id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : success ? (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center shadow-xl shadow-slate-200/40">
          <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <svg className="w-10 h-10 text-accent animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Almost there...</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">We're finalizing your order details. It should appear here in just a few moments.</p>
          <div className="flex justify-center gap-4">
            <RefreshButton />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 text-center shadow-xl shadow-slate-200/40">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No orders yet</h2>
          <p className="text-slate-500 mb-10 max-w-xs mx-auto font-medium">Your collection starts here. Find your first timeless piece today.</p>
          <Link
            href="/products"
            className="inline-block bg-slate-900 text-white px-10 py-3.5 rounded-2xl text-sm font-bold hover:bg-accent transition shadow-xl shadow-slate-900/10"
          >
            Explore Collection
          </Link>
        </div>
      )}
    </main>
  )
}
