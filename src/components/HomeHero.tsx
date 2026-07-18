import { AddressEntry } from './marketplace'

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf4]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(232,247,239,0.95),transparent_30%),radial-gradient(circle_at_88%_22%,rgba(17,133,87,0.12),transparent_32%),linear-gradient(180deg,#fbfaf4_0%,#eef8f2_100%)]" aria-hidden="true" />
      <div className="absolute left-8 top-16 h-48 w-48 rounded-full bg-white/55 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-8 right-[12%] h-72 w-72 rounded-full bg-[var(--color-primary-green)]/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[680px] max-w-[var(--page-max-width)] items-center gap-10 px-4 py-14 sm:py-18 lg:grid-cols-[0.56fr_0.44fr] lg:py-20">
        <div className="mx-auto max-w-[720px] text-center lg:mx-0 lg:text-left">
          <h1 className="text-[52px] font-bold leading-[0.96] tracking-normal text-[var(--color-primary-text)] sm:text-[76px] lg:text-[84px]">
            FreshForward
          </h1>
          <p className="mx-auto mt-5 max-w-[680px] text-[20px] font-semibold leading-8 text-[var(--color-primary-text)] sm:text-2xl lg:mx-0 lg:text-[28px]">
            Affordable food. Less waste. Stronger communities.
          </p>
          <p className="mx-auto mt-3 max-w-[620px] text-[17px] leading-7 text-[var(--color-secondary-text)] sm:text-lg lg:mx-0">
            Find discounted surplus groceries and restaurant meals from nearby businesses.
          </p>
          <AddressEntry />
        </div>

        <div className="relative mx-auto h-[320px] w-full max-w-[430px] lg:h-[520px] lg:max-w-none">
          <div className="absolute inset-x-4 bottom-4 top-8 rounded-[36px] bg-white/55 shadow-[0_24px_80px_rgb(17_24_39_/_0.12)] backdrop-blur-sm" aria-hidden="true" />
          <div className="absolute left-8 top-0 h-24 w-24 rounded-[32px] bg-[var(--color-warning-amber)]/70 shadow-[0_18px_45px_rgb(17_24_39_/_0.10)]" aria-hidden="true" />
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-[var(--color-primary-green)]/20" aria-hidden="true" />
          <div className="absolute bottom-2 left-2 right-2 rounded-[34px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_60px_rgb(17_24_39_/_0.14)]">
            <div className="relative mx-auto aspect-[4/3] max-w-[340px] rounded-[28px] bg-[var(--color-pale-green)] p-5">
              <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-[#f05f4f] shadow-[inset_-12px_-10px_0_rgba(0,0,0,0.08)]" aria-hidden="true" />
              <div className="absolute left-16 top-5 h-8 w-12 -rotate-12 rounded-full bg-[var(--color-dark-green)]" aria-hidden="true" />
              <div className="absolute right-10 top-12 h-24 w-16 rotate-12 rounded-full bg-[#f3c35b] shadow-[inset_-10px_-8px_0_rgba(0,0,0,0.08)]" aria-hidden="true" />
              <div className="absolute bottom-10 left-10 h-16 w-28 rounded-[999px] bg-white shadow-[0_10px_24px_rgb(17_24_39_/_0.12)]" aria-hidden="true" />
              <div className="absolute bottom-12 left-16 h-8 w-20 rounded-[999px] bg-[#d7a86e]" aria-hidden="true" />
              <div className="absolute bottom-8 right-9 h-24 w-28 rounded-[18px] border-4 border-[var(--color-dark-green)] bg-white shadow-[0_14px_32px_rgb(17_24_39_/_0.12)]" aria-hidden="true" />
              <div className="absolute bottom-28 right-16 h-10 w-14 rounded-t-full border-4 border-b-0 border-[var(--color-dark-green)]" aria-hidden="true" />
            </div>
            <p className="mt-4 text-center text-sm font-semibold text-[var(--color-dark-green)]">
              Groceries, meals, and fresh food with a second chance.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
