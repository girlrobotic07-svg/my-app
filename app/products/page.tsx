import { createSupabaseServer } from '@/lib/supabase-server'
import CheckoutButton from '../../components/CheckoutButton'

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  stripe_price_id: string | null
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
  }).format(cents / 100)
}

export default async function ProductsPage() {
  const supabase = await createSupabaseServer()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('price', { ascending: true })

  // Check if user is already subscribed
  const { data: { user } } = await supabase.auth.getUser()
  const { data: subscription } = user
    ? await supabase
        .from('subscriptions')
        .select('stripe_price_id, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()
    : { data: null }

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-20 space-y-4">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">
          Exclusive Ethnic Collection
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Discover the blend of tradition and modern elegance with our curated selection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {products?.map((product: any) => {
          return (
            <div
              key={product.id}
              className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                  </div>
                )}
                
                {product.is_featured && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-black shadow-sm">
                    New Arrival
                  </div>
                )}
              </div>

              {/* Details Container */}
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h2>
                  <p className="text-2xl font-black text-black">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 border border-gray-200 rounded-md text-[10px] font-bold text-gray-400">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <CheckoutButton
                    priceId={product.stripe_price_id!}
                    isCurrentPlan={false} // No "current plan" in fashion retail
                    isLoggedIn={!!user}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {products?.length === 0 && (
        <div className="text-center py-40">
          <p className="text-gray-400 italic">No products available in this collection yet.</p>
        </div>
      )}
    </main>
  )
}