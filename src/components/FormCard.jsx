export default function FormCard({ title, children, className = '' }) {
  return (
    <div
      className={`
        rounded-2xl border-2 border-neutral-200 bg-gradient-to-b from-neutral-50 to-white
        p-6 shadow-sm dark:border-neutral-700 dark:from-neutral-800/50 dark:to-neutral-800
        ${className}
      `}
    >
      {title && (
        <h2 className="mb-5 border-b border-neutral-200 pb-3 text-lg font-semibold text-neutral-800 dark:border-neutral-600 dark:text-neutral-200">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
