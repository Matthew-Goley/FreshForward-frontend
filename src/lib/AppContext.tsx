import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AccountType, CurrentUser, Listing, Order, Restaurant } from '../types'
import { initialListings, initialOrders, initialRestaurants } from './mockData'

export interface ListingInput {
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  quantityAvailable: number
  pickupWindow: string
}

export interface ApplicationInput {
  name: string
  contactEmail: string
  address: string
  description: string
}

interface AppContextValue {
  currentUser: CurrentUser | null
  listings: Listing[]
  orders: Order[]
  restaurants: Restaurant[]
  login: (email: string, password: string) => CurrentUser
  logout: () => void
  signup: (email: string, password: string, accountType: AccountType) => CurrentUser
  submitApplication: (input: ApplicationInput) => void
  placeOrder: (listingId: string) => Order
  createListing: (input: ListingInput) => void
  updateListing: (id: string, input: ListingInput) => void
  deleteListing: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

let idCounter = 0
function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants)

  function login(email: string, password: string): CurrentUser {
    void password
    const restaurant = restaurants.find((r) => r.contactEmail.toLowerCase() === email.toLowerCase())
    const user: CurrentUser = restaurant
      ? { email, accountType: 'restaurant', restaurantId: restaurant.id }
      : { email, accountType: 'customer' }
    setCurrentUser(user)
    return user
  }

  function logout() {
    setCurrentUser(null)
  }

  function signup(email: string, password: string, accountType: AccountType): CurrentUser {
    void password
    if (accountType === 'customer') {
      const user: CurrentUser = { email, accountType: 'customer' }
      setCurrentUser(user)
      return user
    }

    const existing = restaurants.find((r) => r.contactEmail.toLowerCase() === email.toLowerCase())
    let restaurantId = existing?.id

    if (!existing) {
      const restaurant: Restaurant = {
        id: nextId('rest'),
        name: email,
        contactEmail: email,
        address: '',
        description: '',
        status: 'pending',
      }
      restaurantId = restaurant.id
      setRestaurants((prev) => [...prev, restaurant])
    }

    const user: CurrentUser = { email, accountType: 'restaurant', restaurantId }
    setCurrentUser(user)
    return user
  }

  function submitApplication(input: ApplicationInput) {
    setRestaurants((prev) => {
      const existing = prev.find((r) => r.contactEmail.toLowerCase() === input.contactEmail.toLowerCase())
      if (existing) {
        return prev.map((r) => (r.id === existing.id ? { ...r, ...input, status: 'pending' } : r))
      }
      return [...prev, { id: nextId('rest'), ...input, status: 'pending' }]
    })
  }

  function placeOrder(listingId: string): Order {
    const listing = listings.find((l) => l.id === listingId)
    if (!listing || !currentUser) {
      throw new Error('Cannot place an order without a listing and a logged-in customer')
    }
    const order: Order = {
      id: nextId('order'),
      listingId: listing.id,
      listingTitle: listing.title,
      restaurantName: listing.restaurantName,
      pickupWindow: listing.pickupWindow,
      price: listing.discountedPrice,
      customerEmail: currentUser.email,
    }
    setOrders((prev) => [...prev, order])
    return order
  }

  function createListing(input: ListingInput) {
    if (!currentUser?.restaurantId) return
    const restaurant = restaurants.find((r) => r.id === currentUser.restaurantId)
    if (!restaurant) return
    const listing: Listing = {
      id: nextId('listing'),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      ...input,
    }
    setListings((prev) => [...prev, listing])
  }

  function updateListing(id: string, input: ListingInput) {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...input } : l)))
  }

  function deleteListing(id: string) {
    setListings((prev) => prev.filter((l) => l.id !== id))
  }

  const value = useMemo<AppContextValue>(
    () => ({
      currentUser,
      listings,
      orders,
      restaurants,
      login,
      logout,
      signup,
      submitApplication,
      placeOrder,
      createListing,
      updateListing,
      deleteListing,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, listings, orders, restaurants],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
