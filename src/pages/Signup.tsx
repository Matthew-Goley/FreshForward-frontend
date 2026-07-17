import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../lib/AppContext'
import type { AccountType } from '../types'

export default function Signup() {
  const { signup } = useApp()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accountType, setAccountType] = useState<AccountType>('customer')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const user = signup(email, password, accountType)
    navigate(user.accountType === 'restaurant' ? '/restaurant/dashboard' : '/listings')
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-xl font-bold">Sign Up</h1>

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

        <fieldset className="flex flex-col gap-1 text-sm">
          <legend>Account type</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="accountType"
              value="customer"
              checked={accountType === 'customer'}
              onChange={() => setAccountType('customer')}
            />
            Customer
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="accountType"
              value="restaurant"
              checked={accountType === 'restaurant'}
              onChange={() => setAccountType('restaurant')}
            />
            Restaurant
          </label>
        </fieldset>

        <button type="submit" className="border border-gray-400 px-4 py-2">
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="underline">
          Login
        </Link>
      </p>
    </div>
  )
}
