const raw = import.meta.env.VITE_API_URL ?? ''
// Defensive: a trailing slash produces "//listings", which some proxies treat as a distinct path.
export const API_BASE_URL: string = raw.replace(/\/+$/, '')

if (import.meta.env.PROD && !API_BASE_URL) {
  console.error('VITE_API_URL is not set. All API calls will fail.')
}
