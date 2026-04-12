'use client'

export default function RefreshButton() {
  return (
    <button 
      onClick={() => window.location.reload()}
      className="bg-accent text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-black transition shadow-lg shadow-accent/20"
    >
      Refresh Status
    </button>
  )
}
