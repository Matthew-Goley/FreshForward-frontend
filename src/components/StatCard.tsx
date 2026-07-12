import type { Stat } from '../data/site'

export default function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-emerald-700 sm:text-3xl">{stat.value}</div>
      <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
    </div>
  )
}
