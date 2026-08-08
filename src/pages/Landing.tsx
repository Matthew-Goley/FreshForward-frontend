import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import HeroAddressSearch from '../components/HeroAddressSearch'

const heroBackgroundImage =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2400&h=1350&q=85'

const heroBackgroundPosition = '88% center'

const heroOverlayGradient = [
  'radial-gradient(ellipse 85% 75% at 50% 42%, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.55) 42%, transparent 72%)',
  'linear-gradient(to right, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.65) 45%, rgba(0, 0, 0, 0.25) 100%)',
].join(', ')

const howItWorksMapImage = '/how-it-works-map.jpg'

const howItWorks = [
  {
    emoji: '🔍',
    title: 'Browse Local Surplus',
    body: 'Restaurants and grocers list excess food at deep discounts.',
    buttonLabel: 'Browse Now',
    href: '/browse',
  },
  {
    emoji: '🤝',
    title: 'Partner with Us',
    body: 'List surplus food, set a pickup window, and reach nearby customers looking for a deal.',
    buttonLabel: 'Partner With Us',
    href: '/restaurant/apply',
  },
  {
    emoji: '🌱',
    title: 'Save Money & Reduce Waste',
    body: 'Get great food for cheap while keeping edible food out of landfills.',
    buttonLabel: 'Learn More',
    href: '/company',
  },
]

type HowItWorksItem = (typeof howItWorks)[number]

function HowItWorksCard({
  item,
  onAction,
}: {
  item: HowItWorksItem
  onAction: (item: HowItWorksItem) => void
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-black/55 p-6 backdrop-blur-sm">
      <span className="text-2xl" aria-hidden>
        {item.emoji}
      </span>
      <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white">{item.body}</p>
      <button
        type="button"
        onClick={() => onAction(item)}
        className="mt-6 inline-flex w-fit cursor-pointer rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
      >
        {item.buttonLabel}
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
  { label: 'Contact Us', to: '/company' },
]

const footerBusinessLinks = [
  { label: 'Become a Partner', to: '/restaurant/apply' },
  { label: 'Partner Central', to: '/doing-business' },
]

type SplitSectionProps = {
  title: string
  body: string[]
  image: { src: string; webpSrc?: string; alt: string; width?: number; height?: number }
  reverse?: boolean
  className?: string
  cta?: { label: string; to: string; variant?: 'primary' | 'outline' }
}

function SplitSection({
  title,
  body,
  image,
  reverse = false,
  className = 'bg-white',
  cta,
}: SplitSectionProps) {
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 xl:gap-20 ${
            reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
          }`}
        >
          <div className="w-full">
            <picture>
              {image.webpSrc && <source srcSet={image.webpSrc} type="image/webp" />}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                width={image.width}
                height={image.height}
                className="aspect-[5/4] w-full object-cover sm:min-h-[20rem] lg:min-h-[28rem]"
              />
            </picture>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-black sm:text-lg">
              {body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {cta && (
              <Link
                to={cta.to}
                className={`mt-8 inline-flex w-fit rounded-full px-6 py-3 text-sm font-bold transition-colors ${
                  cta.variant === 'outline'
                    ? 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {cta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const wasteProblemSection = {
  title: 'Without a better outlet, good food goes to waste.',
  body: [
    'Restaurants and grocers toss leftover food and groceries at closing, not because they went bad, but because there is no fast way to sell what is left.',
  ],
  image: {
    src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=900&q=85',
    alt: 'Fresh groceries and produce in a store',
  },
}

const missionSection = {
  title: "We're on a mission to eliminate food waste, one meal at a time.",
  body: [
    'FreshForward is the marketplace for surplus food and groceries. We aim to save you money while keeping delicious, edible food out of landfills.',
    'Local restaurants and grocers list what they did not sell at deep discounts, and you pick it up when it works for you.',
  ],
  reverse: true,
  image: {
    src: '/mission-section.jpg',
    webpSrc: '/mission-section.webp',
    alt: 'Prepared meals packaged in a restaurant kitchen',
    width: 1200,
    height: 900,
  },
}

const shopperValueSection = {
  title: 'Surplus food near you, priced like a steal.',
  body: [
    'Pick up discounted surplus from local restaurants and grocers, with photos, pickup windows, and prices well below what you would pay on delivery apps.',
  ],
  cta: { label: 'Browse Now', to: '/browse' },
  image: {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&h=900&q=85',
    alt: 'Prepared meals and fresh food on a table',
  },
}

const partnerSection = {
  title: 'Turn unsold inventory into revenue, not trash bags.',
  body: [
    'List what did not sell, set your pickup window and discount, and put it in front of hungry customers nearby who want great food for less.',
  ],
  cta: { label: 'Partner With Us', to: '/restaurant/apply' },
  reverse: true,
  image: {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&h=900&q=85',
    alt: 'Restaurant kitchen preparing fresh food',
  },
}

export default function Landing() {
  const navigate = useNavigate()
  const [headerVisible, setHeaderVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  function handleHowItWorksAction(item: HowItWorksItem) {
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
        <div className="flex w-full items-center justify-between px-8 py-4 sm:px-12 lg:px-16 xl:px-20">
          <Logo variant="dark" linkTo="/" iconOnly />
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
          <div className="mx-auto flex w-full items-center justify-between px-8 pt-6 sm:px-12 lg:px-16 xl:px-20">
            <Logo variant="brand" linkTo="/" iconOnly />
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
              Save on meals, groceries, and produce from local spots nearby.
            </p>

            <HeroAddressSearch variant="hero" className="mt-8 max-w-xl" />
          </div>
        </div>
      </section>

      <SplitSection {...wasteProblemSection} />

      <SplitSection {...missionSection} className="bg-[#F9FAFB]" />

      <section className="relative isolate overflow-hidden py-16 sm:min-h-[36rem] sm:py-20">
        <div aria-hidden className="how-it-works-map-wrap">
          <img
            src={howItWorksMapImage}
            alt=""
            loading="lazy"
            decoding="async"
            width={1400}
            height={933}
            className="how-it-works-map-image"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/40 to-black/50"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-white/90">
            Find discounted surplus food from businesses near you.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <HowItWorksCard
                key={item.title}
                item={item}
                onAction={handleHowItWorksAction}
              />
            ))}
          </div>
        </div>
      </section>

      <SplitSection {...shopperValueSection} className="bg-[#F9FAFB]" />

      <SplitSection {...partnerSection} />

      <footer className="bg-black text-neutral-400">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <Logo variant="brand" linkTo="/" />
              <p className="mt-4 max-w-xs text-sm text-neutral-400">
                Surplus food from local restaurants and grocers.
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
