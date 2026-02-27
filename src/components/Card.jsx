export default function Card({
  as: Component = 'div',
  padding = 'default',
  hover = false,
  className = '',
  children,
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }
  return (
    <Component
      className={`
        rounded-2xl border border-neutral-200 bg-white shadow-sm
        dark:border-neutral-700 dark:bg-neutral-800/80
        ${hover ? 'transition-shadow hover:shadow-md dark:hover:shadow-neutral-900/50' : ''}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  )
}
