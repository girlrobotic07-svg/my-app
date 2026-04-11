'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [initials, setInitials] = useState('?')
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single()

        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url)
        if (profile?.full_name) {
          setInitials(
            profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
          )
        } else if (user.email) {
          setInitials(user.email[0].toUpperCase())
        }
      }
    }
    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load())
    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg">Shreeji Ethnic</Link>



      <div className="flex items-center gap-4 text-sm">
        <Link href="/products" className="text-gray-500 hover:text-black transition">Products</Link>
        <Link href="/account" className="text-gray-500 hover:text-black transition">Account</Link>
        {user ? (
          <>
            <Link href="/dashboard" className="text-gray-500 hover:text-black transition">Dashboard</Link>
            <Link href="/billing" className="text-gray-500 hover:text-black transition">Billing</Link>

            {/* Avatar + profile link */}
            <Link href="/account/profile" className="flex items-center gap-2 hover:opacity-80 transition">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full object-cover w-8 h-8 border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                  {initials}
                </div>
              )}
            </Link>

            <form action="/api/auth/signout" method="POST">
              <button className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition text-sm">
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