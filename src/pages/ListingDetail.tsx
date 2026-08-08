import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import type { Listing } from '../types'

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const { currentUser } = useApp()
  const navigate = useNavigate()

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    queueMicrotask(() => {
      setLoading(true)
      setError('')
      void api
        .getListing(id)
        .then(setListing)
        .catch((err) => {
          setListing(null)
          setError(
            err instanceof ApiError && err.status === 404
              ? 'Listing not found.'
              : err instanceof ApiError
                ? err.message
                : 'Could not load this listing. Please try again shortly.',
          )
        })
        .finally(() => setLoading(false))
    })
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-gray-500">Loading listing…</p>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p role="alert">{error || 'Listing not found.'}</p>
        <Link to="/listings" className="underline">
          Back to listings
        </Link>
      </div>
    )
  }

  const listingId = listing.id
  const soldOut = listing.quantityAvailable === 0

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
          <dd>{soldOut ? <span className="font-semibold text-red-600">Sold out</span> : listing.quantityAvailable}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-1">
          <dt>Pickup window</dt>
          <dd>{listing.pickupWindow}</dd>
        </div>
      </dl>

      <button
        onClick={handleBuy}
        disabled={soldOut}
        className="mt-6 border border-gray-400 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {soldOut ? 'Sold out' : 'Buy'}
      </button>
    </div>
  )
}
