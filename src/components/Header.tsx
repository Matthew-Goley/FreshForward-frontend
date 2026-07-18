import { Link } from 'react-router-dom'
import { LocationSelector } from './marketplace'

export default function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-white">
      <div className="mx-auto grid max-w-[var(--page-max-width)] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 justify-self-start rounded-[var(--radius-control)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
        >
          <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-control)] bg-[var(--color-primary-green)] text-white">
            <BrandMark />
          </span>
          <span className="hidden text-lg font-bold text-[var(--color-dark-green)] sm:inline">FreshForward</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center justify-center gap-3 md:flex">
          <Link
            className="inline-flex min-h-12 items-center gap-2.5 rounded-[var(--radius-control)] px-5 text-base font-semibold text-[var(--color-primary-text)] transition hover:bg-[var(--color-pale-green)] hover:text-[var(--color-dark-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
            to="/deals"
          >
            <BrowseIcon />
            Browse
          </Link>
          <Link
            className="inline-flex min-h-12 items-center gap-2.5 rounded-[var(--radius-control)] px-5 text-base font-semibold text-[var(--color-primary-text)] transition hover:bg-[var(--color-pale-green)] hover:text-[var(--color-dark-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
            to="/sell"
          >
            <SellIcon />
            Sell
          </Link>
        </nav>

        <div className="hidden items-center justify-end gap-3 md:flex">
          <LocationSelector />
          <button className="min-h-11 rounded-[var(--radius-control)] px-4 text-[15px] font-semibold text-[var(--color-primary-text)] transition hover:bg-[var(--color-pale-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2">
            Sign in
          </button>
          <button className="min-h-11 rounded-[var(--radius-control)] bg-[var(--color-primary-green)] px-5 text-[15px] font-semibold text-white transition hover:bg-[var(--color-dark-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2">
            Sign up
          </button>
        </div>

        <button
          type="button"
          aria-label="Open account menu"
          className="col-start-3 grid h-11 w-11 place-items-center justify-self-end rounded-full border border-[var(--color-border)] text-[var(--color-primary-text)] md:hidden"
        >
          <MenuIcon />
        </button>
      </div>

      <div className="border-t border-[var(--color-border)] px-4 py-3 md:hidden">
        <div className="mx-auto flex max-w-[var(--page-max-width)] items-center gap-2 overflow-x-auto">
          <Link
            className="inline-flex min-h-11 min-w-max items-center gap-2 rounded-[var(--radius-control)] px-4 text-sm font-semibold text-[var(--color-primary-text)] hover:bg-[var(--color-pale-green)] hover:text-[var(--color-dark-green)]"
            to="/deals"
          >
            <BrowseIcon />
            Browse
          </Link>
          <Link
            className="inline-flex min-h-11 min-w-max items-center gap-2 rounded-[var(--radius-control)] px-4 text-sm font-semibold text-[var(--color-primary-text)] hover:bg-[var(--color-pale-green)] hover:text-[var(--color-dark-green)]"
            to="/sell"
          >
            <SellIcon />
            Sell
          </Link>
          <LocationSelector />
        </div>
      </div>
    </header>
  )
}

function BrandMark() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M6 13.5C6 7.9 10.7 4 18.5 4c.2 7.8-3.7 12.5-9.3 12.5H6v-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 20c2.5-5.2 5.8-8.5 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BrowseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M4 10h16l-1.2 9H5.2L4 10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 10a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SellIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 7.5h16v12H4v-12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
