# FreshForward — Needed Fixes (Ratified Work Contract)

**Audit date:** 2026-08-08
**Status:** **BINDING.** This document is the single source of truth for the FreshForward deployment work.
**Scope:** `FF/` (frontend → Vercel) and `FF-backend/` (API → Railway)

---

## 0. How to use this document

This document is written so that **two independent Claude Code sessions — one in `FF/`, one in `FF-backend/` — can each work start to finish without talking to each other**, and the two halves will fit together.

Every decision that would otherwise require negotiation between the two sides has already been made and recorded in **§1 Ratified Decisions**. Every wire shape has been frozen in **§2 API Contract** and **§3 Frontend Contract**. Neither session may deviate from those two sections.

### Rules for each session

1. **Stay in your folder.** The `FF/` session touches only `FF/`. The `FF-backend/` session touches only `FF-backend/`. Neither edits this document.
2. **§1, §2, and §3 are law.** If your implementation disagrees with them, your implementation is wrong. Do not "improve" a shape because it seems cleaner — the other session is coding against the frozen version.
3. **Work only your prefix.** `FF-backend/` does `BE-*`. `FF/` does `FE-*`. There are no shared items; the cross-cutting work has already been split.
4. **Line numbers will drift.** Every reference like `app/config.py:11` is accurate as of the audit date and **will be wrong** once you start editing. Every finding quotes the offending code — **locate by the quoted code, not the line number.**
5. **You cannot test end-to-end.** The other half does not exist yet in your environment. Each item states what you *can* verify. Do that, and do not fake the rest.
6. **Both repos forbid pushing to `main`.** Work on a branch, open a PR. One PR per phase is reasonable; one giant PR is not.
7. **Report by ID.** When you finish, list the IDs you closed and any you skipped with the reason.

### Suggested session kickoff prompt

> Read `NEEDED_FIXES.md` in full before writing any code. You are the **`FF/`** session (or **`FF-backend/`**). Implement every `FE-*` (or `BE-*`) item in the order given in §8. §1, §2, and §3 are frozen contracts — implement to them exactly, do not redesign them. Locate code by the quoted snippets, not line numbers. Work on a branch and open a PR per phase.

### Copy this file into both repos

This file lives in `_Dev_ALL/`, which is outside both git repositories. Before starting, copy it into each repo so the sessions can read it without reaching outside their working directory:

```bash
cp _Dev_ALL/NEEDED_FIXES.md _Dev_ALL/FF/NEEDED_FIXES.md
cp _Dev_ALL/NEEDED_FIXES.md _Dev_ALL/FF-backend/NEEDED_FIXES.md
```

Add `NEEDED_FIXES.md` to each `.gitignore` if you don't want it committed. If you *do* commit it, it must stay identical in both places — a diverged contract is worse than no contract.

---

## Verdict

**Not ready to deploy as a working product.** Both repos build and boot. The problem is that they are two disconnected systems: the frontend never makes a single network call to the backend, and the data contracts do not match on any endpoint.

**What deploying today produces:**

- **Vercel:** a marketing site and UI demo on in-memory fake data. Signup succeeds with any password, orders vanish on refresh, nothing persists.
- **Railway:** a well-built API receiving zero traffic, with no possible admin to approve a restaurant, and Stripe redirects pointing at routes that do not exist.

---

## Severity legend

| Severity | Meaning |
|---|---|
| **BLOCKER** | Do not deploy to production with this outstanding. Breaks the product or is a security hole. |
| **HIGH** | Will cause user-visible failures, data corruption, or outages under normal load. |
| **MEDIUM** | Will bite you within weeks. |
| **LOW** | Polish and hygiene. |

---
---

# 1. Ratified Decisions

**These are decided. Do not re-litigate them.** Each entry states the decision, then why, so a session that disagrees understands the tradeoff rather than silently reversing it.

### Data representation

**D-1 — Money is integer cents on the wire; dollars in the frontend UI layer.**
The API sends and receives `original_price`, `discounted_price`, and `price` as **integer cents**. `FF/src/lib/api.ts` converts to and from dollars at the boundary and nowhere else. Every page keeps working with dollars.
*Why:* floats are wrong for money, and the backend already models cents. Converting in exactly one file means exactly one place to get it wrong.

**D-2 — Conversion must round.**
`dollarsToCents = (d) => Math.round(d * 100)`. Not `Math.floor`, not a bare cast.
*Why:* `19.99 * 100 === 1998.9999999999998` in IEEE-754. Without rounding you undercharge a cent on a large fraction of real prices.

**D-3 — The wire is snake_case. The frontend is camelCase.**
The API keeps FastAPI/Pydantic idiom (`quantity_available`). The frontend keeps TypeScript idiom (`quantityAvailable`). `api.ts` maps between them.
*Why:* both sides stay idiomatic; the seam already exists.

**D-4 — IDs are integers on the wire, strings in the frontend.**
The API uses `int`. `FF/src/types/index.ts` keeps `id: string`. `api.ts` does `String(id)` inbound and `Number(id)` outbound.
*Why:* React keys and route params are strings anyway, and the existing frontend types already assume strings. Converting outbound is a one-line concern in `api.ts`.
**Outbound is mandatory:** `POST /orders` sends `listing_id` as a **JSON number**. Sending `"3"` will 422.

**D-5 — Timestamps are ISO 8601 strings, passed through unparsed.**
`created_at` → `createdAt: string`. The frontend does not convert to `Date` in the type layer; format at render time if needed.

### Authentication

**D-6 — Login accepts email or username; the frontend always sends email.**
`POST /auth/login` keeps the OAuth2 form field named `username`, but the backend matches it against **either** `User.username` or `User.email`. The frontend puts the email address in that field.
*Why:* it preserves `OAuth2PasswordBearer` compatibility and FastAPI's Swagger "Authorize" button, while letting users log in the way the UI asks them to.

**D-7 — `username` is optional at registration and derived server-side.**
`POST /auth/register` accepts `username` as optional. When absent, the backend derives it from the email local-part. The frontend **does not** add a username field to the signup form.
*Why:* the signup form collects email and password; adding a third field to satisfy a backend constraint is the tail wagging the dog.

Derivation algorithm (implement exactly — it must be deterministic):
```
1. base = email.split("@")[0].lower()
2. base = re.sub(r"[^a-z0-9._-]", "", base)
3. if len(base) < 3: base = base + "user"
4. base = base[:45]                       # leave room for a suffix; column is String(50)
5. candidate = base
6. n = 2
7. while a User with that username exists:
       candidate = f"{base}-{n}"; n += 1
       if n > 1000: raise HTTPException(500, "Could not allocate a username")
8. return candidate
```

**D-8 — Registration does not return a token. The frontend registers, then logs in.**
`POST /auth/register` keeps returning `UserOut` with `201`. The frontend's `signup()` calls register, then immediately calls login with the same credentials.
*Why:* exactly one endpoint issues tokens. Two round trips at signup only, in exchange for one less place to get token handling wrong across two independent sessions.

**D-9 — The token lives in `localStorage` under the key `ff-auth-token`, sent as `Authorization: Bearer <token>`.**
`allow_credentials=False` on the backend. No cookies.
*Why:* the backend is already bearer-token based. `localStorage` is XSS-exposed, which is a real tradeoff, but httpOnly cookies would require CSRF protection and credentialed CORS — more moving parts for two sessions to coordinate. Revisit before handling anything more sensitive than pickup orders.

**D-10 — `accountType` is not sent at signup. It is derived.**
`POST /auth/register` takes no account type. `User.account_type` is `"customer"` on creation and flips to `"restaurant"` as a side effect of `POST /restaurants/apply` (already implemented).
The signup form keeps its Customer/Restaurant radio, but it is **routing UI only**: choosing "Restaurant" redirects to `/restaurant/apply` after signup instead of to `/listings`.
*Why:* the backend already derives this correctly. Sending a field the server ignores is a lie in the payload.

**D-11 — A 401 clears the session but does not redirect.**
`api.ts` clears the stored token on any 401 and throws. `AppContext` clears `currentUser`. Individual pages decide whether to redirect.
*Why:* a hard redirect from the network layer makes background refreshes yank users off the page they're on.

### Authorization and roles

**D-12 — `POST /restaurants/apply` requires authentication.**
This **overrides `FF/BACKEND_NEEDS.md:156`**, which specified a public endpoint. `/restaurant/apply` becomes a protected frontend route: an unauthenticated visitor is sent to `/signup` with `state.redirectTo` set, and lands back on the form after registering.
*Why:* `Restaurant.owner_user_id` is non-nullable and unique (`app/models.py:38`). A public application would create an ownerless restaurant with no way to attach an owner later. The backend as built is correct; the spec was wrong.

**D-13 — `UserOut` gains `is_admin` and `restaurant_id`.**
One call to `GET /auth/me` tells the frontend everything it needs to route: whether to show admin UI, and whether the user owns a restaurant.
*Why:* without this the frontend needs two or three extra calls on every page load just to decide what to render.

**D-14 — Admin bootstrap is an env-driven migration; the admin UI is built.**
Backend ships `BOOTSTRAP_ADMIN_EMAIL` migration + `GET /restaurants/pending`. Frontend ships `/admin/restaurants` gated on `currentUser.isAdmin`.
*Why:* without both, no restaurant can ever be approved and the product cannot function. The migration alone unblocks; the UI makes it operable.

**D-15 — `OrderOut` includes `customer_email`.**
The restaurant sees the buyer's email address on their orders.
*Why:* they need to identify who is collecting the food. This is a deliberate privacy decision, appropriate for a pickup marketplace.

### Product flow

**D-16 — Checkout redirects to Stripe. There is no instant-purchase path.**
`POST /orders` returns `{order, checkout_url, session_id}` with `status: "pending_payment"`. The frontend does `window.location.href = checkout_url` — a full page navigation, **not** React Router's `navigate`, because `checkout.stripe.com` is an external origin.

**D-17 — The payment return page looks the order up by Stripe session ID.**
Backend adds `GET /orders/by-session/{session_id}`. The frontend's `/payment/success` page polls it, because the webhook is asynchronous and may not have landed when the browser arrives.

**D-18 — `POST /payments/checkout-session` is deleted.**
Along with the `CheckoutSessionCreate` and `CheckoutSessionOut` schemas.
*Why:* it lets the client set its own price, and `POST /orders` fully supersedes it.

**D-19 — `/listings` is the canonical customer browse page. `/browse` is parked.**
`FF/src/pages/Browse.tsx` (76 KB) is a self-contained mock grocery catalog with its own hardcoded product list, categories, and a **multi-item cart**. It never calls `useApp()` or `api.ts`. The backend has no cart concept — `POST /orders` takes one `listing_id` plus a quantity.

Decision: **`Listings.tsx` gets wired to the live API and becomes the customer path.** `HeroAddressSearch.tsx` redirects to `/listings` instead of `/browse`. The `/browse` route stays registered and reachable by direct URL, but is removed from the primary journey and is not integrated.
*Why:* reconciling a multi-item grocery cart with a single-listing order model is a product redesign, not an integration task. Shipping `/browse` as the main path would mean shipping a fake storefront. This is logged as `FE-21` for future work.

**D-20 — There is no cart, and no multi-restaurant order.**
One order = one listing + a quantity. Do not build cart infrastructure.

### Operational

**D-21 — A failed refund blocks the cancellation.**
If `stripe.Refund.create` fails when cancelling a paid order, return 502 and leave the order `paid`.
*Why:* money state and order state stay consistent. The cost is that a restaurant cannot cancel while Stripe is degraded, which is the correct tradeoff.

**D-22 — Swagger UI is hidden in production**, gated on `ENVIRONMENT=production`.

**D-23 — Geocoding stays on Nominatim for launch, behind a swappable config.**
`FF/src/lib/address.ts` reads `VITE_GEOCODE_URL` (default `https://nominatim.openstreetmap.org`) and optional `VITE_GEOCODE_KEY`. Request hygiene is fixed now (600 ms debounce, abort, cache, real error state). Switching to a paid provider later becomes an env change, not a code change.
*Why:* choosing a paid provider is a spending decision that shouldn't block engineering. This makes the eventual switch trivial while stopping the worst of the current abuse. **Must be switched before any real marketing push** — see `FE-6`.

**D-24 — Both `VITE_API_URL` and `FRONTEND_URL` are set with no trailing slash**, and both sides strip one defensively.

---
---

# 2. Frozen API Contract

**This is the authoritative wire format.** The `FF-backend/` session implements exactly this. The `FF/` session codes against exactly this. Where an individual work item below seems to disagree with this section, **this section wins**.

Base URL: the Railway service root, no trailing slash. All request and response bodies are JSON unless stated otherwise.

## 2.1 Error shape

Every non-2xx response is one of two shapes. **The frontend must handle both.**

```jsonc
// 400, 401, 403, 404, 409, 500, 502 — a plain string detail
{ "detail": "Not enough stock available" }

// 422 — FastAPI request validation, detail is an ARRAY
{ "detail": [ { "loc": ["body", "email"], "msg": "value is not a valid email address", "type": "value_error" } ] }
```

Frontend normalisation rule:
```ts
function extractDetail(body: unknown, status: number): string {
  const d = (body as { detail?: unknown })?.detail
  if (typeof d === 'string') return d
  if (Array.isArray(d)) return d.map((e) => e?.msg ?? 'Invalid input').join(', ')
  return `Request failed (${status})`
}
```

## 2.2 Response models

### `UserOut`
```jsonc
{
  "id": 1,
  "username": "jane",
  "email": "jane@example.com",
  "account_type": "customer",        // "customer" | "restaurant"
  "is_admin": false,                 // NEW - see D-13
  "restaurant_id": null,             // NEW - int | null, the restaurant this user owns
  "created_at": "2026-08-08T12:00:00Z"
}
```

### `Token`
```jsonc
{ "access_token": "eyJhbGci...", "token_type": "bearer" }
```

