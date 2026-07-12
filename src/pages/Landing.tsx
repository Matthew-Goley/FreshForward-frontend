import { Link } from 'react-router-dom'
import { deals } from '../data/deals'
import { marketplaces, stats } from '../data/site'
import DealCard from '../components/DealCard'
import MarketplaceCard from '../components/MarketplaceCard'
import StatCard from '../components/StatCard'

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Fresh food, finally affordable
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Save food. Save money. Choose your marketplace below.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link to="/deals" className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700">
              Browse Deals
            </Link>
            <Link to="/market" className="rounded-lg border border-emerald-600 px-6 py-3 font-medium text-emerald-700 hover:bg-emerald-50">
              Explore Market
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Marketplaces */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {marketplaces.map((market) => (
            <MarketplaceCard key={market.id} market={market} />
          ))}
        </div>
      </section>

      {/* Featured deals */}
      <section className="mx-auto max-w-6xl px-4 py-4">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">Featured Deals</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Live Deals Near You</h2>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* Seller CTA */}
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="rounded-2xl bg-emerald-700 px-6 py-12 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">You cook it, we sell it.</h2>
          <p className="mx-auto mt-2 max-w-lg text-emerald-100">
            Join hundreds of local sellers reducing food waste and earning extra income.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/sell" className="rounded-lg bg-white px-6 py-3 font-medium text-emerald-700 hover:bg-emerald-50">
              Start as Grocer
            </Link>
            <Link to="/sell" className="rounded-lg border border-white px-6 py-3 font-medium text-white hover:bg-emerald-600">
              Start as Seller
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
