import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-lg">🌱</span>
          <span className="text-lg font-bold text-emerald-800">FreshForward</span>
        </Link>

        {/* Search (skeleton — not wired up) */}
        <div className="hidden flex-1 sm:block">
          <input
            type="search"
            placeholder="Search food, vendors..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-emerald-400"
          />
        </div>

        <button className="ml-auto flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 sm:ml-0">
          <span>📍</span>
          <span className="font-medium">Midtown, NY</span>
        </button>
      </div>
    </header>
  )
}
