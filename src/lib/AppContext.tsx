import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ApplicationInput, CurrentUser, Listing, ListingInput, Restaurant } from '../types'
import * as api from './api'
import { ApiError } from './api'

interface AppContextValue {
  // auth
  currentUser: CurrentUser | null
  authLoading: boolean // true until the initial /auth/me settles
  login: (email: string, password: string) => Promise<CurrentUser>
  signup: (email: string, password: string) => Promise<CurrentUser>
  logout: () => void

  // catalogue
  listings: Listing[]
  listingsLoading: boolean
  listingsError: string | null
  refreshListings: () => Promise<void>

  // the caller's own restaurant, null if they don't own one
  myRestaurant: Restaurant | null
  refreshMyRestaurant: () => Promise<void>
  submitApplication: (input: ApplicationInput) => Promise<Restaurant>

  // restaurant listing CRUD (operates on the caller's own restaurant)
  createListing: (input: ListingInput) => Promise<void>
  updateListing: (id: string, input: ListingInput) => Promise<void>
  deleteListing: (id: string) => Promise<void>

  // orders
  placeOrder: (listingId: string, quantity: number) => Promise<{ checkoutUrl: string }>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [listings, setListings] = useState<Listing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [listingsError, setListingsError] = useState<string | null>(null)
  const [myRestaurant, setMyRestaurant] = useState<Restaurant | null>(null)

  // D-11: api.ts clears the token on any 401; the context clears the user.
  // Pages decide for themselves whether to redirect.
  const guard = useCallback(<T,>(promise: Promise<T>): Promise<T> => {
    return promise.catch((err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        setCurrentUser(null)
      }
      throw err
    })
  }, [])

  // FE-2: rehydrate the session from the stored token on every page load.
  useEffect(() => {
    void (async () => {
      if (api.getToken()) {
        try {
          setCurrentUser(await api.getCurrentUser())
        } catch {
          api.setToken(null) // expired or invalid; fall through as logged out
        }
      }
      setAuthLoading(false)
    })()
  }, [])

  const refreshListings = useCallback(async () => {
    setListingsLoading(true)
    setListingsError(null)
    try {
      setListings(await api.getListings())
    } catch (err) {
      setListingsError(
        err instanceof ApiError ? err.message : 'Could not reach the server. Please try again shortly.',
      )
    } finally {
      setListingsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Deferred to a microtask so the loading-state updates never run
    // synchronously inside the effect (react-hooks/set-state-in-effect).
    queueMicrotask(() => void refreshListings())
  }, [refreshListings])

  const refreshMyRestaurant = useCallback(async () => {
    setMyRestaurant(await guard(api.getMyRestaurant()))
  }, [guard])

  // Load the caller's restaurant only when they own one.
  const restaurantId = currentUser?.restaurantId ?? null
  useEffect(() => {
    queueMicrotask(() => {
      if (!restaurantId) {
        setMyRestaurant(null)
        return
      }
      void refreshMyRestaurant().catch(() => setMyRestaurant(null))
    })
  }, [restaurantId, refreshMyRestaurant])

  const login = useCallback(async (email: string, password: string): Promise<CurrentUser> => {
    const user = await api.login(email, password)
    setCurrentUser(user)
    return user
  }, [])

  const signup = useCallback(async (email: string, password: string): Promise<CurrentUser> => {
    const user = await api.signup(email, password)
    setCurrentUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    api.setToken(null)
    setCurrentUser(null)
  }, [])

  const submitApplication = useCallback(
    async (input: ApplicationInput): Promise<Restaurant> => {
      const restaurant = await guard(api.submitRestaurantApplication(input))
      setMyRestaurant(restaurant)
      // Applying flips the account to "restaurant" server-side (D-10); refresh
      // the user so accountType and restaurantId reflect it.
      try {
        setCurrentUser(await api.getCurrentUser())
      } catch {
        // Non-fatal: the application itself succeeded.
      }
      return restaurant
    },
    [guard],
  )

  const createListing = useCallback(
    async (input: ListingInput): Promise<void> => {
      await guard(api.createListing(input))
      void refreshListings()
    },
    [guard, refreshListings],
  )

  const updateListing = useCallback(
    async (id: string, input: ListingInput): Promise<void> => {
      await guard(api.updateListing(id, input))
      void refreshListings()
    },
    [guard, refreshListings],
  )

  const deleteListing = useCallback(
    async (id: string): Promise<void> => {
      await guard(api.deleteListing(id))
      void refreshListings()
    },
    [guard, refreshListings],
  )

  const placeOrder = useCallback(
    async (listingId: string, quantity: number): Promise<{ checkoutUrl: string }> => {
      const { checkoutUrl } = await guard(api.placeOrder(listingId, quantity))
      return { checkoutUrl }
    },
    [guard],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      currentUser,
      authLoading,
      login,
      signup,
      logout,
      listings,
      listingsLoading,
      listingsError,
      refreshListings,
      myRestaurant,
      refreshMyRestaurant,
      submitApplication,
      createListing,
      updateListing,
      deleteListing,
      placeOrder,
    }),
    [
      currentUser,
      authLoading,
      login,
      signup,
      logout,
      listings,
      listingsLoading,
      listingsError,
      refreshListings,
      myRestaurant,
      refreshMyRestaurant,
      submitApplication,
      createListing,
      updateListing,
      deleteListing,
      placeOrder,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
