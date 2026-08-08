export const DELIVERY_ADDRESS_KEY = 'ff-delivery-address'
export const SAVED_ADDRESSES_KEY = 'ff-saved-addresses'

// D-23: geocoding provider is swappable via env. Defaults to Nominatim for
// launch; switching to a keyed Nominatim-compatible provider (LocationIQ,
// Geoapify, ...) is an env change, not a code change. VITE_* values are
// public — use referrer restrictions on any key.
const GEOCODE_URL = (import.meta.env.VITE_GEOCODE_URL ?? 'https://nominatim.openstreetmap.org').replace(
  /\/+$/,
  '',
)
const GEOCODE_KEY = import.meta.env.VITE_GEOCODE_KEY ?? ''

function geocodeParams(base: Record<string, string>): URLSearchParams {
  const p = new URLSearchParams(base)
  if (GEOCODE_KEY) p.set('key', GEOCODE_KEY) // LocationIQ / Geoapify style
  return p
}

export interface SavedAddress {
  id: string
  full: string
}

export interface AddressSuggestion {
  id: string
  primary: string
  secondary: string
  full: string
}

interface NominatimSearchResult {
  place_id: number
  display_name: string
  address?: {
    house_number?: string
    road?: string
    city?: string
    town?: string
    village?: string
    state?: string
    postcode?: string
  }
}

export function loadSavedAddresses(): SavedAddress[] {
  try {
    const raw = localStorage.getItem(SAVED_ADDRESSES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedAddress[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (address): address is SavedAddress =>
        typeof address?.id === 'string' && typeof address?.full === 'string' && address.full.trim().length > 0,
    )
  } catch {
    return []
  }
}

export function loadDeliveryAddress(): string {
  return localStorage.getItem(DELIVERY_ADDRESS_KEY)?.trim() ?? ''
}

export function loadInitialAddressState(): { deliveryAddress: string; savedAddresses: SavedAddress[] } {
  const deliveryAddress = loadDeliveryAddress()
  const savedAddresses = loadSavedAddresses()

  if (deliveryAddress && !savedAddresses.some((item) => item.full === deliveryAddress)) {
    return {
      deliveryAddress,
      savedAddresses: [...savedAddresses, { id: crypto.randomUUID(), full: deliveryAddress }],
    }
  }

  return { deliveryAddress, savedAddresses }
}

export function persistDeliveryAddress(address: string) {
  const trimmed = address.trim()
  if (trimmed) {
    localStorage.setItem(DELIVERY_ADDRESS_KEY, trimmed)
  } else {
    localStorage.removeItem(DELIVERY_ADDRESS_KEY)
  }
}

export function persistSavedAddresses(savedAddresses: SavedAddress[]) {
  if (savedAddresses.length > 0) {
    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(savedAddresses))
  } else {
    localStorage.removeItem(SAVED_ADDRESSES_KEY)
  }
}

export function formatAddressShort(full: string): string {
  return full.split(',')[0]?.trim() || full
}

function formatSuggestion(result: NominatimSearchResult): AddressSuggestion {
  const a = result.address
  const primary = a
    ? [a.house_number, a.road].filter(Boolean).join(' ')
    : result.display_name.split(',')[0]?.trim() ?? result.display_name
  const secondary = a
    ? [a.city ?? a.town ?? a.village, a.state, a.postcode].filter(Boolean).join(', ')
    : result.display_name.split(',').slice(1).join(',').trim()
  const full = a ? [primary, secondary].filter(Boolean).join(', ') : result.display_name
  return { id: String(result.place_id), primary, secondary, full }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const params = geocodeParams({ lat: String(lat), lon: String(lon), format: 'json' })
  const res = await fetch(`${GEOCODE_URL}/reverse?${params}`, {
    headers: { 'Accept-Language': 'en' },
  })
  if (!res.ok) throw new Error('Could not resolve address')
  const data = (await res.json()) as {
    display_name?: string
    address?: {
      house_number?: string
      road?: string
      city?: string
      town?: string
      village?: string
    }
  }
  const a = data.address
  if (a) {
    const street = [a.house_number, a.road].filter(Boolean).join(' ')
    const city = a.city ?? a.town ?? a.village
    const parts = [street, city].filter(Boolean)
    if (parts.length > 0) return parts.join(', ')
  }
  return data.display_name?.split(',').slice(0, 2).join(',') ?? 'Current location'
}

// Users backspace constantly; cache successful lookups so repeats are free.
const suggestionCache = new Map<string, AddressSuggestion[]>()

export async function searchAddressSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const cached = suggestionCache.get(trimmed.toLowerCase())
  if (cached) return cached

  const params = geocodeParams({
    q: trimmed,
    format: 'json',
    addressdetails: '1',
    limit: '6',
    countrycodes: 'us',
  })
  const res = await fetch(`${GEOCODE_URL}/search?${params}`, {
    headers: { 'Accept-Language': 'en' },
    signal,
  })
  // Throw on failure so the UI can distinguish "search unavailable" (e.g.
  // rate-limited) from a genuine "no matches" empty result.
  if (!res.ok) throw new Error(`Address search failed (${res.status})`)
  const data = (await res.json()) as NominatimSearchResult[]
  const suggestions = data.map(formatSuggestion)
  suggestionCache.set(trimmed.toLowerCase(), suggestions)
  return suggestions
}

export async function fetchCurrentAddress(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const address = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          resolve(address)
        } catch (err) {
          reject(err)
        }
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 12000 },
    )
  })
}

export function saveAddressSelection(
  address: string,
  savedAddresses: SavedAddress[],
): { deliveryAddress: string; savedAddresses: SavedAddress[] } {
  const trimmed = address.trim()
  if (!trimmed) {
    return { deliveryAddress: '', savedAddresses }
  }

  const nextSaved = savedAddresses.some((item) => item.full === trimmed)
    ? savedAddresses
    : [...savedAddresses, { id: crypto.randomUUID(), full: trimmed }]

  persistDeliveryAddress(trimmed)
  persistSavedAddresses(nextSaved)

  return { deliveryAddress: trimmed, savedAddresses: nextSaved }
}
