import { Link } from 'react-router-dom'

export default function PaymentCancel() {
  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-xl font-bold">Payment cancelled</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your payment was cancelled and your order was not placed. You have not been charged.
      </p>
      <Link to="/listings" className="mt-4 inline-block underline">
        Back to listings
      </Link>
    </div>
  )
}
