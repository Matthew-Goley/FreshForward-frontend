import type { Deal } from '../data/deals'
import { ProductCard } from './marketplace'

export default function DealCard({ deal }: { deal: Deal }) {
  return <ProductCard deal={deal} />
}
