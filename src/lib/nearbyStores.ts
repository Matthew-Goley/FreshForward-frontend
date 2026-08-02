import { destinationPoint, haversineDistanceMeters } from './geo'

export const DEFAULT_RADIUS_METERS = 5000
export const MIN_RADIUS_METERS = 1609
export const MAX_RADIUS_METERS = 16_093
export const RADIUS_STEP_METERS = 805
export const MAP_RADIUS_KEY = 'ff-map-radius-meters'

export type NearbyStore = {
  id: string
  name: string
  category: string
  listingCount: number
  lat: number
  lng: number
}

const storeCatalog: { name: string; category: string; listingCount: number }[] = [
  { name: "Trader Joe's", category: 'Grocery', listingCount: 3 },
  { name: 'ALDI', category: 'Grocery', listingCount: 2 },
  { name: 'Key Food', category: 'Grocery', listingCount: 3 },
  { name: 'Chipotle Mexican Grill', category: 'Prepared Meals', listingCount: 2 },
  { name: 'Local Harvest Co.', category: 'Grocery', listingCount: 2 },
  { name: "Joe's Pizza", category: 'Prepared Meals', listingCount: 1 },
  { name: 'Panda Express', category: 'Prepared Meals', listingCount: 2 },
  { name: 'CookUnity', category: 'Prepared Meals', listingCount: 1 },
  { name: 'Sweetgreen', category: 'Prepared Meals', listingCount: 2 },
  { name: 'Whole Foods', category: 'Grocery', listingCount: 1 },
  { name: 'Local Butcher Co.', category: 'Meat & Seafood', listingCount: 1 },
  { name: 'Harbor Fish Market', category: 'Meat & Seafood', listingCount: 1 },
  { name: 'Parisian Bakery', category: 'Bakery', listingCount: 1 },
  { name: 'Wing Stop', category: 'Prepared Meals', listingCount: 1 },
  { name: 'Local Deli', category: 'Prepared Meals', listingCount: 1 },
  { name: 'Thai Kitchen', category: 'Prepared Meals', listingCount: 1 },
  { name: 'Curry House', category: 'Prepared Meals', listingCount: 1 },
  { name: 'Blue Bottle', category: 'Grocery', listingCount: 1 },
  { name: 'Bodega Express', category: 'Convenience', listingCount: 1 },
]

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function loadMapRadiusMeters(): number {
  try {
    const raw = localStorage.getItem(MAP_RADIUS_KEY)
    if (!raw) return DEFAULT_RADIUS_METERS
    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) return DEFAULT_RADIUS_METERS
    return Math.min(MAX_RADIUS_METERS, Math.max(MIN_RADIUS_METERS, parsed))
  } catch {
    return DEFAULT_RADIUS_METERS
  }
}

export function persistMapRadiusMeters(radiusMeters: number) {
  localStorage.setItem(MAP_RADIUS_KEY, String(radiusMeters))
}

export function buildNearbyStores(
  centerLat: number,
  centerLng: number,
  radiusMeters: number,
): NearbyStore[] {
  return storeCatalog
    .map((store, index) => {
      const bearing = (index / storeCatalog.length) * 360 + 18
      const distance = radiusMeters * (0.42 + ((index * 13) % 40) / 100)
      const { lat, lng } = destinationPoint(centerLat, centerLng, distance, bearing)
      return {
        id: slugify(store.name),
        name: store.name,
        category: store.category,
        listingCount: store.listingCount,
        lat,
        lng,
      }
    })
    .filter(
      (store) =>
        haversineDistanceMeters(centerLat, centerLng, store.lat, store.lng) <= radiusMeters,
    )
}

export function formatRadiusMiles(meters: number) {
  const miles = meters / 1609.34
  return `${miles.toFixed(1)} mi`
}
