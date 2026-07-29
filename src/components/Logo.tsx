import { Link } from 'react-router-dom'

type LogoProps = {
  className?: string
  size?: 'sm' | 'lg'
  variant?: 'light' | 'dark' | 'brand'
  linkTo?: string
  iconOnly?: boolean
}

export default function Logo({
  className = '',
  size = 'sm',
  variant = 'light',
  linkTo,
  iconOnly = false,
}: LogoProps) {
  const iconSize = size === 'lg' ? 40 : 28
  const iconFill =
    variant === 'dark' || variant === 'brand' ? '#059669' : '#ffffff'
  const iconFillSecondary =
    variant === 'brand' ? '#10B981' : iconFill

  const content = (
    <>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1"
          y="8.5"
          width="9.5"
          height="9.5"
          rx="2"
          transform="rotate(-45 5.75 13.25)"
          fill={iconFill}
        />
        <rect
          x="10.2"
          y="3.2"
          width="9.5"
          height="9.5"
          rx="2"
          transform="rotate(-45 14.95 7.95)"
          fill={iconFillSecondary}
          fillOpacity={variant === 'brand' ? 1 : 0.6}
        />
      </svg>
      {!iconOnly && (
        <span
          className={`${size === 'lg' ? 'text-3xl' : 'text-xl'} font-bold tracking-tight ${
            variant === 'dark' ? 'text-slate-900' : 'text-white'
          }`}
        >
          FreshForward
        </span>
      )}
    </>
  )

  const wrapperClass = `inline-flex items-center ${iconOnly ? '' : 'gap-2.5'} ${className}`
  const ariaLabel = iconOnly ? 'FreshForward home' : undefined

  if (linkTo) {
    return (
      <Link to={linkTo} className={wrapperClass} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  return <span className={wrapperClass}>{content}</span>
}
