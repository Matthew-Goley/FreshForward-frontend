import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
}

const buttonVariants = {
  primary:
    'bg-[var(--color-primary-green)] text-white hover:bg-[var(--color-dark-green)] active:bg-[var(--color-dark-green)]',
  secondary:
    'border border-[var(--color-primary-green)] bg-white text-[var(--color-dark-green)] hover:bg-[var(--color-pale-green)]',
  ghost: 'text-[var(--color-secondary-text)] hover:bg-[var(--color-pale-green)] hover:text-[var(--color-dark-green)]',
}

export function Button({ children, variant = 'primary', fullWidth = false, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] px-5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)] disabled:text-white',
        buttonVariants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
}

export function IconButton({ label, children, className = '', ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={[
        'grid h-11 w-11 place-items-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary-text)] transition hover:border-[var(--color-primary-green)] hover:text-[var(--color-dark-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        className={[
          'min-h-11 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-page-background)] px-4 text-sm text-[var(--color-primary-text)] outline-none transition placeholder:text-[var(--color-secondary-text)] focus:border-[var(--color-primary-green)] focus:bg-white focus:ring-2 focus:ring-[var(--color-pale-green)]',
          className,
        ].join(' ')}
        {...props}
      />
    </label>
  )
}
