'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'
import { useScroll } from '@/hooks/useScroll'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard as DashboardIcon,
  Search,
  ChevronDown
} from 'lucide-react'

const CATEGORIES = [
  { name: 'Sherwani', href: '/products#sherwani' },
  { name: 'Indo-Western', href: '/products#indo-western' },
  { name: 'Kurtas', href: '/products#kurtas' },
  { name: 'Accessories', href: '/products#accessories' },
]

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [initials, setInitials] = useState('?')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const scrolled = useScroll(20)
  const pathname = usePathname()
  const supabase = createSupabaseBrowser()
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null)

  // Ensure hydration safety
  useEffect(() => {
    setMounted(true)
  }, [])

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
  }, [supabase])

  const isHome = pathname === '/'
  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '#', hasDropdown: true },
    { name: 'Collections', href: '/collections' },
  ]

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current)
    setIsDropdownOpen(true)
  }

  const handleDropdownMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 150)
  }

  // Prevent rendering before mount to avoid hydration mismatch
  if (!mounted) return null

  // Navbar classes based on route and scroll
  const navBgClass = isHome 
    ? (scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-3' : 'bg-transparent py-6')
    : 'bg-white border-b border-gray-100 shadow-sm py-3'

  const textColorClass = isHome
    ? (scrolled ? 'text-black' : 'text-white')
    : 'text-black'

  const mutedTextColorClass = isHome
    ? (scrolled ? 'text-black/70 hover:text-black' : 'text-white/80 hover:text-white')
    : 'text-black/70 hover:text-black'

  const logoColorClass = isHome
    ? (scrolled ? 'text-black' : 'text-white drop-shadow-md')
    : 'text-black'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 ${navBgClass}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <span className={`text-2xl font-serif tracking-tighter transition-colors duration-300 ${logoColorClass}`}>
                SHREEJI <span className="text-[#C9A14A]">ETHNIC</span>
              </span>
            </Link>
          </motion.div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link, idx) => (
              <div 
                key={link.name}
                className="relative"
                onMouseEnter={link.hasDropdown ? handleDropdownMouseEnter : undefined}
                onMouseLeave={link.hasDropdown ? handleDropdownMouseLeave : undefined}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    className={`text-[13px] font-bold tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-1.5 group ${
                      pathname === link.href || (link.hasDropdown && isDropdownOpen)
                        ? 'text-[#C9A14A]' 
                        : mutedTextColorClass
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />}
                    <span className={`absolute bottom-[-6px] left-0 h-[2px] bg-[#C9A14A] transition-all duration-300 ${
                      pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                </motion.div>

                {/* Categories Dropdown */}
                {link.hasDropdown && (
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white shadow-2xl border border-gray-100 py-4 overflow-hidden"
                      >
                        <div className="flex flex-col">
                          {CATEGORIES.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              onClick={() => setIsDropdownOpen(false)}
                              className="px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-black/60 hover:text-[#C9A14A] hover:bg-gray-50 transition-all border-l-2 border-transparent hover:border-[#C9A14A]"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Right: Icons & Auth */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6"
          >
            <button className={`p-1 transition-colors duration-300 ${
              isHome && !scrolled ? 'text-white/80 hover:text-[#C9A14A]' : 'text-black/70 hover:text-[#C9A14A]'
            }`}>
              <Search size={22} strokeWidth={1.5} />
            </button>
            
            <Link 
              href="/cart" 
              className={`p-1 relative transition-colors duration-300 ${
                isHome && !scrolled ? 'text-white/80 hover:text-[#C9A14A]' : 'text-black/70 hover:text-[#C9A14A]'
              }`}
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 bg-[#C9A14A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg">
                0
              </span>
            </Link>

            <div className={`hidden md:flex items-center gap-5 ml-2 border-l pl-5 h-6 transition-colors ${
              isHome && !scrolled ? 'border-white/20' : 'border-gray-200'
            }`}>
              {user ? (
                <div className="flex items-center gap-5">
                  <Link href="/account/profile" className="flex items-center gap-2 group relative">
                    {avatarUrl ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 group-hover:border-[#C9A14A] transition-all">
                        <Image
                          src={avatarUrl}
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#C9A14A]/10 border border-[#C9A14A]/20 flex items-center justify-center text-[11px] font-black text-[#C9A14A] group-hover:bg-[#C9A14A] group-hover:text-white transition-all shadow-sm">
                        {initials}
                      </div>
                    )}
                  </Link>
                  <form action="/api/auth/signout" method="POST">
                    <button className={`text-[11px] uppercase font-bold tracking-[0.2em] transition-colors ${
                      isHome && !scrolled ? 'text-white/70 hover:text-white' : 'text-black/50 hover:text-black'
                    }`}>
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className={`px-7 py-2.5 text-[11px] uppercase font-bold tracking-[0.2em] transition-all duration-300 shadow-lg ${
                    isHome && !scrolled 
                    ? 'bg-[#C9A14A] text-white hover:bg-white hover:text-black shadow-[#C9A14A]/20'
                    : 'bg-black text-white hover:bg-[#C9A14A] shadow-black/10' 
                  }`}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-1 transition-colors duration-300 ${
                isHome && !scrolled ? 'text-white' : 'text-black'
              }`}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-white md:hidden"
          >
            <div className="flex flex-col h-full pt-28 px-8 pb-10 overflow-y-auto">
              {/* Close Button Mobile */}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 right-8 p-2 text-black"
              >
                <X size={32} />
              </button>

              <div className="flex flex-col gap-8">
                {navLinks.map((link, idx) => (
                  <div key={link.name} className="flex flex-col gap-4">
                    <Link 
                      href={link.href}
                      onClick={link.hasDropdown ? undefined : () => setIsMenuOpen(false)}
                      className={`text-4xl font-serif tracking-tight flex items-center justify-between ${
                        pathname === link.href ? 'text-[#C9A14A]' : 'text-black'
                      }`}
                    >
                      {link.name}
                      {link.hasDropdown && <ChevronDown size={24} className="text-[#C9A14A]" />}
                    </Link>
                    
                    {link.hasDropdown && (
                      <div className="flex flex-col gap-4 ml-4 border-l-2 border-gray-100 pl-6 py-2">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-lg font-bold text-black/60 uppercase tracking-widest hover:text-[#C9A14A]"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-10 flex flex-col gap-4">
                {user ? (
                  <>
                    <Link 
                      href="/account/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 text-xl font-bold uppercase tracking-widest text-black/80"
                    >
                      <UserIcon size={22} className="text-[#C9A14A]" /> Profile
                    </Link>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 text-xl font-bold uppercase tracking-widest text-black/80"
                    >
                      <DashboardIcon size={22} className="text-[#C9A14A]" /> Dashboard
                    </Link>
                    <form action="/api/auth/signout" method="POST" className="mt-6">
                      <button className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        <LogOut size={20} /> Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link 
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-[#C9A14A] text-white py-6 text-center font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#C9A14A]/30"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}