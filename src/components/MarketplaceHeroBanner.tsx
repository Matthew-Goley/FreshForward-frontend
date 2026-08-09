import { useState, type ReactNode, type SVGProps } from 'react'

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
        <circle cx="150" cy="42" r="36" fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeWidth={3.5} />
        <circle cx="150" cy="42" r="3.5" fill="currentColor" />
        <line x1="150" y1="42" x2="150" y2="20" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        <line x1="150" y1="42" x2="172" y2="52" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
        <line x1={beltStart} y1={beltY} x2={beltEnd} y2={beltY} stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        <line x1="50" y1="140" x2="250" y2="140" stroke="currentColor" strokeOpacity={0.4} strokeWidth={2} />
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

export default function MarketplaceHeroBanner() {
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
    <section className="relative w-full overflow-hidden bg-emerald-600 pt-14">
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
