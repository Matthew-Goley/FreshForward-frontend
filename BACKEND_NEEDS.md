# FreshForward — Backend Needs

Source of truth for the backend endpoints the FreshForward frontend requires. Every action below currently exists as a mock implementation in `src/lib/api.ts`, operating on in-memory data instead of a real database. The request/response shapes here are exactly what the frontend sends and expects back today — implement to these shapes and `api.ts` can be rewritten to call real `fetch` endpoints with no changes needed anywhere else in the app (pages, `AppContext.tsx`).

Base URL is read from `VITE_API_URL` (see `src/lib/config.ts`), currently unused.

## Data shapes referenced below

```ts
type AccountType = 'customer' | 'restaurant'
type RestaurantStatus = 'pending' | 'approved'

interface CurrentUser {
  email: string
  accountType: AccountType
  restaurantId?: string // present only when accountType === 'restaurant'
}

interface Listing {
  id: string
  restaurantId: string
  restaurantName: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  quantityAvailable: number
  pickupWindow: string // free-text, e.g. "5:00 PM - 6:00 PM"
}

interface Restaurant {
  id: string
  name: string
  contactEmail: string
  address: string
  description: string
  status: RestaurantStatus
}

interface Order {
  id: string
  listingId: string
  listingTitle: string
  restaurantName: string
  pickupWindow: string
  price: number // the discountedPrice at time of purchase
  customerEmail: string
}

interface ListingInput {
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  quantityAvailable: number
  pickupWindow: string
}

interface ApplicationInput {
  name: string
  contactEmail: string
  address: string
  description: string
}
```

---

## Auth

### login
- **HTTP:** `POST /auth/login`
- **Request:** `{ email: string, password: string }`
- **Response:** `CurrentUser`
- **Auth:** Public
- **Notes:** The mock does not validate the password at all — it just checks whether `email` matches a known restaurant's `contactEmail` and logs the caller in as that restaurant (any `status`), otherwise logs them in as a plain customer. The real backend must actually verify credentials. There is currently **no session/token persistence** — `CurrentUser` lives only in React state and is lost on page refresh. The real implementation should return a session token or set an auth cookie here, and the frontend will need a `getCurrentUser` call (see below) added to rehydrate on load.

### signup
- **HTTP:** `POST /auth/signup`
- **Request:** `{ email: string, password: string, accountType: AccountType }`
- **Response:** `CurrentUser`
- **Auth:** Public
- **Notes:** For `accountType: 'customer'`, this just creates a session — no customer record is persisted anywhere else in the app today (no customer profile, no customer list). For `accountType: 'restaurant'`, if `email` doesn't match an existing restaurant, the backend must create a new `Restaurant` row with `status: 'pending'`, `name` defaulted to the email address (placeholder — there's no name field on this form), and empty `address`/`description`. If `email` *does* match an existing restaurant (e.g. one created via `submitRestaurantApplication`), this should log into that existing restaurant account rather than creating a duplicate.

### getCurrentUser *(not yet implemented in the frontend — needed for production)*
- **HTTP:** `GET /auth/me`
- **Request:** none (session/token from cookie or header)
- **Response:** `CurrentUser | null`
- **Auth:** Uses whatever session the client has, if any
- **Notes:** Called once on app load to restore the logged-in session after a page refresh. The current frontend has no equivalent and simply starts logged-out on every load — this is a known gap, not a deliberate design choice.

### logout
- **HTTP:** none currently — purely client-side (clears local state)
- **Auth:** n/a
- **Notes:** If the real backend issues server-side sessions/tokens, add `POST /auth/logout` to invalidate them; the frontend will need a small update to call it.

---

## Public listings browsing

### getListings
- **HTTP:** `GET /listings`
- **Request:** none
- **Response:** `Listing[]`
- **Auth:** Public
- **Notes:** Fetched once on app load and cached in context state. Title search on the Browse Listings page is currently done **client-side** against this full list — fine at current scale, but consider a `?q=` query param on this endpoint if the catalog grows.

### getListing
- **HTTP:** `GET /listings/:id`
- **Request:** none (id in path)
- **Response:** `Listing` (404 if not found)
- **Auth:** Public
- **Notes:** Exists in `api.ts` for parity with a real REST resource, but the frontend doesn't currently call it directly — the Listing Detail page finds the listing from the already-fetched `getListings()` result in memory. Worth wiring up directly once `getListings` is no longer practical to fetch in bulk.

---

## Restaurant listing CRUD

All of the following require the caller to be logged in as a restaurant. The frontend does not currently gate these on `status === 'approved'` at the API-call level — it just doesn't render the "Create Listing" UI when the restaurant's dashboard shows the pending-approval message. **The backend must enforce approved-only server-side**, since a pending restaurant could otherwise call these directly.

### getMyListings
- **HTTP:** `GET /restaurants/me/listings`
- **Request:** none (restaurant identified by session)
- **Response:** `Listing[]`
- **Auth:** Requires approved restaurant login
- **Notes:** Currently the frontend fetches **all** listings via `getListings()` and filters client-side by `restaurantId` inside the Restaurant Dashboard page. That's a shortcut appropriate for a mock but leaks nothing sensitive today only because `Listing` has no private fields — still, the real backend should expose a properly scoped endpoint rather than relying on the client to filter.

