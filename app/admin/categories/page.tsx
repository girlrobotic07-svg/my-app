import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { deleteCategory } from './actions'

export default async function CategoriesPage() {
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">Manage product categories</p>
        </div>
        <Link 
          href="/admin/categories/new"
          className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
        >
          Add Category
        </Link>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase text-xs tracking-wider font-semibold">
            <tr>
              <th className="text-left px-6 py-4">Category</th>
              <th className="text-left px-6 py-4">Slug</th>
              <th className="text-left px-6 py-4">Description</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
            {categories?.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 flex items-center gap-3">
                  {cat.image_url && (
                    <img src={cat.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                  )}
                  <span className="font-semibold text-gray-900">{cat.name}</span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-400">{cat.slug}</td>
                <td className="px-6 py-4 max-w-xs truncate">{cat.description}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link 
                    href={`/admin/categories/${cat.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <form 
                    action={async () => {
                      'use server'
                      await deleteCategory(cat.id)
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
            {categories?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
