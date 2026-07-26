import { useEffect, useRef, useState, type FormEvent, type SVGProps } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { AddressSuggestion, SavedAddress } from '../lib/address'
import {
  fetchCurrentAddress,
  formatAddressShort,
  loadInitialAddressState,
  persistSavedAddresses,
  saveAddressSelection,
  searchAddressSuggestions,
} from '../lib/address'

const textButtonHover = 'hover:bg-gray-300'

function IconLocationPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M10 17s5-4.5 5-9a5 5 0 1 0-10 0c0 4.5 5 9 5 9Z"
        stroke="currentColor"
        strokeWidth={1.8}
      />
      <circle cx="10" cy="8" r="1.75" fill="currentColor" />
    </svg>
  )
}

function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M4 10h12M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="7" r="3.25" stroke="currentColor" strokeWidth={1.8} />
      <path
        d="M4.5 16.5c.8-2.8 2.9-4.5 5.5-4.5s4.7 1.7 5.5 4.5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconGpsTarget(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth={1.8} />
      <circle cx="10" cy="10" r="2.5" fill="currentColor" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}

function IconChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M7 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}

function IconX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}

export default function HeroAddressSearch() {
  const navigate = useNavigate()
  const initialAddressState = loadInitialAddressState()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimerRef = useRef<number | null>(null)

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(initialAddressState.savedAddresses)
  const [addressDraft, setAddressDraft] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelMode, setPanelMode] = useState<'search' | 'manual'>('search')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [currentLocation, setCurrentLocation] = useState('')

  const trimmedCurrentLocation = currentLocation.trim()
  const detectedAlreadySaved = savedAddresses.some((saved) => saved.full.trim() === trimmedCurrentLocation)
  const showDetectedAddress = trimmedCurrentLocation.length > 0 && !detectedAlreadySaved
  const detectedSecondary = trimmedCurrentLocation.split(',').slice(1).join(',').trim()

  function closePanel() {
    setPanelOpen(false)
    setPanelMode('search')
  }

  function openPanel() {
    setPanelOpen(true)
    setPanelMode('search')
  }

  function commitAddress(address: string) {
    const next = saveAddressSelection(address, savedAddresses)
    setSavedAddresses(next.savedAddresses)
    setAddressDraft('')
    setSuggestions([])
    closePanel()
    navigate('/browse')
  }

  function handleDraftChange(value: string) {
    setAddressDraft(value)
    if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current)
    const query = value.trim()
    if (query.length < 2) {
      setSuggestions([])
      setSuggestionsLoading(false)
      return
    }
    setSuggestionsLoading(true)
    searchTimerRef.current = window.setTimeout(() => {
      searchAddressSuggestions(query)
        .then(setSuggestions)
        .catch(() => setSuggestions([]))
        .finally(() => setSuggestionsLoading(false))
    }, 300)
  }

  async function requestLocation() {
    setLocationLoading(true)
    try {
      const address = await fetchCurrentAddress()
      setCurrentLocation(address)
      commitAddress(address)
    } catch {
      openPanel()
      inputRef.current?.focus()
    } finally {
      setLocationLoading(false)
    }
  }

  function handleUseCurrentLocation() {
    if (currentLocation.trim()) {
      commitAddress(currentLocation)
      return
    }
    void requestLocation()
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = addressDraft.trim()
    if (trimmed) {
      commitAddress(trimmed)
      return
    }
    openPanel()
    inputRef.current?.focus()
  }

  function handleManualSave() {
    const trimmed = addressDraft.trim()
    if (!trimmed) return
    commitAddress(trimmed)
  }

  function handleRemoveSaved(id: string) {
    setSavedAddresses((prev) => {
      const next = prev.filter((item) => item.id !== id)
      persistSavedAddresses(next)
      return next
    })
  }

  function handleClearCurrentLocation() {
    setCurrentLocation('')
  }

  useEffect(() => {
    if (!panelOpen) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePanel()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [panelOpen])

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative mt-8 w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-lg shadow-emerald-900/20"
      >
        <IconLocationPin className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={addressDraft}
          onChange={(e) => handleDraftChange(e.target.value)}
          onFocus={openPanel}
          placeholder="Search for an address"
          aria-label="Search for an address"
          aria-expanded={panelOpen}
          aria-haspopup="listbox"
          autoComplete="off"
          className="min-w-0 flex-1 border-none bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          aria-label="Browse food near this address"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
        >
          <IconArrowRight className="h-4 w-4" />
        </button>
      </form>

      {panelOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-3">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-xl">
            {panelMode === 'manual' ? (
              <div className="p-4">
                <p className="text-base font-bold text-slate-900">Add a new address</p>
                <p className="mt-1 text-sm text-slate-500">Enter your full delivery address</p>
                <textarea
                  value={addressDraft}
                  onChange={(e) => setAddressDraft(e.target.value)}
                  placeholder="Street, city, state, zip"
                  autoFocus
                  rows={3}
                  className="mt-3 w-full resize-none rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPanelMode('search')}
                    className={`rounded-lg px-3 py-1.5 text-sm text-slate-600 ${textButtonHover}`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleManualSave}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Save address
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-base font-bold text-slate-900">Enter Your Address</p>
                  <p className="mt-1 text-sm text-slate-500">Search for an address</p>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {suggestionsLoading && (
                    <p className="px-4 py-3 text-sm text-slate-500">Searching addresses…</p>
                  )}
                  {!suggestionsLoading && addressDraft.trim().length >= 2 && suggestions.length === 0 && (
                    <p className="px-4 py-3 text-sm text-slate-500">No addresses found. Try a different search.</p>
                  )}
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => commitAddress(s.full)}
                      className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left ${textButtonHover}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">{s.primary}</p>
                        {s.secondary && <p className="truncate text-sm text-slate-500">{s.secondary}</p>}
                      </div>
                      <IconChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </button>
                  ))}

                  {savedAddresses.map((saved) => {
                    const secondary = saved.full.split(',').slice(1).join(',').trim()
                    return (
                      <div key={saved.id} className="flex items-center gap-1 border-b border-gray-100">
                        <button
                          type="button"
                          onClick={() => commitAddress(saved.full)}
                          className={`flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left ${textButtonHover}`}
                        >
                          <IconLocationPin className="h-4 w-4 shrink-0 text-slate-500" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-slate-900">
                              {formatAddressShort(saved.full)}
                            </p>
                            {secondary && <p className="truncate text-sm text-slate-500">{secondary}</p>}
                          </div>
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${formatAddressShort(saved.full)}`}
                          onClick={() => handleRemoveSaved(saved.id)}
                          className={`mr-3 grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:text-slate-600 ${textButtonHover}`}
                        >
                          <IconX className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}

                  {showDetectedAddress && (
                    <div className="flex items-center gap-1 border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => commitAddress(trimmedCurrentLocation)}
                        className={`flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left ${textButtonHover}`}
                      >
                        <IconGpsTarget className="h-4 w-4 shrink-0 text-emerald-600" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-900">
                            {formatAddressShort(trimmedCurrentLocation)}
                          </p>
                          <p className="truncate text-sm text-emerald-600">
                            {detectedSecondary || 'Detected location'}
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove detected address ${formatAddressShort(trimmedCurrentLocation)}`}
                        onClick={handleClearCurrentLocation}
                        className={`mr-3 grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:text-slate-600 ${textButtonHover}`}
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setPanelMode('manual')}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left ${textButtonHover}`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gray-200 text-slate-600">
                      <IconPlus className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Add a new address</p>
                      <p className="text-sm text-slate-500">Enter address manually</p>
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locationLoading}
                  className={`flex w-full items-start gap-3 border-t border-gray-100 px-4 py-3 text-left disabled:opacity-60 ${textButtonHover}`}
                >
                  <IconGpsTarget className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div className="min-w-0">
                    {locationLoading ? (
                      <p className="text-sm font-semibold text-emerald-700">Detecting your location…</p>
                    ) : (
                      <>
                        <p className="font-semibold text-emerald-700">Use current location</p>
                        <p className="text-sm text-emerald-600/80">Share location to autofill</p>
                      </>
                    )}
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/login"
          state={{ redirectTo: '/browse' }}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-emerald-50"
        >
          <IconUser className="h-4 w-4 text-slate-500" />
          Sign in for saved address
        </Link>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locationLoading}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <IconGpsTarget className="h-4 w-4 text-emerald-600" />
          {locationLoading ? 'Detecting your location…' : 'Use current location'}
        </button>
      </div>
    </div>
  )
}
