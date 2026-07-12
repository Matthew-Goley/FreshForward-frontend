import { deals } from '../data/deals'
import DealCard from '../components/DealCard'

export default function Deals() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">Discounted Groceries</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Browse Deals</h1>
      <p className="mt-2 text-slate-500">
        Live discounted prices from local restaurants and grocery stores. Curbside, in-person, or delivery.
      </p>

      {/* Filters (skeleton) */}
      <div className="mt-6 flex flex-wrap gap-2">
        {['All', 'Bakery', 'Produce', 'Prepared', 'Restaurant', 'Grocery'].map((f) => (
          <button
            key={f}
            className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600 hover:border-emerald-400 hover:text-emerald-700"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
}
