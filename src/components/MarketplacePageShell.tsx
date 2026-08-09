import { useEffect, useRef, useState, type ReactNode } from 'react'
import ListingsPageHeader from './ListingsPageHeader'
import MarketplaceHeroBanner from './MarketplaceHeroBanner'

type MarketplacePageShellProps = {
  children: ReactNode
  searchQuery?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

export default function MarketplacePageShell({
  children,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search surplus listings...',
}: MarketplacePageShellProps) {
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const pageScrollRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollRoot = pageScrollRef.current
    const hero = heroRef.current
    if (!scrollRoot || !hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderScrolled(entry.intersectionRatio < 0.15)
      },
      { root: scrollRoot, threshold: [0, 0.15, 1] },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="h-screen overflow-hidden bg-white text-slate-800 [&_button]:cursor-pointer">
      <ListingsPageHeader
        headerScrolled={headerScrolled}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange ?? (() => undefined)}
        searchPlaceholder={searchPlaceholder}
      />

      <div ref={pageScrollRef} className="h-full overflow-y-auto overscroll-y-contain">
        <div ref={heroRef}>
          <MarketplaceHeroBanner />
        </div>
        {children}
        <div className="h-8" />
      </div>
    </div>
  )
}
