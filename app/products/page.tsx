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
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Our Plans</h1>
      <p className="text-center text-gray-500 mb-12">
        Choose the plan that works for you
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {products?.map((product: Product) => {
          const isCurrentPlan =
            subscription?.stripe_price_id === product.stripe_price_id

          return (
            <div
              key={product.id}
              className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col
                ${isCurrentPlan ? 'border-black ring-2 ring-black' : 'border-gray-200'}`}
            >
              {isCurrentPlan && (
                <span className="text-xs font-medium bg-black text-white px-3 py-1 rounded-full self-start mb-3">
                  Current Plan
                </span>
              )}
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-500 text-sm mb-4 flex-1">
                {product.description}
              </p>
              <p className="text-3xl font-bold mb-6">
                {formatPrice(product.price)}
                <span className="text-sm font-normal text-gray-400">/mo</span>
              </p>
              <CheckoutButton
                priceId={product.stripe_price_id!}
                isCurrentPlan={isCurrentPlan}
                isLoggedIn={!!user}
              />
            </div>
          )
        })}
      </div>
    </main>
  )
}