### `ListingOut`
```jsonc
{
  "id": 1,
  "restaurant_id": 1,
  "restaurant_name": "Green Table Cafe",
  "title": "Chef Special Pasta Box",
  "description": "Leftover pasta primavera...",
  "original_price": 1400,            // INTEGER CENTS
  "discounted_price": 500,           // INTEGER CENTS
  "quantity_available": 6,
  "pickup_window": "5:00 PM - 6:00 PM",
  "created_at": "2026-08-08T12:00:00Z"
}
```

### `RestaurantOut` — owner or admin view
```jsonc
{
  "id": 1,
  "owner_user_id": 4,
  "name": "Green Table Cafe",
  "contact_email": "demo@greentable.example",
  "address": "123 Main St, Amherst, MA",
  "description": "Farm-to-table cafe...",
  "status": "pending",               // "pending" | "approved" | "rejected"
  "rejection_reason": null,          // string | null
  "created_at": "2026-08-08T12:00:00Z"
}
```

### `RestaurantPublicOut` — public directory
```jsonc
{ "id": 1, "name": "Green Table Cafe", "address": "123 Main St", "description": "..." }
```

### `OrderOut`
```jsonc
{
  "id": 1,
  "listing_id": 1,
  "listing_title": "Chef Special Pasta Box",
  "restaurant_name": "Green Table Cafe",
  "customer_email": "jane@example.com",   // NEW - see D-15
  "pickup_window": "5:00 PM - 6:00 PM",
  "quantity": 1,
  "price": 500,                            // INTEGER CENTS, total for the line
  "status": "pending_payment",
  "created_at": "2026-08-08T12:00:00Z"
}
```

`status` is exactly one of: `pending_payment`, `paid`, `payment_failed`, `ready`, `picked_up`, `cancelled`.

### `OrderCreateOut`
```jsonc
{
  "order": { /* OrderOut */ },
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "session_id": "cs_test_..."
}
```

### `PaymentOut`
```jsonc
{ "id": 1, "amount": 500, "currency": "usd", "status": "pending", "description": "...", "created_at": "..." }
```

## 2.3 Endpoints

### Auth

| Method | Path | Auth | Request | Success | Errors |
|---|---|---|---|---|---|
| `POST` | `/auth/register` | none | `{email, password, username?}` | `201` `UserOut` | `400` email taken / username taken, `422` |
| `POST` | `/auth/login` | none | **form-urlencoded** `username`, `password` | `200` `Token` | `401` |
| `GET` | `/auth/me` | Bearer | — | `200` `UserOut` | `401` |

`POST /auth/register` body:
```jsonc
{ "email": "jane@example.com", "password": "hunter2hunter2", "username": null }
```
`password` is 8–128 characters. `username`, when supplied, is 3–50 characters; when `null` or absent it is derived per **D-7**.

`POST /auth/login` is **`application/x-www-form-urlencoded`**, not JSON:
```
username=jane%40example.com&password=hunter2hunter2
```
The `username` field accepts an email address or a username (**D-6**).

### Listings

| Method | Path | Auth | Request | Success | Errors |
|---|---|---|---|---|---|
| `GET` | `/listings` | none | — | `200` `ListingOut[]` | — |
| `GET` | `/listings/{id}` | none | — | `200` `ListingOut` | `404` |
| `GET` | `/restaurants/me/listings` | approved restaurant | — | `200` `ListingOut[]` | `401`, `403`, `404` |
| `POST` | `/restaurants/me/listings` | approved restaurant | `ListingInput` | `201` `ListingOut` | `401`, `403`, `404`, `422` |
| `PUT` | `/restaurants/me/listings/{id}` | approved restaurant + owner | `ListingInput` | `200` `ListingOut` | `403`, `404`, `422` |
| `DELETE` | `/restaurants/me/listings/{id}` | approved restaurant + owner | — | `204` no body | `400` has orders, `403`, `404` |

`GET /listings` returns listings belonging to **approved** restaurants only. Sold-out listings (`quantity_available == 0`) **are still returned** — the frontend renders them as sold out (**FE-13**).

`ListingInput`:
```jsonc
{
  "title": "Chef Special Pasta Box",      // 1..200
  "description": "...",                    // 1..2000
  "original_price": 1400,                  // int cents, > 0
  "discounted_price": 500,                 // int cents, > 0, <= original_price
  "quantity_available": 6,                 // int, >= 0
  "pickup_window": "5:00 PM - 6:00 PM"     // 1..200
}
```
`discounted_price > original_price` returns `422`.

### Restaurants

| Method | Path | Auth | Request | Success | Errors |
|---|---|---|---|---|---|
| `POST` | `/restaurants/apply` | Bearer | `RestaurantApplicationInput` | `200` `RestaurantOut` | `401`, `422` |
| `GET` | `/restaurants/me` | Bearer | — | `200` `RestaurantOut` | `401`, `404` |
| `GET` | `/restaurants/pending` | **admin** | — | `200` `RestaurantOut[]` | `401`, `403` |
| `POST` | `/restaurants/{id}/approve` | **admin** | — | `200` `RestaurantOut` | `401`, `403`, `404` |
| `POST` | `/restaurants/{id}/reject` | **admin** | `{reason}` | `200` `RestaurantOut` | `401`, `403`, `404`, `422` |
| `GET` | `/restaurants` | none | — | `200` `RestaurantPublicOut[]` | — |
| `GET` | `/restaurants/{id}` | none | — | `200` `RestaurantPublicOut` | `404` |

**Route ordering is load-bearing.** `/restaurants/me`, `/restaurants/pending`, `/restaurants/me/listings`, and `/restaurants/me/orders` must all be declared **before** `/restaurants/{restaurant_id}`. Because `restaurant_id` is typed `int`, a literal `me` or `pending` matched against it produces a confusing `422`, not a fallthrough.

`RestaurantApplicationInput`:
```jsonc
{ "name": "...", "contact_email": "...", "address": "...", "description": "..." }
```
Re-applying updates the existing record and resets `status` to `"pending"`, clearing `rejection_reason`.

`{reason}` for reject: `{ "reason": "Address could not be verified" }`, 1–500 characters.

### Orders

| Method | Path | Auth | Request | Success | Errors |
|---|---|---|---|---|---|
| `POST` | `/orders` | Bearer | `{listing_id, quantity}` | `201` `OrderCreateOut` | `400` stock, `401`, `404`, `422`, `502` Stripe |
| `GET` | `/orders/me` | Bearer | — | `200` `OrderOut[]` | `401` |
| `GET` | `/orders/by-session/{session_id}` | Bearer | — | `200` `OrderOut` | `401`, `403`, `404` |
| `GET` | `/orders/{id}` | Bearer, customer or owning restaurant | — | `200` `OrderOut` | `401`, `403`, `404` |
| `GET` | `/restaurants/me/orders` | approved restaurant | — | `200` `OrderOut[]` | `401`, `403`, `404` |
| `PATCH` | `/orders/{id}/status` | approved restaurant + owner | `{status}` | `200` `OrderOut` | `400` bad transition, `403`, `404`, `422` |

**Route ordering:** `/orders/me` and `/orders/by-session/{session_id}` must be declared **before** `/orders/{order_id}`.

`POST /orders` body — note `listing_id` is a **number**, not a string (**D-4**):
```jsonc
{ "listing_id": 3, "quantity": 1 }
```

`PATCH /orders/{id}/status` body: `{ "status": "ready" }`. Accepted values are only `ready`, `picked_up`, `cancelled`. Permitted transitions:

| From | To |
|---|---|
| `paid` | `ready`, `cancelled` |
| `ready` | `picked_up`, `cancelled` |

Anything else returns `400`. `pending_payment → paid` and `pending_payment → payment_failed` are set **only** by the Stripe webhook.

`GET /orders/me` returns the authenticated user's own orders, newest first.

`GET /orders/by-session/{session_id}` looks up the `Payment` row by `stripe_checkout_session_id` and returns its order. `403` if the payment belongs to another user; `404` if no payment or no attached order.

### Payments

| Method | Path | Auth | Request | Success |
|---|---|---|---|---|
| `POST` | `/payments/webhook` | Stripe signature | raw body | `200` `{"received": true}` |
| `GET` | `/payments/history` | Bearer | — | `200` `PaymentOut[]` |

`POST /payments/checkout-session` is **deleted** (**D-18**).

### Health

| Method | Path | Auth | Success |
|---|---|---|---|
| `GET` | `/` | none | `200` `{"status": "FreshForward API running"}` |
| `GET` | `/health` | none | `200` `{"status": "ok"}`, `500` if the database is unreachable |

---
---

# 3. Frozen Frontend Contract

The `FF/` session implements exactly this. It is recorded here so the shapes are reviewable alongside the API contract, and so a future backend change can see what depends on it.

## 3.1 `FF/src/types/index.ts` — frozen

```ts
export type AccountType = 'customer' | 'restaurant'
export type RestaurantStatus = 'pending' | 'approved' | 'rejected'
export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'payment_failed'
  | 'ready'
  | 'picked_up'
  | 'cancelled'

export interface CurrentUser {
  id: string
  username: string
  email: string
  accountType: AccountType
  isAdmin: boolean
  restaurantId: string | null   // non-null iff this user owns a restaurant
}

export interface Listing {
  id: string
  restaurantId: string
  restaurantName: string
  title: string
  description: string
  originalPrice: number          // DOLLARS
  discountedPrice: number        // DOLLARS
  quantityAvailable: number
  pickupWindow: string
  createdAt: string
}

export interface Restaurant {
  id: string
  name: string
  contactEmail: string
  address: string
  description: string
  status: RestaurantStatus
  rejectionReason: string | null
}

export interface Order {
  id: string
  listingId: string
  listingTitle: string
  restaurantName: string
  customerEmail: string
  pickupWindow: string
  quantity: number
  price: number                  // DOLLARS, total for the line
  status: OrderStatus
  createdAt: string
}

export interface ListingInput {
  title: string
  description: string
  originalPrice: number          // DOLLARS
  discountedPrice: number        // DOLLARS
  quantityAvailable: number
  pickupWindow: string
}

export interface ApplicationInput {
  name: string
  contactEmail: string
  address: string
  description: string
}
```

## 3.2 `FF/src/lib/api.ts` — frozen public surface

```ts
// --- token ---
export function getToken(): string | null
export function setToken(token: string | null): void
export class ApiError extends Error { status: number }

// --- auth ---
export function login(email: string, password: string): Promise<CurrentUser>
export function signup(email: string, password: string): Promise<CurrentUser>   // no accountType (D-10)
export function getCurrentUser(): Promise<CurrentUser>

// --- listings ---
export function getListings(): Promise<Listing[]>
export function getListing(id: string): Promise<Listing>
export function getMyListings(): Promise<Listing[]>                             // no restaurantId arg
export function createListing(input: ListingInput): Promise<Listing>
export function updateListing(id: string, input: ListingInput): Promise<Listing>
export function deleteListing(id: string): Promise<void>

// --- restaurants ---
export function submitRestaurantApplication(input: ApplicationInput): Promise<Restaurant>
export function getMyRestaurant(): Promise<Restaurant | null>                   // null on 404
export function getPendingRestaurants(): Promise<Restaurant[]>
export function approveRestaurant(id: string): Promise<Restaurant>
export function rejectRestaurant(id: string, reason: string): Promise<Restaurant>

// --- orders ---
export function placeOrder(
  listingId: string,
  quantity: number,
): Promise<{ order: Order; checkoutUrl: string; sessionId: string }>
export function getMyOrders(): Promise<Order[]>
export function getRestaurantOrders(): Promise<Order[]>
export function getOrder(id: string): Promise<Order>
export function getOrderBySession(sessionId: string): Promise<Order>
export function updateOrderStatus(id: string, status: OrderStatus): Promise<Order>
```

**Deleted from the current surface:** `getRestaurants()`, `getRestaurant(id)`, `getOrders()`, and the `LoginRequest` / `SignupRequest` interfaces. No page uses them after the rewrite.

## 3.3 `FF/src/lib/AppContext.tsx` — frozen shape

```ts
interface AppContextValue {
  // auth
  currentUser: CurrentUser | null
  authLoading: boolean            // true until the initial /auth/me settles
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
```

**Removed from the current context:** the global `orders: Order[]` and `restaurants: Restaurant[]` arrays. There is no `GET /orders` or bulk-restaurant endpoint backing them, and holding every restaurant's contact details in client state was the leak `BACKEND_NEEDS.md:164` flagged.

## 3.4 Context consumers that must be updated

Verified by grep. These are every call site:

| File | Currently destructures | Action |
|---|---|---|
| `src/components/NavBar.tsx` | `currentUser, logout` | no change |
| `src/pages/Login.tsx` | `login` | no change to the call; remove the demo banner (**FE-3**) |
| `src/pages/Signup.tsx` | `signup` | drop the `accountType` argument (**D-10**) |
| `src/pages/RestaurantApply.tsx` | `submitApplication` | add auth gating (**D-12**, **FE-20**) |
| `src/pages/Listings.tsx` | `listings` | add loading and error states (**FE-13**) |
| `src/pages/ListingDetail.tsx` | `listings, currentUser` | fetch by ID; handle sold out (**FE-13**) |
| `src/pages/Checkout.tsx` | `listings, currentUser, placeOrder` | redirect to Stripe (**FE-17**) |
| `src/pages/OrderConfirmation.tsx` | `orders` | **breaks** — `orders` is gone; call `getOrder(id)` (**FE-19**) |
| `src/pages/RestaurantDashboard.tsx` | `currentUser, restaurants, listings, orders, createListing, updateListing, deleteListing` | **breaks** — rewire to `myRestaurant`, `getMyListings()`, `getRestaurantOrders()` (**FE-19**) |
| `src/pages/Browse.tsx` | *(does not use `useApp()` at all)* | leave alone (**D-19**) |

---
---

# 4. `FF-backend/` work items

Owner: the **`FF-backend/`** session. Every item is single-repo. Order given in §8.

---

