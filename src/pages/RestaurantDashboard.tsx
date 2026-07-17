import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../lib/AppContext'
import type { ListingInput } from '../lib/AppContext'
import type { Listing } from '../types'

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

export default function RestaurantDashboard() {
  const { currentUser, restaurants, listings, orders, createListing, updateListing, deleteListing } = useApp()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ListingFormState>(emptyForm)

  if (!currentUser || currentUser.accountType !== 'restaurant') {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p>Please log in as a restaurant to view the dashboard.</p>
        <Link to="/login" className="underline">
          Login
        </Link>
      </div>
    )
  }

  const restaurant = restaurants.find((r) => r.id === currentUser.restaurantId)

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p>Restaurant account not found.</p>
      </div>
    )
  }

  if (restaurant.status === 'pending') {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p className="border border-gray-400 px-4 py-3">Your application is pending approval.</p>
      </div>
    )
  }

  const myListings = listings.filter((l) => l.restaurantId === restaurant.id)
  const myOrders = orders.filter((o) => myListings.some((l) => l.id === o.listingId))

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const input: ListingInput = {
      title: form.title,
      description: form.description,
      originalPrice: Number(form.originalPrice),
      discountedPrice: Number(form.discountedPrice),
      quantityAvailable: Number(form.quantityAvailable),
      pickupWindow: form.pickupWindow,
    }
    if (editingId) {
      updateListing(editingId, input)
    } else {
      createListing(input)
    }
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-bold">{restaurant.name} — Dashboard</h1>

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
                <button onClick={() => deleteListing(listing.id)} className="border border-gray-400 px-2 py-1">
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
                min="0"
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
                min="0"
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
          {myOrders.map((order) => (
            <div key={order.id} className="border border-gray-300 px-3 py-2 text-sm">
              {order.customerEmail} · {order.listingTitle} · Pickup {order.pickupWindow}
            </div>
          ))}
          {myOrders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
        </div>
      </section>
    </div>
  )
}
