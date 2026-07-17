import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext'

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const { listings, currentUser } = useApp()
  const navigate = useNavigate()

  const listing = listings.find((l) => l.id === id)

  if (!listing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p>Listing not found.</p>
        <Link to="/listings" className="underline">
          Back to listings
        </Link>
      </div>
    )
  }

  const listingId = listing.id

  function handleBuy() {
    if (!currentUser) {
      navigate('/login', { state: { redirectTo: `/checkout/${listingId}` } })
      return
    }
    navigate(`/checkout/${listingId}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-xl font-bold">{listing.title}</h1>
      <p className="text-gray-600">{listing.restaurantName}</p>
      <p className="mt-4">{listing.description}</p>

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Price</dt>
          <dd>
            <span className="font-semibold">${listing.discountedPrice.toFixed(2)}</span>{' '}
            <span className="text-gray-500 line-through">${listing.originalPrice.toFixed(2)}</span>
          </dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Quantity available</dt>
          <dd>{listing.quantityAvailable}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Pickup window</dt>
          <dd>{listing.pickupWindow}</dd>
        </div>
      </dl>

      <button onClick={handleBuy} className="mt-6 border border-gray-400 px-4 py-2">
        Buy
      </button>
    </div>
  )
}
