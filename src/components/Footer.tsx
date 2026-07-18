import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-[var(--page-max-width)] px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] bg-[var(--color-primary-green)] text-white">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M6 13.5C6 7.9 10.7 4 18.5 4c.2 7.8-3.7 12.5-9.3 12.5H6v-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M6 20c2.5-5.2 5.8-8.5 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-bold text-[var(--color-dark-green)]">FreshForward</span>
            </div>
            <p className="mt-3 text-sm text-[var(--color-secondary-text)]">
              Connecting communities with affordable, fresh food while reducing waste.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm text-[var(--color-secondary-text)]">
            <Link to="/deals" className="hover:text-[var(--color-dark-green)]">Discounted Groceries</Link>
            <Link to="/market" className="hover:text-[var(--color-dark-green)]">Local Sellers</Link>
            <Link to="/sell" className="hover:text-[var(--color-dark-green)]">Sell on FreshForward</Link>
          </nav>
        </div>

        <p className="mt-8 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-secondary-text)]">
          © 2026 FreshForward. All rights reserved. · Powered by AI
        </p>
      </div>
    </footer>
  )
}
