'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    image: '/images/sherwani_hero.png',
    subtitle: 'Wedding Essence',
    title: 'Royal Sherwani',
    description: 'Experience true royalty with our hand-crafted wedding couture designed for your most special day.',
    primaryBtn: 'Shop Collection',
    secondaryBtn: 'Book Appointment',
    href: '/products#sherwani'
  },
  {
    image: '/images/indo_western.png',
    subtitle: 'Modern Fusion',
    title: 'Indo Western',
    description: 'A perfect blend of contemporary style and traditional roots, crafted for the modern gentleman.',
    primaryBtn: 'Explore Fusion',
    secondaryBtn: 'View Lookbook',
    href: '/products#indo-western'
  },
  {
    image: '/images/kurta.png',
    subtitle: 'Elegant Comfort',
    title: 'Silk Kurtas',
    description: 'Simple, sophisticated, and perfect for every celebration. Discover the art of minimal luxury.',
    primaryBtn: 'Shop Kurtas',
    secondaryBtn: 'Our Fabrics',
    href: '/products#kurtas'
  }
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const variants = {
    enter: (direction: number) => ({
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      opacity: 0,
      // scale: 0.9,
    })
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: 10, ease: "linear" } // Slow zoom-in effect
          }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[current].image}
            alt={SLIDES[current].title}
            fill
            className="object-cover object-top"
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center">
        <div className="max-w-3xl space-y-8">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <span className="inline-block text-[#C9A14A] font-bold uppercase tracking-[0.4em] text-xs lg:text-sm">
              {SLIDES[current].subtitle}
            </span>
            
            <h1 className="text-6xl lg:text-8xl font-serif leading-[1.1] tracking-tight text-white">
              {SLIDES[current].title.split(' ')[0]}{' '}
              <span className="text-[#C9A14A]">
                {SLIDES[current].title.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-white/80 max-w-xl font-light leading-relaxed">
              {SLIDES[current].description}
            </p>
          </motion.div>

          <motion.div
            key={`btns-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-5 pt-4"
          >
            <Link
              href={SLIDES[current].href}
              className="bg-[#C9A14A] text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#B08A3E] transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-[#C9A14A]/20"
            >
              {SLIDES[current].primaryBtn}
            </Link>
            <Link
              href="/login"
              className="bg-transparent border border-white/30 text-white backdrop-blur-sm px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
            >
              {SLIDES[current].secondaryBtn}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Manual Navigation Controls (Minimal) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 z-20">
        <button
          onClick={prevSlide}
          className="text-white/50 hover:text-[#C9A14A] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Dots */}
        <div className="flex gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 transition-all duration-500 rounded-full ${
                i === current ? 'w-12 bg-[#C9A14A]' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="text-white/50 hover:text-[#C9A14A] transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 right-12 z-20 hidden lg:block">
        <div className="text-white/10 font-serif text-9xl select-none rotate-90 origin-bottom-right translate-y-full opacity-40">
          EST. 1995
        </div>
      </div>
    </section>
  )
}
