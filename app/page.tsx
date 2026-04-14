'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'

const SLIDES = [
  {
    image: '/images/sherwani_hero.png',
    title: 'Royal Sherwani',
    subtitle: 'Wedding Essence',
    description: 'Experience true royalty with our hand-crafted wedding couture.'
  },
  {
    image: '/images/indo_western.png',
    title: 'Indo-Western',
    subtitle: 'Modern Fusion',
    description: 'A perfect blend of contemporary style and traditional roots.'
  },
  {
    image: '/images/kurta.png',
    title: 'Silk Kurtas',
    subtitle: 'Elegant Comfort',
    description: 'Simple, sophisticated, and perfect for every celebration.'
  }
]

function HeroSlider() {
  const [current, setCurrent] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className={`object-cover object-top transition-transform duration-[5s] ease-linear ${
              index === current ? 'scale-110' : 'scale-100'
            }`}
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-center space-y-6 px-6 max-w-4xl transition-all duration-700 delay-300 ${
              index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <span className="text-accent font-bold uppercase tracking-[0.3em] text-sm drop-shadow-md">
                {slide.subtitle}
              </span>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none text-white drop-shadow-2xl">
                {slide.title.split(' ')[0]} <span className="text-accent">{slide.title.split(' ')[1]}</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
                {slide.description}
              </p>
              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-accent text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-accent/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/login"
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all active:scale-95"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all z-20 group"
      >
        <svg className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all z-20 group"
      >
        <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              i === current ? 'w-8 bg-accent' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="flex flex-col min-h-[calc(100vh-73px)] relative bg-background text-foreground">
      
      <HeroSlider />

      {/* Featured Collections Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight">Signature Series</h2>
            <p className="text-muted-foreground text-lg">Hand-crafted elegance for your most special occasions.</p>
          </div>
          <Link href="/products" className="text-accent font-bold hover:underline underline-offset-4">View Full Lookbook →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Royal Sherwani', tag: 'Wedding', img: '/images/sherwani_hero.png', price: '₹24,999', slug: 'sherwani' },
            { title: 'Indo-Western Fusion', tag: 'Contemporary', img: '/images/indo_western.png', price: '₹18,999', slug: 'indo-western' },
            { title: 'Celebration Kurtas', tag: 'Festive', img: '/images/kurta.png', price: '₹4,999', slug: 'kurtas' },
          ].map((item, i) => (
            <Link key={item.title} href={`/products#${item.slug}`} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-4 bg-muted animate-in fade-in duration-500">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {item.tag}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{item.title}</h3>
              <p className="text-muted-foreground font-medium">Starts from {item.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Process Section */}
      <section className="bg-slate-900 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {[
            { title: 'Bespoke Fitting', desc: 'Expert tailors ensuring a perfect silhouette for your body type.', icon: '🧵' },
            { title: 'Luxury Fabrics', desc: 'Sourced from the finest silk and velvet mills across India.', icon: '✨' },
            { title: 'Global Concierge', desc: 'Elegance delivered to your doorstep, anywhere in the world.', icon: '🌍' },
          ].map((feature) => (
            <div key={feature.title} className="space-y-4">
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8 p-16 rounded-[3.5rem] bg-slate-50 border border-slate-200 shadow-2xl shadow-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full" />
          <h2 className="text-5xl font-black tracking-tight text-slate-900 relative z-10">Make Your Special Day Unforgettable</h2>
          <p className="text-slate-600 text-xl relative z-10">Book a personal styling session or visit our boutique to experience luxury first-hand.</p>
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/login" className="bg-accent text-white px-10 py-4 rounded-full font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">Book Appointment</Link>
            <Link href="/products" className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">View Lookbook</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
