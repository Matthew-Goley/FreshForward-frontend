import type {
  ApplicationInput,
  AccountType,
  CurrentUser,
  Listing,
  ListingInput,
  Order,
  OrderStatus,
  Restaurant,
  RestaurantStatus,
} from '../types'
import { API_BASE_URL } from './config'

// Thin fetch layer over the FreshForward API. This file is the only place that
// knows about the wire format: snake_case keys, integer ids, and integer-cent
// prices all convert to frontend shapes here and nowhere else (NEEDED_FIXES.md
// D-1..D-5).

// --- token ---

const TOKEN_KEY = 'ff-auth-token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function extractDetail(body: unknown, status: number): string {
  const d = (body as { detail?: unknown })?.detail
  if (typeof d === 'string') return d
  if (Array.isArray(d)) return d.map((e) => (e as { msg?: string })?.msg ?? 'Invalid input').join(', ')
  return `Request failed (${status})`
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const isForm = init.body instanceof URLSearchParams

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (res.status === 401) {
    setToken(null) // D-11: clear, do not redirect
    throw new ApiError(401, 'Your session has expired. Please sign in again.')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, extractDetail(body, res.status))
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

// --- wire shapes (see NEEDED_FIXES.md §2.2) ---

interface WireUser {
  id: number
  username: string
  email: string
  account_type: AccountType
  is_admin: boolean
  restaurant_id: number | null
  created_at: string
}

interface WireListing {
  id: number
  restaurant_id: number
  restaurant_name: string
  title: string
  description: string
  original_price: number // integer cents
  discounted_price: number // integer cents
  quantity_available: number
  pickup_window: string
  created_at: string
}

interface WireRestaurant {
  id: number
  owner_user_id: number
  name: string
  contact_email: string
  address: string
  description: string
  status: RestaurantStatus
  rejection_reason: string | null
  created_at: string
}

interface WireOrder {
  id: number
  listing_id: number
  listing_title: string
  restaurant_name: string
  customer_email: string
  pickup_window: string
  quantity: number
  price: number // integer cents, total for the line
  status: OrderStatus
  created_at: string
}

interface WireOrderCreate {
  order: WireOrder
  checkout_url: string
  session_id: string
}

// --- mappers ---

const centsToDollars = (c: number) => c / 100
// D-2: Math.round is mandatory. 19.99 * 100 === 1998.9999999999998
const dollarsToCents = (d: number) => Math.round(d * 100)

function toCurrentUser(w: WireUser): CurrentUser {
  return {
    id: String(w.id),
    username: w.username,
    email: w.email,
    accountType: w.account_type,
    isAdmin: w.is_admin,
    restaurantId: w.restaurant_id === null ? null : String(w.restaurant_id),
  }
}

function toListing(w: WireListing): Listing {
  return {
    id: String(w.id),
    restaurantId: String(w.restaurant_id),
    restaurantName: w.restaurant_name,
    title: w.title,
    description: w.description,
    originalPrice: centsToDollars(w.original_price),
    discountedPrice: centsToDollars(w.discounted_price),
    quantityAvailable: w.quantity_available,
    pickupWindow: w.pickup_window,
    createdAt: w.created_at,
  }
}

function toRestaurant(w: WireRestaurant): Restaurant {
  return {
    id: String(w.id),
    name: w.name,
    contactEmail: w.contact_email,
    address: w.address,
    description: w.description,
    status: w.status,
    rejectionReason: w.rejection_reason,
  }
}

function toOrder(w: WireOrder): Order {
  return {
    id: String(w.id),
    listingId: String(w.listing_id),
    listingTitle: w.listing_title,
    restaurantName: w.restaurant_name,
    customerEmail: w.customer_email,
    pickupWindow: w.pickup_window,
    quantity: w.quantity,
    price: centsToDollars(w.price),
    status: w.status,
    createdAt: w.created_at,
  }
}

function fromListingInput(input: ListingInput) {
  return {
    title: input.title,
    description: input.description,
    original_price: dollarsToCents(input.originalPrice),
    discounted_price: dollarsToCents(input.discountedPrice),
    quantity_available: input.quantityAvailable,
    pickup_window: input.pickupWindow,
  }
}

