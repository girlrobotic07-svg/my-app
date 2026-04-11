'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { upsertProduct } from './actions'

interface ProductFormProps {
  product?: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    stock_quantity: number
    category_id: string
    stripe_price_id: string
    status: string
    is_featured: boolean
    sizes: string[]
    colors: string[]
    image_url?: string
  }
  categories: { id: string, name: string }[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(product?.image_url || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    if (product) formData.append('id', product.id)

    try {
      const result = await upsertProduct(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
        return
      }
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-20">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Basic Information</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Product Name</label>
            <input
              required
              name="name"
              defaultValue={product?.name}
              placeholder="e.g. Classic Silk Shirt"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              onChange={(e) => {
                if (!product) {
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
              defaultValue={product?.slug}
              placeholder="classic-silk-shirt"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea
            required
            name="description"
            defaultValue={product?.description}
            rows={4}
            placeholder="Describe the product features, material, etc."
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
          />
        </div>
      </div>

      {/* Inventory & Pricing */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Inventory & Pricing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Price (in Rupees)</label>
            <input
              required
              type="number"
              name="price"
              defaultValue={product?.price}
              placeholder="e.g. 6500 (for ₹6,500)"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
            <input
              required
              type="number"
              name="stock_quantity"
              defaultValue={product?.stock_quantity}
              placeholder="e.g. 100"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Stripe Price ID</label>
            <input
              required
              name="stripe_price_id"
              defaultValue={product?.stripe_price_id}
              placeholder="price_..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select
              name="category_id"
              defaultValue={product?.category_id}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition appearance-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Status</label>
            <select
              name="status"
              defaultValue={product?.status ?? 'draft'}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition appearance-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Product Image</h2>
        <div className="flex items-start gap-8">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Upload Image</label>
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full px-4 py-8 border-2 border-dashed border-gray-200 rounded-2xl group-hover:border-black transition flex flex-col items-center gap-2">
                  <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-400">PNG, JPG, WEBP (max 5MB)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-48 h-48 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden relative group">
            {preview ? (
              <>
                <img src={preview} alt="Product preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => {
                    setPreview(null)
                    const input = document.querySelector('input[name="image"]') as HTMLInputElement
                    if (input) input.value = ''
                  }}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="text-center space-y-2">
                <svg className="w-8 h-8 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">No Image</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variants & Tags */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Variants & Features</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Available Sizes (comma separated)</label>
            <input
              name="sizes"
              defaultValue={product?.sizes?.join(', ')}
              placeholder="S, M, L, XL"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Available Colors (comma separated)</label>
            <input
              name="colors"
              defaultValue={product?.colors?.join(', ')}
              placeholder="Black, White, Blue"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_featured"
            id="is_featured"
            defaultChecked={product?.is_featured}
            className="w-5 h-5 border-gray-300 rounded text-black focus:ring-black"
          />
          <label htmlFor="is_featured" className="text-sm font-semibold text-gray-700 cursor-pointer italic">
            Feature this product on homepage?
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-10 py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 shadow-lg shadow-black/20"
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
