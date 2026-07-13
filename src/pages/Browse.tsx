import { useEffect, useRef, useState, type ReactNode, type SVGProps } from 'react'

/* ─── Types ─── */

const DELIVERY_ADDRESS_KEY = 'ff-delivery-address'

interface Product {
  id: string
  title: string
  vendor: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: string
  deliveryMin: number
  deliveryMax: number
  imageUrl: string
}

interface PromoSlide {
  id: string
  headline: string
  subtext: string
  cta: string
  gradient: string
}

interface SidebarItem {
  id: string
  label: string
  icon: (props: SVGProps<SVGSVGElement>) => ReactNode
}

interface Pill {
  id: string
  emoji: string
  label: string
}

/* ─── Icons ─── */

function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  )
}

function IconGrocery(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16l-1.2 12.2A2 2 0 0 1 16.81 21H7.19a2 2 0 0 1-1.99-1.8L4 7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a4 4 0 0 1 8 0v2" />
    </svg>
  )
}

function IconProduce(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4-3 7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 3 8 7 11Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v4M10 12h4" />
    </svg>
  )
}

function IconDairy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <ellipse cx="12" cy="12" rx="8" ry="5" />
      <path strokeLinecap="round" d="M4 12v2c0 2.8 3.6 5 8 5s8-2.2 8-5v-2" />
    </svg>
  )
}

function IconMeat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 14c-2 0-4-1.5-4-4s2.5-5 6-5c4.5 0 7 2.5 9 5 1.5 1.8 2 3.5 1 5s-3.5 2-6 1c-1.5-.5-3-1-4-1H7Z" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconBakery(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 14c0-4 3.5-7 8-7s8 3 8 7v2H4v-2Z" />
      <path strokeLinecap="round" d="M8 14v2M12 14v2M16 14v2" />
    </svg>
  )
}

function IconMeals(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11h16v2a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6v-2Z" />
      <path strokeLinecap="round" d="M8 11V6M12 11V4M16 11V7" />
    </svg>
  )
}

function IconDeals(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 14.5 8.5 20.5 9.3 16 13.4 17.2 19.4 12 16.6 6.8 19.4 8 13.4 3.5 9.3 9.5 8.5 12 3Z" />
    </svg>
  )
}

function IconElectronics(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  )
}

function IconCart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l1.5 11h11L20 7H7" />
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="17" cy="20" r="1.25" />
    </svg>
  )
}

function IconChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  )
}

function IconChevronLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
    </svg>
  )
}

function IconChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
    </svg>
  )
}

function IconPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.33 6-10a6 6 0 1 0-12 0c0 4.67 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  )
}

function IconGpsTarget(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" />
      <path strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  )
}

function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path strokeLinecap="round" d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </svg>
  )
}

function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} {...props}>
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  )
}

function IconMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

/* ─── Mock data ─── */

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: IconHome },
  { id: 'grocery', label: 'Grocery', icon: IconGrocery },
  { id: 'produce', label: 'Fresh Produce', icon: IconProduce },
  { id: 'dairy', label: 'Dairy & Eggs', icon: IconDairy },
  { id: 'meat', label: 'Meat & Seafood', icon: IconMeat },
  { id: 'bakery', label: 'Bakery', icon: IconBakery },
  { id: 'meals', label: 'Prepared Meals', icon: IconMeals },
  { id: 'deals', label: 'Deals', icon: IconDeals },
  { id: 'electronics', label: 'Electronics', icon: IconElectronics },
]

const pills: Pill[] = [
  { id: 'pizza', emoji: '🍕', label: 'Pizza' },
  { id: 'sushi', emoji: '🍣', label: 'Sushi' },
  { id: 'healthy', emoji: '🥦', label: 'Healthy' },
  { id: 'burgers', emoji: '🍔', label: 'Burgers' },
  { id: 'drinks', emoji: '🥤', label: 'Drinks' },
  { id: 'berries', emoji: '🍓', label: 'Berries' },
  { id: 'desserts', emoji: '🍰', label: 'Desserts' },
  { id: 'coffee', emoji: '☕', label: 'Coffee' },
]

const promoSlides: PromoSlide[] = [
  {
    id: 'summer',
    headline: 'Fresh Summer Savings',
    subtext: 'Up to 40% off seasonal produce and prepared meals near you.',
    cta: 'Shop deals',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'delivery',
    headline: 'Sign up for $0 Delivery Fees',
    subtext: 'New members get free delivery on their first three orders.',
    cta: 'Order now',
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'local',
    headline: 'Support Local Kitchens',
    subtext: 'Discover surplus meals from restaurants within MAARA.',
    cta: 'Explore',
    gradient: 'from-green-600 to-emerald-700',
  },
]

