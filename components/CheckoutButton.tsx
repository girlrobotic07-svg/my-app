'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  priceId: string
  isCurrentPlan: boolean
  isLoggedIn: boolean
}

export default function CheckoutButton({ priceId, isCurrentPlan, isLoggedIn }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCheckout() {
    if (!isLoggedIn) {
      router.push('/login?redirectTo=/products')
      return
    }

    setLoading(true)

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })

    const data = await response.json()
    console.log('Checkout response:', data)

    if (data.url) {
      window.location.href = data.url   // redirect to Stripe checkout
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

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
    >
      {loading ? 'Redirecting...' : isLoggedIn ? 'Get Started' : 'Sign in to Subscribe'}
    </button>
  )
}