## BE-1 — BLOCKER — `SECRET_KEY` silently defaults to a value published in your public repo

**Where:** `FF-backend/app/config.py`, the whole `Settings` class:

```python
database_url: str = "postgresql://postgres:postgres@localhost:5432/freshforward"
secret_key: str = "dev-secret-change-me"
algorithm: str = "HS256"
access_token_expire_minutes: int = 60 * 24
stripe_secret_key: str = ""
stripe_webhook_secret: str = ""
frontend_url: str = "http://localhost:5173"
```

**Why it matters.** `secret_key` is the JWT signing key, used in `app/security.py` by `create_access_token` and `decode_access_token`. If the Railway variable is missing or misspelled, the service **boots normally** and signs tokens with a string committed to `github.com/Matthew-Goley/FF-backend`, which anyone can read.

The attack is trivial:
```python
import jwt, datetime
jwt.encode(
    {"sub": "<any_username>", "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=1)},
    "dev-secret-change-me", algorithm="HS256",
)
```
That token passes `decode_access_token`, passes `get_current_user`, and grants full access as that user — including any user with `is_admin = true`. Nothing logs it.

The siblings are quieter but still bad. `database_url` defaulting to localhost means a missing `DATABASE_URL` produces a service that boots green, passes a healthcheck on `/` (which touches no database), then 500s on every real request. `stripe_secret_key` defaulting to `""` means checkout fails at runtime rather than at boot.

**Fix.** Make the security-critical settings required with no default, so Pydantic raises at import and the container refuses to start. Replace `app/config.py` entirely:

```python
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Required. A missing value must crash the boot, not degrade silently. ---
    database_url: str
    secret_key: str = Field(min_length=32)
    stripe_secret_key: str
    stripe_webhook_secret: str
    frontend_url: str

    # --- Optional. ---
    extra_cors_origins: str = ""          # see BE-2
    environment: str = "development"      # see BE-12
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    @field_validator("secret_key")
    @classmethod
    def reject_placeholder_secret(cls, v: str) -> str:
        if v in {"dev-secret-change-me", "changeme", "secret"}:
            raise ValueError("SECRET_KEY is still the placeholder value")
        return v

    @field_validator("frontend_url")
    @classmethod
    def strip_trailing_slash(cls, v: str) -> str:
        # Stripe success_url/cancel_url concatenate onto this; a trailing slash yields "//payment/success"
        return v.rstrip("/")

    @property
    def cors_origins(self) -> list[str]:
        extra = [o.strip().rstrip("/") for o in self.extra_cors_origins.split(",") if o.strip()]
        return [self.frontend_url, *extra]


settings = Settings()
```

Generate a real key with `python -c "import secrets; print(secrets.token_hex(32))"`.

**This intentionally breaks local dev for anyone without a complete `.env`.** That is the point. `FF-backend/.env.example` is already accurate — keep it in sync and mention the change in the README.

**Rotate.** Any environment that has ever run with `dev-secret-change-me` has compromised tokens. Rotating invalidates every outstanding JWT and forces re-login, which is what you want.

**Verify:** `unset SECRET_KEY && python -c "from app.config import settings"` must raise `ValidationError`.

---

## BE-2 — BLOCKER — CORS accepts one origin and the comment contradicts the code

**Where:** `FF-backend/app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],   # a single-element list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
against `app/config.py`, which documents the field as something else entirely:
```python
# CORS - comma-separated list of allowed origins
frontend_url: str = "http://localhost:5173"
```
There is no `.split(",")` anywhere in the codebase.

**Why it matters.** Three failures:

1. **The comment is a trap.** Someone follows it, sets `FRONTEND_URL=https://a.com,https://b.com`, and the middleware receives one nonsense origin — the literal string with the comma in it. That matches nothing, so **every browser request from every origin is blocked**, and the console shows a generic CORS error with no hint why. Total outage from following your own documentation.
2. **Every Vercel preview deployment is blocked.** Preview domains are unique per branch and will never match a single production origin — so nobody can test a PR against the real API.
3. **`FRONTEND_URL` is overloaded.** It is both the CORS allowlist and the base for Stripe's `success_url`/`cancel_url`. You cannot widen it for CORS without moving where paying customers land.

**Fix.** `BE-1` already adds `extra_cors_origins` and the `cors_origins` property. Now rewrite the middleware in `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    # Vercel preview deployments. TIGHTEN THIS to your real project slug before shipping -
    # a loose pattern like .*\.vercel\.app lets ANY Vercel-hosted site call your API.
    allow_origin_regex=r"^https://freshforward-frontend-[a-z0-9-]+\.vercel\.app$",
    allow_credentials=False,                 # see BE-10 and D-9
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
```

Confirm the actual preview domain format in the Vercel dashboard before trusting that regex — the project slug derives from the repo name (`FreshForward-frontend`) but Vercel lowercases and may truncate.

**Verify:**
```bash
curl -i -X OPTIONS http://localhost:8000/listings \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET"
```
Expect `200`/`204` with `access-control-allow-origin` echoing the origin. Then repeat with a junk origin and confirm the header is absent.

---

## BE-15 — BLOCKER — Login by email (contract requirement D-6)

**Where:** `FF-backend/app/routers/auth.py`, in `login`:
```python
user = db.query(User).filter(User.username == form_data.username).first()
```

**Why it matters.** The frontend's login form collects an email address (`FF/src/pages/Login.tsx` — `type="email"`, `autoComplete="email"`). There is currently no way for a user to log in with the identifier the UI asked them for. Since `username` is now derived server-side (**D-7**), most users will never *know* their username.

**Fix.** Match against either column:

```python
from sqlalchemy import or_

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # The OAuth2 form field is named "username", but we accept an email address there too (D-6).
    identifier = form_data.username.strip()
    user = (
        db.query(User)
        .filter(or_(User.username == identifier, User.email == identifier.lower()))
        .first()
    )
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(access_token=create_access_token(subject=user.username))
```

Note `identifier.lower()` on the email comparison only — emails are stored lowercase (see `BE-16`), usernames are matched exactly. Keep the error message identical for "no such user" and "wrong password" so it can't be used to enumerate accounts.

**Verify:** register a user, then log in successfully with both the email and the derived username.

---

## BE-16 — BLOCKER — Optional username at registration (contract requirement D-7)

**Where:** `FF-backend/app/schemas.py`:
```python
class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
```
and `app/routers/auth.py`, in `register`.

**Why it matters.** `FF/src/pages/Signup.tsx` collects email and password only. Registration currently fails with a `422` for every signup the frontend can produce.

**Fix.** Make it optional in `app/schemas.py`:
```python
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    username: str | None = Field(default=None, min_length=3, max_length=50)
```

Add the derivation helper — put it in `app/security.py` or a new `app/usernames.py`:
```python
import re
from sqlalchemy.orm import Session
from app.models import User


def derive_username(email: str, db: Session) -> str:
    """Deterministic username from an email local-part. See NEEDED_FIXES.md D-7."""
    base = re.sub(r"[^a-z0-9._-]", "", email.split("@")[0].lower())
    if len(base) < 3:
        base = f"{base}user"
    base = base[:45]                       # leave room for a "-NNN" suffix; column is String(50)

    candidate, n = base, 2
    while db.query(User).filter(User.username == candidate).first() is not None:
        candidate = f"{base}-{n}"
        n += 1
        if n > 1000:
            raise HTTPException(status_code=500, detail="Could not allocate a username")
    return candidate
```

And wire it into `register`:
```python
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if payload.username:
        if db.query(User).filter(User.username == payload.username).first():
            raise HTTPException(status_code=400, detail="Username already taken")
        username = payload.username
    else:
        username = derive_username(email, db)

    user = User(username=username, email=email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```

**Normalise email to lowercase on write.** `User.email` has a unique index, so without this `Jane@x.com` and `jane@x.com` are two accounts, and `BE-15`'s lowercase lookup would miss the first one.

**Race note:** the uniqueness check and the insert are not atomic — two simultaneous signups from the same email local-part can both pass the loop and one will hit the DB unique constraint as an `IntegrityError` (a 500). Catch it and retry once, or accept it as rare. Do not remove the unique constraint.

**Verify:** register with `{"email":"jane@example.com","password":"hunter2hunter2"}` and no username; expect `201` with `"username": "jane"`. Register `jane@other.com`; expect `"jane-2"`.

---

## BE-17 — BLOCKER — `UserOut` gains `is_admin` and `restaurant_id` (contract requirement D-13)

**Where:** `FF-backend/app/schemas.py`:
```python
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: EmailStr
    account_type: str
    created_at: datetime
```

**Why it matters.** `GET /auth/me` is the frontend's only session-rehydration call. Without `is_admin` it cannot decide whether to render the admin route, and without `restaurant_id` it cannot decide whether to show the restaurant dashboard — it would need extra round trips on every page load just to pick a layout.

**Fix.** Add a property to `User` in `app/models.py`, next to the existing `restaurant` relationship:
```python
@property
def restaurant_id(self) -> int | None:
    return self.restaurant.id if self.restaurant else None
```
The `restaurant` relationship already exists with `uselist=False`, so this works as-is.

Then extend the schema:
```python
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: EmailStr
    account_type: str
    is_admin: bool
    restaurant_id: int | None
    created_at: datetime
```

**Watch the extra query.** `restaurant_id` lazy-loads the relationship on every serialisation. `GET /auth/me` returns one user so it's one extra query — acceptable. Do not reuse `UserOut` in any list endpoint without adding `joinedload(User.restaurant)`.

**Verify:** `GET /auth/me` returns both fields; `restaurant_id` is `null` for a fresh user and an integer after applying.

---

## BE-18 — BLOCKER — `OrderOut` gains `customer_email` (contract requirement D-15)

**Where:** `FF-backend/app/schemas.py`, `class OrderOut`, and `FF-backend/app/models.py`, `class Order`.

**Why it matters.** `FF/src/pages/RestaurantDashboard.tsx` renders `{order.customerEmail}` in its Recent Orders list. Without this field the restaurant has no way to identify who is collecting the food.

**Fix.** Add a property to `Order` in `app/models.py`, alongside `listing_title` / `restaurant_name` / `pickup_window`:
```python
@property
def customer_email(self) -> str:
    return self.customer.email
```
The `customer` relationship already exists. Then add `customer_email: EmailStr` to `OrderOut`.

**Add eager loading with it** — see `BE-23`. This property is the third lazy-load on `OrderOut` and list endpoints will now fire four queries per row without it.

**Verify:** `GET /restaurants/me/orders` returns `customer_email` on every row.

---

## BE-19 — BLOCKER — `GET /orders/me` (contract requirement)

**Where:** `FF-backend/app/routers/orders.py` — the endpoint does not exist.

**Why it matters.** There is currently **no way for a customer to list their own orders**. The router has `/orders/{id}` and `/restaurants/me/orders`, but nothing customer-scoped. `GET /payments/history` returns payments, not orders. The frontend's order history and the post-payment confirmation flow both need this.

**Fix.** Add to `app/routers/orders.py`, **declared before `read_order`** so the literal `me` isn't matched against `{order_id}: int`:

```python
@router.get("/orders/me", response_model=list[OrderOut])
def read_my_orders(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return (
        db.query(Order)
        .options(
            joinedload(Order.listing).joinedload(Listing.restaurant),
            joinedload(Order.customer),
        )
        .filter(Order.customer_user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
```

**Verify:** place an order as user A, then `GET /orders/me` as A (returns it) and as B (returns `[]`).

---

## BE-20 — BLOCKER — `GET /orders/by-session/{session_id}` (contract requirement D-17)

**Where:** `FF-backend/app/routers/orders.py` — the endpoint does not exist.

**Why it matters.** Stripe redirects the customer to `{FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`. The browser has only that session ID — it has never seen the internal integer order ID that `GET /orders/{id}` requires. Without this endpoint the success page cannot show the customer what they just bought.

**Fix.** Add to `app/routers/orders.py`, **before `read_order`**:

```python
@router.get("/orders/by-session/{session_id}", response_model=OrderOut)
def read_order_by_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payment = (
        db.query(Payment).filter(Payment.stripe_checkout_session_id == session_id).first()
    )
    if payment is None or payment.order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if payment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your order")
    return payment.order
```

The ownership check is not optional — Stripe session IDs appear in URLs, browser history, and referrer headers.

**Verify:** create an order, take the `session_id` from the response, and confirm the lookup returns the same order for its owner and `403`s for anyone else.

---

## BE-21 — BLOCKER — `GET /restaurants/pending` for admin review (contract requirement D-14)

**Where:** `FF-backend/app/routers/restaurants.py` — the endpoint does not exist.

**Why it matters.** `POST /restaurants/{id}/approve` exists, but an admin has **no way to discover the ID to approve**. `GET /restaurants` filters to `status == "approved"`, so pending applications are invisible through the API. The approval flow is unreachable even for a correctly provisioned admin.

**Fix.** Add to `app/routers/restaurants.py`. **Declaration order matters** — this must come before `@router.get("/{restaurant_id}")`, or FastAPI tries to parse `pending` as an `int` and returns `422`:

```python
@router.get("/pending", response_model=list[RestaurantOut])
def list_pending(
    admin: User = Depends(get_current_admin), db: Session = Depends(get_db)
):
    return (
        db.query(Restaurant)
        .filter(Restaurant.status == "pending")
        .order_by(Restaurant.created_at)
        .all()
    )
```

While in this file, confirm the whole ordering is correct: `/apply`, `/me`, `/pending`, `/me/listings`, `/me/orders` must all precede `/{restaurant_id}`.

**Verify:** apply as a restaurant, then `GET /restaurants/pending` as a non-admin (`403`) and as an admin (returns the application).

---

## BE-22 — BLOCKER — Bootstrap the first admin (contract requirement D-14)

**Where:** nothing implements this. `FF-backend/app/models.py` documents the dead end:
```python
# No self-serve way to become an admin yet - flip this manually in the DB for now
is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
```

**Why it matters.** Trace the cold start on a fresh Railway database:

