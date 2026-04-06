import CategoryForm from '../CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Category</h1>
        <p className="text-gray-500 text-sm">Add a new category to your shop</p>
      </header>

      <CategoryForm />
    </div>
  )
}
