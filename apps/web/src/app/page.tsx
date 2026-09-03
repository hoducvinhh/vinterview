import Link from 'next/link';

export default function Home() {
  const topics = [
    { title: 'JavaScript & TypeScript', slug: 'javascript', icon: '🟨', desc: 'Event Loop, Closure, Prototypes, Generics, Async/Await, Memory Leaks.' },
    { title: 'React & Next.js', slug: 'react', icon: '⚛️', desc: 'Virtual DOM, Server Components, Hydration, Custom Hooks, Performance.' },
    { title: 'Node.js & NestJS', slug: 'nodejs', icon: '🟩', desc: 'Event-driven architecture, Middleware, Dependency Injection, Streams.' },
    { title: 'Database & Redis', slug: 'postgresql', icon: '🐘', desc: 'Indexing, ACID, Query Optimization, Caching strategies, Locks.' },
    { title: 'System Design & Docker', slug: 'docker', icon: '🐳', desc: 'Microservices, Containerization, Load Balancing, Scalability.' },
  ];

  return (
    <div className="space-y-16 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="text-center py-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
          🚀 Platform Luyện Phỏng Vấn Chuyên Sâu
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Chinh Phục Phỏng Vấn <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 bg-clip-text text-transparent">Lập Trình</span> Cùng Vinterview
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Thành thạo các câu hỏi phỏng vấn Lập trình, Thiết kế Hệ thống và Core Frameworks với đáp án chuẩn production, minh họa code rõ ràng và giải thích chuyên sâu.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/questions"
            className="px-6 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/40"
          >
            Khám Phá Ngân Hàng Câu Hỏi &rarr;
          </Link>
          <Link
            href="/interview"
            className="px-6 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Bắt Đầu Luyện Phỏng Vấn
          </Link>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Chủ Đề Công Nghệ Trọng Tâm
          </h2>
          <Link href="/questions" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/questions?technology=${t.slug}`}
              className="p-6 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="text-3xl mb-3">{t.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {t.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
