import { createContext, useContext } from 'react'

export interface LocationContextValue {
  location: string
  setLocation: (location: string) => void
  clearLocation: () => void
}

export const LocationContext = createContext<LocationContextValue | null>(null)

export function useLocationState() {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error('useLocationState must be used within LocationProvider')
  }

  return context
}
