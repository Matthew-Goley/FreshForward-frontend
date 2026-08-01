import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export type AuthLayoutHero = {
  line1: string
  line2: string
  body: string
}

const defaultHero: AuthLayoutHero = {
  line1: 'Eat great food.',
  line2: 'Pay a fraction of the price.',
  body: 'FreshForward connects you with local restaurants offering surplus meals at a discount. Less waste, more flavor.',
}

type AuthLayoutProps = {
  title: ReactNode
  subtitle: string
  children: ReactNode
  footer: ReactNode
  hero?: AuthLayoutHero
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  hero = defaultHero,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-emerald-600 p-10 lg:flex lg:p-12">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/40" />
          <div className="pointer-events-none absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-emerald-700/50" />
          <div className="pointer-events-none absolute bottom-32 left-1/3 h-40 w-40 rounded-full bg-emerald-400/20" />

          <Logo variant="light" linkTo="/" className="relative z-10" />

          <div className="relative z-10 max-w-md">
            <p className="text-3xl font-bold leading-tight text-white">{hero.line1}</p>
            <p className="mt-1 text-3xl font-bold leading-tight text-emerald-100">{hero.line2}</p>
            <p className="mt-6 text-sm leading-relaxed text-emerald-100/90">{hero.body}</p>
          </div>

          <p className="relative z-10 text-xs text-emerald-200/80">
            &copy; {new Date().getFullYear()} FreshForward
          </p>
        </div>

        <div className="flex flex-col">
          <header className="flex items-center justify-between px-6 py-5 lg:px-12">
            <div className="lg:hidden">
              <Logo variant="dark" linkTo="/" />
            </div>
            <Link
              to="/"
              className="ml-auto text-sm font-medium text-slate-500 hover:text-emerald-600"
            >
              Back to home
            </Link>
          </header>

          <div className="flex flex-1 flex-col justify-center px-6 pb-12 lg:px-12">
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
                <div className="mt-8">{children}</div>
              </div>
              <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const authInputClassName =
  'w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'

export const authLabelClassName = 'flex flex-col gap-1.5 text-sm font-medium text-slate-700'

export const authSubmitClassName =
  'mt-2 w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

export const authTextareaClassName =
  'w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
