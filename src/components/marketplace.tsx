import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Deal } from '../data/deals'
import type { Category, Seller } from '../data/site'
import { useLocationState } from '../context/location'
import { IconButton, Input } from './ui'

export function SearchBar({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-secondary-text)]">
        <SearchIcon />
      </span>
      <Input
        label="Search food, stores, restaurants, and categories"
        type="search"
        placeholder={compact ? 'Search food or stores' : 'Search food, grocery stores, restaurants, or categories'}
        className="pl-11"
      />
    </div>
  )
}

export function AddressEntry() {
  const { location, setLocation } = useLocationState()
  const [address, setAddress] = useState(location)

  return (
    <form
      className="mx-auto mt-8 w-full max-w-[700px]"
      onSubmit={(event) => {
        event.preventDefault()
        setLocation(address)
      }}
    >
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-2 shadow-[0_18px_45px_rgb(17_24_39_/_0.12)]">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Delivery or pickup address</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-secondary-text)]">
              <LocationIcon />
            </span>
            <input
              type="text"
              placeholder="Enter your delivery or pickup address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="min-h-14 w-full rounded-[var(--radius-control)] border-0 bg-white px-4 pl-11 text-base font-medium text-[var(--color-primary-text)] outline-none placeholder:font-normal placeholder:text-[var(--color-secondary-text)] focus:ring-2 focus:ring-[var(--color-primary-green)]"
            />
          </label>
          <button
            type="submit"
            className="min-h-14 rounded-[var(--radius-control)] bg-[var(--color-primary-green)] px-7 text-base font-semibold text-white transition hover:bg-[var(--color-dark-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
          >
            Find food
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setLocation('Midtown, NY')}
        className="mx-auto mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-[var(--color-dark-green)] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
      >
        <LocationIcon />
        Use my current location
      </button>
    </form>
  )
}

export function LocationSelector({ state = 'available' }: { state?: 'available' | 'unavailable' }) {
  const { location, setLocation, clearLocation } = useLocationState()
  const unavailable = state === 'unavailable'
  const [editing, setEditing] = useState(false)
  const [nextLocation, setNextLocation] = useState(location)

  if (editing) {
    return (
      <form
        className="flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white px-3"
        onSubmit={(event) => {
          event.preventDefault()
          setLocation(nextLocation)
          setEditing(false)
        }}
      >
        <label>
          <span className="sr-only">Change location</span>
          <input
            autoFocus
            type="text"
            value={nextLocation}
            onChange={(event) => setNextLocation(event.target.value)}
            placeholder="Set location"
            className="w-32 bg-transparent text-sm font-semibold text-[var(--color-primary-text)] outline-none placeholder:text-[var(--color-secondary-text)] sm:w-40"
          />
        </label>
        <button type="submit" className="text-sm font-semibold text-[var(--color-dark-green)]">
          Save
        </button>
        <button
          type="button"
          className="text-sm font-semibold text-[var(--color-secondary-text)]"
          onClick={() => {
            setEditing(false)
            setNextLocation(location)
          }}
        >
          Cancel
        </button>
      </form>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setNextLocation(location)
        setEditing(true)
        if (unavailable) {
          clearLocation()
        }
      }}
      className="flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-3 text-left font-semibold text-[var(--color-primary-text)] transition hover:bg-[var(--color-pale-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-pale-green)] text-[var(--color-dark-green)]">
        <LocationIcon />
      </span>
      <span className="max-w-[150px] truncate text-sm">
        {unavailable ? 'Set location' : location || 'Set location'}
      </span>
    </button>
  )
}

export function CategoryChip({ category, active = false }: { category: Category; active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={[
        'flex min-h-11 min-w-max items-center gap-2 rounded-full border px-4 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2',
        active
          ? 'border-[var(--color-primary-green)] bg-[var(--color-pale-green)] text-[var(--color-dark-green)]'
          : 'border-[var(--color-border)] bg-white text-[var(--color-primary-text)] hover:border-[var(--color-primary-green)]',
      ].join(' ')}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-page-background)] text-[11px] font-bold">
        {category.label.slice(0, 2).toUpperCase()}
      </span>
      <span>{category.label}</span>
    </button>
  )
}

export function DiscountBadge({ discount }: { discount: number }) {
  return (
    <span className="rounded-full bg-[var(--color-discount-red)] px-2.5 py-1 text-xs font-bold text-white">
      Save {discount}%
    </span>
  )
}

