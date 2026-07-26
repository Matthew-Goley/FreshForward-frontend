import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import HeroAddressSearch from '../components/HeroAddressSearch'
import { useApp } from '../lib/AppContext'
import type { AccountType } from '../types'

const heroBackgroundImage =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2400&h=1350&q=85'

const heroBackgroundPosition = '88% center'

const heroOverlayGradient = [
  'radial-gradient(ellipse 85% 75% at 50% 42%, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.55) 42%, transparent 72%)',
  'linear-gradient(to right, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.65) 45%, rgba(0, 0, 0, 0.25) 100%)',
].join(', ')

const howItWorks = [
  {
    emoji: '🔍',
    title: 'Browse Local Surplus',
    body: 'Restaurants and grocers list excess inventory at deep discounts.',
    buttonLabel: 'Browse Now',
    href: '/browse',
  },
  {
    emoji: '🤝',
    title: 'Partner with Us',
    body: 'Restaurants and vendors list surplus food, set pickup windows, and reach customers looking for deals.',
    buttonLabel: 'Partner With Us',
    href: '/restaurant/apply',
  },
  {
    emoji: '🌱',
    title: 'Save Money & Reduce Waste',
    body: 'Get high-quality food for cheap while keeping edible food out of landfills.',
    buttonLabel: 'Get Started',
    href: '/browse',
    requiresAuth: true,
    signupAccountType: 'customer' as AccountType,
  },
]

type HowItWorksItem = (typeof howItWorks)[number]

function HowItWorksCard({
  item,
  isLoggedIn,
  onAction,
}: {
  item: HowItWorksItem
  isLoggedIn: boolean
  onAction: (item: HowItWorksItem) => void
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <span className="text-2xl" aria-hidden>
        {item.emoji}
      </span>
      <h3 className="mt-4 text-lg font-bold text-black">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-black">{item.body}</p>
      <button
        type="button"
        onClick={() => onAction(item)}
        className="mt-6 inline-flex w-fit cursor-pointer rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
      >
        {item.requiresAuth && !isLoggedIn ? 'Sign Up to Continue' : item.buttonLabel}
      </button>
    </article>
  )
}

const footerCategories = [
  { label: 'Grocery', id: 'grocery' },
  { label: 'Vegan', id: 'vegan' },
  { label: 'Dairy & Eggs', id: 'dairy' },
  { label: 'Meat & Seafood', id: 'meat' },
  { label: 'Bakery', id: 'bakery' },
  { label: 'Prepared Meals', id: 'meals' },
  { label: 'Deals', id: 'deals' },
]

const footerCompanyLinks = [
  { label: 'About Us', to: '/company' },
  { label: 'Careers', to: '/company' },
  { label: 'Contact Us', to: '/company' },
]

const footerBusinessLinks = [
  { label: 'Become a Partner', to: '/restaurant/apply' },
  { label: 'Partner Central', to: '/doing-business' },
]

type SplitSectionProps = {
  title: string
  body: string[]
  image: { src: string; alt: string }
  reverse?: boolean
  className?: string
}

