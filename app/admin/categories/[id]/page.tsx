import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import CategoryForm from '../CategoryForm'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!category) return notFound()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-500 text-sm">Update the details for {category.name}</p>
      </header>

      <CategoryForm category={category} />
    </div>
  )
}
