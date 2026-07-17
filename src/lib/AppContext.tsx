import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AccountType, ApplicationInput, CurrentUser, Listing, ListingInput, Order, Restaurant } from '../types'
import * as api from './api'

interface AppContextValue {
  currentUser: CurrentUser | null
  listings: Listing[]
  orders: Order[]
  restaurants: Restaurant[]
  login: (email: string, password: string) => Promise<CurrentUser>
  logout: () => void
  signup: (email: string, password: string, accountType: AccountType) => Promise<CurrentUser>
  submitApplication: (input: ApplicationInput) => Promise<Restaurant>
  placeOrder: (listingId: string) => Promise<Order>
  createListing: (input: ListingInput) => Promise<void>
  updateListing: (id: string, input: ListingInput) => Promise<void>
  deleteListing: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    api.getListings().then(setListings)
    api.getOrders().then(setOrders)
    api.getRestaurants().then(setRestaurants)
  }, [])

  async function login(email: string, password: string): Promise<CurrentUser> {
    const user = await api.login({ email, password })
    setCurrentUser(user)
    return user
  }

  function logout() {
    setCurrentUser(null)
  }

  async function signup(email: string, password: string, accountType: AccountType): Promise<CurrentUser> {
    const user = await api.signup({ email, password, accountType })
    setCurrentUser(user)
    if (user.accountType === 'restaurant') {
      setRestaurants(await api.getRestaurants())
    }
    return user
  }

  async function submitApplication(input: ApplicationInput): Promise<Restaurant> {
    const restaurant = await api.submitRestaurantApplication(input)
    setRestaurants(await api.getRestaurants())
    return restaurant
  }

  async function placeOrder(listingId: string): Promise<Order> {
    if (!currentUser) {
      throw new Error('Cannot place an order without a logged-in customer')
    }
    const order = await api.placeOrder(listingId, currentUser.email)
    setOrders((prev) => [...prev, order])
    return order
  }

  async function createListing(input: ListingInput): Promise<void> {
    if (!currentUser?.restaurantId) return
    const listing = await api.createListing(currentUser.restaurantId, input)
    setListings((prev) => [...prev, listing])
  }

  async function updateListing(id: string, input: ListingInput): Promise<void> {
    const listing = await api.updateListing(id, input)
    setListings((prev) => prev.map((l) => (l.id === id ? listing : l)))
  }

  async function deleteListing(id: string): Promise<void> {
    await api.deleteListing(id)
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
