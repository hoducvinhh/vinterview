export default function QuestionDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 bg-slate-900 rounded w-48 mb-6" />

      {/* Header Skeleton */}
      <div className="space-y-3 mb-8">
        <div className="h-8 bg-slate-900 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-slate-900 rounded-full w-20" />
          <div className="h-5 bg-slate-900 rounded-full w-24" />
          <div className="h-5 bg-slate-900 rounded-full w-16" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-4 mb-8">
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-800 rounded w-5/6" />
        <div className="h-4 bg-slate-800 rounded w-4/6" />
      </div>

      {/* Answer Skeleton */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="h-6 bg-slate-800 rounded w-32" />
        <div className="h-4 bg-slate-800/80 rounded w-full" />
        <div className="h-28 bg-slate-950 rounded-lg w-full" />
      </div>
    </div>
  );
}
