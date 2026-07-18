import { useEffect, useRef, useState, type FormEvent, type SVGProps } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import illustrationCustomer from '../assets/landing/illustration-customer.png'
import illustrationPartner from '../assets/landing/illustration-partner.png'
import illustrationApp from '../assets/landing/illustration-app.png'

function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth={1.8} />
      <path d="m18 18-4.35-4.35" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}

function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Logo({ className = '', size = 'sm', dark = false }: { className?: string; size?: 'sm' | 'lg'; dark?: boolean }) {
  const iconSize = size === 'lg' ? 40 : 28
  const iconFill = dark ? '#059669' : '#ffffff'
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 26 26" fill="none" aria-hidden="true" className="shrink-0">
        <rect x="1" y="8.5" width="9.5" height="9.5" rx="2" transform="rotate(-45 5.75 13.25)" fill={iconFill} />
        <rect x="10.2" y="3.2" width="9.5" height="9.5" rx="2" transform="rotate(-45 14.95 7.95)" fill={iconFill} fillOpacity={0.6} />
      </svg>
      <span
        className={`${size === 'lg' ? 'text-3xl' : 'text-xl'} font-bold tracking-tight ${dark ? 'text-slate-900' : 'text-white'}`}
      >
        FreshForward
      </span>
    </span>
  )
}

const audienceCards = [
  {
    image: illustrationCustomer,
    title: 'Browse selection',
    body: 'Browse surplus meals and groceries from local restaurants near you, priced up to 70% off.',
    linkTo: '/browse',
    linkLabel: 'Start browsing',
  },
  {
    image: illustrationPartner,
    title: 'Become a partner',
    body: 'Turn unsold inventory into revenue instead of the dumpster. Set your own price and pickup window.',
    linkTo: '/restaurant/apply',
    linkLabel: 'Apply to list',
  },
  {
    image: illustrationApp,
    title: 'Get easy access',
    body: 'The FreshForward app is on the way. Browse, reserve, and get notified the moment new surplus drops.',
    linkTo: '/browse',
    linkLabel: 'Get the app',
    // No app exists yet, so this card is held back from rendering below.
    // Kept in the data (not deleted) so it's a one-line flip once there is one.
    enabled: false,
  },
]

// Names drawn from the same vendor list already used in Browse.tsx's product
// catalog, deliberately excluding real chains that also appear there
// (ALDI, Chipotle, Whole Foods, etc.) since listing those here would imply
// a partnership that doesn't exist.
const partners = ['Parisian Bakery', 'Local Harvest Co.', 'Curry House', 'Harbor Fish Market', 'Bodega Express', 'CookUnity']

const stats = [
  { value: '1,180 lbs', label: 'Food rescued this month' },
  { value: '$14,900', label: 'Saved by customers' },
  { value: '38', label: 'Restaurants live on FreshForward' },
]

// Same category set and ids as Browse.tsx's sidebar, minus "Home". Kept in
// sync rather than inventing a separate list. The `id` matches Browse.tsx's
// SidebarCategoryId exactly so the ?category= link lands on the right tab.
const footerCategories = [
  { label: 'Grocery', id: 'grocery' },
  { label: 'Vegan', id: 'vegan' },
  { label: 'Dairy & Eggs', id: 'dairy' },
  { label: 'Meat & Seafood', id: 'meat' },
  { label: 'Bakery', id: 'bakery' },
  { label: 'Prepared Meals', id: 'meals' },
  { label: 'Deals', id: 'deals' },
]

// All point at the same /company skeleton page for now, until each gets its
// own real page.
const footerCompanyLinks = ['About Us', 'Careers', 'Contact Us', 'Our Team', 'Company Blog']

const footerBusinessLinks = [
  { label: 'Become a Partner', to: '/restaurant/apply' },
  { label: 'Partner Central', to: '/doing-business' },
  { label: 'Promotions', to: '/doing-business' },
]

