import { Link } from 'react-router-dom'
import type { SVGProps } from 'react'

function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  )
}

type ListingsPageHeaderProps = {
  headerScrolled: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
}

const textButtonHover = 'hover:bg-gray-300'

export default function ListingsPageHeader({
  headerScrolled,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search surplus listings...',
}: ListingsPageHeaderProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,box-shadow,color] duration-300 ease-in-out ${
        headerScrolled
          ? 'border-gray-100 bg-white shadow-sm'
          : 'border-emerald-700/30 bg-emerald-600'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3 lg:gap-4">
        <Link
          to="/"
          aria-label="FreshForward home"
          className="flex shrink-0 items-center gap-2 rounded-lg px-1 py-1 transition-opacity hover:opacity-80"
        >
          <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="shrink-0">
            <rect
              x="1"
              y="8.5"
              width="9.5"
              height="9.5"
              rx="2"
              transform="rotate(-45 5.75 13.25)"
              fill={headerScrolled ? '#059669' : '#ffffff'}
            />
            <rect
              x="10.2"
              y="3.2"
              width="9.5"
              height="9.5"
              rx="2"
              transform="rotate(-45 14.95 7.95)"
              fill={headerScrolled ? '#059669' : '#ffffff'}
              fillOpacity={headerScrolled ? 0.55 : 0.6}
            />
          </svg>
          <span
            className={`hidden text-lg font-bold tracking-tight sm:inline ${
              headerScrolled ? 'text-slate-800' : 'text-white'
            }`}
          >
            FreshForward
          </span>
        </Link>

        <div className="relative min-w-0 flex-1 max-w-2xl">
          <IconSearch
            className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
              headerScrolled ? 'text-slate-400' : 'text-white/70'
            }`}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search listings"
            className={`w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
              headerScrolled
                ? 'border-gray-100 bg-gray-50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                : 'border-white/25 bg-white/15 text-white placeholder:text-white/70 focus:border-white/50 focus:ring-2 focus:ring-white/20'
            }`}
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/browse"
            className={`hidden rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:inline ${
              headerScrolled
                ? `text-slate-600 ${textButtonHover} hover:text-slate-900`
                : 'text-white hover:bg-white/15'
            }`}
          >
            Browse
          </Link>
          <Link
            to="/login"
            className={`hidden rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:inline ${
              headerScrolled
                ? `text-slate-600 ${textButtonHover} hover:text-slate-900`
                : 'text-white hover:bg-white/15'
            }`}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="hidden rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:inline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}
