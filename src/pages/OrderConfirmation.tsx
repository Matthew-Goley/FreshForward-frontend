import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import type { Order } from '../types'

const statusLabels: Record<Order['status'], string> = {
  pending_payment: 'Awaiting payment',
  paid: 'Paid',
  payment_failed: 'Payment failed',
  ready: 'Ready for pickup',
  picked_up: 'Picked up',
  cancelled: 'Cancelled',
}

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    void api
      .getOrder(orderId)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 403) {
          setError("You don't have access to this order.")
        } else if (err instanceof ApiError && err.status === 404) {
          setError('Order not found.')
        } else {
          setError(err instanceof ApiError ? err.message : 'Could not load this order.')
        }
      })
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p className="text-gray-500">Loading order…</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p role="alert">{error || 'Order not found.'}</p>
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
          <dt>Quantity</dt>
          <dd>{order.quantity}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Total</dt>
          <dd>${order.price.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Status</dt>
          <dd>{statusLabels[order.status]}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Pickup window</dt>
          <dd>{order.pickupWindow}</dd>
        </div>
      </dl>

      {(order.status === 'paid' || order.status === 'ready') && (
        <p className="mt-4 font-semibold">Confirmed. Pick up at {order.pickupWindow}</p>
      )}
    </div>
  )
}
