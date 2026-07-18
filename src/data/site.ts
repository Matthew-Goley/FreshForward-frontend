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

export interface Category {
  id: string
  label: string
  helper: string
}

export const categories: Category[] = [
  { id: 'all', label: 'All', helper: 'Every nearby deal' },
  { id: 'groceries', label: 'Groceries', helper: 'Stores and markets' },
  { id: 'prepared', label: 'Prepared Meals', helper: 'Ready-to-eat food' },
  { id: 'bakery', label: 'Bakery', helper: 'Bread and pastries' },
  { id: 'produce', label: 'Produce', helper: 'Imperfect fruit and vegetables' },
  { id: 'restaurant', label: 'Restaurant', helper: 'Meals from local kitchens' },
  { id: 'under-5', label: 'Under $5', helper: 'Low-price finds' },
  { id: 'expiring', label: 'Expiring Soon', helper: 'Pickup windows closing' },
]

export interface Seller {
  id: string
  name: string
  category: string
  distance: string
  pickupAvailability: string
  activeDeals: number
  verified: boolean
}

export const sellers: Seller[] = [
  {
    id: 'aldi-midtown',
    name: 'ALDI Midtown',
    category: 'Grocery store',
    distance: '0.8 mi',
    pickupAvailability: 'Pickup today',
    activeDeals: 6,
    verified: true,
  },
  {
    id: 'key-food-west',
    name: 'Key Food West',
    category: 'Grocery store',
    distance: '1.1 mi',
    pickupAvailability: 'Open until 9 PM',
    activeDeals: 4,
    verified: true,
  },
  {
    id: 'joes-pizza',
    name: "Joe's Pizza",
    category: 'Restaurant',
    distance: '0.6 mi',
    pickupAvailability: 'Pickup by 8 PM',
    activeDeals: 3,
    verified: true,
  },
]

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
