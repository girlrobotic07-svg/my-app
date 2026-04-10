import { createSupabaseServer } from '@/lib/supabase-server'
import CheckoutButton from '../../components/CheckoutButton'
import Image from 'next/image'

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  stripe_price_id: string | null
  image_url: string | null
  is_featured: boolean
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', 
    currency: 'USD',
  }).format(cents / 100)
}

export default async function ProductsPage() {
  const supabase = await createSupabaseServer()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('price', { ascending: true })

  // Check if user is already logged in for the checkout buttons
  const { data: { user } } = await supabase.auth.getUser()
  
  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-32">
      {/* Premium Header Segment */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Abstract background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block text-accent font-bold uppercase tracking-[0.4em] text-xs animate-in fade-in slide-in-from-bottom-4 duration-700">
            The Signature Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Timeless <span className="text-accent underline decoration-accent/20 underline-offset-8">Elegance</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
            Explore our curated selection of bespoke ethnic wear, crafted with passion and precision for your most memorable moments.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {products?.map((product: Product, index: number) => (
            <div
              key={product.id}
              className="group flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-16 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Premium Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-slate-50 shadow-xl shadow-slate-200/50 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-accent/10 group-hover:-translate-y-2">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-300 gap-3">
                    <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authentic Quality</span>
                  </div>
                )}
                
                {/* Floating "Featured" Badge */}
                {product.is_featured && (
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white/50 z-10">
                    Featured
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Product Details */}
              <div className="space-y-3 px-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                    New Edition
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 line-clamp-1 group-hover:text-accent transition-colors duration-300">
                    {product.name}
                  </h2>
                </div>
                
                {product.description && (
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4">
                  <p className="text-2xl font-black text-slate-900 tracking-tight">
                    {formatPrice(product.price)}
                  </p>
                  
                  <div className="w-32">
                    <CheckoutButton
                      priceId={product.stripe_price_id!}
                      isCurrentPlan={false}
                      isLoggedIn={!!user}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products?.length === 0 && (
          <div className="text-center py-48 space-y-4">
            <div className="text-4xl">✨</div>
            <p className="text-slate-400 font-medium italic">Our new collection is arriving soon. Stay tuned.</p>
          </div>
        )}
      </section>

      {/* Bottom Subtle Footer */}
      <footer className="mt-40 text-center px-6">
        <div className="h-px w-24 bg-slate-200 mx-auto mb-8" />
        <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">
          Legacy of Elegance • Crafted for Royalty
        </p>
      </footer>
    </main>
  )
}