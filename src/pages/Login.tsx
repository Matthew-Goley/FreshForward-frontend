import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../lib/AppContext'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const user = login(email, password)
    navigate(user.accountType === 'restaurant' ? '/restaurant/dashboard' : redirectTo || '/listings')
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-xl font-bold">Login</h1>
      <p className="mt-2 text-sm text-gray-600">Demo restaurant account: demo@restaurant.test / any password</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 px-3 py-2"
          />
        </label>
        <button type="submit" className="border border-gray-400 px-4 py-2">
          Login
        </button>
      </form>

      <p className="mt-4 text-sm">
        No account?{' '}
        <Link to="/signup" className="underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