export function AvailabilityBadge({ deal }: { deal: Deal }) {
  if (deal.soldOut) {
    return (
      <span className="rounded-full bg-[var(--color-disabled)] px-2.5 py-1 text-xs font-semibold text-white">
        Sold out
      </span>
    )
  }

  if (deal.quantityRemaining <= 3) {
    return (
      <span className="rounded-full bg-[var(--color-warning-amber)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary-text)]">
        Only {deal.quantityRemaining} left
      </span>
    )
  }

  return (
    <span className="rounded-full bg-[var(--color-pale-green)] px-2.5 py-1 text-xs font-semibold text-[var(--color-dark-green)]">
      {deal.tag ?? 'Available'}
    </span>
  )
}

export function ProductCard({ deal }: { deal: Deal }) {
  const disabled = deal.soldOut

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-pale-green)]">
        <div className="flex h-full items-center justify-center bg-[var(--color-pale-green)]">
          <div className="grid h-20 w-20 place-items-center rounded-[var(--radius-card)] border border-white bg-white text-lg font-bold text-[var(--color-dark-green)] shadow-sm">
            {deal.category.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <DiscountBadge discount={deal.discount} />
          <AvailabilityBadge deal={deal} />
        </div>
        <IconButton
          label={`Save ${deal.name}`}
          className="absolute right-3 top-3 h-10 w-10 border-white/80 bg-white/90"
        >
          <HeartIcon />
        </IconButton>
        {disabled ? <div className="absolute inset-0 bg-white/55" aria-hidden="true" /> : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-[var(--color-primary-text)]">{deal.name}</h3>
            <p className="mt-1 truncate text-sm text-[var(--color-secondary-text)]">
              {deal.vendor} · {deal.distance}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--color-dark-green)]">${deal.price.toFixed(2)}</span>
          <span className="text-sm text-[var(--color-secondary-text)] line-through">
            ${deal.originalPrice.toFixed(2)}
          </span>
        </div>

        <p className="mt-2 text-sm font-medium text-[var(--color-primary-text)]">{deal.pickupWindow}</p>
        <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
          {deal.quantityRemaining > 0 ? `${deal.quantityRemaining} left` : 'Sold out'}
        </p>
      </div>
    </article>
  )
}

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--color-border)] bg-white/95 px-4 py-2 backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 text-xs font-semibold text-[var(--color-secondary-text)]">
        <Link className="rounded-[var(--radius-control)] px-2 py-2 text-center hover:bg-[var(--color-pale-green)] hover:text-[var(--color-dark-green)]" to="/">
          Home
        </Link>
        <Link className="rounded-[var(--radius-control)] px-2 py-2 text-center hover:bg-[var(--color-pale-green)] hover:text-[var(--color-dark-green)]" to="/deals">
          Browse
        </Link>
        <Link className="rounded-[var(--radius-control)] px-2 py-2 text-center hover:bg-[var(--color-pale-green)] hover:text-[var(--color-dark-green)]" to="/sell">
          Sell
        </Link>
        <Link className="rounded-[var(--radius-control)] px-2 py-2 text-center text-[var(--color-dark-green)] hover:bg-[var(--color-pale-green)]" to="/deals">
          Cart · 1
        </Link>
      </div>
    </nav>
  )
}

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <Link
      to="/market"
      className="flex min-w-[260px] gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
    >
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[var(--radius-card)] bg-[var(--color-pale-green)] text-sm font-bold text-[var(--color-dark-green)]">
        {seller.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-bold text-[var(--color-primary-text)]">{seller.name}</h3>
          {seller.verified ? (
            <span className="rounded-full bg-[var(--color-success)] px-2 py-0.5 text-xs font-semibold text-white">
              Verified
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
          {seller.category} · {seller.distance}
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--color-primary-text)]">
          {seller.activeDeals} active demo listings
        </p>
        <p className="mt-1 text-xs text-[var(--color-secondary-text)]">{seller.pickupAvailability}</p>
      </div>
    </Link>
  )
}

export function SectionHeader({
  title,
  description,
  actionLabel = 'View all',
}: {
  title: string
  description?: string
  actionLabel?: string
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary-text)]">{title}</h2>
        {description ? <p className="mt-1 text-sm text-[var(--color-secondary-text)]">{description}</p> : null}
      </div>
      <Link
        to="/deals"
        className="shrink-0 text-sm font-semibold text-[var(--color-dark-green)] hover:text-[var(--color-primary-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
      >
        {actionLabel}
      </Link>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="aspect-[4/3] animate-pulse rounded-[var(--radius-card)] bg-[var(--color-page-background)]" />
      <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-[var(--color-page-background)]" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[var(--color-page-background)]" />
      <div className="mt-5 h-11 animate-pulse rounded-[var(--radius-control)] bg-[var(--color-page-background)]" />
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
      <h3 className="text-lg font-bold text-[var(--color-primary-text)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-secondary-text)]">{description}</p>
    </div>
  )
}

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-warning-amber)] bg-white p-6">
      <h3 className="font-bold text-[var(--color-primary-text)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--color-secondary-text)]">{description}</p>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
