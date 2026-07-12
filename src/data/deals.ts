export interface Deal {
  id: string
  name: string
  vendor: string
  price: number
  originalPrice: number
  discount: number // percent off, e.g. 75
  quantity: string
  expires: string
  emoji: string
}

export const deals: Deal[] = [
  { id: 'brioche-buns', name: 'Brioche Burger Buns', vendor: 'ALDI', price: 0.87, originalPrice: 3.49, discount: 75, quantity: '10 packs of 8', expires: '2 days', emoji: '🍔' },
  { id: 'fresh-baguette', name: 'Fresh Baguette', vendor: 'Key Food', price: 0.87, originalPrice: 3.49, discount: 75, quantity: '6 loaves', expires: '12 hours', emoji: '🥖' },
  { id: 'organic-bananas', name: 'Organic Bananas', vendor: "Trader Joe's", price: 0.99, originalPrice: 3.49, discount: 72, quantity: '10 bunches', expires: '2 days', emoji: '🍌' },
  { id: 'pepperoni-slice', name: 'Pepperoni Slice', vendor: "Joe's Pizza", price: 1.05, originalPrice: 3.5, discount: 70, quantity: '12 slices', expires: '2 hours', emoji: '🍕' },
  { id: 'orange-chicken', name: 'Orange Chicken', vendor: 'Panda Express', price: 3.45, originalPrice: 11.5, discount: 70, quantity: '5 plates', expires: '3 hours', emoji: '🍗' },
  { id: 'beijing-beef', name: 'Beijing Beef', vendor: 'Panda Express', price: 3.6, originalPrice: 12.0, discount: 70, quantity: '4 plates', expires: '3 hours', emoji: '🥩' },
  { id: 'guac-chips', name: 'Guacamole & Chips', vendor: 'Chipotle Mexican Grill', price: 1.95, originalPrice: 6.5, discount: 70, quantity: '8 servings', expires: '6 hours', emoji: '🥑' },
  { id: 'sofritas-bowl', name: 'Sofritas Bowl', vendor: 'Chipotle Mexican Grill', price: 3.15, originalPrice: 10.5, discount: 70, quantity: '3 bowls', expires: '5 hours', emoji: '🥗' },
]
