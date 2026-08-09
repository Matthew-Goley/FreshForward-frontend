import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../lib/AppContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import type { Listing, ListingInput, Order, OrderStatus } from '../types'

interface ListingFormState {
  title: string
  description: string
  originalPrice: string
  discountedPrice: string
  quantityAvailable: string
  pickupWindow: string
}

const emptyForm: ListingFormState = {
  title: '',
  description: '',
  originalPrice: '',
  discountedPrice: '',
  quantityAvailable: '',
  pickupWindow: '',
}

const orderStatusLabels: Record<OrderStatus, string> = {
  pending_payment: 'Awaiting payment',
  paid: 'Paid',
  payment_failed: 'Payment failed',
  ready: 'Ready for pickup',
  picked_up: 'Picked up',
  cancelled: 'Cancelled',
}

// Legal transitions a restaurant can trigger (NEEDED_FIXES.md §2.3).
const orderActions: Partial<Record<OrderStatus, { label: string; to: OrderStatus }[]>> = {
  paid: [
    { label: 'Mark ready', to: 'ready' },
    { label: 'Cancel', to: 'cancelled' },
  ],
  ready: [
    { label: 'Mark picked up', to: 'picked_up' },
    { label: 'Cancel', to: 'cancelled' },
  ],
}

export default function RestaurantDashboard() {
  const { currentUser, myRestaurant, createListing, updateListing, deleteListing } = useApp()

  const [myListings, setMyListings] = useState<Listing[]>([])
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ListingFormState>(emptyForm)
  const [error, setError] = useState('')
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null)

  const approved = myRestaurant?.status === 'approved'

  const reload = useCallback(() => {
    if (!approved) return
    void api.getMyListings().then(setMyListings).catch(() => setMyListings([]))
    void api.getRestaurantOrders().then(setMyOrders).catch(() => setMyOrders([]))
  }, [approved])
  useEffect(reload, [reload])

  // RequireAuth guarantees a user; branch on whether they own a restaurant yet.
  if (!currentUser?.restaurantId) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p>You don't have a restaurant yet.</p>
        <Link to="/restaurant/apply" className="underline">
          Apply to partner with FreshForward
        </Link>
      </div>
    )
  }

  if (!myRestaurant) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p className="text-gray-500">Loading your restaurant…</p>
      </div>
    )
  }

  if (myRestaurant.status === 'pending') {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p className="border border-gray-400 px-4 py-3">Your application is pending approval.</p>
      </div>
    )
  }

  if (myRestaurant.status === 'rejected') {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">Your application was not approved.</p>
          {myRestaurant.rejectionReason && <p className="mt-1">Reason: {myRestaurant.rejectionReason}</p>}
        </div>
        <p className="mt-4 text-sm">
          You can update your details and{' '}
          <Link to="/restaurant/apply" className="underline">
            re-apply
          </Link>
          .
        </p>
      </div>
    )
  }

  function openCreateForm() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(listing: Listing) {
    setForm({
      title: listing.title,
      description: listing.description,
      originalPrice: String(listing.originalPrice),
      discountedPrice: String(listing.discountedPrice),
      quantityAvailable: String(listing.quantityAvailable),
      pickupWindow: listing.pickupWindow,
    })
    setEditingId(listing.id)
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const input: ListingInput = {
      title: form.title,
      description: form.description,
      originalPrice: Number(form.originalPrice),
      discountedPrice: Number(form.discountedPrice),
      quantityAvailable: Number(form.quantityAvailable),
      pickupWindow: form.pickupWindow,
    }
    try {
      if (editingId) {
        await updateListing(editingId, input)
      } else {
        await createListing(input)
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save the listing. Please try again.')
    }
  }

  async function handleDelete(id: string) {
    setError('')
    try {
      await deleteListing(id)
      reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete the listing.')
    }
  }

  async function handleOrderStatus(orderId: string, status: OrderStatus) {
    setBusyOrderId(orderId)
    setError('')
    try {
      const updated = await api.updateOrderStatus(orderId, status)
      setMyOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update the order.')
    } finally {
      setBusyOrderId(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-bold">{myRestaurant.name} Dashboard</h1>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Your Listings</h2>
          <button onClick={openCreateForm} className="border border-gray-400 px-3 py-1 text-sm">
            Create New Listing
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {myListings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-gray-300 px-3 py-2 text-sm"
            >
              <div>
                <div className="font-medium">{listing.title}</div>
                <div className="text-gray-600">
                  ${listing.discountedPrice.toFixed(2)} · {listing.pickupWindow} · {listing.quantityAvailable} available
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditForm(listing)} className="border border-gray-400 px-2 py-1">
                  Edit
                </button>
                <button onClick={() => void handleDelete(listing.id)} className="border border-gray-400 px-2 py-1">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {myListings.length === 0 && <p className="text-sm text-gray-500">No listings yet.</p>}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 flex max-w-sm flex-col gap-3 border border-gray-300 p-4">
            <h3 className="font-semibold">{editingId ? 'Edit Listing' : 'New Listing'}</h3>
            <label className="flex flex-col gap-1 text-sm">
              Title
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border border-gray-400 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Description
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border border-gray-400 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Original price
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="border border-gray-400 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Discounted price
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={form.discountedPrice}
                onChange={(e) => setForm({ ...form, discountedPrice: e.target.value })}
                className="border border-gray-400 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Quantity available
              <input
                type="number"
                step="1"
                min="0"
                required
                value={form.quantityAvailable}
                onChange={(e) => setForm({ ...form, quantityAvailable: e.target.value })}
                className="border border-gray-400 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Pickup window
              <input
                required
                placeholder="e.g. 5:00 PM - 6:00 PM"
                value={form.pickupWindow}
                onChange={(e) => setForm({ ...form, pickupWindow: e.target.value })}
                className="border border-gray-400 px-3 py-2"
              />
            </label>
            <div className="flex gap-2">
              <button type="submit" className="border border-gray-400 px-4 py-2">
                {editingId ? 'Save' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-400 px-4 py-2">
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Recent Orders</h2>
        <div className="mt-3 flex flex-col gap-2">
          {myOrders.map((order) => {
            const actions = orderActions[order.status] ?? []
            return (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-gray-300 px-3 py-2 text-sm"
              >
                <div>
                  <div>
                    {order.customerEmail} · {order.listingTitle} · Qty {order.quantity} · $
                    {order.price.toFixed(2)}
                  </div>
                  <div className="text-gray-600">
                    Pickup {order.pickupWindow} · {orderStatusLabels[order.status]}
                  </div>
                </div>
                {actions.length > 0 && (
                  <div className="flex gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.to}
                        onClick={() => void handleOrderStatus(order.id, action.to)}
                        disabled={busyOrderId === order.id}
                        className="border border-gray-400 px-2 py-1 disabled:opacity-60"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {myOrders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
        </div>
      </section>
    </div>
  )
}
