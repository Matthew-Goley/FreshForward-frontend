import { useState } from 'react'
import { useApp } from '../lib/AppContext'
import ListingCard from '../components/ListingCard'

export default function Listings() {
  const { listings, listingsLoading, listingsError, refreshListings } = useApp()
  const [query, setQuery] = useState('')

  const filtered = listings.filter((l) => l.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-xl font-bold">Browse Listings</h1>

      <input
        type="text"
        placeholder="Search by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-4 w-full max-w-sm border border-gray-400 px-3 py-2"
      />

      {listingsError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p>{listingsError}</p>
          <button onClick={() => void refreshListings()} className="mt-2 font-semibold underline">
            Try again
          </button>
        </div>
      )}

      {listingsLoading && !listingsError && <p className="mt-6 text-gray-500">Loading listings…</p>}

      {!listingsLoading && !listingsError && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {filtered.length === 0 && <p className="mt-4 text-gray-500">No listings found.</p>}
        </>
      )}
    </div>
  )
}
