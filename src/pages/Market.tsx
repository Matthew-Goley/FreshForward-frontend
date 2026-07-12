export default function Market() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">Farmers Market</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Explore Market</h1>
      <p className="mt-2 text-slate-500">
        Homemade food and fresh produce from your neighbors. Support local households.
      </p>

      {/* Seller grid (skeleton placeholders) */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-4">
            <div className="h-32 rounded-lg bg-slate-100" />
            <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  )
}
