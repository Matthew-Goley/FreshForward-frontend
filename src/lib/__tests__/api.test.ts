import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api'

// api.ts touches localStorage at call time; give the node environment one.
const store = new Map<string, string>()
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, String(value)),
  removeItem: (key: string) => void store.delete(key),
  clear: () => store.clear(),
})

type FetchCall = { url: string; init: RequestInit | undefined }

function stubFetch(responder: (url: string, init?: RequestInit) => Response) {
  const calls: FetchCall[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, init })
      return responder(url, init)
    }),
  )
  return calls
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const wireListing = {
  id: 3,
  restaurant_id: 7,
  restaurant_name: 'Green Table Cafe',
  title: 'Pasta Box',
  description: 'Leftover pasta',
  original_price: 1400,
  discounted_price: 500,
  quantity_available: 6,
  pickup_window: '5:00 PM - 6:00 PM',
  created_at: '2026-08-08T12:00:00Z',
}

beforeEach(() => {
  store.clear()
})

describe('money conversion (D-1/D-2)', () => {
  it('sends listing prices as integer cents, rounded not truncated', async () => {
    const calls = stubFetch(() => json(wireListing, 201))
    await api.createListing({
      title: 'Pasta Box',
      description: 'Leftover pasta',
      // 19.99 * 100 === 1998.9999999999998 and 4.35 * 100 === 434.99999999999994
      // in IEEE-754; a floor or bare cast undercharges a cent.
      originalPrice: 19.99,
      discountedPrice: 4.35,
      quantityAvailable: 6,
      pickupWindow: '5:00 PM - 6:00 PM',
    })
    const body = JSON.parse(String(calls[0].init?.body)) as Record<string, unknown>
    expect(body.original_price).toBe(1999)
    expect(body.discounted_price).toBe(435)
    expect(body.quantity_available).toBe(6)
  })

  it('converts wire cents to dollars on the way in', async () => {
    stubFetch(() => json([wireListing]))
    const [listing] = await api.getListings()
    expect(listing.originalPrice).toBe(14)
    expect(listing.discountedPrice).toBe(5)
  })
})

describe('wire mapping (D-3/D-4/D-5)', () => {
  it('maps a wire listing to the frontend shape', async () => {
    stubFetch(() => json(wireListing))
    const listing = await api.getListing('3')
    expect(listing).toEqual({
      id: '3',
      restaurantId: '7',
      restaurantName: 'Green Table Cafe',
      title: 'Pasta Box',
      description: 'Leftover pasta',
      originalPrice: 14,
      discountedPrice: 5,
      quantityAvailable: 6,
      pickupWindow: '5:00 PM - 6:00 PM',
      createdAt: '2026-08-08T12:00:00Z',
    })
  })

  it('sends listing_id as a JSON number when placing an order', async () => {
    const calls = stubFetch(() =>
      json(
        {
          order: {
            id: 1,
            listing_id: 3,
            listing_title: 'Pasta Box',
            restaurant_name: 'Green Table Cafe',
            customer_email: 'jane@example.com',
            pickup_window: '5:00 PM - 6:00 PM',
            quantity: 2,
            price: 1000,
            status: 'pending_payment',
            created_at: '2026-08-08T12:00:00Z',
          },
          checkout_url: 'https://checkout.stripe.com/c/pay/cs_test_123',
          session_id: 'cs_test_123',
        },
        201,
      ),
    )
    const result = await api.placeOrder('3', 2)
    const body = JSON.parse(String(calls[0].init?.body)) as Record<string, unknown>
    expect(body.listing_id).toBe(3)
    expect(typeof body.listing_id).toBe('number')
    expect(result.checkoutUrl).toBe('https://checkout.stripe.com/c/pay/cs_test_123')
    expect(result.sessionId).toBe('cs_test_123')
    expect(result.order.price).toBe(10)
  })
})

describe('auth (D-6/D-8/D-9)', () => {
  const wireUser = {
    id: 1,
    username: 'jane',
    email: 'jane@example.com',
    account_type: 'customer',
    is_admin: false,
    restaurant_id: null,
    created_at: '2026-08-08T12:00:00Z',
  }

  it('logs in with a form-urlencoded body, stores the token, and returns the user', async () => {
    const calls = stubFetch((url) =>
      url.endsWith('/auth/login') ? json({ access_token: 'tok-123', token_type: 'bearer' }) : json(wireUser),
    )
    const user = await api.login('jane@example.com', 'hunter2hunter2')

    expect(calls[0].init?.body).toBeInstanceOf(URLSearchParams)
    expect(String(calls[0].init?.body)).toBe('username=jane%40example.com&password=hunter2hunter2')
    expect(localStorage.getItem('ff-auth-token')).toBe('tok-123')
    expect(user).toEqual({
      id: '1',
      username: 'jane',
      email: 'jane@example.com',
      accountType: 'customer',
      isAdmin: false,
      restaurantId: null,
    })
  })

  it('signup registers then logs in with the same credentials', async () => {
    const calls = stubFetch((url) => {
      if (url.endsWith('/auth/register')) return json(wireUser, 201)
      if (url.endsWith('/auth/login')) return json({ access_token: 'tok-456', token_type: 'bearer' })
      return json(wireUser)
    })
    await api.signup('jane@example.com', 'hunter2hunter2')
    expect(calls.map((c) => c.url)).toEqual(['/auth/register', '/auth/login', '/auth/me'])
    const registerBody = JSON.parse(String(calls[0].init?.body)) as Record<string, unknown>
    expect(registerBody).toEqual({ email: 'jane@example.com', password: 'hunter2hunter2', username: null })
  })

  it('clears the stored token and throws ApiError on a 401 (D-11)', async () => {
    localStorage.setItem('ff-auth-token', 'stale')
    stubFetch(() => json({ detail: 'Not authenticated' }, 401))
    await expect(api.getMyOrders()).rejects.toMatchObject({ name: 'ApiError', status: 401 })
    expect(localStorage.getItem('ff-auth-token')).toBeNull()
  })
})

describe('error handling (§2.1)', () => {
  it('surfaces a string detail', async () => {
    stubFetch(() => json({ detail: 'Not enough stock available' }, 400))
    await expect(api.placeOrder('3', 2)).rejects.toThrow('Not enough stock available')
  })

  it('joins a 422 array detail', async () => {
    stubFetch(() =>
      json(
        {
          detail: [
            { loc: ['body', 'email'], msg: 'value is not a valid email address', type: 'value_error' },
            { loc: ['body', 'password'], msg: 'too short', type: 'value_error' },
          ],
        },
        422,
      ),
    )
    await expect(api.signup('bad', 'x')).rejects.toThrow(
      'value is not a valid email address, too short',
    )
  })

  it('falls back to a generic message when the body is not JSON', async () => {
    stubFetch(() => new Response('gateway error', { status: 502 }))
    await expect(api.getListings()).rejects.toThrow('Request failed (502)')
  })

  it('getMyRestaurant returns null on 404 instead of throwing', async () => {
    stubFetch(() => json({ detail: 'No restaurant' }, 404))
    await expect(api.getMyRestaurant()).resolves.toBeNull()
  })
})
