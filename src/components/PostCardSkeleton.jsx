export default function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800/80">
      <div className="mb-3 h-6 max-w-[75%] rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="mb-4 h-4 max-w-[33%] rounded bg-neutral-100 dark:bg-neutral-700" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-700" />
        <div className="h-4 max-w-[85%] rounded bg-neutral-100 dark:bg-neutral-700" />
      </div>
    </div>
  )
}
