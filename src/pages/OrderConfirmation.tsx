import { Link, useParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext'

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>()
  const { orders } = useApp()

  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p>Order not found.</p>
        <Link to="/listings" className="underline">
          Back to listings
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-xl font-bold">Order Confirmation</h1>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Listing</dt>
          <dd>{order.listingTitle}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Restaurant</dt>
          <dd>{order.restaurantName}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Pickup window</dt>
          <dd>{order.pickupWindow}</dd>
        </div>
      </dl>

      <p className="mt-4 font-semibold">Confirmed — pick up at {order.pickupWindow}</p>
    </div>
  )
}
