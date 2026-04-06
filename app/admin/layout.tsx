import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Role check
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="text-xl font-bold tracking-tight hover:opacity-80 transition">
            Admin Panel
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/admin" 
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Products
          </Link>
          <Link 
            href="/admin/categories" 
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Categories
          </Link>
          <Link 
            href="/admin/orders" 
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link 
            href="/" 
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition"
          >
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
