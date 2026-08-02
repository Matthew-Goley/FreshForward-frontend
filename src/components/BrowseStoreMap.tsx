import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { NearbyStore } from '../lib/nearbyStores'
import { formatRadiusMiles } from '../lib/nearbyStores'

type BrowseStoreMapProps = {
  center: { lat: number; lng: number }
  radiusMeters: number
  stores: NearbyStore[]
  onClose: () => void
}

export default function BrowseStoreMap({
  center,
  radiusMeters,
  stores,
  onClose,
}: BrowseStoreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    const container = mapContainerRef.current
    if (!container) return

    const map = L.map(container, {
      center: [center.lat, center.lng],
      zoom: 13,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    L.circle([center.lat, center.lng], {
      radius: radiusMeters,
      color: '#059669',
      weight: 2,
      fillColor: '#059669',
      fillOpacity: 0.1,
    }).addTo(map)

    L.circleMarker([center.lat, center.lng], {
      radius: 9,
      color: '#ffffff',
      weight: 3,
      fillColor: '#2563eb',
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup('Your location')

    stores.forEach((store) => {
      L.circleMarker([store.lat, store.lng], {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: '#059669',
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:10rem">
            <strong>${store.name}</strong><br/>
            <span style="color:#64748b;font-size:12px">${store.category}</span><br/>
            <span style="font-size:12px">${store.listingCount} surplus listing${store.listingCount === 1 ? '' : 's'}</span>
          </div>`,
        )
    })

    const bounds = L.latLngBounds([[center.lat, center.lng]])
    stores.forEach((store) => bounds.extend([store.lat, store.lng]))
    map.fitBounds(bounds.pad(0.15))

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [center.lat, center.lng, radiusMeters, stores])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 sm:p-6">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Nearby stores</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Surplus food within {formatRadiusMiles(radiusMeters)} of your location
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close map"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-500 transition-colors hover:bg-gray-100 hover:text-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref={mapContainerRef} className="min-h-[22rem] flex-1 bg-slate-100 sm:min-h-[28rem]" />

        <div className="border-t border-gray-100 px-5 py-3 text-xs text-slate-500">
          {stores.length} stores in range. Tap a pin to see listings available nearby.
        </div>
      </div>
    </div>
  )
}
