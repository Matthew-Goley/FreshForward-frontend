import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout, {
  authInputClassName,
  authLabelClassName,
  authSubmitClassName,
} from '../components/AuthLayout'
import { useApp } from '../lib/AppContext'
import { ApiError } from '../lib/api'
import type { AccountType } from '../types'

const accountTypeOptions: { value: AccountType; label: string; description: string }[] = [
  { value: 'customer', label: 'Customer', description: 'Browse and order surplus meals' },
  { value: 'restaurant', label: 'Restaurant', description: 'List food and manage orders' },
]

export default function Signup() {
  const { signup } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const signupState = location.state as { redirectTo?: string; accountType?: AccountType } | null
  const redirectTo = signupState?.redirectTo

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accountType, setAccountType] = useState<AccountType>(signupState?.accountType ?? 'customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // D-10: accountType is not sent to the API — the radio is routing UI only.
      await signup(email, password)
      navigate(accountType === 'restaurant' ? '/restaurant/apply' : redirectTo || '/listings')
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not create your account. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Join FreshForward"
      subtitle="Create an account and start saving on great food near you."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <label className={authLabelClassName}>
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={authInputClassName}
          />
        </label>

        <label className={authLabelClassName}>
          Password
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className={authInputClassName}
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-slate-700">Account type</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {accountTypeOptions.map((option) => {
              const selected = accountType === option.value
              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 transition-colors ${
                    selected
                      ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={option.value}
                    checked={selected}
                    onChange={() => setAccountType(option.value)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-semibold text-slate-900">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <p className="text-xs leading-relaxed text-slate-500">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="font-medium text-emerald-600 hover:text-emerald-700">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="font-medium text-emerald-600 hover:text-emerald-700">
            Privacy
          </Link>
          .
        </p>

        <button type="submit" disabled={loading} className={authSubmitClassName}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