1. Migrations run, tables empty. Zero users, therefore zero admins.
2. A restaurant signs up and applies → `status='pending'`.
3. Approval requires an admin. There are none, and no code path creates one.
4. `get_current_restaurant` 403s → no listings can be created.
5. `GET /listings` filters to approved → returns `[]` forever.

**The product is non-functional on day one** until someone opens a Postgres shell.

**Fix.** New Alembic revision in `FF-backend/alembic/versions/`, generated with `alembic revision -m "bootstrap the first admin"` so the revision ID and `down_revision` are wired correctly:

```python
"""bootstrap the first admin

Revision ID: <generated>
Revises: a9815aa986a0
"""
import os
from alembic import op
import sqlalchemy as sa

revision = '<generated>'
down_revision = 'a9815aa986a0'


def upgrade() -> None:
    email = os.environ.get("BOOTSTRAP_ADMIN_EMAIL")
    if not email:
        return  # no-op when unset, so local dev and CI are unaffected
    op.execute(
        sa.text("UPDATE users SET is_admin = true WHERE email = :email")
        .bindparams(email=email.lower())
    )


def downgrade() -> None:
    email = os.environ.get("BOOTSTRAP_ADMIN_EMAIL")
    if email:
        op.execute(
            sa.text("UPDATE users SET is_admin = false WHERE email = :email")
            .bindparams(email=email.lower())
        )
```

`.lower()` matches the normalisation from `BE-16`.

**Deploy sequence matters and must be documented in the README:**
1. Deploy. Migration runs as a no-op (variable unset, or no matching user).
2. Register your admin account through the normal signup flow.
3. Set `BOOTSTRAP_ADMIN_EMAIL` on the Railway service.
4. **Alembic will not re-run an applied revision.** Either run `alembic downgrade -1 && alembic upgrade head` from a Railway shell, or run the one-line `UPDATE` directly. Add a note to the README saying so — this trips everyone.

**Verify locally:** register a user, set the env var, run `alembic downgrade -1 && alembic upgrade head`, and confirm `GET /auth/me` reports `is_admin: true`.

---

## BE-3 — HIGH — Oversell race condition in `place_order`

**Where:** `FF-backend/app/routers/orders.py`:
```python
if listing.quantity_available < payload.quantity:
    raise HTTPException(status_code=400, detail="Not enough stock available")

customer_id = _get_or_create_stripe_customer(current_user, db)

listing.quantity_available -= payload.quantity
```

**Why it matters.** Three distinct problems.

**(a) Read-then-write race.** Two customers buy the last item within milliseconds. Both `SELECT` and see `quantity_available = 1`. Both pass the check. Both decrement to `0`. Both get charged. One arrives at the restaurant and there is no food.

Postgres's default `READ COMMITTED` does not prevent this. There is no `SELECT ... FOR UPDATE`, no version column, and no `CHECK (quantity_available >= 0)` backstop. Surplus-food listings are low-quantity, time-boxed, and hit hard the moment they appear — this is not theoretical.

**(b) `_get_or_create_stripe_customer` commits mid-transaction.** In `app/routers/payments.py`:
```python
def _get_or_create_stripe_customer(user: User, db: Session) -> str:
    if user.stripe_customer_id:
        return user.stripe_customer_id
    customer = stripe.Customer.create(email=user.email, name=user.username)
    user.stripe_customer_id = customer.id
    db.commit()          # commits the ENTIRE session, not just the user row
    return customer.id
```
`db.commit()` ends the transaction. For a first-time buyer the transaction boundary lands in the middle of the stock check, and the `db.rollback()` in the exception handler can only unwind to *after* that commit. Calling it before the decrement does not make it safe — it makes the function non-atomic.

**(c) Stock is held from session creation, released only by webhook.** The decrement happens before payment. Release happens only in the `checkout.session.expired` handler. If that event isn't subscribed, or delivery fails past Stripe's retry window, **that inventory is gone permanently** with no reconciliation.

**Fix.**

Lock the row. Replace the listing fetch:
```python
from sqlalchemy import select

listing = db.execute(
    select(Listing).where(Listing.id == payload.listing_id).with_for_update()
).scalar_one_or_none()
```
`with_for_update()` emits `SELECT ... FOR UPDATE`, blocking a concurrent transaction until this one commits or rolls back. The second buyer then sees the true value and gets a clean `400`.

Add a database backstop in a new Alembic migration:
```python
op.create_check_constraint(
    "ck_listings_quantity_non_negative", "listings", "quantity_available >= 0"
)
```

Hoist the Stripe customer out of the order transaction. Cleanest is to create it at registration in `app/routers/auth.py`. If you keep it lazy, it must run in its own session before the order transaction opens.

Add a reconciliation job for stranded stock: find `Payment` rows `status='pending'` older than 24 hours, query the Stripe API for the true session state, release stock for expired ones. Webhooks are best-effort; a payment system that learns state only from webhooks will drift.

**Verify:** with a listing at `quantity_available = 1`, fire two concurrent `POST /orders`. Exactly one should get `201`, the other `400`. Without the lock, both get `201`.

---

## BE-4 — HIGH — `POST /payments/checkout-session` lets the client set its own price

**Where:** `FF-backend/app/routers/payments.py`, and `app/schemas.py`:
```python
class CheckoutSessionCreate(BaseModel):
    amount: int = Field(gt=0, description="Amount in the smallest currency unit, e.g. cents")
```
flowing into Stripe as `"unit_amount": payload.amount`.

**Why it matters.** Any authenticated user can `POST {"amount": 1}` and create a legitimate signed Stripe session for one cent with a description of their choosing. The `Payment` row records the attacker-chosen amount as though it were real.

It has `order_id = None`, so it doesn't currently grant goods. But it is a live "name your own price" endpoint on a payments API, it pollutes your Stripe dashboard, and repeated cheap session creation is the standard **card-testing** signature that gets Stripe accounts flagged. `orders.py` already implements the correct pattern, deriving `unit_amount` from `listing.discounted_price` server-side.

**Fix — delete it (D-18).** Remove `create_checkout_session` from `app/routers/payments.py`, and remove `CheckoutSessionCreate` and `CheckoutSessionOut` from `app/schemas.py`. Keep the router for `/payments/webhook` and `/payments/history`.

Keep `_get_or_create_stripe_customer` — `orders.py` imports it.

**Verify:** `POST /payments/checkout-session` returns `404`, and `POST /orders` still works.

---

## BE-5 — HIGH — No `pool_pre_ping`, guaranteed intermittent 500s on Railway

**Where:** `FF-backend/app/database.py`:
```python
engine = create_engine(settings.database_url)
```

**Why it matters.** SQLAlchemy's default pool holds connections indefinitely and hands them out without checking liveness. Railway's Postgres closes idle connections server-side and its networking layer drops idle TCP. So:

1. Traffic goes quiet overnight; pooled connections sit idle.
2. Postgres or the network closes them. SQLAlchemy doesn't know.
3. The first request next morning checks out a dead connection.
4. `psycopg2.OperationalError: server closed the connection unexpectedly` → unhandled → **500**.
5. That connection is discarded; the next request works fine.

Classic signature: the first request after any quiet period fails, a refresh fixes it, and it never reproduces in testing because you're always actively hitting it.

Related: Railway caps `max_connections` (often 100, lower on hobby tiers). SQLAlchemy's default `pool_size=5, max_overflow=10` is 15 per process. Uvicorn without `--workers` is one process, so you're fine today — but `--workers 4` would be 60 connections from one service.

**Fix.**
```python
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,   # cheap SELECT 1 before handing out a connection; transparently
                          # replaces dead ones instead of surfacing OperationalError
    pool_recycle=280,     # retire connections before typical 300s idle timeouts
    pool_size=5,
    max_overflow=5,
    echo=False,
)
```

While in this file, make the rollback explicit in `get_db`:
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
```
`close()` already discards the transaction, so this is belt-and-braces — but it makes the intent obvious.

---

## BE-6 — HIGH — A `%` in the database password breaks the entire deploy

**Where:** `FF-backend/alembic/env.py`:
```python
config.set_main_option("sqlalchemy.url", settings.database_url)
```

**Why it matters.** Alembic's config is backed by `configparser`, which performs **`%`-interpolation**. Railway URL-encodes generated Postgres passwords into `DATABASE_URL`. If one contains a `%` sequence, interpolation raises:
```
configparser.InterpolationSyntaxError: '%' must be followed by '%' or '(', found: '%3D...'
```

Then trace `FF-backend/Procfile`:
```
web: alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
The `&&` means a failed migration prevents uvicorn from ever starting. Railway restarts, it fails identically — **crash loop with zero availability**. The error names `configparser` and says nothing about passwords, so it reads as an Alembic bug.

Whether it fires depends on the password Railway happens to generate. It may never happen. When it does it's a total outage during a deploy.

**Fix.** Bypass configparser entirely. In `alembic/env.py`, delete the `set_main_option` line and rewrite `run_migrations_online`:

```python
from sqlalchemy import create_engine

def run_migrations_online() -> None:
    connectable = create_engine(settings.database_url, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()
```

Also fix the offline path, which reads the same interpolated option:
```python
def run_migrations_offline() -> None:
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()
```

This reads straight from pydantic settings with no interpolation anywhere. The dummy `sqlalchemy.url` in `alembic.ini` becomes unused — leave it, it's harmless.

**Verify:** set `DATABASE_URL` to a URL with a `%25` in the password and confirm `alembic upgrade head` runs.

---

## BE-23 — HIGH — N+1 queries on every list endpoint

**Where:** the denormalised properties in `FF-backend/app/models.py`:
```python
class Listing:
    @property
    def restaurant_name(self) -> str:
        return self.restaurant.name        # lazy-loads per row

class Order:
    @property
    def listing_title(self) -> str: return self.listing.title
    @property
    def restaurant_name(self) -> str: return self.listing.restaurant.name
    @property
    def pickup_window(self) -> str: return self.listing.pickup_window
    @property
    def customer_email(self) -> str: return self.customer.email    # added by BE-18
```
consumed by `app/routers/listings.py` (`list_listings`, `read_my_listings`) and `app/routers/orders.py` (`read_my_restaurant_orders`, plus the new `read_my_orders`).

**Why it matters.** `GET /listings` with 200 listings fires 1 query for the listings plus 200 for restaurant names. `GET /restaurants/me/orders` is worse — each row lazy-loads `listing`, then `listing.restaurant`, then `customer`. That's up to 3 extra queries per order.

This is invisible with the four mock listings and becomes a timeout at real scale. It also multiplies against `BE-5`'s connection pool.

**Fix.** Eager-load on every list endpoint. In `app/routers/listings.py`:
```python
from sqlalchemy.orm import joinedload

@router.get("/listings", response_model=list[ListingOut])
def list_listings(db: Session = Depends(get_db)):
    return (
        db.query(Listing)
        .options(joinedload(Listing.restaurant))
        .join(Restaurant)
        .filter(Restaurant.status == "approved")
        .all()
    )
```
Same `.options(joinedload(Listing.restaurant))` on `read_my_listings`.

In `app/routers/orders.py`, for `read_my_restaurant_orders` and `read_my_orders`:
```python
.options(
    joinedload(Order.listing).joinedload(Listing.restaurant),
    joinedload(Order.customer),
)
```

**Verify:** set `echo=True` on the engine temporarily, hit `GET /listings` with several listings across two restaurants, and count the emitted `SELECT`s. You want one or two, not one per row.

---

## BE-7 — MEDIUM — An empty `STRIPE_WEBHOOK_SECRET` fails silently and strands paid orders

**Where:** `FF-backend/app/routers/payments.py`:
```python
try:
    event = stripe.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
except (ValueError, stripe.SignatureVerificationError):
    raise HTTPException(status_code=400, detail="Invalid webhook payload")
```
with `stripe_webhook_secret: str = ""` in `app/config.py`.

**Why it matters.** With an empty secret, **every** webhook fails verification and returns `400`. The cascade is silent:

- `Payment.status` never leaves `'pending'`.
- `Order.status` never leaves `'pending_payment'`.
- The customer's card **is charged** — Stripe captured it; only your bookkeeping failed.
- The restaurant never sees the order.
- Stock stays decremented (`BE-3c`) and is never released.
- Stripe retries for ~3 days, then marks the endpoint failing.

Nothing logs an error. From inside the app it looks like nobody is buying anything.

**Fix.** `BE-1` fixes the root cause by making the secret required at boot. Then add observability and idempotency.

Split the exception handling so a misconfiguration is distinguishable from garbage:
```python
import logging
logger = logging.getLogger(__name__)

try:
    event = stripe.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
except ValueError:
    logger.warning("Stripe webhook: malformed payload")
    raise HTTPException(status_code=400, detail="Invalid webhook payload")
except stripe.SignatureVerificationError:
    # Almost always a misconfigured STRIPE_WEBHOOK_SECRET, not an attack.
    logger.error("Stripe webhook signature verification FAILED - check STRIPE_WEBHOOK_SECRET")
    raise HTTPException(status_code=400, detail="Invalid webhook signature")
```

**Add idempotency — this one is a real bug.** Stripe guarantees at-least-once delivery; the same event *will* arrive twice. The `completed` branch is idempotent by luck (setting `status = "succeeded"` twice is harmless). The `expired` branch is **not**:
```python
payment.order.listing.quantity_available += payment.order.quantity
```
A duplicate expiry event **increments stock twice**, inventing inventory that does not exist. Guard on the current status:
```python
elif event_type in ("checkout.session.expired", "checkout.session.async_payment_failed"):
    payment = db.query(Payment).filter(Payment.stripe_checkout_session_id == data["id"]).first()
    if payment and payment.status == "pending":       # only act on the first delivery
        payment.status = "failed"
        if payment.order and payment.order.status == "pending_payment":
            payment.order.status = "payment_failed"
            payment.order.listing.quantity_available += payment.order.quantity
        db.commit()
```
Apply the same `payment.status == "pending"` guard to the `completed` branch for symmetry.

