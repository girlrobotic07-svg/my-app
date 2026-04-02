'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    // Get the current session on load
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg">MyApp</Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/products" className="text-gray-500 hover:text-black transition">
          Plans
        </Link>
        <Link href="/account" className="text-gray-500 hover:text-black transition">
            Account
        </Link>
        {user ? (
          <>
            <Link href="/dashboard" className="text-gray-500 hover:text-black transition">
              Dashboard
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition">
                Sign Out
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition">
            Sign In
          </Link>
          
        )}
      </div>
    </nav>
  )
}