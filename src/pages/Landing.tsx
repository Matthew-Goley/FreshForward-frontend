import { useEffect, useRef, useState, type SVGProps } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import HeroAddressSearch from '../components/HeroAddressSearch'
import illustrationCustomer from '../assets/landing/illustration-customer.png'
import illustrationPartner from '../assets/landing/illustration-partner.png'
import illustrationApp from '../assets/landing/illustration-app.png'

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

const audienceCards = [
  {
    image: illustrationPartner,
    title: 'Become a partner',
    body: 'Turn unsold inventory into revenue instead of waste. Set your own price and pickup window.',
    linkTo: '/restaurant/apply',
    linkLabel: 'Apply to list',
  },
  {
    image: illustrationCustomer,
    title: 'Browse selection',
    body: 'Browse surplus meals and groceries from local restaurants near you at reduced prices.',
    linkTo: '/browse',
    linkLabel: 'Start browsing',
  },
  {
    image: illustrationApp,
    title: 'Get easy access',
    body: 'Browse, reserve, and pick up surplus food from restaurants and grocers in your area.',
    linkTo: '/browse',
    linkLabel: 'Get started',
  },
]

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

const heroBackgroundImage =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2400&q=80'

export default function Landing() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

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
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white shadow-sm transition-all duration-300 ${
          headerVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
        }`}
      >
        <div className="flex w-full items-center justify-between px-8 py-3 sm:px-12 lg:px-20 xl:px-28">
          <Logo variant="dark" linkTo="/" iconOnly />
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-emerald-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="relative flex min-h-[88vh] flex-col overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackgroundImage})` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-900/70 to-emerald-950/85"
        />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex w-full items-center justify-between px-8 pt-6 sm:px-12 lg:px-20 xl:px-28">
            <Logo variant="light" linkTo="/" iconOnly size="lg" />
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/login"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold text-white transition-colors hover:text-emerald-100"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-10 text-center sm:pb-20">
            <Logo size="lg" variant="light" linkTo="/" />

            <h1 className="mt-8 max-w-2xl text-3xl font-extrabold uppercase leading-tight tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
              Surplus food from local restaurants
            </h1>
            <p className="mt-3 text-sm text-white/90 drop-shadow-sm">Curbside pickup in your area</p>

            <HeroAddressSearch />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-3 sm:gap-8 sm:py-20 lg:px-10">
          {audienceCards.map(({ image, title, body, linkTo, linkLabel }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="grid h-36 w-36 place-items-center rounded-full bg-slate-50">
                <img src={image} alt="" className="h-24 w-24 object-contain" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">{body}</p>
              <Link
                to={linkTo}
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                {linkLabel}
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Everything you crave, delivered.
            </h2>
            <p className="mt-5 text-xl font-bold text-slate-900">Your favorite local restaurants</p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
              Get a prepared meal or fresh groceries from restaurants and grocers near you — surplus
              inventory priced to move, ready for curbside pickup.
            </p>
            <Link
              to="/browse"
              className="mt-8 inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Browse near you
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src={illustrationCustomer}
              alt=""
              className="h-auto w-full max-w-md object-contain"
            />
          </div>
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
