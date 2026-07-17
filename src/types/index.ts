export type AccountType = 'customer' | 'restaurant'

export interface CurrentUser {
  email: string
  accountType: AccountType
  restaurantId?: string
}

export interface Listing {
  id: string
  restaurantId: string
  restaurantName: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  quantityAvailable: number
  pickupWindow: string
}

export type RestaurantStatus = 'pending' | 'approved'

export interface Restaurant {
  id: string
  name: string
  contactEmail: string
  address: string
  description: string
  status: RestaurantStatus
}

export interface Order {
  id: string
  listingId: string
  listingTitle: string
  restaurantName: string
  pickupWindow: string
  price: number
  customerEmail: string
}

export interface ListingInput {
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  quantityAvailable: number
  pickupWindow: string
}

export interface ApplicationInput {
  name: string
  contactEmail: string
  address: string
  description: string
}