const todaysOffers: Product[] = [
  {
    id: 'avocado-berry',
    title: 'Organic Avocado & Berry Box',
    vendor: "Trader Joe's",
    price: 8.99,
    originalPrice: 14.99,
    rating: 4.8,
    reviewCount: '100+',
    deliveryMin: 15,
    deliveryMax: 30,
    imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop',
  },
  {
    id: 'brioche-buns',
    title: 'Brioche Burger Buns',
    vendor: 'ALDI',
    price: 0.87,
    originalPrice: 3.49,
    rating: 4.6,
    reviewCount: '80+',
    deliveryMin: 20,
    deliveryMax: 35,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop',
  },
  {
    id: 'organic-bananas',
    title: 'Organic Bananas',
    vendor: "Trader Joe's",
    price: 0.99,
    originalPrice: 3.49,
    rating: 4.7,
    reviewCount: '200+',
    deliveryMin: 15,
    deliveryMax: 25,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
  },
  {
    id: 'fresh-baguette',
    title: 'Fresh Baguette',
    vendor: 'Key Food',
    price: 0.87,
    originalPrice: 3.49,
    rating: 4.5,
    reviewCount: '60+',
    deliveryMin: 20,
    deliveryMax: 40,
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=400&fit=crop',
  },
  {
    id: 'guac-chips',
    title: 'Guacamole & Chips',
    vendor: 'Chipotle Mexican Grill',
    price: 1.95,
    originalPrice: 6.5,
    rating: 4.9,
    reviewCount: '150+',
    deliveryMin: 10,
    deliveryMax: 25,
    imageUrl: 'https://images.unsplash.com/photo-1615870216519-2f35ccceb79c?w=400&h=400&fit=crop',
  },
  {
    id: 'mixed-greens',
    title: 'Farm Fresh Mixed Greens',
    vendor: 'Local Harvest Co.',
    price: 3.49,
    originalPrice: 6.99,
    rating: 4.8,
    reviewCount: '90+',
    deliveryMin: 15,
    deliveryMax: 30,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
  },
]

const preparedMeals: Product[] = [
  {
    id: 'pepperoni-slice',
    title: 'Pepperoni Slice',
    vendor: "Joe's Pizza",
    price: 1.05,
    originalPrice: 3.5,
    rating: 4.7,
    reviewCount: '300+',
    deliveryMin: 15,
    deliveryMax: 25,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
  },
  {
    id: 'orange-chicken',
    title: 'Orange Chicken',
    vendor: 'Panda Express',
    price: 3.45,
    originalPrice: 11.5,
    rating: 4.4,
    reviewCount: '220+',
    deliveryMin: 20,
    deliveryMax: 35,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop',
  },
  {
    id: 'beijing-beef',
    title: 'Beijing Beef',
    vendor: 'Panda Express',
    price: 3.6,
    originalPrice: 12.0,
    rating: 4.5,
    reviewCount: '180+',
    deliveryMin: 20,
    deliveryMax: 35,
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop',
  },
  {
    id: 'sofritas-bowl',
    title: 'Sofritas Bowl',
    vendor: 'Chipotle Mexican Grill',
    price: 3.15,
    originalPrice: 10.5,
    rating: 4.8,
    reviewCount: '140+',
    deliveryMin: 15,
    deliveryMax: 30,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
  },
  {
    id: 'salmon-rice',
    title: 'Salmon Rice Bowl',
    vendor: 'CookUnity',
    price: 9.99,
    originalPrice: 14.99,
    rating: 4.9,
    reviewCount: '95+',
    deliveryMin: 25,
    deliveryMax: 40,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
  },
  {
    id: 'veggie-wrap',
    title: 'Grilled Veggie Wrap',
    vendor: 'Sweetgreen',
    price: 5.5,
    originalPrice: 9.99,
    rating: 4.6,
    reviewCount: '110+',
    deliveryMin: 15,
    deliveryMax: 30,
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
  },
]