For full safety, add a `processed_stripe_events` table keyed on the Stripe event ID and short-circuit on any ID already seen.

**Verify:** use the Stripe CLI — `stripe listen --forward-to localhost:8000/payments/webhook`, then `stripe trigger checkout.session.completed`. Replay the same expiry event twice and confirm stock increments only once.

---

## BE-8 — MEDIUM — No Python version pin

**Where:** `FF-backend/` has no `.python-version`, no `runtime.txt`, no `requires-python`. The local venv is **Python 3.12.10**.

**Why it matters.** Nixpacks picks its own default when nothing is specified, and that default changes over time. You deploy an interpreter nobody tested against, and it can change between two deploys of identical code.

Concrete risks: `psycopg2-binary==2.9.12` and `greenlet==3.5.3` are C extensions shipping prebuilt wheels per Python version. On a version without a matching wheel, pip builds from source, needs `libpq-dev` and `gcc`, and **the build fails** with a compiler error that looks nothing like a version problem.

**Fix.** Create `FF-backend/.python-version`:
```
3.12
```
Optionally also `pyproject.toml`:
```toml
[project]
requires-python = ">=3.12,<3.13"
```
Update the Setup section of `FF-backend/README.md`, which currently says `python -m venv venv` with no version.

---

## BE-9 — MEDIUM — Migrations run on every container start

**Where:** `FF-backend/Procfile`, documented as intentional in the README.

**Why it matters.** Fine at one replica. Three things to know:

1. **Multiple replicas race.** Two instances run `alembic upgrade head` simultaneously. Alembic locks `alembic_version`, so usually one wins — but a slow migration or DDL outside the transaction can deadlock, and the loser fails to boot.
2. **A failed migration is a full outage.** The `&&` means uvicorn never starts. No "keep serving the old version while we investigate."
3. **Every restart re-runs it.** A no-op when up to date, but a database round-trip on every cold start.

**Fix — short term: leave it.** It's pragmatic and documented. Just know the constraint: **do not scale beyond one replica** without changing this.

**When you scale**, move it to Railway's Pre-Deploy Command (Service Settings → Deploy):
- Pre-deploy: `alembic upgrade head`
- Procfile: `web: uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Revisit `BE-5`'s pool sizing at the same time.

---

## BE-10 — MEDIUM — `allow_credentials=True` with bearer-token auth

**Where:** `FF-backend/app/main.py`, `allow_credentials=True`.

**Why it matters.** This tells browsers to include cookies and HTTP auth on cross-origin requests. Your API uses none — auth is a bearer token in the `Authorization` header via `OAuth2PasswordBearer`, unaffected by this setting.

It buys nothing and costs two things:
1. It converts a CORS misconfiguration from "blocked" into "exploitable." A malicious origin slipping through the allowlist could make authenticated requests with ambient credentials. Given `BE-2`'s fragility, that raises the stakes on the origin list.
2. It conflicts with `allow_headers=["*"]` — the CORS spec forbids the wildcard in credentialed responses.

**Fix.** Already covered by `BE-2`'s middleware rewrite: `allow_credentials=False`. Confirm the frontend does not use `credentials: 'include'` (per **D-9**, it does not).

---

## BE-11 — LOW — No dedicated health endpoint

**Where:** `FF-backend/app/main.py`, only `GET /`.

**Why it matters.** Railway will use `/` and it returns `200` — but it's a **liveness** check that touches nothing. It returns `200` when the process is up even if the database is unreachable, which is exactly the state `BE-1`'s old `database_url` default could produce. Railway would report healthy while every real request 500s.

**Fix.**
```python
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import get_db

@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok"}
```
If the database is down the dependency raises and this returns `500` — what a healthcheck should do. Set Railway's Healthcheck Path to `/health` explicitly. Keep `/` as a cheap liveness ping.

---

## BE-12 — LOW — Swagger UI is public on the deployed API

**Where:** `FF-backend/app/main.py`, `app = FastAPI(title="FreshForward API")`. FastAPI enables `/docs`, `/redoc`, and `/openapi.json` by default.

**Why it matters.** Anyone can enumerate the full API surface including admin endpoints and exact schemas. Not a vulnerability — your authorization checks are what protect those endpoints, and they're sound — but it hands an attacker an accurate map for free.

**Fix (D-22).** `BE-1` adds `environment` to settings. Then:
```python
_is_prod = settings.environment == "production"
app = FastAPI(
    title="FreshForward API",
    docs_url=None if _is_prod else "/docs",
    redoc_url=None if _is_prod else "/redoc",
    openapi_url=None if _is_prod else "/openapi.json",
)
```
Set `ENVIRONMENT=production` on Railway. Note this hides docs from your own team too.

---

## BE-13 — LOW — Cancelling a paid order does not refund it

**Where:** `FF-backend/app/routers/orders.py`, in `update_order_status` — the code says so itself:
```python
if payload.status == "cancelled":
    # Return the reserved stock. Note: this does NOT refund the Stripe payment automatically -
    # that still needs a manual/future stripe.Refund.create call.
    order.listing.quantity_available += order.quantity
```

**Why it matters.** A restaurant cancels a `paid` order (an allowed transition). Stock returns, the order shows `cancelled`, and the customer's money stays with you. There's no queue, no flag, and no report of orders in this state, so nobody finds them until a customer complains or files a chargeback — which costs a fee on top of the refund and counts against your Stripe account health.

**Fix (D-21) — a failed refund blocks the cancellation.**
```python
if payload.status == "cancelled":
    if order.status == "paid" and order.payment and order.payment.stripe_payment_intent_id:
        try:
            stripe.Refund.create(payment_intent=order.payment.stripe_payment_intent_id)
            order.payment.status = "refunded"
        except stripe.StripeError:
            logger.exception("Refund failed for order %s - needs manual intervention", order.id)
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Could not process the refund; order not cancelled. Please retry.",
            )
    order.listing.quantity_available += order.quantity
```
Note the refund is attempted **before** the stock is returned, so a 502 leaves both money and stock untouched. `Payment.status` already documents `"refunded"` in its value set.

---

## BE-14 — LOW — No tests, no CI

**Where:** no `tests/`, no `pytest` in `requirements.txt`, no `.github/workflows/`.

**Why it matters.** The backend has real logic worth protecting: the transition table, ownership checks, the approved-only gate, and the webhook state machine. All verified by nothing. Both READMEs mandate PR review as the only gate, and human review does not catch a broken status transition.

**Fix.** Add `requirements-dev.txt` with `pytest`, `httpx`, `pytest-asyncio`. Start with the highest-value cases:

1. The `_ALLOWED_TRANSITIONS` matrix — every legal and illegal transition.
2. Ownership — restaurant A cannot read or mutate restaurant B's listings and orders.
3. `get_current_restaurant` 403s for `pending` and `rejected`.
4. **Duplicate webhook delivery** of `checkout.session.expired` — the `BE-7` double-increment.
5. **Concurrent `place_order`** on the last unit — the `BE-3` race.
6. `derive_username` collision handling from `BE-16`.

FastAPI's `TestClient` plus a throwaway Postgres fixture makes these cheap. Then a GitHub Actions workflow running `pytest` on every PR.

---
---

# 5. `FF/` work items

Owner: the **`FF/`** session. Every item is single-repo. Order given in §8.

---

## FE-1 — BLOCKER — No `vercel.json`, SPA fallback unverified

**Where:** `FF/` contains no `vercel.json`. The app uses `BrowserRouter` in `FF/src/App.tsx`. `npm run build` emits a flat `dist/` with only `index.html`, `assets/index-*.js`, `assets/index-*.css`, and the two copied `public/` JPEGs.

**Why it matters.** With `BrowserRouter`, `/browse` is a real HTTP path. There is no `dist/browse/index.html`. A request that reaches the server for `/listings` — which happens on **direct link, page refresh, and every Stripe redirect** — asks Vercel for a file that doesn't exist. Without a rewrite, Vercel returns its 404 and React Router never runs.

Vercel's Vite preset *usually* installs the fallback, so this may work by default. "Usually" is not good enough for the path a paying customer returns to from Stripe.

**Fix.** Create `FF/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/index.html",
      "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

A **rewrite** (not a redirect) serves `index.html` while preserving the URL, which is what a SPA needs. The caching rules matter: Vite's hashed asset names are immutable and should cache forever; `index.html` must never cache or users get stale bundles after a deploy.

**Vercel project settings:** Framework Preset `Vite`, Build Command `npm run build`, Output Directory `dist`, Install Command `npm install`. Root Directory stays empty — `FF/` is its own repo, not a monorepo subfolder.

**Verify after deploy:**
```bash
curl -I https://<domain>/listings
curl -I https://<domain>/payment/success
```
Both must return `200`, not `404`.

---

## FE-14 — BLOCKER — Align `src/types/index.ts` with the contract

**Where:** `FF/src/types/index.ts`.

**Why it matters.** Every other frontend item depends on these types. Do this **first** — `tsc -b` will then point you at every call site that needs updating, which turns the rest of the integration into a guided walk rather than a hunt.

**Fix.** Replace the file with the frozen definition in **§3.1**. The changes are:
- `RestaurantStatus` gains `'rejected'`.
- New `OrderStatus` union.
- `CurrentUser` gains `id`, `username`, `isAdmin`; `restaurantId` becomes `string | null`.
- `Listing` gains `createdAt`.
- `Restaurant` gains `rejectionReason`.
- `Order` gains `quantity`, `status`, `createdAt`; keeps `customerEmail`.

**Verify:** `npm run build` fails loudly with type errors at every call site that needs work. That's the expected state — those errors are your to-do list for `FE-13` through `FE-20`.

---

## FE-13 — BLOCKER — Rewrite `src/lib/api.ts` against the live API

**Where:** `FF/src/lib/api.ts` — the entire file. Every exported function operates on module-level arrays:
```ts
let listingsDb: Listing[] = [...initialListings]
let ordersDb: Order[] = [...initialOrders]
let restaurantsDb: Restaurant[] = [...initialRestaurants]
```
And `FF/src/lib/config.ts` declares a base URL that **nothing imports**:
```ts
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? ''
```

**Why it matters.** There is no `fetch` to your own API anywhere in the frontend. The only network calls are to `nominatim.openstreetmap.org`. This is the item that turns two deployments into a product.

**Fix.** Implement exactly the surface in **§3.2**, against the contract in **§2**.

**Step 1 — harden `config.ts`:**
```ts
const raw = import.meta.env.VITE_API_URL ?? ''
// Defensive: a trailing slash produces "//listings", which some proxies treat as a distinct path.
export const API_BASE_URL: string = raw.replace(/\/+$/, '')

if (import.meta.env.PROD && !API_BASE_URL) {
  console.error('VITE_API_URL is not set. All API calls will fail.')
}
```

**Step 2 — the request helper:**
```ts
import { API_BASE_URL } from './config'

const TOKEN_KEY = 'ff-auth-token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function extractDetail(body: unknown, status: number): string {
  const d = (body as { detail?: unknown })?.detail
  if (typeof d === 'string') return d
  if (Array.isArray(d)) return d.map((e) => (e as { msg?: string })?.msg ?? 'Invalid input').join(', ')
  return `Request failed (${status})`
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const isForm = init.body instanceof URLSearchParams

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (res.status === 401) {
    setToken(null)                       // D-11: clear, do not redirect
    throw new ApiError(401, 'Your session has expired. Please sign in again.')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, extractDetail(body, res.status))
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
```

**Step 3 — wire types and mappers.** Declare the snake_case shapes from §2.2 as local `Wire*` interfaces, then:
```ts
const centsToDollars = (c: number) => c / 100
// D-2: Math.round is mandatory. 19.99 * 100 === 1998.9999999999998
const dollarsToCents = (d: number) => Math.round(d * 100)

function toListing(w: WireListing): Listing {
  return {
    id: String(w.id),
    restaurantId: String(w.restaurant_id),
    restaurantName: w.restaurant_name,
    title: w.title,
    description: w.description,
    originalPrice: centsToDollars(w.original_price),
    discountedPrice: centsToDollars(w.discounted_price),
    quantityAvailable: w.quantity_available,
    pickupWindow: w.pickup_window,
    createdAt: w.created_at,
  }
}

function toOrder(w: WireOrder): Order {
  return {
    id: String(w.id),
    listingId: String(w.listing_id),
    listingTitle: w.listing_title,
    restaurantName: w.restaurant_name,
    customerEmail: w.customer_email,
    pickupWindow: w.pickup_window,
    quantity: w.quantity,
    price: centsToDollars(w.price),
    status: w.status,
    createdAt: w.created_at,
  }
}

function toRestaurant(w: WireRestaurant): Restaurant {
  return {
    id: String(w.id),
    name: w.name,
    contactEmail: w.contact_email,
    address: w.address,
    description: w.description,
    status: w.status,
    rejectionReason: w.rejection_reason,
  }
}

function toCurrentUser(w: WireUser): CurrentUser {
  return {
    id: String(w.id),
    username: w.username,
    email: w.email,
    accountType: w.account_type,
    isAdmin: w.is_admin,
    restaurantId: w.restaurant_id === null ? null : String(w.restaurant_id),
  }
}

function fromListingInput(input: ListingInput) {
  return {
    title: input.title,
    description: input.description,
    original_price: dollarsToCents(input.originalPrice),
    discounted_price: dollarsToCents(input.discountedPrice),
    quantity_available: input.quantityAvailable,
    pickup_window: input.pickupWindow,
  }
}
```

**Step 4 — the functions.** Two that need care:

```ts
// D-8: register, then log in. Two calls, one token issuer.
export async function signup(email: string, password: string): Promise<CurrentUser> {
  await request<WireUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username: null }),
  })
  return login(email, password)
}

// D-6: the OAuth2 form field is named "username" but takes the email.
export async function login(email: string, password: string): Promise<CurrentUser> {
  const body = new URLSearchParams({ username: email, password })
  const token = await request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  setToken(token.access_token)
  return getCurrentUser()
}
```

