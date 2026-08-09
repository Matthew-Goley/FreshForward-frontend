import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { NearbyStore } from '../lib/nearbyStores'

type StoreMapViewProps = {
  center: { lat: number; lng: number }
  radiusMeters: number
  stores: NearbyStore[]
  onStoreSelect?: (store: NearbyStore) => void
  className?: string
}

export default function StoreMapView({
  center,
  radiusMeters,
  stores,
  onStoreSelect,
  className = '',
}: StoreMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const circleRef = useRef<L.Circle | null>(null)
  const userMarkerRef = useRef<L.CircleMarker | null>(null)
  const storeMarkersRef = useRef<L.LayerGroup | null>(null)
  const onStoreSelectRef = useRef(onStoreSelect)
  const storesRef = useRef(stores)

  useEffect(() => {
    onStoreSelectRef.current = onStoreSelect
  }, [onStoreSelect])

  useEffect(() => {
    storesRef.current = stores
  }, [stores])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handlePopupClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return

      const button = target.closest<HTMLElement>('[data-store-id]')
      if (!button) return

      const storeId = button.dataset.storeId
      if (!storeId) return

      const store = storesRef.current.find((item) => item.id === storeId)
      if (store) onStoreSelectRef.current?.(store)
    }

    container.addEventListener('click', handlePopupClick)
    return () => container.removeEventListener('click', handlePopupClick)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    const map = L.map(container, {
      center: [center.lat, center.lng],
      zoom: 13,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      circleRef.current = null
      userMarkerRef.current = null
      storeMarkersRef.current = null
    }
  }, [center.lat, center.lng])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    circleRef.current?.remove()
    circleRef.current = L.circle([center.lat, center.lng], {
      radius: radiusMeters,
      color: '#059669',
      weight: 2,
      fillColor: '#059669',
      fillOpacity: 0.12,
    }).addTo(map)

    userMarkerRef.current?.remove()
    userMarkerRef.current = L.circleMarker([center.lat, center.lng], {
      radius: 9,
      color: '#ffffff',
      weight: 3,
      fillColor: '#2563eb',
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup('Your location')

    storeMarkersRef.current?.remove()
    const storeLayer = L.layerGroup()
    stores.forEach((store) => {
      L.circleMarker([store.lat, store.lng], {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: '#059669',
        fillOpacity: 1,
      })
        .addTo(storeLayer)
        .bindPopup(buildStorePopupHtml(store), {
          closeButton: true,
          maxWidth: 260,
          minWidth: 220,
        })
    })
    storeLayer.addTo(map)
    storeMarkersRef.current = storeLayer

    map.fitBounds(circleRef.current.getBounds(), { padding: [32, 32], maxZoom: 15 })
  }, [center.lat, center.lng, radiusMeters, stores])

  return <div ref={containerRef} className={`h-full w-full ${className}`} />
}

function buildStorePopupHtml(store: NearbyStore) {
  return `<div style="font-family:system-ui,sans-serif;padding:2px 0">
    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#059669">
      Nearby store
    </p>
    <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#0f172a;line-height:1.3">
      ${escapeHtml(store.name)}
    </p>
    <p style="margin:6px 0 0;font-size:13px;color:#64748b">
      ${escapeHtml(store.category)} · ${store.listingCount} surplus listing${store.listingCount === 1 ? '' : 's'}
    </p>
    <button
      type="button"
      data-store-id="${escapeHtml(store.id)}"
      style="margin-top:12px;width:100%;border:none;border-radius:9999px;background:#059669;color:#fff;font-size:13px;font-weight:600;padding:10px 14px;cursor:pointer"
    >
      View listings
    </button>
  </div>`
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