const hideScrollbar =
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { 'Accept-Language': 'en' } },
  )
  if (!res.ok) throw new Error('Could not resolve address')
  const data = (await res.json()) as {
    display_name?: string
    address?: {
      house_number?: string
      road?: string
      city?: string
      town?: string
      village?: string
    }
  }
  const a = data.address
  if (a) {
    const street = [a.house_number, a.road].filter(Boolean).join(' ')
    const city = a.city ?? a.town ?? a.village
    const parts = [street, city].filter(Boolean)
    if (parts.length > 0) return parts.join(', ')
  }
  return data.display_name?.split(',').slice(0, 2).join(',') ?? 'Current location'
}

interface AddressSuggestion {
  id: string
  primary: string
  secondary: string
  full: string
}

interface NominatimSearchResult {
  place_id: number
  display_name: string
  address?: {
    house_number?: string
    road?: string
    city?: string
    town?: string
    village?: string
    state?: string
    postcode?: string
  }
}

function formatAddressShort(full: string): string {
  return full.split(',')[0]?.trim() || full
}

function formatSuggestion(result: NominatimSearchResult): AddressSuggestion {
  const a = result.address
  const primary = a
    ? [a.house_number, a.road].filter(Boolean).join(' ')
    : result.display_name.split(',')[0]?.trim() ?? result.display_name
  const secondary = a
    ? [a.city ?? a.town ?? a.village, a.state, a.postcode].filter(Boolean).join(', ')
    : result.display_name.split(',').slice(1).join(',').trim()
  const full = a
    ? [primary, secondary].filter(Boolean).join(', ')
    : result.display_name
  return { id: String(result.place_id), primary, secondary, full }
}

