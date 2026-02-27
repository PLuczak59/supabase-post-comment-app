export default function Button({
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60'

  const variants = {
    primary:
      'bg-violet-600 text-white shadow-md shadow-violet-600/25 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/30 hover:-translate-y-0.5 focus:ring-violet-500 dark:bg-violet-500 dark:shadow-violet-500/25 dark:hover:bg-violet-400',
    secondary:
      'border-2 border-neutral-300 bg-white text-neutral-700 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 focus:ring-violet-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-violet-500 dark:hover:bg-violet-950/50',
    ghost:
      'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-400 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
    danger:
      'bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600 hover:shadow-red-500/30 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-500',
    dangerGhost:
      'text-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-400 dark:text-red-400 dark:hover:bg-red-950/40',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const size = sizes[props.size] || sizes.md
  delete props.size

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
