import { createSupabaseServer } from '@/lib/supabase-server'
import ProductForm from '../ProductForm'

export default async function NewProductPage() {
  const supabase = await createSupabaseServer()
  
  // Fetch categories for the dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Product</h1>
        <p className="text-gray-500 text-sm">Add a new item to your fashion collection</p>
      </header>

      <ProductForm categories={categories || []} />
    </div>
  )
}
