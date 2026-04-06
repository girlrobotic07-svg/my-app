import { createSupabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

// Admin client bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminPage() {
  // Navigation/Auth is handled by layout.tsx
  const { data: users } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, updated_at')

  const { data: subscriptions } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, status, stripe_price_id, current_period_end')

  const usersWithSubs = users?.map((u) => ({
    ...u,
    subscription: subscriptions?.find((s) => s.user_id === u.id) ?? null,
  }))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Real-time stats and user management</p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Users', value: users?.length ?? 0, color: 'text-blue-600' },
          { label: 'Active Subscriptions', value: subscriptions?.filter((s) => s.status === 'active').length ?? 0, color: 'text-green-600' },
          { label: 'Canceled Plans', value: subscriptions?.filter((s) => s.status === 'canceled').length ?? 0, color: 'text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <h2 className="font-semibold text-gray-800">Recent Users</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              {['User', 'Subscription', 'Status', 'Renews'].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-gray-400 font-medium uppercase tracking-wider text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {usersWithSubs?.slice(0, 10).map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{u.full_name ?? 'Anonymous User'}</span>
                    <span className="text-xs text-gray-400 font-mono mt-1">{u.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs italic">
                  {u.subscription?.stripe_price_id ?? '—'}
                </td>
                <td className="px-6 py-4">
                  {u.subscription ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${u.subscription.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'}`}>
                      {u.subscription.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-400">
                      idle
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {u.subscription?.current_period_end
                    ? new Date(u.subscription.current_period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}