async function searchAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&addressdetails=1&limit=6&countrycodes=us`,
    { headers: { 'Accept-Language': 'en' } },
  )
  if (!res.ok) return []
  const data = (await res.json()) as NominatimSearchResult[]
  return data.map(formatSuggestion)
}

function fetchCurrentAddress(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const address = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          resolve(address)
        } catch (err) {
          reject(err)
        }
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 12000 },
    )
  })
}

/* ─── Subcomponents ─── */

function ProductCard({ product, onAdd }: { product: Product; onAdd: (id: string) => void }) {
  return (
    <article className="w-56 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <button
          type="button"
          aria-label={`Add ${product.title} to cart`}
          onClick={() => onAdd(product.id)}
          className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-900 shadow-md transition hover:scale-105 hover:bg-emerald-50"
        >
          <IconPlus className="h-5 w-5" />
        </button>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{product.title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold text-emerald-700">${product.price.toFixed(2)}</span>
          {product.originalPrice != null && (
            <span className="text-sm text-slate-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-slate-500">
          {product.vendor} · {product.rating} ★ ({product.reviewCount}) · {product.deliveryMin}–
          {product.deliveryMax} min
        </p>
      </div>
    </article>
  )
}

function ProductRow({
  title,
  products,
  onAdd,
}: {
  title: string
  products: Product[]
  onAdd: (id: string) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            See All
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-100 text-slate-600 hover:bg-gray-50"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll(1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-100 text-slate-600 hover:bg-gray-50"
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={trackRef} className={`flex gap-4 overflow-x-auto pb-2 ${hideScrollbar}`}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}

function AddressDropdown({
  address,
  currentLocation,
  open,
  mode,
  draft,
  suggestions,
  suggestionsLoading,
  locationLoading,
  onToggle,
  onClose,
  onDraftChange,
  onSetMode,
  onSelectSuggestion,
  onManualSave,
  onUseLocation,
}: {
  address: string
  currentLocation: string
  open: boolean
  mode: 'search' | 'manual'
  draft: string
  suggestions: AddressSuggestion[]
  suggestionsLoading: boolean
  locationLoading: boolean
  onToggle: () => void
  onClose: () => void
  onDraftChange: (v: string) => void
  onSetMode: (mode: 'search' | 'manual') => void
  onSelectSuggestion: (suggestion: AddressSuggestion) => void
  onManualSave: () => void
  onUseLocation: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  useEffect(() => {
    if (open && mode === 'search') {
      inputRef.current?.focus()
    }
  }, [open, mode])

  const displayAddress = address ? formatAddressShort(address) : ''

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex max-w-[10rem] items-center gap-1 overflow-hidden rounded-full border border-gray-100 px-3 py-2 text-sm hover:bg-gray-50 md:max-w-[14rem]"
      >
        <IconPin className="h-4 w-4 shrink-0 text-slate-500" />
        {displayAddress ? (
          <>
            <span className="truncate font-medium text-slate-900">{displayAddress}</span>
            <IconChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </>
        ) : (
          <>
            <span className="truncate text-slate-500">Add delivery address</span>
            <IconChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-3 w-[min(22rem,calc(100vw-2rem))]">
          <div className="absolute -top-1.5 right-8 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white" />
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            {mode === 'manual' ? (
              <div className="p-4">
                <p className="text-base font-bold text-slate-900">Add a new address</p>
                <p className="mt-1 text-sm text-slate-500">Enter your full delivery address</p>
                <textarea
                  value={draft}
                  onChange={(e) => onDraftChange(e.target.value)}
                  placeholder="Street, city, state, zip"
                  autoFocus
                  rows={3}
                  className="mt-3 w-full resize-none rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onSetMode('search')}
                    className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={onManualSave}
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
                  <div className="relative mt-3">
                    <IconPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={draft}
                      onChange={(e) => onDraftChange(e.target.value)}
                      placeholder="Search for an address"
                      className="w-full rounded-full border-2 border-slate-900 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {suggestionsLoading && (
                    <p className="px-4 py-3 text-sm text-slate-500">Searching addresses…</p>
                  )}
                  {!suggestionsLoading && draft.trim().length >= 2 && suggestions.length === 0 && (
                    <p className="px-4 py-3 text-sm text-slate-500">No addresses found. Try a different search.</p>
                  )}
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSelectSuggestion(s)}
                      className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">{s.primary}</p>
                        {s.secondary && (
                          <p className="truncate text-sm text-slate-500">{s.secondary}</p>
                        )}
                      </div>
                      <IconChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => onSetMode('manual')}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
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

                <div className="border-t border-gray-100 px-4 py-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50"
                  >
                    <IconUser className="h-4 w-4" />
                    Sign in for saved address
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onUseLocation}
                  disabled={locationLoading}
                  className="flex w-full items-start gap-3 border-t border-gray-100 px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-60"
                >
                  <IconGpsTarget className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div className="min-w-0">
                    {locationLoading ? (
                      <p className="text-sm font-semibold text-emerald-700">Detecting your location…</p>
                    ) : currentLocation ? (
                      <>
                        <p className="truncate font-semibold text-emerald-700">
                          {formatAddressShort(currentLocation)}
                        </p>
                        <p className="truncate text-sm text-emerald-600/80">
                          {currentLocation.split(',').slice(1).join(',').trim() || 'Current location'}
                        </p>
                      </>
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
    </div>
  )
}

/* ─── Page ─── */

export default function Browse() {
  const [cartCount, setCartCount] = useState(0)
  const [deliveryAddress, setDeliveryAddress] = useState(
    () => localStorage.getItem(DELIVERY_ADDRESS_KEY) ?? '',
  )
  const [locationLoading, setLocationLoading] = useState(false)
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false)
  const [addressPanelMode, setAddressPanelMode] = useState<'search' | 'manual'>('search')
  const [addressDraft, setAddressDraft] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [currentLocation, setCurrentLocation] = useState('')
  const [pendingProductId, setPendingProductId] = useState<string | null>(null)
  const [activeSidebar, setActiveSidebar] = useState('home')
  const [activePill, setActivePill] = useState<string | null>(null)
  const [activePromo, setActivePromo] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const searchTimerRef = useRef<number | null>(null)

  const handleAddressDraftChange = (value: string) => {
    setAddressDraft(value)
    if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current)
    const query = value.trim()
    if (query.length < 2) {
      setAddressSuggestions([])
      setSuggestionsLoading(false)
      return
    }
    setSuggestionsLoading(true)
    searchTimerRef.current = window.setTimeout(() => {
      searchAddressSuggestions(query)
        .then(setAddressSuggestions)
        .catch(() => setAddressSuggestions([]))
        .finally(() => setSuggestionsLoading(false))
    }, 300)
  }

  const saveAddress = (address: string, pendingId: string | null = pendingProductId) => {
    setDeliveryAddress(address)
    localStorage.setItem(DELIVERY_ADDRESS_KEY, address)
    setAddressDropdownOpen(false)
    setAddressPanelMode('search')
    setAddressDraft('')
    setAddressSuggestions([])
    if (pendingId) {
      setCartCount((c) => c + 1)
      setPendingProductId(null)
    }
  }

  const openAddressDropdown = () => {
    setAddressDropdownOpen(true)
    setAddressPanelMode('search')
    setAddressDraft('')
    setAddressSuggestions([])
  }

  const requestLocation = async (pendingId: string | null = null) => {
    setLocationLoading(true)
    try {
      const address = await fetchCurrentAddress()
      setCurrentLocation(address)
      saveAddress(address, pendingId ?? pendingProductId)
    } catch {
      openAddressDropdown()
    } finally {
      setLocationLoading(false)
    }
  }

  const handleAddToCart = (productId: string) => {
    if (deliveryAddress.trim()) {
      setCartCount((c) => c + 1)
      return
    }
    setPendingProductId(productId)
    void requestLocation(productId)
  }

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    saveAddress(suggestion.full)
  }

  const handleManualSave = () => {
    const trimmed = addressDraft.trim()
    if (!trimmed) return
    saveAddress(trimmed)
  }

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      saveAddress(currentLocation)
      return
    }
    void requestLocation()
  }

  const closeAddressDropdown = () => {
    setAddressDropdownOpen(false)
    setAddressPanelMode('search')
    setAddressDraft('')
    setAddressSuggestions([])
  }

  const toggleAddressDropdown = () => {
    if (addressDropdownOpen) {
      closeAddressDropdown()
    } else {
      openAddressDropdown()
    }
  }

  const slide = promoSlides[activePromo]

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800 [&_button]:cursor-pointer">
      {/* Sticky control bar */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 px-4 py-3 lg:gap-4">
          <button
            type="button"
            aria-label="Toggle categories"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gray-100 text-slate-600 lg:hidden"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <IconMenu className="h-5 w-5" />
          </button>

          <div className="relative mx-auto min-w-0 flex-1 max-w-2xl">
            <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search FreshForward..."
              className="w-full rounded-full border border-gray-100 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <AddressDropdown
              address={deliveryAddress}
              currentLocation={currentLocation}
              open={addressDropdownOpen}
              mode={addressPanelMode}
              draft={addressDraft}
              suggestions={addressSuggestions}
              suggestionsLoading={suggestionsLoading}
              locationLoading={locationLoading}
              onToggle={toggleAddressDropdown}
              onClose={closeAddressDropdown}
              onDraftChange={handleAddressDraftChange}
              onSetMode={setAddressPanelMode}
              onSelectSuggestion={handleSelectSuggestion}
              onManualSave={handleManualSave}
              onUseLocation={handleUseCurrentLocation}
            />
            <button type="button" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline">
              Sign In
            </button>
            <button type="button" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline">
              Sign Up
            </button>
            <button
              type="button"
              aria-label={`Shopping cart, ${cartCount} items`}
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <IconCart className="h-4 w-4" />
              <span>{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`absolute inset-y-0 left-0 z-20 w-56 shrink-0 overflow-y-auto border-r border-gray-100 bg-white transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="flex flex-col gap-0.5 p-3">
            {sidebarItems.map((item) => {
              const active = activeSidebar === item.id
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSidebar(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-emerald-600' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 z-10 bg-slate-900/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-5 sm:px-6 lg:px-8">
            {/* Category pills */}
            <div className={`flex gap-2 overflow-x-auto pb-1 ${hideScrollbar}`}>
              {pills.map((pill) => {
                const selected = activePill === pill.id
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setActivePill(selected ? null : pill.id)}
                    className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                        : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    <span aria-hidden>{pill.emoji}</span>
                    {pill.label}
                  </button>
                )
              })}
            </div>

            {/* Promo carousel */}
            <div className="relative mt-6 overflow-hidden rounded-2xl">
              <div
                className={`flex min-h-[10rem] flex-col justify-center bg-gradient-to-r ${slide.gradient} px-6 py-8 text-white sm:min-h-[11rem] sm:px-10`}
              >
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{slide.headline}</h2>
                <p className="mt-2 max-w-lg text-sm text-white/90 sm:text-base">{slide.subtext}</p>
                <button
                  type="button"
                  className="mt-4 w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                >
                  {slide.cta}
                </button>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous promo"
                  onClick={() =>
                    setActivePromo((i) => (i - 1 + promoSlides.length) % promoSlides.length)
                  }
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                >
                  <IconChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-1.5">
                  {promoSlides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={`Go to promo ${i + 1}`}
                      onClick={() => setActivePromo(i)}
                      className={`h-2 w-2 rounded-full transition ${
                        i === activePromo ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next promo"
                  onClick={() => setActivePromo((i) => (i + 1) % promoSlides.length)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                >
                  <IconChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ProductRow title="Today's Offers" products={todaysOffers} onAdd={handleAddToCart} />
            <ProductRow title="Prepared Meals" products={preparedMeals} onAdd={handleAddToCart} />

            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  )
}
