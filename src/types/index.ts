export type AccountType = 'customer' | 'restaurant'
export type RestaurantStatus = 'pending' | 'approved' | 'rejected'
export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'payment_failed'
  | 'ready'
  | 'picked_up'
  | 'cancelled'

export interface CurrentUser {
  id: string
  username: string
  email: string
  accountType: AccountType
  isAdmin: boolean
  restaurantId: string | null // non-null iff this user owns a restaurant
}

export interface Listing {
  id: string
  restaurantId: string
  restaurantName: string
  title: string
  description: string
  originalPrice: number // DOLLARS
  discountedPrice: number // DOLLARS
  quantityAvailable: number
  pickupWindow: string
  createdAt: string
}

export interface Restaurant {
  id: string
  name: string
  contactEmail: string
  address: string
  description: string
  status: RestaurantStatus
  rejectionReason: string | null
}

export interface Order {
  id: string
  listingId: string
  listingTitle: string
  restaurantName: string
  customerEmail: string
  pickupWindow: string
  quantity: number
  price: number // DOLLARS, total for the line
  status: OrderStatus
  createdAt: string
}

export interface ListingInput {
  title: string
  description: string
  originalPrice: number // DOLLARS
  discountedPrice: number // DOLLARS
  quantityAvailable: number
  pickupWindow: string
}

export interface ApplicationInput {
  name: string
  contactEmail: string
  address: string
  description: string
}
