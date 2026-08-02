export const NEARBY_RADIUS_METERS = 5000

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

function offsetFromCenter(
  centerLat: number,
  centerLng: number,
  index: number,
  total: number,
  maxRadiusMeters: number,
) {
  const angle = (index / total) * Math.PI * 2 + 0.35
  const distance = maxRadiusMeters * (0.35 + ((index * 17) % 50) / 100)
  const latOffset = (distance / 111_320) * Math.cos(angle)
  const lngOffset =
    (distance / (111_320 * Math.cos((centerLat * Math.PI) / 180))) * Math.sin(angle)
  return { lat: centerLat + latOffset, lng: centerLng + lngOffset }
}

export function buildNearbyStores(centerLat: number, centerLng: number): NearbyStore[] {
  return storeCatalog.map((store, index) => {
    const { lat, lng } = offsetFromCenter(
      centerLat,
      centerLng,
      index,
      storeCatalog.length,
      NEARBY_RADIUS_METERS * 0.9,
    )
    return {
      id: slugify(store.name),
      name: store.name,
      category: store.category,
      listingCount: store.listingCount,
      lat,
      lng,
    }
  })
}

export function formatRadiusMiles(meters: number) {
  const miles = meters / 1609.34
  return `${miles.toFixed(1)} mi`
}
