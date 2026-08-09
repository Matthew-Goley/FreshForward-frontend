import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  SAVED_ADDRESSES_KEY,
  DELIVERY_ADDRESS_KEY,
  formatAddressShort,
  loadSavedAddresses,
  saveAddressSelection,
} from '../address'

const store = new Map<string, string>()
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, String(value)),
  removeItem: (key: string) => void store.delete(key),
  clear: () => store.clear(),
})

beforeEach(() => {
  store.clear()
})

describe('formatAddressShort', () => {
  it('returns the street portion before the first comma', () => {
    expect(formatAddressShort('123 Main St, Amherst, MA')).toBe('123 Main St')
  })

  it('returns the input unchanged when there is no comma', () => {
    expect(formatAddressShort('Amherst')).toBe('Amherst')
  })
})

describe('loadSavedAddresses validation', () => {
  it('returns [] when nothing is stored', () => {
    expect(loadSavedAddresses()).toEqual([])
  })

  it('returns [] for malformed JSON', () => {
    localStorage.setItem(SAVED_ADDRESSES_KEY, 'not-json{')
    expect(loadSavedAddresses()).toEqual([])
  })

  it('returns [] when the stored value is not an array', () => {
    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify({ id: '1', full: 'x' }))
    expect(loadSavedAddresses()).toEqual([])
  })

  it('filters out entries with missing or empty fields', () => {
    localStorage.setItem(
      SAVED_ADDRESSES_KEY,
      JSON.stringify([
        { id: '1', full: '123 Main St, Amherst, MA' },
        { id: '2', full: '   ' },
        { id: 3, full: '456 Oak Ave' },
        { full: 'no id' },
        null,
      ]),
    )
    expect(loadSavedAddresses()).toEqual([{ id: '1', full: '123 Main St, Amherst, MA' }])
  })
})

describe('saveAddressSelection', () => {
  it('persists a new address and adds it to the saved list', () => {
    const result = saveAddressSelection('123 Main St, Amherst, MA', [])
    expect(result.deliveryAddress).toBe('123 Main St, Amherst, MA')
    expect(result.savedAddresses).toHaveLength(1)
    expect(result.savedAddresses[0].full).toBe('123 Main St, Amherst, MA')
    expect(localStorage.getItem(DELIVERY_ADDRESS_KEY)).toBe('123 Main St, Amherst, MA')
    expect(JSON.parse(localStorage.getItem(SAVED_ADDRESSES_KEY)!)).toHaveLength(1)
  })

  it('does not duplicate an already-saved address', () => {
    const existing = [{ id: 'a', full: '123 Main St, Amherst, MA' }]
    const result = saveAddressSelection('123 Main St, Amherst, MA', existing)
    expect(result.savedAddresses).toBe(existing)
  })

  it('ignores blank input without touching storage', () => {
    const existing = [{ id: 'a', full: '123 Main St' }]
    const result = saveAddressSelection('   ', existing)
    expect(result.deliveryAddress).toBe('')
    expect(result.savedAddresses).toBe(existing)
    expect(localStorage.getItem(DELIVERY_ADDRESS_KEY)).toBeNull()
  })
})
