import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout, {
  authInputClassName,
  authLabelClassName,
  authSubmitClassName,
  authTextareaClassName,
} from '../components/AuthLayout'
import { useApp } from '../lib/AppContext'

const partnerHero = {
  line1: 'Turn surplus into sales.',
  line2: 'Not trash bags.',
  body: 'List excess food, set pickup windows, and reach customers nearby who want great food for less.',
}

export default function RestaurantApply() {
  const { submitApplication } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await submitApplication({ name, contactEmail, address, description })
      setSubmitted(true)
    } catch {
      setError('Could not submit your application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <AuthLayout
        hero={partnerHero}
        title="Application submitted"
        subtitle="Thanks for applying to partner with FreshForward."
        footer={
          <>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Sign in
            </Link>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Your application is pending approval. We&apos;ll review your details and follow up at{' '}
            <span className="font-medium">{contactEmail}</span>.
          </p>
          <Link
            to="/"
            className={`${authSubmitClassName} mt-0 inline-block text-center no-underline`}
          >
            Back to home
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      hero={partnerHero}
      title="Partner with FreshForward"
      subtitle="Apply to list surplus food and reach customers near you."
      footer={
        <>
          Already have a restaurant account?{' '}
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
          Restaurant name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your restaurant or store name"
            className={authInputClassName}
          />
        </label>

        <label className={authLabelClassName}>
          Contact email
          <input
            type="email"
            required
            autoComplete="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="you@restaurant.com"
            className={authInputClassName}
          />
        </label>

        <label className={authLabelClassName}>
          Address
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, city, state"
            className={authInputClassName}
          />
        </label>

        <label className={authLabelClassName}>
          Description
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us what you sell and when you typically have surplus food."
            className={authTextareaClassName}
          />
        </label>

        <button type="submit" disabled={loading} className={authSubmitClassName}>
          {loading ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </AuthLayout>
  )
}
