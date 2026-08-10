import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MarketplacePageShell from '../components/MarketplacePageShell'
import { useApp } from '../lib/AppContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { LISTING_IMAGE_PLACEHOLDER } from '../lib/listingUi'
import type { Listing } from '../types'

function DetailSkeleton() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="aspect-square rounded-2xl bg-gray-100" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-24 rounded-xl bg-gray-100" />
            <div className="h-12 w-full rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </main>
  )
}

function DetailMessage({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/listings"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
        </svg>
        Back to listings
      </Link>
      <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 px-6 py-10 text-center">
        <p className="text-base font-semibold text-slate-900">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </main>
  )
}

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const [searchDraft, setSearchDraft] = useState('')

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

  function handleSearchChange(value: string) {
    setSearchDraft(value)
    const trimmed = value.trim()
    navigate(trimmed ? `/listings?q=${encodeURIComponent(trimmed)}` : '/listings')
  }

  function handleBuy(listingId: string) {
    if (!currentUser) {
      navigate('/login', { state: { redirectTo: `/checkout/${listingId}` } })
      return
    }
    navigate(`/checkout/${listingId}`)
  }

  return (
    <MarketplacePageShell
      searchQuery={searchDraft}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search all listings..."
    >
      {loading && <DetailSkeleton />}

      {!loading && (error || !listing) && (
        <DetailMessage
          title="Could not load listing"
          message={error || 'Listing not found.'}
          action={
            <Link
              to="/listings"
              className="inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Browse all listings
            </Link>
          }
        />
      )}

      {!loading && listing && (
        <ListingDetailContent listing={listing} onBuy={() => handleBuy(listing.id)} />
      )}
    </MarketplacePageShell>
  )
}

function ListingDetailContent({
  listing,
  onBuy,
}: {
  listing: Listing
  onBuy: () => void
}) {
  const soldOut = listing.quantityAvailable === 0
  const savings = listing.originalPrice - listing.discountedPrice
  const discountPercent =
    listing.originalPrice > 0
      ? Math.round((savings / listing.originalPrice) * 100)
      : 0

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/listings"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
        </svg>
        Back to listings
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
          <div className="relative aspect-square">
            <img
              src={LISTING_IMAGE_PLACEHOLDER}
              alt=""
              className="h-full w-full object-cover"
            />
            {soldOut ? (
              <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-sm font-semibold text-white">
                Sold out
              </span>
            ) : (
              savings > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white">
                  Save ${savings.toFixed(2)}
                  {discountPercent > 0 ? ` (${discountPercent}% off)` : ''}
                </span>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            {listing.restaurantName}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{listing.title}</h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-emerald-700">
              ${listing.discountedPrice.toFixed(2)}
            </span>
            <span className="text-lg text-slate-400 line-through">
              ${listing.originalPrice.toFixed(2)}
            </span>
          </div>

          {listing.description.trim() && (
            <p className="mt-5 text-base leading-relaxed text-slate-600">{listing.description}</p>
          )}

          <div className="mt-6 space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4 text-sm">
              <span className="font-medium text-slate-500">Pickup window</span>
              <span className="text-right font-semibold text-slate-900">{listing.pickupWindow}</span>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-gray-100 pt-3 text-sm">
              <span className="font-medium text-slate-500">Available</span>
              <span className="text-right font-semibold text-slate-900">
                {soldOut ? (
                  <span className="text-red-600">Sold out</span>
                ) : (
                  `${listing.quantityAvailable} remaining`
                )}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-gray-100 pt-3 text-sm">
              <span className="font-medium text-slate-500">Listed</span>
              <span className="text-right text-slate-700">
                {new Date(listing.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBuy}
            disabled={soldOut}
            className="mt-6 w-full rounded-full bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto sm:min-w-[12rem]"
          >
            {soldOut ? 'Sold out' : 'Reserve pickup'}
          </button>

          <p className="mt-3 text-xs text-slate-500">
            Curbside pickup only. You will choose quantity on the next step.
          </p>
        </div>
      </div>
    </main>
  )
}
