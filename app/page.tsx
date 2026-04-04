// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12 lg:py-24 overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-8 relative">
        {/* Hero Section */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            Welcome to My App <span className="inline-block animate-bounce">🚀</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A high-performance, full-stack web application built with <span className="text-foreground font-medium">Next.js</span>, 
            <span className="text-foreground font-medium"> Supabase</span>, and <span className="text-foreground font-medium">Stripe</span>. 
            Ready for production.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Link
            href="/dashboard"
            className="group relative flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-all hover:scale-105 active:scale-95 sm:w-auto"
          >
            Go to Dashboard
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="flex h-12 items-center justify-center rounded-full border border-border bg-background/50 px-8 text-sm font-semibold transition-all hover:bg-muted active:scale-95"
            >
              Sign In
            </Link>
            <Link
              href="/products"
              className="flex h-12 items-center justify-center rounded-full border border-border bg-background/50 px-8 text-sm font-semibold transition-all hover:bg-muted active:scale-95"
            >
              View Plans
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          {[
            { 
              title: 'Next.js 15', 
              desc: 'Leveraging the latest App Router patterns for speed and SEO.', 
              icon: '⚡',
              color: 'from-blue-500/20'
            },
            { 
              title: 'Supabase Auth', 
              desc: 'Secure authentication and real-time database integration.', 
              icon: '🗄️',
              color: 'from-emerald-500/20'
            },
            { 
              title: 'Stripe Billing', 
              desc: 'Seamless subscription management and payment flows.', 
              icon: '💳',
              color: 'from-purple-500/20'
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group relative bg-background/40 backdrop-blur-sm border border-border rounded-2xl p-8 text-left transition-all hover:border-foreground/20 hover:shadow-2xl hover:shadow-foreground/5"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-2xl`} />
              <div className="text-3xl mb-4">{card.icon}</div>
              <h2 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">{card.title}</h2>
              <p className="text-muted-foreground text-sm line-height-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

