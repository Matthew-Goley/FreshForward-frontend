import { useState } from 'react'
import { deals } from '../data/deals'
import { ProductCard, SearchBar } from '../components/marketplace'

const sortOptions = ['Recommended', 'Closest', 'Lowest price', 'Biggest discount', 'Expiring soon']
const categoryShortcuts = ['All', 'Groceries', 'Prepared Meals', 'Bakery', 'Produce', 'Restaurants']
const activeFilters = ['Available now', 'Under $5', 'Grocery']

const filterGroups = [
  {
    title: 'Category',
    type: 'radio',
    name: 'category',
    options: ['All', 'Groceries', 'Prepared Meals', 'Bakery', 'Produce', 'Restaurants'],
    selected: 'All',
  },
  {
    title: 'Availability',
    type: 'checkbox',
    name: 'availability',
    options: ['Available now', 'Pickup today', 'Expiring soon'],
    selected: 'Available now',
  },
  {
    title: 'Price',
    type: 'checkbox',
    name: 'price',
    options: ['Under $5', '$5-$10', '$10+'],
    selected: 'Under $5',
  },
  {
    title: 'Dietary',
    type: 'checkbox',
    name: 'dietary',
    options: ['Vegetarian', 'Vegan', 'Gluten-free'],
  },
  {
    title: 'Seller type',
    type: 'checkbox',
    name: 'sellerType',
    options: ['Grocery store', 'Restaurant', 'Bakery', 'Community seller'],
    selected: 'Grocery store',
  },
  {
    title: 'Distance',
    type: 'radio',
    name: 'distance',
    options: ['Under 1 mile', 'Under 3 miles', 'Under 5 miles'],
  },
]

export default function Deals() {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[var(--color-border)] pr-6 lg:block">
          <div className="sticky top-6">
            <FilterPanel />
          </div>
        </aside>

        <main>
          <div>
            <p className="text-sm font-semibold text-[var(--color-dark-green)]">Midtown, NY</p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal text-[var(--color-primary-text)] sm:text-4xl">
              Discounted food near you
            </h1>
            <p className="mt-2 max-w-2xl text-base text-[var(--color-secondary-text)]">
              Fresh discounts from nearby stores and restaurants, with pickup timing and quantity shown upfront.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <SearchBar compact />
            <label className="flex min-h-11 items-center gap-3 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-secondary-text)]">
              Sort
              <select className="min-w-0 flex-1 bg-transparent text-[var(--color-primary-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)]">
                {sortOptions.map((sort) => (
                  <option key={sort}>{sort}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="min-h-11 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-primary-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
            >
              Filters ({activeFilters.length})
            </button>
            <button
              type="button"
              className="min-h-11 rounded-[var(--radius-control)] px-3 text-sm font-semibold text-[var(--color-dark-green)] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
            >
              Clear all
            </button>
          </div>

          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {categoryShortcuts.map((category, index) => (
              <button
                key={category}
                type="button"
                aria-pressed={index === 0}
                className={[
                  'min-h-10 min-w-max rounded-full border px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2',
                  index === 0
                    ? 'border-[var(--color-primary-green)] bg-[var(--color-pale-green)] text-[var(--color-dark-green)]'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-primary-text)] hover:border-[var(--color-primary-green)]',
                ].join(' ')}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className="inline-flex min-h-8 items-center gap-1 rounded-full bg-[var(--color-pale-green)] px-3 text-sm font-medium text-[var(--color-dark-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
              >
                {filter}
                <span aria-hidden="true">x</span>
                <span className="sr-only">Remove {filter}</span>
              </button>
            ))}
            <button
              type="button"
              className="min-h-8 px-2 text-sm font-semibold text-[var(--color-dark-green)] hover:text-[var(--color-primary-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
            >
              Clear all
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {deals.map((deal) => (
              <ProductCard key={deal.id} deal={deal} />
            ))}
          </div>
        </main>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-filters-title">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/30"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-[24px] bg-white p-5 shadow-[0_-18px_45px_rgb(17_24_39_/_0.18)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="mobile-filters-title" className="text-xl font-bold text-[var(--color-primary-text)]">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="min-h-11 rounded-[var(--radius-control)] px-3 text-sm font-semibold text-[var(--color-dark-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)]"
              >
                Done
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function FilterPanel() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-primary-text)]">Filters</h2>
        <button
          type="button"
          className="text-sm font-semibold text-[var(--color-dark-green)] hover:text-[var(--color-primary-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {filterGroups.map((group) => (
          <fieldset key={group.title} className="border-t border-[var(--color-border)] pt-5">
            <legend className="text-xs font-bold uppercase tracking-wide text-[var(--color-secondary-text)]">
              {group.title}
            </legend>
            <div className="mt-3 space-y-3">
              {group.options.map((option) => {
                const inputId = `${group.name}-${option.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

                return (
                  <label
                    key={option}
                    htmlFor={inputId}
                    className="flex min-h-8 cursor-pointer items-center gap-3 text-sm font-medium text-[var(--color-primary-text)]"
                  >
                    <input
                      id={inputId}
                      name={group.name}
                      type={group.type}
                      defaultChecked={group.selected === option}
                      className="h-4 w-4 accent-[var(--color-primary-green)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-green)]"
                    />
                    <span>{option}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  )
}
