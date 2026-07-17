import type {
  AccountType,
  ApplicationInput,
  CurrentUser,
  Listing,
  ListingInput,
  Order,
  Restaurant,
} from '../types'
import { initialListings, initialOrders, initialRestaurants } from './mockData'

// Mock backend. Every function below has the signature a real `fetch` call
// would have — async, Promise<T> return, same request/response shapes — so
// swapping to a live backend later means rewriting these bodies to call
// `fetch(`${API_BASE_URL}/...`)` instead of touching the in-memory arrays.
// Nothing outside this file (AppContext, pages) should need to change.

let listingsDb: Listing[] = [...initialListings]
let ordersDb: Order[] = [...initialOrders]
let restaurantsDb: Restaurant[] = [...initialRestaurants]

let idCounter = 0
function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  accountType: AccountType
}

export async function login({ email, password }: LoginRequest): Promise<CurrentUser> {
  void password
  const restaurant = restaurantsDb.find((r) => r.contactEmail.toLowerCase() === email.toLowerCase())
  return restaurant
    ? { email, accountType: 'restaurant', restaurantId: restaurant.id }
    : { email, accountType: 'customer' }
}

export async function signup({ email, password, accountType }: SignupRequest): Promise<CurrentUser> {
  void password
  if (accountType === 'customer') {
    return { email, accountType: 'customer' }
  }

  const existing = restaurantsDb.find((r) => r.contactEmail.toLowerCase() === email.toLowerCase())
  if (existing) {
    return { email, accountType: 'restaurant', restaurantId: existing.id }
  }

  const restaurant: Restaurant = {
    id: nextId('rest'),
    name: email,
    contactEmail: email,
    address: '',
    description: '',
    status: 'pending',
  }
  restaurantsDb = [...restaurantsDb, restaurant]
  return { email, accountType: 'restaurant', restaurantId: restaurant.id }
}

export async function getListings(): Promise<Listing[]> {
  return listingsDb
}

export async function getListing(id: string): Promise<Listing | undefined> {
  return listingsDb.find((l) => l.id === id)
}

export async function getMyListings(restaurantId: string): Promise<Listing[]> {
  return listingsDb.filter((l) => l.restaurantId === restaurantId)
}

export async function createListing(restaurantId: string, input: ListingInput): Promise<Listing> {
  const restaurant = restaurantsDb.find((r) => r.id === restaurantId)
  if (!restaurant) {
    throw new Error('Unknown restaurant')
  }
  const listing: Listing = {
    id: nextId('listing'),
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    ...input,
  }
  listingsDb = [...listingsDb, listing]
  return listing
}

export async function updateListing(id: string, input: ListingInput): Promise<Listing> {
  listingsDb = listingsDb.map((l) => (l.id === id ? { ...l, ...input } : l))
  const updated = listingsDb.find((l) => l.id === id)
  if (!updated) {
    throw new Error('Listing not found')
  }
  return updated
}

export async function deleteListing(id: string): Promise<void> {
  listingsDb = listingsDb.filter((l) => l.id !== id)
}

export async function getRestaurants(): Promise<Restaurant[]> {
  return restaurantsDb
}

export async function getRestaurant(id: string): Promise<Restaurant | undefined> {
  return restaurantsDb.find((r) => r.id === id)
}

export async function submitRestaurantApplication(input: ApplicationInput): Promise<Restaurant> {
  const existing = restaurantsDb.find((r) => r.contactEmail.toLowerCase() === input.contactEmail.toLowerCase())
  if (existing) {
    const updated: Restaurant = { ...existing, ...input, status: 'pending' }
    restaurantsDb = restaurantsDb.map((r) => (r.id === existing.id ? updated : r))
    return updated
  }
  const restaurant: Restaurant = { id: nextId('rest'), ...input, status: 'pending' }
  restaurantsDb = [...restaurantsDb, restaurant]
  return restaurant
}

export async function placeOrder(listingId: string, customerEmail: string): Promise<Order> {
  const listing = listingsDb.find((l) => l.id === listingId)
  if (!listing) {
    throw new Error('Listing not found')
  }
  const order: Order = {
    id: nextId('order'),
    listingId: listing.id,
    listingTitle: listing.title,
    restaurantName: listing.restaurantName,
    pickupWindow: listing.pickupWindow,
    price: listing.discountedPrice,
    customerEmail,
  }
  ordersDb = [...ordersDb, order]
  return order
}

export async function getOrders(): Promise<Order[]> {
  return ordersDb
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return ordersDb.find((o) => o.id === id)
}

export async function getMyOrders(restaurantId: string): Promise<Order[]> {
  const myListingIds = new Set(listingsDb.filter((l) => l.restaurantId === restaurantId).map((l) => l.id))
  return ordersDb.filter((o) => myListingIds.has(o.listingId))
}
