import { useMemo, useState, type ReactNode } from 'react'
import { LocationContext, type LocationContextValue } from './location'

const STORAGE_KEY = 'freshforward.location'

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState(() => window.localStorage.getItem(STORAGE_KEY) ?? '')

  const value = useMemo<LocationContextValue>(
    () => ({
      location,
      setLocation: (nextLocation) => {
        const trimmedLocation = nextLocation.trim()
        setLocationState(trimmedLocation)

        if (trimmedLocation) {
          window.localStorage.setItem(STORAGE_KEY, trimmedLocation)
        } else {
          window.localStorage.removeItem(STORAGE_KEY)
        }
      },
      clearLocation: () => {
        setLocationState('')
        window.localStorage.removeItem(STORAGE_KEY)
      },
    }),
    [location],
  )

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}
