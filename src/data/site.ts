export interface Stat {
  label: string
  value: string
}

export const stats: Stat[] = [
  { value: '2,448', label: 'Meals Saved' },
  { value: '$61,010', label: 'Money Saved' },
  { value: '3,557 lbs', label: 'Food Rescued' },
]

export interface Marketplace {
  id: string
  title: string
  description: string
  highlights: string[]
  ctaLabel: string
  href: string
  emoji: string
}

export const marketplaces: Marketplace[] = [
  {
    id: 'groceries',
    title: 'Discounted Groceries',
    description: 'Live discounted prices from local restaurants and grocery stores. Curbside, in-person, or delivery.',
    highlights: ['Up to 70% off', '1842 vendors'],
    ctaLabel: 'Browse Deals',
    href: '/deals',
    emoji: '🛒',
  },
  {
    id: 'market',
    title: 'Farmers Market',
    description: 'Homemade food and fresh produce from your neighbors. Support local households.',
    highlights: ['Avg 4.8 rating', '828 sellers'],
    ctaLabel: 'Explore Market',
    href: '/market',
    emoji: '🧺',
  },
]
