import { Link } from 'react-router-dom'
import type { Marketplace } from '../data/site'

export default function MarketplaceCard({ market }: { market: Marketplace }) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 p-6 transition hover:border-emerald-300 hover:shadow-sm">
      <div className="text-3xl">{market.emoji}</div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{market.title}</h3>
      <p className="mt-1 text-sm text-slate-500">{market.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {market.highlights.map((h) => (
          <span key={h} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {h}
          </span>
        ))}
      </div>

      <Link
        to={market.href}
        className="mt-5 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700"
      >
        {market.ctaLabel}
      </Link>
    </div>
  )
}
