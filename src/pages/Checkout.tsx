import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext'

export default function Checkout() {
  const { listingId: paramListingId } = useParams<{ listingId: string }>()
  const { listings, currentUser, placeOrder } = useApp()
  const navigate = useNavigate()

  const listing = listings.find((l) => l.id === paramListingId)

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p>Please log in to check out.</p>
        <Link to="/login" className="underline">
          Login
        </Link>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p>Listing not found.</p>
        <Link to="/listings" className="underline">
          Back to listings
        </Link>
      </div>
    )
  }

  const listingId = listing.id

  function handleConfirm() {
    const order = placeOrder(listingId)
    navigate(`/orders/${order.id}`)
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-xl font-bold">Checkout</h1>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Listing</dt>
          <dd>{listing.title}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Price</dt>
          <dd>${listing.discountedPrice.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Pickup window</dt>
          <dd>{listing.pickupWindow}</dd>
        </div>
      </dl>

      <button onClick={handleConfirm} className="mt-6 border border-gray-400 px-4 py-2">
        Confirm Purchase
      </button>
    </div>
  )
}
