'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cents)
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  async function handleCheckout() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login?redirectTo=/cart')
      return
    }

    // If logged in, proceed to checkout (this could be a redirect to a checkout session or form)
    // For now, let's redirect to the first item's checkout or a dedicated checkout flow
    if (cart.length > 0) {
       // Typically you'd create a bulk checkout session here
       // For this simple demo, let's just trigger a checkout for the first item 
       // but ideally you'd have an /api/stripe/create-cart-checkout route
       const response = await fetch('/api/stripe/checkout', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ priceId: cart[0].stripe_price_id }),
       })
       const data = await response.json()
       if (data.url) window.location.href = data.url
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <header className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-serif text-[#1A1A1A] mb-4">Your Selection</h1>
          <p className="text-muted-foreground font-light italic">
            You have {cartCount} {cartCount === 1 ? 'item' : 'items'} in your boutique collection.
          </p>
        </header>

        {cart.length === 0 ? (
          <div className="text-center py-32 space-y-8 bg-white/50 rounded-3xl border border-[#C9A14A]/10">
            <div className="w-20 h-20 bg-[#F3F0E9] rounded-full flex items-center justify-center mx-auto text-[#C9A14A]">
              <ShoppingBag size={32} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-[#1A1A1A]">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-sm mx-auto font-light">
                Explore our signature series and discover timeless elegance for your wardrobe.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#C9A14A] transition-all group"
              >
                Start Shopping
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-8">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    className="flex gap-6 p-6 bg-white rounded-3xl shadow-sm border border-[#C9A14A]/5 group"
                  >
                    <div className="relative w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-[#F3F0E9] shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C9A14A]/20">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow flex flex-col justify-between py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl lg:text-2xl font-serif text-[#1A1A1A] group-hover:text-[#C9A14A] transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                            Luxury Edition
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-4 bg-[#F8F7F3] rounded-full p-1 border border-[#C9A14A]/10">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-[#1A1A1A]"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-[#1A1A1A]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-xl font-bold text-[#1A1A1A]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <aside className="lg:col-span-4 sticky top-32">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#C9A14A]/10 space-y-8">
                <h2 className="text-2xl font-serif text-[#1A1A1A]">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-[#C9A14A] font-medium italic">Complimentary</span>
                  </div>
                  <div className="h-px bg-[#C9A14A]/10" />
                  <div className="flex justify-between text-2xl font-bold text-[#1A1A1A]">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#1A1A1A] text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-sm hover:bg-[#C9A14A] transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-1 h-1 bg-[#C9A14A] rounded-full" />
                    Secure Checkout by Stripe
                    <span className="w-1 h-1 bg-[#C9A14A] rounded-full" />
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-[#F3F0E9]/50 rounded-2xl border border-[#C9A14A]/5">
                <p className="text-xs text-muted-foreground font-light leading-relaxed italic">
                  "Each piece from Shreeji Ethnic is handcrafted with precision. Please allow for traditional artistry to shine through in every stitch."
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
