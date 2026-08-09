import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext'
import ListingCard from '../components/ListingCard'
import MarketplacePageShell from '../components/MarketplacePageShell'

export default function Listings() {
  const { listings, listingsLoading, listingsError, refreshListings } = useApp()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')

  const filtered = listings.filter((listing) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      listing.title.toLowerCase().includes(q) ||
      listing.restaurantName.toLowerCase().includes(q)
    )
  })

  return (
    <MarketplacePageShell searchQuery={query} onSearchChange={setQuery}>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Surplus listings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real deals from local restaurants and grocers near you.
          </p>
        </div>

        {listingsError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p>{listingsError}</p>
            <button
              type="button"
              onClick={() => void refreshListings()}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {listingsLoading && !listingsError && (
          <p className="text-sm text-slate-500">Loading listings…</p>
        )}

        {!listingsLoading && !listingsError && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 px-6 py-10 text-center">
                <p className="text-base font-semibold text-slate-900">No listings found</p>
                <p className="mt-1 text-sm text-slate-500">
                  {query.trim()
                    ? `Nothing matched "${query.trim()}". Try another search.`
                    : 'Check back soon for new surplus from local spots.'}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </MarketplacePageShell>
  )
}
