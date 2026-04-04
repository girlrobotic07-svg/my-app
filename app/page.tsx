import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex flex-col min-h-[calc(100vh-73px)] relative bg-background text-foreground">
      
      {/* Hero Section with Image Background */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/sherwani_hero.png"
          alt="Shreeji Ethnic Hero"
          fill
          className="object-cover object-top brightness-[0.8]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="text-accent font-bold uppercase tracking-[0.3em] text-sm">Now Exclusively Available</span>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none text-white drop-shadow-2xl">
            Shreeji <span className="text-accent">Ethnic</span>
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
            Defining royalty with our exquisite collection of premium Sherwanis and Indo-Western couture.
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
              Custom Fitting
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight">Our Signature Collections</h2>
            <p className="text-muted-foreground text-lg">Hand-crafted elegance for your most special occasions.</p>
          </div>
          <Link href="/products" className="text-accent font-bold hover:underline underline-offset-4">View All Designs →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: 'The Royal Sherwani', 
              tag: 'Wedding Essence',
              img: '/images/sherwani_hero.png',
              price: 'Starts from ₹24,999'
            },
            { 
              title: 'Indo-Western Fusion', 
              tag: 'Modern Royalty',
              img: '/images/indo_western.png',
              price: 'Starts from ₹18,999'
            },
            { 
              title: 'Celebration Kurtas', 
              tag: 'Elegant Comfort',
              img: '/images/kurta.png',
              price: 'Starts from ₹4,999'
            },
          ].map((item, i) => (
            <div key={item.title} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-4 bg-muted animate-in fade-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
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
              <p className="text-muted-foreground font-medium">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/30 py-24 px-6 border-y border-muted/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { title: 'Custom Fitting', desc: 'Expert tailors ensuring a perfect silhouette for your body type.', icon: '🧵' },
            { title: 'Premium Fabrics', desc: 'Sourced from the finest silk and velvet mills across India.', icon: '✨' },
            { title: 'Global Delivery', desc: 'Elegance delivered to your doorstep, anywhere in the world.', icon: '🌍' },
          ].map((feature) => (
            <div key={feature.title} className="space-y-4">
              <div className="text-5xl">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8 p-12 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full" />
          <h2 className="text-4xl font-black tracking-tight relative z-10">Make Your Special Day Unforgettable</h2>
          <p className="text-white/70 text-lg relative z-10">Book a personal styling session or visit our boutique to experience luxury first-hand.</p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/login" className="bg-accent text-white px-8 py-3.5 rounded-full font-bold hover:bg-accent/90 transition-all">Book Appointment</Link>
            <Link href="/products" className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold hover:bg-slate-100 transition-all">View All Styles</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