### createListing
- **HTTP:** `POST /restaurants/me/listings`
- **Request:** `ListingInput` (restaurant identified by session, not sent in the body)
- **Response:** `Listing`
- **Auth:** Requires approved restaurant login
- **Notes:** `restaurantId` and `restaurantName` on the response are derived server-side from the authenticated restaurant, not client-supplied. `quantityAvailable` is never decremented anywhere when an order is placed — there's no inventory tracking beyond the value set here. Decide whether that's in scope for the real backend.

### updateListing
- **HTTP:** `PUT /restaurants/me/listings/:id` (or `PATCH`)
- **Request:** `ListingInput`
- **Response:** `Listing`
- **Auth:** Requires approved restaurant login **and** ownership of the listing (the mock does not currently check ownership — any logged-in restaurant could edit any listing ID if they guessed it)
- **Notes:** Full replace of all editable fields; the frontend always sends the complete form, never a partial patch.

### deleteListing
- **HTTP:** `DELETE /restaurants/me/listings/:id`
- **Request:** none
- **Response:** `204 No Content` (or the deleted `Listing`, frontend doesn't use the body)
- **Auth:** Requires approved restaurant login **and** ownership (same caveat as `updateListing` — not currently enforced in the mock)

---

## Restaurant application / approval status

### submitRestaurantApplication
- **HTTP:** `POST /restaurants/apply`
- **Request:** `ApplicationInput` — `{ name: string, contactEmail: string, address: string, description: string }`
- **Response:** `Restaurant` (with `status: 'pending'`)
- **Auth:** Public — no login required to apply
- **Notes:** If `contactEmail` matches an existing restaurant record, this **updates** that record's `name`/`address`/`description` and resets `status` back to `'pending'` (a resubmission), rather than erroring or creating a duplicate. Once submitted, the applicant is expected to log in later via `/auth/login` with that same email to reach their dashboard (which will show the pending-approval message until approved).

### getRestaurant (a.k.a. "my restaurant status")
- **HTTP:** `GET /restaurants/me`
- **Request:** none (restaurant identified by session)
- **Response:** `Restaurant`
- **Auth:** Requires restaurant login (pending or approved)
- **Notes:** Powers the Restaurant Dashboard's pending-vs-approved branch. The current mock instead fetches **all** restaurants via a bulk `GET /restaurants`-equivalent and finds the caller's own record client-side — that's a shortcut that should not ship to production, since it means any client can currently see every restaurant's contact email, address, and approval status. Replace with a properly scoped `me` endpoint.

### approveRestaurant *(not implemented anywhere in the frontend — required for the product to function end-to-end)*
- **HTTP:** `POST /restaurants/:id/approve` (suggested)
- **Request:** none
- **Response:** `Restaurant` (with `status: 'approved'`)
- **Auth:** Admin-only — no such role or UI exists in this frontend at all
- **Notes:** The mock frontend has no approval flow whatsoever — two restaurant accounts are simply hardcoded as pre-approved (`demo@restaurant.test`, `bakery@restaurant.test`) for demo purposes, and every other signup/application is permanently stuck at `pending` with no way to change that through the UI. **An admin approval mechanism (endpoint + some kind of internal tool) is a hard requirement for a working product**, even though this frontend doesn't build it.

---

## Order placement

### placeOrder
- **HTTP:** `POST /orders`
- **Request:** `{ listingId: string }` — the customer is identified by the authenticated session in a real implementation; the current mock passes `customerEmail` explicitly in the call only because there's no real session to read it from server-side
- **Response:** `Order`
- **Auth:** Requires customer login (any logged-in customer; the "Buy" button on Listing Detail redirects to `/login` first if the visitor isn't logged in)
- **Notes:** This is an **instant-charge simulation** — clicking "Confirm Purchase" immediately creates a completed order with no payment step, no Stripe/payment processor integration, and no confirmation from the restaurant. There's also no inventory decrement: `quantityAvailable` on the listing is untouched after a purchase, and nothing currently prevents ordering more than the listed quantity. Real payment integration and stock validation are both out of scope for this frontend but will be needed before this goes live with real money.

### getOrder
- **HTTP:** `GET /orders/:id`
- **Request:** none
- **Response:** `Order` (404 if not found)
- **Auth:** ⚠️ Currently called with **no ownership check** — the Order Confirmation page will show any order's details to anyone who has (or guesses) the order ID, logged in or not. The real backend should require the requesting user to be either the customer who placed the order or the restaurant that owns the listing.
- **Notes:** Response includes a denormalized `listingTitle`, `restaurantName`, and `pickupWindow` (snapshotted at order-creation time) rather than requiring the client to join against the listing — keep that shape so historical orders still display correctly even if the listing is later edited or deleted.

### getMyOrders
- **HTTP:** `GET /restaurants/me/orders`
- **Request:** none (restaurant identified by session)
- **Response:** `Order[]`
- **Auth:** Requires approved restaurant login
- **Notes:** "Recent Orders" on the Restaurant Dashboard. The mock currently computes this by fetching **all** orders and **all** listings in bulk and cross-referencing them client-side by `restaurantId` — same shortcut/leak concern as `getMyListings`. The real backend should do this join server-side and only return orders belonging to the caller's own listings. There is no order status pipeline beyond "confirmed" — no restaurant accept/reject/fulfill step exists in this frontend.