```ts
// D-4: listing_id must be a NUMBER on the wire.
export async function placeOrder(listingId: string, quantity: number) {
  const w = await request<WireOrderCreate>('/orders', {
    method: 'POST',
    body: JSON.stringify({ listing_id: Number(listingId), quantity }),
  })
  return { order: toOrder(w.order), checkoutUrl: w.checkout_url, sessionId: w.session_id }
}
```

```ts
// Returns null rather than throwing, so callers can branch on "no restaurant yet".
export async function getMyRestaurant(): Promise<Restaurant | null> {
  try {
    return toRestaurant(await request<WireRestaurant>('/restaurants/me'))
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}
```

**Step 5 — delete `FF/src/lib/mockData.ts`** and its import. Leaving it means a future accidental import silently reintroduces fake listings and the two hardcoded pre-approved restaurants.

**What you can verify without a backend:** `npm run build` passes; every function returns the frozen types; no import of `mockData` remains; `Math.round` is present in `dollarsToCents`. Write a Vitest unit test for `dollarsToCents(19.99) === 1999` — that is the single highest-value test in the repo.

---

## FE-2 — HIGH — No auth token storage or session rehydration

**Where:** `FF/src/lib/AppContext.tsx`:
```ts
const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
```
and the mount effect, which fetches listings, orders, and restaurants but never restores a session. `FF/BACKEND_NEEDS.md` already flags this as *"not a deliberate design choice."*

**Why it matters.** `useState(null)` means the user is logged out on **every page load** — a refresh, a back-button remount, or a return from an external site.

That last one is fatal with `FE-16`. The Stripe flow is: your site → `checkout.stripe.com` → back to your site. That return is a **fresh page load**. The customer pays, comes back, and is logged out, so the success page cannot call any authenticated endpoint to confirm their order.

**Fix.** Covered structurally by `FE-15`; the key pieces:

```tsx
const [authLoading, setAuthLoading] = useState(true)

useEffect(() => {
  void (async () => {
    if (api.getToken()) {
      try {
        setCurrentUser(await api.getCurrentUser())
      } catch {
        api.setToken(null)      // expired or invalid; fall through as logged out
      }
    }
    setAuthLoading(false)
  })()
}, [])
```

**`authLoading` is not optional.** Without it, `Checkout.tsx` and `RestaurantDashboard.tsx` flash "Please log in" on every load for a logged-in user, and any redirect-on-unauthenticated guard (`FE-20`) bounces them to `/login` before rehydration finishes.

And:
```tsx
function logout() {
  api.setToken(null)
  setCurrentUser(null)
}
```

**Verify:** log in, hard-refresh, and confirm you stay logged in and no "please log in" flash occurs.

---

## FE-3 — HIGH — Demo credentials hint is rendered on the production login page

**Where:** `FF/src/pages/Login.tsx`:
```tsx
<p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
  Demo restaurant: <span className="font-medium">demo@restaurant.test</span> / any password
</p>
```
Unconditional — no environment check.

**Why it matters.** Every visitor is told, in a styled callout, that there is a demo account and **any password works**. Against the mock that is literally true — `api.ts`'s `login` ignores the password entirely. It broadcasts that your authentication is not real, on the page immediately before you ask for card details.

**Fix.** Delete the block. If you want it locally, gate it so Vite strips it from the production bundle:
```tsx
{import.meta.env.DEV && (
  <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
    Demo restaurant: <span className="font-medium">demo@restaurant.test</span> / any password
  </p>
)}
```
`import.meta.env.DEV` is `false` in production builds and dead-code elimination removes the whole block, so the string never ships.

Also confirm `demo@restaurant.test` and `bakery@restaurant.test` never reach the production database — they only exist in `mockData.ts`, which `FE-13` deletes.

**Verify:** `npm run build && grep -r "restaurant.test" dist/` returns nothing.

---

## FE-15 — BLOCKER — Restructure `AppContext`

**Where:** `FF/src/lib/AppContext.tsx`.

**Why it matters.** The current context holds global `orders` and `restaurants` arrays. Neither has a backing endpoint — there is no `GET /orders` in the API at all, and holding every restaurant's contact email and address in client state is the leak `BACKEND_NEEDS.md:164` flagged. Both must go, and every consumer rewired.

**Fix.** Implement exactly the shape in **§3.3**.

Key points:

**Listings load with error handling.** The current mount effect has no `.catch()` — with real `fetch` that means unhandled rejections and permanently empty state with no indication anything is wrong:
```tsx
const [listings, setListings] = useState<Listing[]>([])
const [listingsLoading, setListingsLoading] = useState(true)
const [listingsError, setListingsError] = useState<string | null>(null)

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
```
An explicit "can't reach the server" message beats a page silently showing zero listings, which users read as "there is no food available."

**`myRestaurant` loads only when the user owns one:**
```tsx
useEffect(() => {
  if (!currentUser?.restaurantId) {
    setMyRestaurant(null)
    return
  }
  void api.getMyRestaurant().then(setMyRestaurant).catch(() => setMyRestaurant(null))
}, [currentUser?.restaurantId])
```

**`placeOrder` returns the checkout URL** rather than an order:
```tsx
async function placeOrder(listingId: string, quantity: number) {
  const { checkoutUrl } = await api.placeOrder(listingId, quantity)
  return { checkoutUrl }
}
```

**Fix the `useMemo` dependency list.** The current one carries `// eslint-disable-next-line react-hooks/exhaustive-deps` and lists only state values, omitting the functions. Wrap the callbacks in `useCallback` and list them properly rather than suppressing the rule — with real async work behind them, a stale closure means a mutation applied against outdated state.

**Verify:** `npm run build` passes with no remaining references to `restaurants` or `orders` from the context.

---

## FE-17 — BLOCKER — Checkout redirects to Stripe

**Where:** `FF/src/pages/Checkout.tsx`:
```tsx
async function handleConfirm() {
  const order = await placeOrder(listingId)
  navigate(`/orders/${order.id}`)
}
```
and the price display:
```tsx
<dd>${listing.discountedPrice.toFixed(2)}</dd>
```

**Why it matters.** This treats the order as complete the instant the button is clicked. Against the real backend the order is created as `pending_payment` and nothing is paid until the customer completes Stripe checkout. As written, the customer would be sent to a confirmation page for an order they never paid for.

**Fix (D-16).**
```tsx
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState('')

async function handleConfirm() {
  setError('')
  setSubmitting(true)
  try {
    const { checkoutUrl } = await placeOrder(listingId, quantity)
    // Full page navigation - checkout.stripe.com is an external origin and
    // React Router cannot navigate there.
    window.location.href = checkoutUrl
  } catch (err) {
    setError(err instanceof ApiError ? err.message : 'Could not start checkout. Please try again.')
    setSubmitting(false)
  }
}
```

Do **not** clear `submitting` on success — the page is navigating away, and re-enabling the button invites a double-click that creates two orders and two Stripe sessions.

**Surface the stock error.** `POST /orders` returns `400 "Not enough stock available"` when someone else bought the last one first. The `catch` above renders it via `ApiError.message`, which is the correct behaviour — make sure the error is actually displayed in the JSX, not just stored in state.

**Add a quantity control.** The contract's `POST /orders` takes a quantity; the current page hardcodes one item implicitly. A simple number input bounded by `listing.quantityAvailable` is enough.

The `.toFixed(2)` call stays correct — `api.ts` converts cents to dollars per **D-1**.

**Verify:** `npm run build` passes; the confirm button disables on submit and does not re-enable on success.

---

## FE-16 — BLOCKER — Payment success and cancel pages

**Where:** `FF/src/App.tsx` declares no `/payment/success` or `/payment/cancel` route, and has no catch-all. The backend builds both URLs in `payments.py` and `orders.py`.

**Why it matters.** The customer completes payment on Stripe, is charged, and is redirected to a URL your app does not handle — a blank page or a hard 404. The payment succeeded and the webhook marked the order paid, but they see nothing. They will assume it failed and either retry or charge back.

**Fix.** Create `FF/src/pages/PaymentSuccess.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import * as api from '../lib/api'
import type { Order } from '../types'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [settled, setSettled] = useState(false)

  // The Stripe webhook is asynchronous and may not have landed when the browser
  // arrives here. Poll a few times before falling back to a softer message (D-17).
  useEffect(() => {
    if (!sessionId) { setSettled(true); return }
    let cancelled = false
    let attempts = 0

    const tick = async () => {
      attempts += 1
      try {
        const found = await api.getOrderBySession(sessionId)
        if (cancelled) return
        setOrder(found)
        if (found.status !== 'pending_payment') { setSettled(true); return }
      } catch {
        // 404 just means the webhook hasn't landed yet; keep trying.
      }
      if (cancelled) return
      if (attempts < 5) setTimeout(tick, 1500)
      else setSettled(true)
    }

    void tick()
    return () => { cancelled = true }
  }, [sessionId])

  const confirmed = order?.status && order.status !== 'pending_payment'

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-xl font-bold">Payment received</h1>
      <p className="mt-2 text-sm text-slate-600">
        {confirmed
          ? `Your order is confirmed. Pick up at ${order?.pickupWindow}.`
          : settled
            ? 'Your payment went through. Confirmation may take a few moments to appear in your orders.'
            : 'Confirming your order…'}
      </p>
      <Link to="/listings" className="mt-4 inline-block underline">Back to listings</Link>
    </div>
  )
}
```

Note this page requires a valid session (`getOrderBySession` is authenticated) — which is exactly why `FE-2` must land first.

Create `PaymentCancel.tsx` — a simple "payment cancelled, your order was not placed" page with a link back to `/listings`.

Register both in `FF/src/App.tsx`, inside the `<Layout />` group:
```tsx
<Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/cancel" element={<PaymentCancel />} />
```

**Verify:** `npm run build` passes; visiting `/payment/success` without a `session_id` renders the fallback copy rather than hanging or crashing.

---

## FE-19 — BLOCKER — Rewire OrderConfirmation and RestaurantDashboard

**Where:**
```tsx
// FF/src/pages/OrderConfirmation.tsx
const { orders } = useApp()
const order = orders.find((o) => o.id === orderId)
```
```tsx
// FF/src/pages/RestaurantDashboard.tsx
const { currentUser, restaurants, listings, orders, createListing, updateListing, deleteListing } = useApp()
const restaurant = restaurants.find((r) => r.id === currentUser.restaurantId)
const myListings = listings.filter((l) => l.restaurantId === restaurant.id)
const myOrders = orders.filter((o) => myListings.some((l) => l.id === o.listingId))
```

**Why it matters.** Both break at compile time once `FE-15` removes `orders` and `restaurants` from the context. Beyond that, the dashboard's client-side filtering is the shortcut `BACKEND_NEEDS.md` flagged twice — it works only because the mock hands every client every restaurant's data.

**Fix — `OrderConfirmation.tsx`:** fetch the single order by ID.
```tsx
const { orderId } = useParams<{ orderId: string }>()
const [order, setOrder] = useState<Order | null>(null)
const [error, setError] = useState('')
const [loading, setLoading] = useState(true)

useEffect(() => {
  if (!orderId) return
  void api.getOrder(orderId)
    .then(setOrder)
    .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load this order.'))
    .finally(() => setLoading(false))
}, [orderId])
```
Render distinct loading, error, and not-found states. The backend enforces ownership and returns `403` for someone else's order — surface that as "You don't have access to this order," not "Order not found."

Add `quantity`, `price`, and `status` to the rendered detail list; the contract now provides them.

**Fix — `RestaurantDashboard.tsx`:** use the scoped endpoints.
```tsx
const { currentUser, myRestaurant, createListing, updateListing, deleteListing } = useApp()
const [myListings, setMyListings] = useState<Listing[]>([])
const [myOrders, setMyOrders] = useState<Order[]>([])

useEffect(() => {
  if (myRestaurant?.status !== 'approved') return
  void api.getMyListings().then(setMyListings).catch(() => setMyListings([]))
  void api.getRestaurantOrders().then(setMyOrders).catch(() => setMyOrders([]))
}, [myRestaurant?.status])
```

**Handle all three statuses.** The current code branches only on `'pending'`. `'rejected'` now exists and carries a reason:
```tsx
if (myRestaurant.status === 'pending') return <PendingNotice />
if (myRestaurant.status === 'rejected') return <RejectedNotice reason={myRestaurant.rejectionReason} />
```

**Add order status controls.** `PATCH /orders/{id}/status` exists and the dashboard uses none of it. Render each order's status and offer the legal transitions only:

| Current status | Buttons to show |
|---|---|
| `pending_payment` | none — awaiting the customer's payment |
| `paid` | "Mark ready", "Cancel" |
| `ready` | "Mark picked up", "Cancel" |
| `picked_up`, `cancelled`, `payment_failed` | none — terminal |

Offering an illegal transition just produces a `400` the user cannot act on.

**Verify:** `npm run build` passes with no context references to `orders` or `restaurants`.

---

## FE-18 — BLOCKER — Admin approval page

**Where:** does not exist. `FF/src/App.tsx` declares no admin route.

**Why it matters.** Without it, approving a restaurant requires a Postgres shell. `BE-21` and `BE-22` make the operation *possible*; this makes it *operable*. See **D-14**.

**Fix.** Create `FF/src/pages/AdminRestaurants.tsx`:

```tsx
export default function AdminRestaurants() {
  const { currentUser, authLoading } = useApp()
  const [pending, setPending] = useState<Restaurant[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(() => {
    void api.getPendingRestaurants().then(setPending).catch(() => setPending([]))
  }, [])
  useEffect(load, [load])

  if (authLoading) return <p className="px-4 py-8">Loading…</p>
  if (!currentUser?.isAdmin) return <Navigate to="/" replace />

  async function approve(id: string) {
    setBusyId(id)
    try { await api.approveRestaurant(id); load() } finally { setBusyId(null) }
  }

  async function reject(id: string) {
    const reason = window.prompt('Reason for rejection?')
    if (!reason?.trim()) return
    setBusyId(id)
    try { await api.rejectRestaurant(id, reason.trim()); load() } finally { setBusyId(null) }
  }

  // ...render each pending restaurant with name, contact email, address,
  // description, and Approve / Reject buttons disabled while busyId matches.
}
```

