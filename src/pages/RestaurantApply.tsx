import { useState } from 'react'
import type { FormEvent } from 'react'
import { useApp } from '../lib/AppContext'

export default function RestaurantApply() {
  const { submitApplication } = useApp()
  const [submitted, setSubmitted] = useState(false)

  const [name, setName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    submitApplication({ name, contactEmail, address, description })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-sm px-4 py-8">
        <p className="border border-gray-400 px-4 py-3">Application submitted — pending approval</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-xl font-bold">Restaurant Application</h1>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Restaurant name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contact email
          <input
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="border border-gray-400 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Address
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-400 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Description
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-400 px-3 py-2"
          />
        </label>
        <button type="submit" className="border border-gray-400 px-4 py-2">
          Submit Application
        </button>
      </form>
    </div>
  )
}
