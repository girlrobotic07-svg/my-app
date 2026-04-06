import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ProductForm from '../ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  // Fetch product data
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) return notFound()

  // Fetch categories for the dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 text-sm">Update {product.name} details</p>
      </header>

      <ProductForm product={product} categories={categories || []} />
    </div>
  )
}
