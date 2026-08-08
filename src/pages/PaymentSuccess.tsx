import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import * as api from '../lib/api'
import type { Order } from '../types'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [settled, setSettled] = useState(false)

  // The Stripe webhook is asynchronous and may not have landed when the browser
  // arrives here. Poll a few times before falling back to a softer message (D-17).
  useEffect(() => {
    if (!sessionId) {
      queueMicrotask(() => setSettled(true))
      return
    }
    let cancelled = false
    let attempts = 0

    const tick = async () => {
      attempts += 1
      try {
        const found = await api.getOrderBySession(sessionId)
        if (cancelled) return
        setOrder(found)
        if (found.status !== 'pending_payment') {
          setSettled(true)
          return
        }
      } catch {
        // 404 just means the webhook hasn't landed yet; keep trying.
      }
      if (cancelled) return
      if (attempts < 5) setTimeout(tick, 1500)
      else setSettled(true)
    }

    void tick()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const confirmed = order?.status && order.status !== 'pending_payment'

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-xl font-bold">Payment received</h1>
      <p className="mt-2 text-sm text-slate-600">
        {confirmed
          ? `Your order is confirmed. Pick up at ${order?.pickupWindow}.`
          : settled
            ? 'Your payment went through. Confirmation may take a few moments to appear in your orders.'
            : 'Confirming your order…'}
      </p>
      {confirmed && order && (
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
        </dl>
      )}
      <Link to="/listings" className="mt-4 inline-block underline">
        Back to listings
      </Link>
    </div>
  )
}
