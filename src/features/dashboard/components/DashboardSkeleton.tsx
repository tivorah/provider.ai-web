export function DashboardSkeleton() {
  return <section className="pinned-workspace-page space-y-8" role="status" aria-label="Loading overview">
    <span className="sr-only">Loading your overview…</span>
    <div className="h-24 w-72 rounded-xl bg-line/50 motion-safe:animate-pulse" />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map(item => <div key={item} className="h-40 rounded-xl bg-line/50 motion-safe:animate-pulse" />)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><div className="h-96 rounded-xl bg-line/50 motion-safe:animate-pulse" /><div className="h-96 rounded-xl bg-line/50 motion-safe:animate-pulse" /></div>
  </section>;
}
