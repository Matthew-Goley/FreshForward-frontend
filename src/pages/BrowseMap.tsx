import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StoreMapView from '../components/StoreMapView'
import { formatAddressShort, loadDeliveryAddress, resolveMapCenter } from '../lib/address'
import {
  MAX_RADIUS_METERS,
  MIN_RADIUS_METERS,
  RADIUS_STEP_METERS,
  buildNearbyStores,
  formatRadiusMiles,
  loadMapRadiusMeters,
  persistMapRadiusMeters,
} from '../lib/nearbyStores'

export default function BrowseMap() {
  const deliveryAddress = loadDeliveryAddress()
  const [radiusMeters, setRadiusMeters] = useState(loadMapRadiusMeters)
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadCenter() {
      setLoading(true)
      setError('')
      try {
        const coords = await resolveMapCenter(deliveryAddress)
        if (!cancelled) setCenter(coords)
      } catch {
        if (!cancelled) {
          setError('Add a delivery address on Browse or allow location access to view the map.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadCenter()
    return () => {
      cancelled = true
    }
  }, [deliveryAddress])

  const stores = useMemo(
    () => (center ? buildNearbyStores(center.lat, center.lng, radiusMeters) : []),
    [center, radiusMeters],
  )

  function handleRadiusChange(nextRadius: number) {
    setRadiusMeters(nextRadius)
    persistMapRadiusMeters(nextRadius)
  }

  return (
    <div className="flex h-screen flex-col bg-white text-slate-800">
      <header className="shrink-0 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-emerald-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
            Back to Browse
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-slate-900">Nearby stores</h1>
            <p className="truncate text-sm text-slate-500">
              {deliveryAddress
                ? formatAddressShort(deliveryAddress)
                : 'Using your current location'}
            </p>
          </div>

          <div className="flex w-full min-w-[14rem] flex-col gap-1 sm:w-auto sm:min-w-[18rem]">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="map-radius" className="font-medium text-slate-700">
                Search radius
              </label>
              <span className="font-semibold text-emerald-700">{formatRadiusMiles(radiusMeters)}</span>
            </div>
            <input
              id="map-radius"
              type="range"
              min={MIN_RADIUS_METERS}
              max={MAX_RADIUS_METERS}
              step={RADIUS_STEP_METERS}
              value={radiusMeters}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{formatRadiusMiles(MIN_RADIUS_METERS)}</span>
              <span>{formatRadiusMiles(MAX_RADIUS_METERS)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90">
            <p className="text-sm font-medium text-slate-600">Loading map…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-full items-center justify-center px-6">
            <div className="max-w-md rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
              <p className="text-base font-semibold text-slate-900">Location needed</p>
              <p className="mt-2 text-sm text-slate-500">{error}</p>
              <Link
                to="/browse"
                className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Set address on Browse
              </Link>
            </div>
          </div>
        )}

        {!loading && center && (
          <StoreMapView center={center} radiusMeters={radiusMeters} stores={stores} />
        )}
      </div>

      {!loading && center && (
        <div className="shrink-0 border-t border-gray-100 px-4 py-2.5 text-center text-xs text-slate-500 sm:px-6">
          {stores.length} store{stores.length === 1 ? '' : 's'} within {formatRadiusMiles(radiusMeters)}.
          Tap a pin for details.
        </div>
      )}
    </div>
  )
}
