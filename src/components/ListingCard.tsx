import { Link } from 'react-router-dom'
import { LISTING_IMAGE_PLACEHOLDER } from '../lib/listingUi'
import type { Listing } from '../types'

export default function ListingCard({ listing }: { listing: Listing }) {
  const soldOut = listing.quantityAvailable === 0
  const savings = listing.originalPrice - listing.discountedPrice

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={LISTING_IMAGE_PLACEHOLDER}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
        {savings > 0 && !soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
            Save ${savings.toFixed(2)}
          </span>
        )}
      </div>
      <div className="p-3">
        <h2 className="line-clamp-2 text-sm font-bold text-slate-900">{listing.title}</h2>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold text-emerald-700">${listing.discountedPrice.toFixed(2)}</span>
          <span className="text-sm text-slate-400 line-through">${listing.originalPrice.toFixed(2)}</span>
        </div>
        <p className="mt-1 truncate text-xs text-slate-500">{listing.restaurantName}</p>
        <p className="mt-1 truncate text-xs text-slate-500">Pickup: {listing.pickupWindow}</p>
        {!soldOut && (
          <p className="mt-1 text-xs font-medium text-slate-600">
            {listing.quantityAvailable} available
          </p>
        )}
      </div>
    </Link>
  )
}
