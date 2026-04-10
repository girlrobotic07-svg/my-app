import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { deleteProduct } from './actions'

export default async function ProductsPage() {
  // Fetch products with category names using admin client (bypasses RLS)
  // Fetch products and categories separately to avoid "missing relationship" error
  const [productsRes, categoriesRes] = await Promise.all([
    supabaseAdmin.from('products').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('categories').select('id, name')
  ])

  const products = productsRes.data
  const error = productsRes.error || categoriesRes.error
  const categoriesMap = Object.fromEntries(categoriesRes.data?.map(c => [c.id, c.name]) || [])

  if (error) {
    console.error('Fetch error:', error)
  }

  function formatPrice(cents: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR',
      maximumFractionDigits: 0,
    }).format(cents / 100)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 mb-6">
          <strong>Database Error:</strong> {error.message}
        </div>
      )}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">Manage your store catalog and inventory</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
        >
          Add Product
        </Link>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase text-xs tracking-wider font-semibold">
            <tr>
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-6 py-4">Category</th>
              <th className="text-left px-6 py-4">Price</th>
              <th className="text-left px-6 py-4">Stock</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
            {products?.map((prod) => (
              <tr key={prod.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300 font-bold uppercase">No Img</div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{prod.name}</span>
                      <span className="text-xs text-gray-400 font-mono mt-0.5 italic">{prod.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 italic">
                  {categoriesMap[prod.category_id] ?? 'Uncategorized'}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {formatPrice(prod.price)}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-mono ${prod.stock_quantity <= 5 ? 'text-red-500 font-bold' : ''}`}>
                    {prod.stock_quantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                    ${prod.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {prod.status}
                  </span>
                  {prod.is_featured && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link 
                    href={`/admin/products/${prod.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <form 
                    action={async () => {
                      'use server'
                      await deleteProduct(prod.id)
                    }}
                    className="inline"
                  >
                    <button className="text-red-500 hover:text-red-700 font-medium">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {products?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
