'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { upsertCategory } from './actions'

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
    description: string
    image_url: string
  }
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    if (category) formData.append('id', category.id)

    try {
      await upsertCategory(formData)
      router.push('/admin/categories')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Display Name</label>
          <input
            required
            name="name"
            defaultValue={category?.name}
            placeholder="e.g. T-Shirts"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition shadow-sm"
            onChange={(e) => {
              // Auto-generate slug if it's a new category
              if (!category) {
                const slugInput = (e.target.form as HTMLFormElement).elements.namedItem('slug') as HTMLInputElement
                slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">URL Slug</label>
          <input
            required
            name="slug"
            defaultValue={category?.slug}
            placeholder="e.g. t-shirts"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition shadow-sm font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Description</label>
        <textarea
          name="description"
          defaultValue={category?.description}
          rows={3}
          placeholder="What kind of products are in this category?"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Image URL</label>
        <input
          name="image_url"
          defaultValue={category?.image_url}
          placeholder="https://images.unsplash.com/..."
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition shadow-sm"
        />
      </div>

      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 shadow-lg shadow-black/10"
        >
          {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