export default function Landing() {
  const [zip, setZip] = useState('')
  const [topSearchQuery, setTopSearchQuery] = useState('')
  const [headerVisible, setHeaderVisible] = useState(false)
  const navigate = useNavigate()
  const heroRef = useRef<HTMLElement>(null)

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    navigate('/browse')
  }

  // Same scroll-driven header pattern Browse.tsx uses, adapted for normal
  // document scrolling (Landing doesn't use Browse's custom scroll container).
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setHeaderVisible(entry.intersectionRatio < 0.1), {
      threshold: [0, 0.1, 1],
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Sticky top bar: hidden while the hero (which has its own logo + auth row) is in view, slides in once scrolled past it */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white shadow-sm transition-all duration-300 ${
          headerVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3 sm:gap-6 sm:px-10 lg:px-14">
          <Link to="/" aria-label="FreshForward home" className="shrink-0">
            <Logo dark />
          </Link>

          <form onSubmit={handleSearch} className="min-w-0 max-w-md flex-1">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-4 pr-1.5">
              <IconSearch className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="text"
                value={topSearchQuery}
                onChange={(e) => setTopSearchQuery(e.target.value)}
                placeholder="Search FreshForward..."
                aria-label="Search FreshForward"
                className="min-w-0 flex-1 border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 sm:px-4"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:px-4"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-emerald-600">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-[10%] h-72 w-72 rounded-full bg-white/10" />
        <div aria-hidden className="pointer-events-none absolute right-1/3 top-8 h-24 w-24 rounded-full bg-white/10" />

        {/* Top bar: logo left, auth actions right. One seamless row, no separate nav underneath */}
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 pt-6 sm:px-10 lg:px-14">
          <Link to="/" aria-label="FreshForward home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/15 sm:px-4"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-white px-3.5 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50 sm:px-4"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Main hero graphic: logo mark, slogan, search bar */}
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28">
          <Logo size="lg" />
          <h1 className="mt-6 max-w-2xl text-3xl font-bold leading-snug tracking-tight text-white sm:text-4xl lg:text-5xl">
            Food,{' '}
            <span className="font-['Dancing_Script',cursive] text-4xl font-bold text-emerald-100 sm:text-5xl lg:text-6xl">
              finally
            </span>{' '}
            affordable.
          </h1>
          <p className="mt-5 max-w-xl text-emerald-50/90">
            Browse surplus food from restaurants and grocers near you. Order in seconds, pick up curbside.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-9 flex w-full max-w-md items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-lg shadow-emerald-900/20"
          >
            <IconSearch className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="Enter your zip code"
              aria-label="Enter your zip code"
              className="min-w-0 flex-1 border-none bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Find food near you"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
            >
              <IconArrowRight className="h-4 w-4" />
            </button>
          </form>

          <Link
            to="/browse"
            className="mt-4 text-sm font-medium text-emerald-50/90 underline decoration-emerald-200/50 underline-offset-4 hover:text-white"
          >
            or browse everything near you →
          </Link>
        </div>
      </section>

      {/* Partners */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 pt-14">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Trusted by local restaurants &amp; grocers
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map((name) => (
              <span key={name} className="text-lg font-bold text-slate-400">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid grid-cols-1 gap-8 border-t border-slate-200 pt-10 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-3xl font-bold text-emerald-600 sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">Concept figures for this preview, not live data.</p>
        </div>
      </section>

      {/* Each widget gets its own full section, alternating layout. Mirrors DoorDash's "Become a Dasher" banner treatment */}
      {audienceCards
        .filter((card) => card.enabled !== false)
        .map(({ image, title, body, linkTo, linkLabel }, i) => (
        <section key={title} className={i % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
          <div
            className={`mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-16 sm:py-20 ${
              i % 2 === 1 ? 'sm:flex-row-reverse' : 'sm:flex-row'
            }`}
          >
            <img src={image} alt="" className="h-56 w-56 shrink-0 object-contain sm:h-64 sm:w-64" />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">{title}</h2>
              <p className="mt-3 max-w-sm text-slate-500">{body}</p>
              <Link
                to={linkTo}
                className="mt-6 inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                {linkLabel}
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Minimal closing banner */}
      <section className="bg-emerald-600">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to eat well for less?</h2>
          <p className="mt-3 text-emerald-50/90">Create a free account and start saving on your first order today.</p>
          <Link
            to="/signup"
            className="mt-6 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
          >
            Sign up free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-neutral-400">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <Logo />
              <p className="mt-4 max-w-xs text-sm text-neutral-400">
                Surplus food from local restaurants and grocers, priced to move. Curbside pickup only.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Popular Categories</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {footerCategories.map(({ label, id }) => (
                  <li key={id}>
                    <Link to={`/browse?category=${id}`} className="text-neutral-400 transition-colors hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {footerCompanyLinks.map((label) => (
                  <li key={label}>
                    <Link to="/company" className="text-neutral-400 transition-colors hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Doing Business</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {footerBusinessLinks.map(({ label, to }) => (
                  <li key={label}>
                    {to === '#' ? (
                      <a href="#" className="text-neutral-400 transition-colors hover:text-white">
                        {label}
                      </a>
                    ) : (
                      <Link to={to} className="text-neutral-400 transition-colors hover:text-white">
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 text-xs text-neutral-500 sm:flex-row">
            <p>© {new Date().getFullYear()} FreshForward.</p>
            <div className="flex items-center gap-5">
              <Link to="/privacy" className="text-neutral-400 transition-colors hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="text-neutral-400 transition-colors hover:text-white">
                Terms
              </Link>
              <a href="#" className="text-neutral-400 transition-colors hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
