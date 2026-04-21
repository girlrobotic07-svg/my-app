'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

type Product = {
  id: string
  name: string
  price: number
  image_url: string | null
  stripe_price_id: string | null
}

type Props = {
  priceId: string
  isCurrentPlan: boolean
  isLoggedIn: boolean
  variant?: 'full' | 'icon'
  product?: Product
}

export default function CheckoutButton({ priceId, isCurrentPlan, isLoggedIn, variant = 'full', product }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToCart } = useCart()

  async function handleAction(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (variant === 'icon' && product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        stripe_price_id: product.stripe_price_id,
      })
      router.push('/cart')
      return
    }

    if (!isLoggedIn) {
      router.push('/login?redirectTo=/products')
      return
    }

    setLoading(true)
    // ... restriction Stripe logic for "Buy Now" or "Checkout" ...
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })

    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (isCurrentPlan) {
    return (
      <button disabled className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-400 text-sm cursor-not-allowed">
        Current Plan
      </button>
    )
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleAction}
        disabled={loading}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-[#C9A14A] hover:text-white transition-all shadow-md group/cart"
        title="Add to Cart"
      >
        <ShoppingBag size={18} className={loading ? 'animate-pulse' : ''} />
      </button>
    )
  }

  return (
    <button
      onClick={handleAction}
      disabled={loading}
      className="w-full bg-black text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50 shadow-lg shadow-black/10"
    >
      {loading ? 'Redirecting...' : isLoggedIn ? 'Proceed to Checkout' : 'Sign in to Buy'}
    </button>
  )
}