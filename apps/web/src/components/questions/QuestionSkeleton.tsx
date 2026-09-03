export function QuestionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="h-5 bg-slate-800 rounded w-3/4" />
            <div className="h-5 bg-slate-800 rounded-full w-14" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-800/60 rounded w-full" />
            <div className="h-3 bg-slate-800/60 rounded w-2/3" />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
            <div className="flex gap-2">
              <div className="h-4 bg-slate-800 rounded-full w-20" />
              <div className="h-4 bg-slate-800 rounded-full w-16" />
            </div>
            <div className="h-3 bg-slate-800 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
