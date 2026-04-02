import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {/* Profile section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">User ID</span>
            <span className="font-mono text-xs text-gray-400">{user.id}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Joined</span>
            <span className="font-medium">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Sign out of your account on this device.
        </p>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </form>
      </div>
    </main>
  )
} 