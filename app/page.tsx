'use client'

import Link from 'next/link'
import Image from 'next/image'
import HeroSection from '@/components/HeroSection'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen relative bg-background text-foreground">
      
      <HeroSection />

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
