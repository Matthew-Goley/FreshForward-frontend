import { useEffect, useRef, useState, type ReactNode, type SVGProps } from 'react'

/* ─── Types ─── */

interface SavedAddress {
  id: string
  full: string
}

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

function IconVegan(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-2-7-6-7-10a7 7 0 0 1 14 0c0 4-3 8-7 10Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V7" />
      <path strokeLinecap="round" d="M10 9h4" />
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

function IconX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" d="m18 6-12 12M6 6l12 12" />
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

function BannerUtensilArt() {
  return (
    <div aria-hidden className="flex h-28 w-72 shrink-0 items-center justify-center md:h-32 md:w-80">
      <svg viewBox="0 0 300 150" className="h-full w-full text-white" fill="none">
        <g transform="translate(150 78) rotate(4)">
          <circle cx="0" cy="0" r="46" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={4} />
          <circle cx="0" cy="0" r="34" stroke="currentColor" strokeOpacity={0.45} strokeWidth={2.5} />
        </g>
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(42 72) rotate(-22)">
          <path strokeWidth={4} d="M-10 -42v32M2 -42v32M14 -42v32" />
          <path strokeWidth={5} d="M2 -10v88" />
        </g>
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(258 72) rotate(22)">
          <ellipse cx="0" cy="-38" rx="16" ry="22" fill="currentColor" fillOpacity={0.22} strokeWidth={4} />
          <path strokeWidth={5} d="M0 -16v88" />
        </g>
      </svg>
    </div>
  )
}

function BannerMissionArt() {
  const beltY = 132
  const packageW = 28
  const packageH = 20
  const packageY = beltY - packageH
  const beltStart = 40
  const beltEnd = 260
  const gap = (beltEnd - beltStart - 4 * packageW) / 3
  const packageXs = [0, 1, 2, 3].map((i) => beltStart + i * (packageW + gap))

  return (
    <div aria-hidden className="flex h-28 w-72 shrink-0 items-center justify-center md:h-32 md:w-80">
      <svg viewBox="0 0 300 160" className="h-full w-full text-white" fill="none">
        {/* Clock */}
        <circle cx="150" cy="42" r="36" fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeWidth={3.5} />
        <circle cx="150" cy="42" r="3.5" fill="currentColor" />
        <line x1="150" y1="42" x2="150" y2="20" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        <line x1="150" y1="42" x2="172" y2="52" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />

        {/* Conveyor belt */}
        <line x1={beltStart} y1={beltY} x2={beltEnd} y2={beltY} stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        <line x1="50" y1="140" x2="250" y2="140" stroke="currentColor" strokeOpacity={0.4} strokeWidth={2} />

        {/* Static packages on belt */}
        {packageXs.map((x) => (
          <rect
            key={x}
            x={x}
            y={packageY}
            width={packageW}
            height={packageH}
            rx="3"
            fill="currentColor"
            fillOpacity={0.25}
            stroke="currentColor"
            strokeWidth={2.5}
          />
        ))}
      </svg>
    </div>
  )
}

interface BannerSlide {
  id: string
  text: ReactNode
  art: ReactNode
}

const bannerSlides: BannerSlide[] = [
  {
    id: 'value',
    text: (
      <h1 className="max-w-xl text-2xl font-bold leading-snug tracking-tight text-white sm:max-w-2xl sm:text-3xl lg:text-4xl">
        Eat{' '}
        <span className="font-['Dancing_Script',cursive] text-4xl font-bold text-emerald-100 sm:text-5xl lg:text-6xl">
          great
        </span>{' '}
        food.
        <br />
        Pay a{' '}
        <span className="font-['Dancing_Script',cursive] text-4xl font-bold text-emerald-100 sm:text-5xl lg:text-6xl">
          fraction
        </span>{' '}
        of the price.
      </h1>
    ),
    art: <BannerUtensilArt />,
  },
  {
    id: 'mission',
    text: (
      <h1 className="max-w-xl text-2xl font-bold leading-snug tracking-tight text-white sm:max-w-2xl sm:text-3xl lg:text-4xl">
        Our mission is to rescue{' '}
        <span className="font-['Dancing_Script',cursive] text-4xl font-bold text-emerald-100 sm:text-5xl lg:text-6xl">
          delicious
        </span>{' '}
        food before time runs out.
      </h1>
    ),
    art: <BannerMissionArt />,
  },
]

function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [animPhase, setAnimPhase] = useState<'idle' | 'out' | 'in'>('idle')

  const changeSlide = (direction: 1 | -1) => {
    if (animPhase !== 'idle') return
    setAnimPhase('out')
    window.setTimeout(() => {
      setActiveSlide((i) => (i + direction + bannerSlides.length) % bannerSlides.length)
      setAnimPhase('in')
      window.setTimeout(() => setAnimPhase('idle'), 450)
    }, 450)
  }

  const goToSlide = (index: number) => {
    if (animPhase !== 'idle' || index === activeSlide) return
    setAnimPhase('out')
    window.setTimeout(() => {
      setActiveSlide(index)
      setAnimPhase('in')
      window.setTimeout(() => setAnimPhase('idle'), 450)
    }, 450)
  }

  const slide = bannerSlides[activeSlide]
  const animClass = animPhase === 'out' ? 'banner-fall-out' : animPhase === 'in' ? 'banner-fall-in' : ''

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 right-1/3 h-32 w-32 rounded-full bg-white/10"
      />

      <button
        type="button"
        aria-label="Previous banner"
        onClick={() => changeSlide(-1)}
        className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 sm:left-4"
      >
        <IconChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next banner"
        onClick={() => changeSlide(1)}
        className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 sm:right-4"
      >
        <IconChevronRight className="h-5 w-5" />
      </button>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-8 px-12 py-7 pb-10 sm:px-14 sm:py-9 sm:pb-11 lg:px-16 lg:py-10 lg:pb-12">
        <div className={`min-h-[5.5rem] flex-1 sm:min-h-[6.5rem] lg:min-h-[7rem] ${animClass}`}>
          {slide.text}
        </div>
        <div className={`hidden shrink-0 sm:block ${animClass}`}>{slide.art}</div>
      </div>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {bannerSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to banner ${i + 1}`}
            aria-current={i === activeSlide ? 'true' : undefined}
            onClick={() => goToSlide(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === activeSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/65'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

/* ─── Mock data ─── */

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: IconHome },
  { id: 'grocery', label: 'Grocery', icon: IconGrocery },
  { id: 'vegan', label: 'Vegan', icon: IconVegan },
  { id: 'dairy', label: 'Dairy & Eggs', icon: IconDairy },
  { id: 'meat', label: 'Meat & Seafood', icon: IconMeat },
  { id: 'bakery', label: 'Bakery', icon: IconBakery },
  { id: 'meals', label: 'Prepared Meals', icon: IconMeals },
  { id: 'deals', label: 'Deals', icon: IconDeals },
]

const pills: Pill[] = [
  { id: 'flash-deals', emoji: '🔥', label: 'Flash Deals' },
  { id: 'grocery', emoji: '🛒', label: 'Grocery' },
  { id: 'convenience', emoji: '🏪', label: 'Convenience' },
  { id: 'burgers', emoji: '🍔', label: 'Burgers' },
  { id: 'pizza', emoji: '🍕', label: 'Pizza' },
  { id: 'wings', emoji: '🍗', label: 'Wings' },
  { id: 'sandwiches', emoji: '🥪', label: 'Sandwiches & Delis' },
  { id: 'sushi', emoji: '🍣', label: 'Sushi' },
  { id: 'mexican', emoji: '🌮', label: 'Mexican' },
  { id: 'chinese', emoji: '🥡', label: 'Chinese' },
  { id: 'thai', emoji: '🍜', label: 'Thai' },
  { id: 'italian', emoji: '🍝', label: 'Italian' },
  { id: 'indian', emoji: '🍛', label: 'Indian' },
  { id: 'mediterranean', emoji: '🥙', label: 'Mediterranean' },
  { id: 'breakfast', emoji: '🥞', label: 'Breakfast & Brunch' },
  { id: 'coffee-tea', emoji: '☕', label: 'Coffee & Tea' },
  { id: 'bakery-desserts', emoji: '🍰', label: 'Bakery & Desserts' },
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

const textButtonHover = 'hover:bg-gray-300'

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

function CategoryPills({
  pills,
  activePill,
  onSelect,
}: {
  pills: Pill[]
  activePill: string | null
  onSelect: (id: string | null) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  const arrowBtnClass =
    'grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-slate-600 shadow-sm hover:bg-gray-300'

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Scroll categories left"
        onClick={() => scroll(-1)}
        className={arrowBtnClass}
      >
        <IconChevronLeft className="h-4 w-4" />
      </button>
      <div ref={trackRef} className={`flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 ${hideScrollbar}`}>
        {pills.map((pill) => {
          const selected = activePill === pill.id
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onSelect(selected ? null : pill.id)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                selected
                  ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-300'
              }`}
            >
              <span aria-hidden>{pill.emoji}</span>
              {pill.label}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        aria-label="Scroll categories right"
        onClick={() => scroll(1)}
        className={arrowBtnClass}
      >
        <IconChevronRight className="h-4 w-4" />
      </button>
    </div>
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
            className={`rounded-lg px-2 py-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 ${textButtonHover}`}
          >
            See All
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-100 text-slate-600 hover:bg-gray-300"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll(1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-100 text-slate-600 hover:bg-gray-300"
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
  savedAddresses,
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
  onSelectSaved,
  onRemoveSaved,
  onManualSave,
  onUseLocation,
}: {
  address: string
  savedAddresses: SavedAddress[]
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
  onSelectSaved: (full: string) => void
  onRemoveSaved: (id: string) => void
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
        className={`flex max-w-[10rem] items-center gap-1 overflow-hidden rounded-full border border-gray-100 px-3 py-2 text-sm md:max-w-[14rem] ${textButtonHover}`}
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
                    className={`rounded-lg px-3 py-1.5 text-sm text-slate-600 ${textButtonHover}`}
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
                      className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left ${textButtonHover}`}
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

                  {savedAddresses.map((saved) => {
                    const selected = address === saved.full
                    const secondary = saved.full.split(',').slice(1).join(',').trim()
                    return (
                      <div
                        key={saved.id}
                        className={`flex items-center gap-1 border-b border-gray-100 ${
                          selected ? 'bg-emerald-50' : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectSaved(saved.full)}
                          className={`flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left ${textButtonHover}`}
                        >
                          <IconPin className="h-4 w-4 shrink-0 text-slate-500" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-slate-900">
                              {formatAddressShort(saved.full)}
                            </p>
                            {secondary && (
                              <p className="truncate text-sm text-slate-500">{secondary}</p>
                            )}
                          </div>
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${formatAddressShort(saved.full)}`}
                          onClick={() => onRemoveSaved(saved.id)}
                          className={`mr-3 grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:text-slate-600 ${textButtonHover}`}
                        >
                          <IconX className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() => onSetMode('manual')}
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

                <div className="border-t border-gray-100 px-4 py-3">
                  <button
                    type="button"
                    className={`flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-slate-700 ${textButtonHover}`}
                  >
                    <IconUser className="h-4 w-4" />
                    Sign in for saved address
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onUseLocation}
                  disabled={locationLoading}
                  className={`flex w-full items-start gap-3 border-t border-gray-100 px-4 py-3 text-left disabled:opacity-60 ${textButtonHover}`}
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
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState('')
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
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
    const trimmed = address.trim()
    if (!trimmed) return

    setSavedAddresses((prev) => {
      if (prev.some((a) => a.full === trimmed)) return prev
      return [...prev, { id: crypto.randomUUID(), full: trimmed }]
    })
    setDeliveryAddress(trimmed)
    setAddressDropdownOpen(false)
    setAddressPanelMode('search')
    setAddressDraft('')
    setAddressSuggestions([])
    if (pendingId) {
      setCartCount((c) => c + 1)
      setPendingProductId(null)
    }
  }

  const selectAddress = (address: string) => {
    setDeliveryAddress(address)
    setAddressDropdownOpen(false)
    setAddressPanelMode('search')
    setAddressDraft('')
    setAddressSuggestions([])
  }

  const removeAddress = (id: string) => {
    setSavedAddresses((prev) => {
      const removed = prev.find((a) => a.id === id)
      const next = prev.filter((a) => a.id !== id)
      if (removed && removed.full === deliveryAddress) {
        setDeliveryAddress(next[0]?.full ?? '')
      }
      return next
    })
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

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800 [&_button]:cursor-pointer">
      {/* Sticky control bar */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 px-4 py-3 lg:gap-4">
          <button
            type="button"
            aria-label="Toggle food categories"
            aria-expanded={sidebarOpen}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gray-100 text-slate-600 ${textButtonHover}`}
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <IconMenu className="h-5 w-5" />
          </button>

          <div className="relative min-w-0 flex-1 max-w-2xl">
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
              savedAddresses={savedAddresses}
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
              onSelectSaved={selectAddress}
              onRemoveSaved={removeAddress}
              onManualSave={handleManualSave}
              onUseLocation={handleUseCurrentLocation}
            />
            <button type="button" className={`hidden rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline ${textButtonHover}`}>
              Sign In
            </button>
            <button type="button" className={`hidden rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline ${textButtonHover}`}>
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

      <HeroBanner />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar — pushes content instead of overlapping */}
        <aside
          className={`h-full shrink-0 overflow-hidden border-gray-100 bg-white transition-[width] duration-200 ease-in-out ${
            sidebarOpen ? 'w-56 border-r' : 'w-0'
          }`}
        >
          <nav className="flex h-full w-56 flex-col gap-0.5 overflow-y-auto p-3">
            {sidebarItems.map((item) => {
              const active = activeSidebar === item.id
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSidebar(item.id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : `text-slate-700 ${textButtonHover}`
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-emerald-600' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-y-auto transition-[margin] duration-200 ease-in-out">
          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <CategoryPills
              pills={pills}
              activePill={activePill}
              onSelect={setActivePill}
            />

            <ProductRow title="Today's Offers" products={todaysOffers} onAdd={handleAddToCart} />
            <ProductRow title="Prepared Meals" products={preparedMeals} onAdd={handleAddToCart} />

            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  )
}
