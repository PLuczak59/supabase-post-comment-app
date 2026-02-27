import { useState } from 'react'

export default function PasswordInput({
  label,
  error,
  className = '',
  id,
  ...props
}) {
  const [visible, setVisible] = useState(false)
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {label}
        </span>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={`
            w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 pr-11 text-neutral-900
            placeholder:text-neutral-400
            focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20
            dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500
            dark:focus:border-violet-400 dark:focus:ring-violet-400/20
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          tabIndex={-1}
        >
          {visible ? 'Masquer' : 'Afficher'}
        </button>
      </div>
      {error && (
        <span className="text-sm text-red-500 dark:text-red-400">{error}</span>
      )}
    </label>
  )
}

