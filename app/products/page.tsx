import { createSupabaseServer } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  stripe_price_id: string | null
  image_url: string | null
  is_featured: boolean
  category_id: string | null
}

type Category = {
  id: string
  name: string
  slug: string
}

export default async function ProductsPage() {
  const supabase = await createSupabaseServer()

  // Fetch categories and products concurrently
  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from('categories').select('id, name, slug').order('name'),
    supabase.from('products').select('*').order('price', { ascending: true })
  ])

  const categories = categoriesRes.data as Category[] || []
  const products = productsRes.data as Product[] || []

  // Group products by category_id
  const groupedProducts: Record<string, Product[]> = {}
  products.forEach(product => {
    const catId = product.category_id || 'uncategorized'
    if (!groupedProducts[catId]) {
      groupedProducts[catId] = []
    }
    groupedProducts[catId].push(product)
  })

  // Check if user is already logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  return (
    <main className="min-h-screen bg-[#FDFBF7] pt-32 pb-40">
      {/* Premium Elegant Header */}
      <section className="max-w-6xl mx-auto px-6 mb-24 text-center">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#C9A14A]/30" />
            <span className="text-[#C9A14A] font-bold uppercase tracking-[0.4em] text-[10px]">
              Signature Series
            </span>
            <div className="h-px w-12 bg-[#C9A14A]/30" />
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-serif text-[#1A1A1A] tracking-tight">
            The <span className="italic text-[#C9A14A]">Curated</span> Collection
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed italic">
            "Timeless luxury handcrafted for those who appreciate the finer details of ethnic heritage."
          </p>

          <div className="pt-8">
            <div className="inline-block relative">
              <span className="block w-2 h-2 rotate-45 border border-[#C9A14A] mx-auto" />
              <div className="absolute top-1/2 -left-20 w-16 h-px bg-gradient-to-r from-transparent to-[#C9A14A]/40" />
              <div className="absolute top-1/2 -right-20 w-16 h-px bg-gradient-to-l from-transparent to-[#C9A14A]/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Sections by Category */}
      <div className="space-y-40">
        {categories.map((category) => {
          const categoryProducts = groupedProducts[category.id] || []
          if (categoryProducts.length === 0) return null

          return (
            <section key={category.id} id={category.slug} className="max-w-[1400px] mx-auto px-6 md:px-12 scroll-mt-32">
              {/* Category Title with Premium Ornament */}
              <div className="flex flex-col items-center mb-16 space-y-4">
                <h2 className="text-4xl lg:text-5xl font-serif text-[#1A1A1A] text-center">
                  {category.name}
                </h2>
                <div className="flex items-center gap-4 w-full max-w-md">
                   <div className="h-px bg-[#C9A14A]/20 flex-grow" />
                   <div className="w-2 h-2 rotate-45 border border-[#C9A14A]/50 shrink-0" />
                   <div className="h-px bg-[#C9A14A]/20 flex-grow" />
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {categoryProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} user={!!user} />
                ))}
              </div>
            </section>
          )
        })}

        {/* Uncategorized Products */}
        {groupedProducts['uncategorized']?.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center mb-16 space-y-4">
              <h2 className="text-4xl lg:text-5xl font-serif text-[#1A1A1A] text-center">
                Boutique Essentials
              </h2>
              <div className="flex items-center gap-4 w-full max-w-md">
                 <div className="h-px bg-[#C9A14A]/20 flex-grow" />
                 <div className="w-2 h-2 rotate-45 border border-[#C9A14A]/50 shrink-0" />
                 <div className="h-px bg-[#C9A14A]/20 flex-grow" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {groupedProducts['uncategorized'].map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} user={!!user} />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {products?.length === 0 && (
        <div className="text-center py-48 space-y-8">
          <div className="relative inline-block">
            <span className="text-5xl grayscale">🕊️</span>
            <div className="absolute -inset-4 border border-[#C9A14A]/10 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-serif text-[#1A1A1A]">Coming Soon</p>
            <p className="text-muted-foreground font-light max-w-sm mx-auto">
              Our artisans are currently crafting the next signature collection. Stay tuned for elegance.
            </p>
          </div>
        </div>
      )}

      {/* Premium Subtle Footer Seal */}
      <footer className="mt-60 text-center px-6">
        <div className="flex flex-col items-center space-y-8">
            <div className="w-12 h-12 border border-[#C9A14A]/30 rounded-full flex items-center justify-center">
                <span className="text-[#C9A14A] text-xs font-serif italic">SE</span>
            </div>
            <div className="space-y-2">
                <p className="text-[#1A1A1A] text-[10px] uppercase font-bold tracking-[0.5em]">
                    Shreeji Ethnic
                </p>
                <p className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-light">
                    Handcrafted Luxury • Est. 1995
                </p>
            </div>
        </div>
      </footer>
    </main>
  )
}