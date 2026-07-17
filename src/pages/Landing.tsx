import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold">FreshForward</h1>
      <p className="mt-2 text-gray-700">
        Browse surplus food from local restaurants at a discount and help reduce food waste.
      </p>
      <div className="mt-6 flex gap-4">
        <Link to="/listings" className="border border-gray-400 px-4 py-2">
          Browse Listings
        </Link>
        <Link to="/signup" className="border border-gray-400 px-4 py-2">
          Sign Up
        </Link>
      </div>
    </div>
  )
}
