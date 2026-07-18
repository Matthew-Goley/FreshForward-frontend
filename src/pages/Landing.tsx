import { Link } from 'react-router-dom'
import HomeHero from '../components/HomeHero'

const audiences = [
  {
    title: 'Shoppers',
    description: 'People looking for lower-cost groceries, meals, and fresh food nearby.',
  },
  {
    title: 'Local businesses',
    description: 'Restaurants, grocery stores, bakeries, and family-owned sellers with surplus inventory.',
  },
  {
    title: 'Communities',
    description: 'Neighborhoods working to reduce food waste and improve access to affordable food.',
  },
]

const shopperSteps = [
  'Enter your location',
  'Browse nearby discounted food',
  'Reserve or purchase',
  'Pick up during the listed window',
]

const sellerSteps = [
  'Create a listing',
  'Add price, quantity, and pickup time',
  'Reach nearby customers',
  'Recover revenue and reduce waste',
]

const reasons = [
  {
    title: 'Save money',
    description: 'Help households stretch food budgets with lower-cost groceries and prepared meals.',
  },
  {
    title: 'Reduce food waste',
    description: 'Give surplus and imperfect-but-good food a practical path to people who can use it.',
  },
  {
    title: 'Support local businesses',
    description: 'Help stores, restaurants, and sellers recover value from inventory they already prepared.',
  },
]

export default function Landing() {
  return (
    <>
      <HomeHero />

      <section className="bg-white">
        <div className="mx-auto max-w-[var(--page-max-width)] px-4 py-14 sm:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-dark-green)]">Our mission</p>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-primary-text)] sm:text-4xl">
            Make good food easier to afford and harder to waste.
          </h2>
          <p className="mt-4 text-lg leading-8 text-[var(--color-secondary-text)]">
            FreshForward makes nutritious food more affordable while helping local businesses recover value from surplus inventory that might otherwise go to waste.
          </p>
        </div>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--page-max-width)] px-4 py-10 sm:py-14">
        <SectionIntro title="Who FreshForward serves" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {audiences.map((audience) => (
            <article key={audience.title} className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
              <h3 className="text-lg font-bold text-[var(--color-primary-text)]">{audience.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-secondary-text)]">{audience.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[var(--page-max-width)] px-4 py-12 sm:py-16">
        <SectionIntro title="How it works" />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <StepFlow title="For shoppers" steps={shopperSteps} />
          <StepFlow title="For sellers" steps={sellerSteps} />
        </div>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--page-max-width)] px-4 py-10 sm:py-14">
        <SectionIntro title="Why it matters" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reasons.map((reason) => (
            <article key={reason.title} className="rounded-[var(--radius-card)] bg-[var(--color-pale-green)] p-5">
              <h3 className="text-lg font-bold text-[var(--color-primary-text)]">{reason.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-secondary-text)]">{reason.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[var(--page-max-width)] px-4 py-12 sm:py-16">
        <div className="grid gap-5 rounded-[var(--radius-card)] bg-[var(--color-dark-green)] p-6 text-white sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Turn surplus food into revenue</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-pale-green)]">
              List unsold groceries and meals, reach nearby customers, and reduce waste.
            </p>
          </div>
          <Link
            to="/sell"
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-white px-6 text-base font-semibold text-[var(--color-dark-green)] transition hover:bg-[var(--color-pale-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-dark-green)]"
          >
            Start selling
          </Link>
        </div>
      </section>
    </>
  )
}

function SectionIntro({ title }: { title: string }) {
  return <h2 className="text-2xl font-bold text-[var(--color-primary-text)] sm:text-3xl">{title}</h2>
}

function StepFlow({ title, steps }: { title: string; steps: string[] }) {
  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-bold text-[var(--color-primary-text)]">{title}</h3>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-pale-green)] text-sm font-bold text-[var(--color-dark-green)]">
              {index + 1}
            </span>
            <span className="pt-0.5 text-sm font-medium text-[var(--color-primary-text)]">{step}</span>
          </li>
        ))}
      </ol>
    </article>
  )
}
