export default function Textarea({
  label,
  error,
  className = '',
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {label}
        </span>
      )}
      <textarea
        id={inputId}
        className={`
          w-full min-h-[100px] resize-y rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-neutral-900
          placeholder:text-neutral-400
          focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20
          dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500
          dark:focus:border-violet-400 dark:focus:ring-violet-400/20
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500 dark:text-red-400">{error}</span>
      )}
    </label>
  )
}
