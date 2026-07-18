import { Link } from 'react-router-dom'
import type { Listing } from '../types'

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link to={`/listings/${listing.id}`} className="block border border-gray-300 p-4 hover:border-gray-500">
      <h2 className="font-semibold">{listing.title}</h2>
      <p className="text-sm text-gray-600">{listing.restaurantName}</p>
      <p className="mt-2">
        <span className="font-semibold">${listing.discountedPrice.toFixed(2)}</span>{' '}
        <span className="text-gray-500 line-through">${listing.originalPrice.toFixed(2)}</span>
      </p>
      <p className="mt-1 text-sm text-gray-600">Pickup: {listing.pickupWindow}</p>
      <p className="text-sm text-gray-600">{listing.quantityAvailable} available</p>
    </Link>
  )
}
