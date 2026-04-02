import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()

  // Get the current logged-in user
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, send them to login page
  if (!user) {
    redirect('/login')
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-6">You are logged in successfully.</p>

        {/* User info card */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
          <p className="text-gray-500 mb-1">Logged in as:</p>
          <p className="font-medium">{user.email}</p>
          <p className="text-gray-400 text-xs mt-1">User ID: {user.id}</p>
        </div>

        {/* Sign out button — this will be a form action */}
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Sign Out
          </button>
        </form>
      </div>
    </main>
  )
}