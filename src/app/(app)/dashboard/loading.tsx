import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <main
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6"
      role="status"
      aria-label="Loading your dashboard"
    >
      <div className="mb-10 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-72 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="mb-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} className="h-44" />
        ))}
      </div>
    </main>
  )
}
