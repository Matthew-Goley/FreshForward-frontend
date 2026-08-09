import { Analytics } from '@vercel/analytics/react'
import { matchPath, useLocation } from 'react-router-dom'

// Route patterns with URL params. Matching against these reports one row per
// route in the Vercel dashboard instead of one row per listing/order id.
// Keep in sync with the dynamic <Route path=...> entries in App.tsx.
const DYNAMIC_ROUTES = ['/listings/:id', '/checkout/:listingId', '/orders/:orderId']

export default function VercelAnalytics() {
  const { pathname } = useLocation()
  const route = DYNAMIC_ROUTES.find((pattern) => matchPath(pattern, pathname)) ?? pathname

  return <Analytics route={route} path={pathname} />
}
