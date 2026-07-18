// Base URL for the live backend once it exists. Unused for now — everything
// in api.ts runs against in-memory mock data — but wired in here so turning
// on real requests later is a one-line change in api.ts, not a hunt for
// where to put it.
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? ''
