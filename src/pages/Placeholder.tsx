import { Link } from 'react-router-dom'

interface PlaceholderProps {
  title: string
  description: string
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Coming soon</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-4 text-slate-500">{description}</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
      >
        Back to home
      </Link>
    </div>
  )
}