`window.prompt` is crude but adequate for an internal tool — the backend requires a 1–500 character reason, so an empty submission must be blocked client-side.

Register in `App.tsx` inside the `<Layout />` group: `<Route path="/admin/restaurants" element={<AdminRestaurants />} />`.

**The `isAdmin` check here is convenience, not security** — the backend's `get_current_admin` is the real gate. Do not add a nav link for non-admins, but do not rely on hiding the link either.

**Verify:** `npm run build` passes; visiting `/admin/restaurants` as a non-admin redirects to `/`.

---

## FE-20 — BLOCKER — Route guards and the restaurant-apply flow

**Where:** `FF/src/App.tsx` — `/restaurant/apply`, `/restaurant/dashboard`, `/checkout/:listingId`, and `/orders/:orderId` are all declared without any auth gating. `RestaurantApply.tsx` calls `submitApplication` with no login check.

**Why it matters.** Per **D-12**, `POST /restaurants/apply` now requires authentication. An anonymous visitor filling in the whole application form and getting a `401` on submit — losing everything they typed — is the worst possible outcome for your highest-value conversion.

**Fix.** Add a guard component:
```tsx
function RequireAuth({ children }: { children: ReactNode }) {
  const { currentUser, authLoading } = useApp()
  const location = useLocation()
  if (authLoading) return null                       // FE-2: never redirect mid-rehydration
  if (!currentUser) {
    return <Navigate to="/signup" replace state={{ redirectTo: location.pathname }} />
  }
  return <>{children}</>
}
```
The `authLoading` check is load-bearing — without it, a logged-in user who refreshes on a protected page gets bounced to signup before `/auth/me` returns.

Wrap `/restaurant/apply`, `/restaurant/dashboard`, `/checkout/:listingId`, `/orders/:orderId`, and `/admin/restaurants`.

Send unauthenticated applicants to `/signup` rather than `/login` — they are new by definition. Both pages already read `location.state.redirectTo`.

**Wire up the signup account-type radio (D-10).** In `Signup.tsx`, drop `accountType` from the `signup()` call and use it only for routing:
```tsx
const user = await signup(email, password)
navigate(accountType === 'restaurant' ? '/restaurant/apply' : redirectTo || '/listings')
```
The radio stays as UI; it just no longer pretends to send a field the server ignores.

**Verify:** `npm run build` passes; logged out, visiting `/restaurant/apply` redirects to `/signup`.

---

## FE-7 — MEDIUM — No error boundary; one thrown render kills the whole page

**Where:** `FF/src/main.tsx` mounts `<App>` with no boundary; `FF/src/App.tsx` wraps everything in `<AppProvider>` and `<BrowserRouter>`, again with none.

**Why it matters.** React unmounts the entire tree when a render throws uncaught. The user gets a **blank white page** with no explanation and no recovery except editing the URL.

This matters much more with real API data. Places that will throw on shapes the mock guarantees but a server does not: `listing.discountedPrice.toFixed(2)` in `Checkout.tsx` and `RestaurantDashboard.tsx` throws `TypeError` if the field is `undefined` — exactly what an incomplete casing map produces. `useApp` throws by design outside a provider. `crypto.randomUUID()` in `address.ts` is undefined in non-secure contexts (fine on HTTPS, throws on plain-HTTP local network testing).

**Fix.** Create `FF/src/components/ErrorBoundary.tsx` — it must be a class component, React has no hook equivalent for `componentDidCatch`:

```tsx
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info)
    // Wire to Sentry or similar here.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-sm px-4 py-16 text-center">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600">
            Please refresh the page. If this keeps happening, let us know.
          </p>
          <button
            onClick={() => window.location.assign('/')}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-white"
          >
            Back to home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

Wrap the tree in `App.tsx`, outside `AppProvider` so a provider-level throw is caught too.

**Verify:** temporarily throw in a page component and confirm the fallback renders instead of a blank page.

---

## FE-4 — MEDIUM — 3.8 MB unoptimized hero image is your Largest Contentful Paint

**Where:**
- `FF/public/how-it-works-map.jpg` — **3,836,499 bytes**, referenced in `FF/src/pages/Landing.tsx` as `const howItWorksMapImage = '/how-it-works-map.jpg'` and rendered as `<img src={howItWorksMapImage} alt="" className="how-it-works-map-image" />`
- `FF/public/mission-section.jpg` — 346,155 bytes

Files in `public/` are copied verbatim by Vite — no compression, no hashing. Confirmed: `dist/how-it-works-map.jpg` is byte-identical.

**Why it matters.** Your entire JavaScript bundle is 332 KB (97 KB gzipped) and the CSS is 45 KB. This one decorative image is **11× the size of all your code combined**. On a median mobile connection that's roughly 3 seconds of transfer for an image marked `aria-hidden` with an empty `alt`.

It will be the LCP element for every first-time visitor on the page your marketing points at, and 3.8 MB will not pass Core Web Vitals. There is no `loading="lazy"`, so it competes with above-the-fold content.

**Fix.**
```bash
npx @squoosh/cli --webp '{"quality":80}' --resize '{"width":1600}' FF/public/how-it-works-map.jpg
```
Or use [squoosh.app](https://squoosh.app) manually. Target well under 200 KB. Do the same for `mission-section.jpg`.

Then serve modern formats with a fallback:
```tsx
<picture>
  <source srcSet="/how-it-works-map.webp" type="image/webp" />
  <img
    src="/how-it-works-map.jpg"
    alt=""
    aria-hidden
    loading="lazy"
    decoding="async"
    width={1600}
    height={900}
    className="how-it-works-map-image"
  />
