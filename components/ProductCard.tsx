'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CheckoutButton from './CheckoutButton'

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

interface ProductCardProps {
  product: Product
  index: number
  user: boolean
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cents)
}

export default function ProductCard({ product, index, user }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F0E9] rounded-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.is_featured && (
            <span className="bg-[#C9A14A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Featured
            </span>
          )}
          {index % 4 === 0 && (
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              New Arrival
            </span>
          )}
        </div>

        {/* Action Icons Container */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out">
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-black hover:bg-[#C9A14A] hover:text-white transition-all scale-100 hover:scale-110 active:scale-95 group/icon"
            title="Add to Wishlist"
          >
            <Heart size={18} className="group-hover/icon:fill-current" />
          </button>

          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-black hover:bg-[#C9A14A] hover:text-white transition-all scale-100 hover:scale-110 active:scale-95"
            title="Quick View"
          >
            <Eye size={18} />
          </button>

          {product.stripe_price_id && (
            <div className="scale-100 hover:scale-110 transition-all">
              <CheckoutButton
                priceId={product.stripe_price_id}
                isCurrentPlan={false}
                isLoggedIn={user}
                variant="icon"
                product={product}
              />
            </div>
          )}
        </div>

        {/* Image with Zoom */}
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#C9A14A]/20">
            <ShoppingBag size={64} strokeWidth={1} />
            <span className="text-[10px] uppercase font-black tracking-widest mt-4">Luxury Couture</span>
          </div>
        )}

        {/* Hover Overlay: Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Details Section */}
      <div className="mt-6 space-y-2 px-1">
        <div className="space-y-1">
          <p className="text-[10px] text-[#C9A14A] uppercase font-bold tracking-[0.2em]">
            Signature Series
          </p>
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-serif text-xl lg:text-2xl text-[#1A1A1A] group-hover:text-[#C9A14A] transition-colors duration-300 flex-grow">
              {product.name}
            </h3>
            <span className="font-sans font-bold text-lg text-[#1A1A1A] shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
        
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-light italic">
            {product.description}
          </p>
        )}
      </div>
    </motion.div>
  )
}
