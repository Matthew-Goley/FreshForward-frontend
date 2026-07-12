export default function Sell() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 text-center">
      <h1 className="text-3xl font-bold text-slate-900">You cook it, we sell it.</h1>
      <p className="mx-auto mt-3 max-w-lg text-slate-500">
        Join hundreds of local sellers reducing food waste and earning extra income.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-6 text-left">
          <div className="text-3xl">🛒</div>
          <h2 className="mt-3 text-lg font-semibold">Start as Grocer</h2>
          <p className="mt-1 text-sm text-slate-500">
            List surplus inventory from your restaurant or store at a discount.
          </p>
          <button className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Get started
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6 text-left">
          <div className="text-3xl">🧺</div>
          <h2 className="mt-3 text-lg font-semibold">Start as Seller</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sell homemade food and fresh produce to neighbors in your community.
          </p>
          <button className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Get started
          </button>
        </div>
      </div>
    </div>
  )
}