</picture>
```
Explicit `width`/`height` reserve layout space and prevent the content shift that currently happens when the image loads (Cumulative Layout Shift is also a Core Web Vital). `loading="lazy"` is right here because it sits well below the fold — never lazy-load a genuinely above-the-fold hero, that delays LCP.

Consider moving both into `src/assets/` and importing them so Vite hashes the filenames. Files in `public/` keep stable names, so a future re-crop is served stale from browser caches.

**Verify:** re-run `npm run build` and check `dist/` file sizes.

---

## FE-5 — MEDIUM — 2.1 MB of tracked PNGs that nothing imports

**Where:** three files, all tracked in git:

| File | Size |
|---|---|
| `FF/src/assets/landing/illustration-app.png` | 715,433 bytes |
| `FF/src/assets/landing/illustration-customer.png` | 703,769 bytes |
| `FF/src/assets/landing/illustration-partner.png` | 729,670 bytes |

A grep across `FF/src` for `illustration-` returns zero matches outside the filenames.

**Why it matters.** Confirmed dead: the build reports `✓ 45 modules transformed` and emits **no image assets** into `dist/assets/`. If any were imported, Vite would emit a hashed copy.

They don't reach users, but they bloat every clone, CI checkout, and Vercel build fetch by 2.1 MB. And as binary blobs in git history, deleting them shrinks the working tree, not the history.

Worth confirming with whoever added them that no in-progress work depends on them — they look like intended landing illustrations superseded by the `public/*.jpg` files.

**Fix.**
```bash
cd FF
git rm src/assets/landing/illustration-app.png \
       src/assets/landing/illustration-customer.png \
       src/assets/landing/illustration-partner.png
```
If they *are* wanted, compress and convert to WebP first — 700 KB PNGs of illustration artwork are hugely oversized — then import them properly so Vite processes and hashes them.

---

## FE-6 — MEDIUM — Nominatim autocomplete violates OSM's usage policy

**Where:** `FF/src/lib/address.ts`:
```ts
const res = await fetch(
  `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&addressdetails=1&limit=6&countrycodes=us`,
  { headers: { 'Accept-Language': 'en' } },
)
```
plus `reverseGeocode` on the same host. Called from `FF/src/components/HeroAddressSearch.tsx` on a 300 ms debounce per keystroke.

**Why it matters.** The [OSM Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) explicitly lists **"auto-complete search"** as prohibited on the public endpoint, caps usage at 1 req/sec, and requires an identifying `User-Agent`. You violate all three — and browsers *forbid* setting `User-Agent` from `fetch`, so you structurally cannot comply.

Requests come from each user's own IP, so rate limiting degrades per-user rather than globally. But OSM blocks by `Referer` for abusive sites, and being blocked means your landing page's primary call-to-action silently returns empty results with no error state.

**Fix (D-23) — make the provider swappable, fix the hygiene now.**

In `FF/src/lib/address.ts`:
```ts
const GEOCODE_URL = (import.meta.env.VITE_GEOCODE_URL ?? 'https://nominatim.openstreetmap.org')
  .replace(/\/+$/, '')
const GEOCODE_KEY = import.meta.env.VITE_GEOCODE_KEY ?? ''

function geocodeParams(base: Record<string, string>): URLSearchParams {
  const p = new URLSearchParams(base)
  if (GEOCODE_KEY) p.set('key', GEOCODE_KEY)   // LocationIQ / Geoapify style
  return p
}
```
Switching to LocationIQ (Nominatim-compatible, 5k req/day free) then becomes two environment variables rather than a code change.

Then fix the request behaviour:

1. **Raise the debounce** in `HeroAddressSearch.tsx` from `300` to `600`. Autocomplete quality barely changes; request volume drops sharply.
2. **Add an `AbortController`.** There is none today, so responses can arrive out of order and a stale response can overwrite a newer one:
   ```ts
   export async function searchAddressSuggestions(
     query: string,
     signal?: AbortSignal,
   ): Promise<AddressSuggestion[]> {
     const res = await fetch(url, { headers: { 'Accept-Language': 'en' }, signal })
     ...
   }
   ```
   Abort the previous controller in `handleDraftChange` before starting a new request.
3. **Cache** in a module-level `Map<string, AddressSuggestion[]>`. Users backspace constantly and every one of those is currently a fresh call.
4. **Surface failures.** The function returns `[]` on a non-OK response, which the UI renders identically to "no matches." A rate-limited user sees "no results" for their real address and concludes the site is broken. Distinguish the two.

**Before any real marketing push**, switch providers. If you pick a keyed provider, either use HTTP-referrer restrictions (Mapbox and Google both support them — lock to your domain) or proxy through the backend, because a `VITE_*` key is embedded in the bundle and readable by anyone.

---

## FE-8 — LOW — Site title is misspelled "FreshFoward"

**Where:** `FF/index.html`:
```html
<title>FreshFoward</title>
```
Missing the `r` in "Forward."

**Why it matters.** This is the browser tab, the default bookmark name, and the `<title>` Google indexes as your search-result headline. One of the most-seen strings on the site.

**Fix.**
```html
<title>FreshForward — Surplus food from local restaurants</title>
```
Include the value proposition after the brand — search engines display roughly 50–60 characters and a bare brand name wastes that. Consider per-route titles later; every route currently shares this one.

---

## FE-9 — LOW — No favicon, no meta description, no Open Graph tags

**Where:** `FF/index.html` — the `<head>` has charset, viewport, title, and Google Fonts links, and nothing else. `FF/public/` contains only the two JPEGs; there is no favicon file.

**Why it matters.**
- **No favicon** → browsers request `/favicon.ico`, get your SPA fallback HTML (after `FE-1`), fail to parse it as an image, and show a blank tab icon.
- **No meta description** → Google invents a snippet by scraping page text, usually badly.
- **No OG tags** → sharing a link in iMessage, Slack, WhatsApp, or Discord renders a bare URL with no image, title, or description. For a consumer marketplace that spreads by word of mouth, that measurably reduces click-through.

**Fix.** Add `favicon.ico` and a 180×180 `apple-touch-icon.png` to `FF/public/`, then:

```html
<title>FreshForward — Surplus food from local restaurants</title>
<meta name="description" content="Buy great food from local restaurants at a discount, and help cut food waste. Browse surplus meals near you and pick up the same day." />
<meta name="theme-color" content="#059669" />

<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

<meta property="og:type" content="website" />
<meta property="og:title" content="FreshForward — Surplus food from local restaurants" />
<meta property="og:description" content="Buy great food from local restaurants at a discount, and help cut food waste." />
<meta property="og:image" content="https://<your-domain>/og-image.jpg" />
<meta property="og:url" content="https://<your-domain>" />
<meta name="twitter:card" content="summary_large_image" />
```

`og:image` must be an **absolute URL** — relative paths are ignored by every scraper. Make it 1200×630, under ~300 KB.

Separately: the Google Fonts `<link>` is render-blocking, adding a third-party round-trip before first paint. The `preconnect` hints help; self-hosting via `@fontsource/inter` would remove the dependency entirely. Low priority, but it's on the critical path.

---

## FE-10 — LOW — No catch-all route; unknown paths render blank

**Where:** `FF/src/App.tsx` declares 13 paths and no `path="*"`.

**Why it matters.** React Router renders `null` when nothing matches. Combined with `FE-1`'s rewrite — which correctly returns `index.html` with a `200` for every path — `/asdf`, `/listinsg` (typo), and any stale bookmark render a **completely blank page**. Not a 404, not a message. It also masks routing bugs in development: a typo'd `<Link to="...">` produces an empty page rather than an obvious error.

**Fix.** Add as the **last** child of `<Routes>`, inside the `<Layout />` group so the 404 keeps site navigation:
```tsx
<Route
  path="*"
  element={
    <Placeholder
      title="Page not found"
      description="We couldn't find that page. It may have moved, or the link may be out of date."
    />
  }
/>
```
`Placeholder` already exists. This returns HTTP 200 with 404 content — unavoidable for a client-rendered SPA and standard practice.

---

## FE-21 — LOW — `/browse` is a disconnected parallel storefront

**Where:** `FF/src/pages/Browse.tsx` — 76 KB. It imports only React, React Router, and `../lib/address`. It **never calls `useApp()`** and never touches `api.ts`. It contains its own hardcoded product catalogue, its own category taxonomy, its own `ProductCard`/`CartDropdown`/`ProductRow` components, and a **multi-item cart**.

`FF/src/components/HeroAddressSearch.tsx` routes there: `navigate('/browse')`.

**Why it matters.** Your landing page's primary call-to-action sends customers to a fully fake storefront modelling a different product than the backend implements. The backend has no cart — `POST /orders` takes one `listing_id` plus a quantity. Reconciling a multi-item grocery cart with a single-listing order model is a product redesign, not an integration task.

**Fix (D-19) — park it for launch.**
1. Change `HeroAddressSearch.tsx` to `navigate('/listings')`.
2. Leave the `/browse` route registered and reachable by direct URL. Do not delete the file — it represents real design work.
3. Make sure no navigation, footer link, or CTA points at `/browse`.

**Future work, out of scope here:** decide whether the FreshForward product is single-listing pickup orders (what the backend builds) or a multi-item cart (what `Browse.tsx` designs). That is a product decision, and the answer determines whether `Browse.tsx` gets wired up or `Listings.tsx` gets `Browse.tsx`'s visual design applied to it.

---

## FE-11 — LOW — Uncommitted change to `productscope.md`

**Where:** `git status` in `FF/` reports ` M productscope.md`.

**Why it matters.** Vercel builds from GitHub, not your working tree, so this doesn't affect the deploy. But local work exists that nobody else has, and `productscope.md` is the product source of truth referenced by `FF/CLAUDE.md` and `FF-backend/README.md`.

**Fix.** Review and either commit on a branch (per the PR workflow both READMEs mandate) or discard:
```bash
cd FF
git diff productscope.md
git checkout -b matthew/productscope-update
git add productscope.md && git commit -m "Update product scope"
git push -u origin matthew/productscope-update
```

---

## FE-12 — LOW — No tests, no CI

**Where:** `FF/package.json` defines `dev`, `build`, `lint`, `preview` — no `test`. No runner in `devDependencies`, no test files, no `.github/workflows/`. `FF/CLAUDE.md` states it: *"There is no test runner configured yet. `npm run build` is the gate."*

**Why it matters.** `tsc -b` catches type errors, which is real value, but it cannot catch the cents/dollars bugs from **D-1** — both sides are `number`, so TypeScript is blind to the unit. And because nothing runs on PRs, a change that breaks the build fails only once merged and Vercel tries to deploy it.

**Fix.** Create `FF/.github/workflows/ci.yml`:
```yaml
name: CI
on: [pull_request, push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```
That's most of the value for ten minutes, and it enforces what `CLAUDE.md` already says should happen.

Then add Vitest (it shares Vite's config) and cover the risky pure functions:
- `dollarsToCents(19.99) === 1999` and `centsToDollars` round-tripping — **the single highest-value test in the repo**
- The `toListing` / `toOrder` / `toCurrentUser` mappers from `FE-13`
- `formatAddressShort`, `saveAddressSelection`, and `loadSavedAddresses`'s validation branch in `address.ts`

---
---

# 6. Verified working — do not "fix" these

Recorded so nobody re-investigates.

**`FF/`**
- `npm run build` **passes clean** — `tsc -b` + `vite build`, 236 ms, 45 modules, 332 KB JS / 97 KB gzipped, 45 KB CSS. Run and confirmed during this audit.
- TypeScript is configured strictly and correctly: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, split project references.
- Tailwind v4 via the `@tailwindcss/vite` plugin — correct for v4; no `tailwind.config.js` needed.
- `node_modules` and `dist` correctly gitignored and untracked.
- All image assets **are** tracked in git — verified with `git ls-files`. Vercel will build with them present.
- `src/lib/api.ts` is well-designed as an integration seam: every function already has the async signature a real fetch wrapper needs, so `FE-13` is a contained rewrite of one file rather than an app-wide refactor.

**`FF-backend/`**
- `.env` is **untracked and gitignored**. No secrets in git history in either repo — verified with `git ls-files`.
- `venv/` and `__pycache__/` correctly gitignored and untracked.
- Alembic chain is **linear and single-headed**: `663b3dda8d27` (down_revision `None`) → `a9815aa986a0`. No merge revisions needed.
- `Procfile` binds `0.0.0.0:$PORT` correctly — the single most common Railway misconfiguration, and it's right.
- `DATABASE_URL` maps cleanly onto pydantic's `database_url`, so Railway's Postgres reference variable wires up with no code change.
- `requirements.txt` is **fully pinned** to exact versions.
- **Authorization logic is genuinely solid** where it exists:
  - Listing ownership enforced server-side in `_get_owned_listing`, closing the gap `BACKEND_NEEDS.md:139` warned about.
  - Order access limited to the customer or the owning restaurant in `read_order`, closing the `BACKEND_NEEDS.md:188` gap.
  - Approved-only gating in `get_current_restaurant`.
  - Order status transitions validated against an explicit whitelist rather than accepting arbitrary strings.
  - `RestaurantPublicOut` correctly omits `owner_user_id`, `contact_email`, and `rejection_reason`, addressing the leak at `BACKEND_NEEDS.md:164`.
- Password handling is correct: bcrypt with proper 72-byte truncation — a real footgun on newer bcrypt versions, handled properly.
- JWT expiry is set and enforced; `jwt.decode` validates `exp` by default.
- Order price is snapshotted at purchase time, so historical orders stay correct when a listing is edited.
- `place_order` correctly uses `db.flush()` rather than `commit()` before the Stripe call so a failure can roll back — the right instinct, undermined only by the mid-transaction commit in `BE-3b`.

---
---

# 7. Environment variables

## Railway (`FF-backend`)

| Variable | Required | Value | Notes |
|---|---|---|---|
| `DATABASE_URL` | **yes** | reference the Postgres plugin | Railway injects it; do not hand-copy |
| `SECRET_KEY` | **yes** | `python -c "import secrets; print(secrets.token_hex(32))"` | ≥32 chars, never the placeholder (`BE-1`) |
| `STRIPE_SECRET_KEY` | **yes** | `sk_test_...` then `sk_live_...` | Start with test keys |
| `STRIPE_WEBHOOK_SECRET` | **yes** | `whsec_...` | From the Stripe webhook endpoint you create (`BE-7`) |
| `FRONTEND_URL` | **yes** | `https://<vercel-domain>` | **No trailing slash** (`D-24`) |
| `EXTRA_CORS_ORIGINS` | no | comma-separated | Staging/custom domains (`BE-2`) |
| `ENVIRONMENT` | no | `production` | Hides Swagger (`BE-12`) |
| `BOOTSTRAP_ADMIN_EMAIL` | situational | your admin email | Set *after* registering (`BE-22`) |
| `ALGORITHM` | no | `HS256` | Safe default in code |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | no | `1440` | Safe default in code |

## Vercel (`FF`)

| Variable | Required | Value | Notes |
|---|---|---|---|
| `VITE_API_URL` | **yes** | `https://<railway-domain>` | **No trailing slash.** Set for Production, Preview, **and** Development |
| `VITE_GEOCODE_URL` | no | defaults to Nominatim | `D-23` |
| `VITE_GEOCODE_KEY` | no | provider API key | `D-23`; publicly readable — use referrer restrictions |

**`VITE_*` variables are embedded in the client bundle and publicly readable. Never put a secret in one.**

---
---

# 8. Fix order within each session

Each session works its own column top to bottom. The two columns are independent — neither blocks the other.

## `FF-backend/` session

| # | ID | Why here |
|---|---|---|
| 1 | `BE-1` | Everything else reads `settings`; do the config rewrite first |
| 2 | `BE-2` | Uses `BE-1`'s `cors_origins` property |
| 3 | `BE-10` | Same middleware block as `BE-2` |
| 4 | `BE-8` | Pin Python before you rebuild anything |
| 5 | `BE-6` | Alembic must work before you write migrations |
| 6 | `BE-5` | Engine config, touched by nothing after this |
| 7 | `BE-11` | Small, and `BE-5` makes it meaningful |
| 8 | `BE-16` | Schema + register changes |
| 9 | `BE-15` | Login, depends on `BE-16`'s email normalisation |
| 10 | `BE-17` | `UserOut` additions |
| 11 | `BE-18` | `OrderOut` additions |
| 12 | `BE-23` | Eager loading, now that all the properties exist |
| 13 | `BE-19` | New endpoint, uses `BE-23`'s loading pattern |
| 14 | `BE-20` | New endpoint |
| 15 | `BE-21` | New endpoint + route-ordering audit |
| 16 | `BE-22` | Bootstrap migration |
| 17 | `BE-4` | Delete the unsafe endpoint |
| 18 | `BE-3` | Row locking + check-constraint migration |
| 19 | `BE-7` | Webhook idempotency and logging |
| 20 | `BE-13` | Refund on cancel |
| 21 | `BE-12` | Hide docs in prod |
| 22 | `BE-9` | Document the replica constraint |
| 23 | `BE-14` | Tests and CI, covering everything above |

## `FF/` session

| # | ID | Why here |
|---|---|---|
| 1 | `FE-1` | `vercel.json`, independent of everything |
| 2 | `FE-3` | Delete the demo banner; one line, do it now |
| 3 | `FE-14` | Types first — `tsc -b` then becomes your to-do list |
| 4 | `FE-13` | `api.ts` rewrite, the core of the integration |
| 5 | `FE-15` | `AppContext` restructure, depends on `FE-13` |
| 6 | `FE-2` | Token persistence, part of `FE-15`'s effect |
| 7 | `FE-20` | Route guards, need `authLoading` from `FE-2` |
| 8 | `FE-17` | Checkout → Stripe |
| 9 | `FE-16` | Payment return pages, need `FE-2`'s session |
| 10 | `FE-19` | OrderConfirmation + Dashboard rewire |
| 11 | `FE-18` | Admin page |
| 12 | `FE-7` | Error boundary, most valuable once real fetches exist |
| 13 | `FE-10` | Catch-all route |
| 14 | `FE-21` | Point the hero at `/listings` |
| 15 | `FE-8` | Title typo |
| 16 | `FE-9` | Favicon and meta tags |
| 17 | `FE-4` | Image compression |
| 18 | `FE-5` | Delete dead PNGs |
| 19 | `FE-6` | Geocoding hygiene + swappable config |
| 20 | `FE-11` | Commit or discard `productscope.md` |
| 21 | `FE-12` | Tests and CI |

---
---

# 9. Human-only integration checklist

No agent can do these. Work through them in order **after** both sessions have merged.

**Provision**
- [ ] Create the Railway project; add the **Postgres** plugin
- [ ] Deploy `FF-backend` as a service; confirm Nixpacks detects Python + `Procfile`
- [ ] Set every **required** Railway variable from §7. The service will **refuse to boot** without them — that's `BE-1` working as designed
- [ ] Set Railway's Healthcheck Path to `/health`
- [ ] Confirm one replica only (`BE-9`)
- [ ] Note the Railway public domain

**Frontend**
- [ ] Create the Vercel project from `FreshForward-frontend`
- [ ] Confirm Framework Preset `Vite`, Output Directory `dist`, Root Directory empty
- [ ] Set `VITE_API_URL` to the Railway domain for **Production, Preview, and Development**
- [ ] Deploy; note the Vercel domain
- [ ] Set `FRONTEND_URL` on Railway to the Vercel domain and redeploy the backend

**Stripe**
- [ ] Create a webhook endpoint at `https://<railway-domain>/payments/webhook`
- [ ] Subscribe to `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_failed` — **all three**. Missing `expired` makes `BE-3c`'s stranded stock permanent
- [ ] Copy the signing secret into `STRIPE_WEBHOOK_SECRET`; redeploy
- [ ] Stay on **test keys** until the smoke test below passes end to end

**Admin bootstrap (`BE-22`)**
- [ ] Register your admin account through the normal signup flow on the live site
- [ ] Set `BOOTSTRAP_ADMIN_EMAIL` on Railway
- [ ] Alembic will not re-run an applied revision — from a Railway shell run `alembic downgrade -1 && alembic upgrade head`, or run the `UPDATE` directly
- [ ] Confirm `GET /auth/me` reports `is_admin: true`

**Smoke test — the full path, in order**
- [ ] Deep link `https://<vercel-domain>/listings` directly → `200`, not 404 (`FE-1`)
- [ ] Sign up as a customer → land on `/listings`
- [ ] Hard-refresh → still logged in (`FE-2`)
- [ ] Sign up as a restaurant → land on `/restaurant/apply` → submit
- [ ] As admin, `/admin/restaurants` → approve it
- [ ] As the restaurant, create a listing — **check the price**. Enter `5.00`, confirm the listing shows `$5.00` and the database stores `500`. This is `D-1`/`D-2`; if it's wrong here it's wrong everywhere
- [ ] As the customer, open the listing → checkout → land on Stripe
- [ ] Pay with `4242 4242 4242 4242`
- [ ] Land on `/payment/success` and see a confirmation (`FE-16`)
- [ ] Confirm the order shows `paid`, not `pending_payment` — if it's stuck, the webhook is misconfigured (`BE-7`)
- [ ] Confirm `quantity_available` decremented exactly once
- [ ] As the restaurant, see the order with the customer's email, mark it `ready`, then `picked_up`
- [ ] Cancel a different paid order and confirm the refund appears in Stripe (`BE-13`)

**Before real money**
- [ ] Swap Stripe to live keys; create a **new** live-mode webhook endpoint and update `STRIPE_WEBHOOK_SECRET`
- [ ] Set `ENVIRONMENT=production`
- [ ] Confirm `SECRET_KEY` has never been the placeholder in any environment; rotate if unsure
- [ ] Re-run the full smoke test on live keys with a real card, then refund yourself
- [ ] Switch geocoding off Nominatim (`FE-6`) before any marketing push

---

*End of document. §1, §2, and §3 are frozen. Everything else is guidance.*
