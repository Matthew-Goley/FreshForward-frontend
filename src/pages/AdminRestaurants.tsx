import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../lib/AppContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import type { Restaurant } from '../types'

export default function AdminRestaurants() {
  const { currentUser, authLoading } = useApp()
  const [pending, setPending] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const isAdmin = currentUser?.isAdmin ?? false

  const load = useCallback(() => {
    if (!isAdmin) return
    setError('')
    void api
      .getPendingRestaurants()
      .then(setPending)
      .catch((err) => {
        setPending([])
        setError(err instanceof ApiError ? err.message : 'Could not load pending applications.')
      })
      .finally(() => setLoading(false))
  }, [isAdmin])
  useEffect(() => {
    queueMicrotask(load)
  }, [load])

  if (authLoading) return <p className="px-4 py-8">Loading…</p>
  // Convenience only — the backend's admin check is the real gate.
  if (!currentUser?.isAdmin) return <Navigate to="/" replace />

  async function approve(id: string) {
    setBusyId(id)
    setError('')
    try {
      await api.approveRestaurant(id)
      load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not approve this restaurant.')
    } finally {
      setBusyId(null)
    }
  }

  async function reject(id: string) {
    const reason = window.prompt('Reason for rejection?')
    // The backend requires a 1-500 character reason; block empty input client-side.
    if (!reason?.trim()) return
    setBusyId(id)
    setError('')
    try {
      await api.rejectRestaurant(id, reason.trim().slice(0, 500))
      load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reject this restaurant.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-bold">Pending restaurant applications</h1>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && <p className="mt-4 text-sm text-gray-500">Loading applications…</p>}
      {!loading && pending.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No pending applications.</p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {pending.map((restaurant) => (
          <div key={restaurant.id} className="rounded-xl border border-gray-300 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{restaurant.name}</p>
                <p className="text-gray-600">{restaurant.contactEmail}</p>
                <p className="text-gray-600">{restaurant.address}</p>
                <p className="mt-2 text-gray-700">{restaurant.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => void approve(restaurant.id)}
                  disabled={busyId === restaurant.id}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  onClick={() => void reject(restaurant.id)}
                  disabled={busyId === restaurant.id}
                  className="rounded-lg border border-red-300 px-3 py-1.5 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
