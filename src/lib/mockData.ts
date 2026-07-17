import type { Listing, Order, Restaurant } from '../types'

export const initialRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Green Table Cafe',
    contactEmail: 'demo@restaurant.test',
    address: '123 Main St, Amherst, MA',
    description: 'Farm-to-table cafe with daily surplus prepared meals.',
    status: 'approved',
  },
  {
    id: 'rest-2',
    name: 'Riverside Bakery',
    contactEmail: 'bakery@restaurant.test',
    address: '88 River Rd, Northampton, MA',
    description: 'Neighborhood bakery with end-of-day bread and pastries.',
    status: 'approved',
  },
]

export const initialListings: Listing[] = [
  {
    id: 'listing-1',
    restaurantId: 'rest-1',
    restaurantName: 'Green Table Cafe',
    title: 'Chef Special Pasta Box',
    description: "Leftover pasta primavera from tonight's service, packed for pickup.",
    originalPrice: 14,
    discountedPrice: 5,
    quantityAvailable: 6,
    pickupWindow: '5:00 PM - 6:00 PM',
  },
  {
    id: 'listing-2',
    restaurantId: 'rest-1',
    restaurantName: 'Green Table Cafe',
    title: 'Soup & Bread Bundle',
    description: 'Daily soup special with a half loaf of house bread.',
    originalPrice: 9,
    discountedPrice: 3.5,
    quantityAvailable: 4,
    pickupWindow: '7:30 PM - 8:00 PM',
  },
  {
    id: 'listing-3',
    restaurantId: 'rest-2',
    restaurantName: 'Riverside Bakery',
    title: 'Assorted Pastry Bag',
    description: 'A mix of croissants, muffins, and scones baked this morning.',
    originalPrice: 12,
    discountedPrice: 4,
    quantityAvailable: 8,
    pickupWindow: '6:00 PM - 7:00 PM',
  },
  {
    id: 'listing-4',
    restaurantId: 'rest-2',
    restaurantName: 'Riverside Bakery',
    title: 'Day-Old Sourdough Loaf',
    description: 'Whole sourdough loaves from yesterday, still fresh.',
    originalPrice: 8,
    discountedPrice: 2.5,
    quantityAvailable: 5,
    pickupWindow: '6:00 PM - 7:00 PM',
  },
]

export const initialOrders: Order[] = [
  {
    id: 'order-1',
    listingId: 'listing-1',
    listingTitle: 'Chef Special Pasta Box',
    restaurantName: 'Green Table Cafe',
    pickupWindow: '5:00 PM - 6:00 PM',
    price: 5,
    customerEmail: 'jane@example.com',
  },
]
