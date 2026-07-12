import type { Deal } from '../data/deals'

export default function DealCard({ deal }: { deal: Deal }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 transition hover:shadow-md">
      <div className="relative grid h-32 place-items-center bg-emerald-50 text-5xl">
        {deal.emoji}
        <span className="absolute left-2 top-2 rounded-md bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
          -{deal.discount}%
        </span>
      </div>

      <div className="p-3">
        <div className="text-xs text-slate-400">{deal.vendor}</div>
        <div className="font-semibold text-slate-900">{deal.name}</div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold text-emerald-700">${deal.price.toFixed(2)}</span>
          <span className="text-sm text-slate-400 line-through">${deal.originalPrice.toFixed(2)}</span>
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {deal.quantity} · Expires {deal.expires}
        </div>
      </div>
    </div>
  )
}
