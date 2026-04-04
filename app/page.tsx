import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12 lg:py-24 relative overflow-hidden bg-background text-foreground">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 relative animate-in fade-in duration-700">
        
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] text-slate-900">
            Welcome to <span className="text-blue-600">My App</span> <span className="inline-block animate-bounce">🚀</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A high-performance, full-stack web application built with <span className="text-slate-900 font-semibold underline decoration-blue-500/30">Next.js</span>, 
            <span className="text-slate-900 font-semibold underline decoration-blue-500/30"> Supabase</span>, and <span className="text-slate-900 font-semibold underline decoration-blue-500/30">Stripe</span>. 
          </p>
        </div>


        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4">
          <Link
            href="/dashboard"
            className="group relative flex h-14 items-center justify-center gap-3 rounded-2xl bg-foreground px-10 text-base font-bold text-background transition-all hover:scale-105 active:scale-95 shadow-lg shadow-foreground/10 sm:w-auto"
          >
            Go to Dashboard
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div className="flex gap-4 w-full sm:w-auto">
            <Link
              href="/login"
              className="flex-1 sm:flex-none flex h-14 items-center justify-center rounded-2xl border-2 border-muted bg-transparent px-8 text-base font-bold transition-all hover:bg-muted/50 hover:border-foreground/20 active:scale-95"
            >
              Sign In
            </Link>
            <Link
              href="/products"
              className="flex-1 sm:flex-none flex h-14 items-center justify-center rounded-2xl border-2 border-muted bg-transparent px-8 text-base font-bold transition-all hover:bg-muted/50 hover:border-foreground/20 active:scale-95"
            >
              View Plans
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          {[
            { 
              title: 'Next.js 15', 
              desc: 'Leveraging the latest App Router patterns for speed and SEO optimization.', 
              icon: '⚡',
              borderColor: 'hover:border-blue-500/50'
            },
            { 
              title: 'Supabase Auth', 
              desc: 'Secure authentication and real-time database integration out of the box.', 
              icon: '🗄️',
              borderColor: 'hover:border-emerald-500/50'
            },
            { 
              title: 'Stripe Billing', 
              desc: 'Seamless subscription management and payment flows for your users.', 
              icon: '💳',
              borderColor: 'hover:border-purple-500/50'
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`group bg-muted/20 backdrop-blur-md border border-muted/30 rounded-3xl p-8 transition-all hover:shadow-2xl hover:-translate-y-1 ${card.borderColor}`}
            >
              <div className="text-4xl mb-6">{card.icon}</div>
              <h2 className="text-xl font-black mb-3 text-foreground">{card.title}</h2>
              <p className="text-muted-foreground text-base leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