function SplitSection({
  title,
  body,
  image,
  reverse = false,
  className = 'bg-white',
}: SplitSectionProps) {
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <div
          className={`mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 ${
            reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
          }`}
        >
          <div className="space-y-5 text-base leading-relaxed text-black">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl shadow-lg shadow-slate-200/60">
            <img src={image.src} alt={image.alt} className="aspect-[4/3] h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

const wasteProblemSection = {
  title: 'Without a better outlet, good food goes to waste.',
  body: [
    'Restaurants and grocers prepare more than they sell. At closing time, perfectly good meals, baked goods, and produce often get tossed—not because they\u2019re bad, but because there\u2019s no quick way to move them.',
    'Meanwhile, shoppers pay full price on delivery apps or skip eating out altogether. FreshForward connects those two sides: surplus inventory listed locally, priced to move before it expires.',
  ],
  image: {
    src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=900&q=85',
    alt: 'Fresh groceries and produce in a store',
  },
}

const shopperValueSection = {
  title: 'Surplus food near you, priced like a steal—not an afterthought.',
  body: [
    'Browse listings from restaurants and grocers in your area the same way you\u2019d scroll a marketplace: photos, pickup windows, and prices that reflect surplus—not shelf price.',
    'Reserve what you want, pick it up on your schedule, and save money on food that would have gone unsold. It\u2019s full-quality inventory at a fraction of the usual cost.',
  ],
  image: {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&h=900&q=85',
    alt: 'Prepared meals and fresh food on a table',
  },
}

const partnerSection = {
  title: 'Turn unsold inventory into revenue—not trash bags.',
  body: [
    'List excess food in minutes: set your quantity, pickup window, and discount. FreshForward puts it in front of hungry customers nearby who are actively looking for deals.',
    'You recover costs on food you already made or stocked. Customers get value. Less edible food ends up in landfills. Everyone wins.',
  ],
  reverse: true,
  image: {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&h=900&q=85',
    alt: 'Restaurant kitchen preparing fresh food',
  },
}

export default function Landing() {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const [headerVisible, setHeaderVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  function handleHowItWorksAction(item: HowItWorksItem) {
    if (item.requiresAuth && !currentUser) {
      navigate('/signup', {
        state: {
          redirectTo: item.href,
          accountType: item.signupAccountType ?? 'customer',
        },
      })
      return
    }
    navigate(item.href)
  }

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
    <div className="min-h-screen bg-white text-black">
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white shadow-sm transition-all duration-300 ${
          headerVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Logo variant="dark" linkTo="/" />
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-black transition-colors hover:bg-slate-50"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="relative flex min-h-[88vh] flex-col overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBackgroundImage})`,
            backgroundPosition: heroBackgroundPosition,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: heroOverlayGradient }}
        />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
            <Logo variant="brand" linkTo="/" className="text-xl" />
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-white transition-colors hover:text-emerald-400"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-10 text-center sm:pb-20">
            <Logo size="lg" variant="brand" linkTo="/" />

            <h1 className="mt-8 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
              Local surplus food &amp; groceries, heavily discounted.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/90 drop-shadow-sm sm:text-lg">
              Save on fresh meals, baked goods, and produce from local spots nearby.
            </p>

            <HeroAddressSearch variant="hero" className="mt-8 max-w-xl" />
          </div>
        </div>
      </section>

      <SplitSection {...wasteProblemSection} />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-black">How it works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-black">
            A simple way to find discounted surplus food from businesses near you.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <HowItWorksCard
                key={item.title}
                item={item}
                isLoggedIn={Boolean(currentUser)}
                onAction={handleHowItWorksAction}
              />
            ))}
          </div>
        </div>
      </section>

      <SplitSection {...shopperValueSection} className="bg-[#F9FAFB]" />

      <SplitSection {...partnerSection} />

      <section className="bg-[#F9FAFB] py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
          <article className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-black">
                Hungry? Start exploring local deals near you.
              </h3>
              <p className="mt-2 text-sm text-black">
                Browse surplus meals and groceries listed by restaurants and grocers in your area.
              </p>
            </div>
            <Link
              to="/browse"
              className="mt-6 inline-flex w-fit rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            >
              Browse Deals
            </Link>
          </article>

          <article className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-black">Have surplus inventory?</h3>
              <p className="mt-2 text-sm text-black">
                List excess food, set your pickup window, and turn waste into revenue.
              </p>
            </div>
            <Link
              to="/restaurant/apply"
              className="mt-6 inline-flex w-fit rounded-full border border-emerald-600 px-6 py-3 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Partner With Us
            </Link>
          </article>
        </div>
      </section>

      <footer className="bg-black text-neutral-400">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <Logo variant="light" linkTo="/" />
              <p className="mt-4 max-w-xs text-sm text-neutral-400">
                Surplus food from local restaurants and grocers. Curbside pickup only.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Categories</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {footerCategories.map(({ label, id }) => (
                  <li key={id}>
                    <Link to={`/browse?category=${id}`} className="transition-colors hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {footerCompanyLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="transition-colors hover:text-white">
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
                    <Link to={to} className="transition-colors hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 text-xs text-neutral-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} FreshForward.</p>
            <div className="flex items-center gap-5">
              <Link to="/privacy" className="transition-colors hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
