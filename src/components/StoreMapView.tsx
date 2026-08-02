import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { NearbyStore } from '../lib/nearbyStores'

type StoreMapViewProps = {
  center: { lat: number; lng: number }
  radiusMeters: number
  stores: NearbyStore[]
  className?: string
}

export default function StoreMapView({
  center,
  radiusMeters,
  stores,
  className = '',
}: StoreMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const circleRef = useRef<L.Circle | null>(null)
  const userMarkerRef = useRef<L.CircleMarker | null>(null)
  const storeMarkersRef = useRef<L.LayerGroup | null>(null)

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
        .bindPopup(
          `<div style="min-width:10rem">
            <strong>${store.name}</strong><br/>
            <span style="color:#64748b;font-size:12px">${store.category}</span><br/>
            <span style="font-size:12px">${store.listingCount} surplus listing${store.listingCount === 1 ? '' : 's'}</span>
          </div>`,
        )
    })
    storeLayer.addTo(map)
    storeMarkersRef.current = storeLayer

    map.fitBounds(circleRef.current.getBounds(), { padding: [32, 32], maxZoom: 15 })
  }, [center.lat, center.lng, radiusMeters, stores])

  return <div ref={containerRef} className={`h-full w-full ${className}`} />
}
