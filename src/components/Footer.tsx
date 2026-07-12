import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-base">🌱</span>
              <span className="font-bold text-emerald-800">FreshForward</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Connecting communities with affordable, fresh food while reducing waste.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm text-slate-600">
            <Link to="/deals" className="hover:text-emerald-700">Discounted Groceries</Link>
            <Link to="/market" className="hover:text-emerald-700">Farmers Market</Link>
            <Link to="/sell" className="hover:text-emerald-700">Sell on FreshForward</Link>
          </nav>
        </div>

        <p className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-400">
          © 2026 FreshForward. All rights reserved. · Powered by AI
        </p>
      </div>
    </footer>
  )
}
