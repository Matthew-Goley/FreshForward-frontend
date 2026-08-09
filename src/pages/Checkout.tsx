import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import type { Listing } from '../types'

export default function Checkout() {
  const { listingId } = useParams<{ listingId: string }>()
  const { placeOrder } = useApp()

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!listingId) return
    queueMicrotask(() => {
      setLoading(true)
      setLoadError('')
      void api
        .getListing(listingId)
        .then(setListing)
        .catch((err) => {
          setListing(null)
          setLoadError(
            err instanceof ApiError && err.status === 404
              ? 'Listing not found.'
              : err instanceof ApiError
                ? err.message
                : 'Could not load this listing. Please try again shortly.',
          )
        })
        .finally(() => setLoading(false))
    })
  }, [listingId])

  if (loading) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p className="text-gray-500">Loading checkout…</p>
      </div>
    )
  }

  if (loadError || !listing || !listingId) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p role="alert">{loadError || 'Listing not found.'}</p>
        <Link to="/listings" className="underline">
          Back to listings
        </Link>
      </div>
    )
  }

  const soldOut = listing.quantityAvailable === 0
  const maxQuantity = Math.max(listing.quantityAvailable, 1)
  const boundedQuantity = Math.min(Math.max(quantity, 1), maxQuantity)
  const total = listing.discountedPrice * boundedQuantity

  async function handleConfirm() {
    setError('')
    setSubmitting(true)
    try {
      const { checkoutUrl } = await placeOrder(listingId!, boundedQuantity)
      // Full page navigation — checkout.stripe.com is an external origin and
      // React Router cannot navigate there (D-16).
      window.location.href = checkoutUrl
      // Deliberately do NOT clear `submitting` here: the page is navigating
      // away, and re-enabling the button invites a double-click that creates
      // two orders and two Stripe sessions.
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not start checkout. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-xl font-bold">Checkout</h1>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Listing</dt>
          <dd>{listing.title}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Price each</dt>
          <dd>${listing.discountedPrice.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 py-1">
          <dt>
            <label htmlFor="quantity">Quantity</label>
          </dt>
          <dd>
            <input
              id="quantity"
              type="number"
              min={1}
              max={maxQuantity}
              step={1}
              value={boundedQuantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              disabled={soldOut}
              className="w-20 border border-gray-400 px-2 py-1 text-right"
            />
          </dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Total</dt>
          <dd className="font-semibold">${total.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Pickup window</dt>
          <dd>{listing.pickupWindow}</dd>
        </div>
      </dl>

      {soldOut && (
        <p className="mt-4 text-sm font-semibold text-red-600">This listing is sold out.</p>
      )}

      <button
        onClick={() => void handleConfirm()}
        disabled={submitting || soldOut}
        className="mt-6 border border-gray-400 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Redirecting to payment…' : 'Continue to payment'}
      </button>
      <p className="mt-2 text-xs text-gray-500">You'll complete payment securely on Stripe.</p>
    </div>
  )
}