// --- auth ---

// D-6: the OAuth2 form field is named "username" but takes the email.
export async function login(email: string, password: string): Promise<CurrentUser> {
  const body = new URLSearchParams({ username: email, password })
  const token = await request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  setToken(token.access_token)
  return getCurrentUser()
}

// D-8: register, then log in. Two calls, one token issuer. No accountType (D-10).
export async function signup(email: string, password: string): Promise<CurrentUser> {
  await request<WireUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username: null }),
  })
  return login(email, password)
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return toCurrentUser(await request<WireUser>('/auth/me'))
}

// --- listings ---

export async function getListings(): Promise<Listing[]> {
  const wires = await request<WireListing[]>('/listings')
  return wires.map(toListing)
}

export async function getListing(id: string): Promise<Listing> {
  return toListing(await request<WireListing>(`/listings/${id}`))
}

export async function getMyListings(): Promise<Listing[]> {
  const wires = await request<WireListing[]>('/restaurants/me/listings')
  return wires.map(toListing)
}

export async function createListing(input: ListingInput): Promise<Listing> {
  return toListing(
    await request<WireListing>('/restaurants/me/listings', {
      method: 'POST',
      body: JSON.stringify(fromListingInput(input)),
    }),
  )
}

export async function updateListing(id: string, input: ListingInput): Promise<Listing> {
  return toListing(
    await request<WireListing>(`/restaurants/me/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fromListingInput(input)),
    }),
  )
}

export async function deleteListing(id: string): Promise<void> {
  await request<void>(`/restaurants/me/listings/${id}`, { method: 'DELETE' })
}

// --- restaurants ---

export async function submitRestaurantApplication(input: ApplicationInput): Promise<Restaurant> {
  return toRestaurant(
    await request<WireRestaurant>('/restaurants/apply', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        contact_email: input.contactEmail,
        address: input.address,
        description: input.description,
      }),
    }),
  )
}

// Returns null rather than throwing, so callers can branch on "no restaurant yet".
export async function getMyRestaurant(): Promise<Restaurant | null> {
  try {
    return toRestaurant(await request<WireRestaurant>('/restaurants/me'))
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

export async function getPendingRestaurants(): Promise<Restaurant[]> {
  const wires = await request<WireRestaurant[]>('/restaurants/pending')
  return wires.map(toRestaurant)
}

export async function approveRestaurant(id: string): Promise<Restaurant> {
  return toRestaurant(
    await request<WireRestaurant>(`/restaurants/${id}/approve`, { method: 'POST' }),
  )
}

export async function rejectRestaurant(id: string, reason: string): Promise<Restaurant> {
  return toRestaurant(
    await request<WireRestaurant>(`/restaurants/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  )
}

// --- orders ---

// D-4: listing_id must be a NUMBER on the wire.
export async function placeOrder(
  listingId: string,
  quantity: number,
): Promise<{ order: Order; checkoutUrl: string; sessionId: string }> {
  const w = await request<WireOrderCreate>('/orders', {
    method: 'POST',
    body: JSON.stringify({ listing_id: Number(listingId), quantity }),
  })
  return { order: toOrder(w.order), checkoutUrl: w.checkout_url, sessionId: w.session_id }
}

export async function getMyOrders(): Promise<Order[]> {
  const wires = await request<WireOrder[]>('/orders/me')
  return wires.map(toOrder)
}

export async function getRestaurantOrders(): Promise<Order[]> {
  const wires = await request<WireOrder[]>('/restaurants/me/orders')
  return wires.map(toOrder)
}

export async function getOrder(id: string): Promise<Order> {
  return toOrder(await request<WireOrder>(`/orders/${id}`))
}

export async function getOrderBySession(sessionId: string): Promise<Order> {
  return toOrder(await request<WireOrder>(`/orders/by-session/${sessionId}`))
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return toOrder(
    await request<WireOrder>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  )
}
