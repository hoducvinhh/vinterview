import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinterview.vn';

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
  },
};

export default function Home() {
  const academicSubjects = [
    { title: 'JavaScript & TypeScript', slug: 'javascript', icon: '🟨', desc: 'Event Loop, Closure, Prototypes, Generics, Async/Await, Memory Leaks.' },
    { title: 'React & Next.js', slug: 'react', icon: '⚛️', desc: 'Virtual DOM, Server Components, Hydration, Custom Hooks, Performance.' },
    { title: 'Node.js & NestJS', slug: 'nodejs', icon: '🟩', desc: 'Event-driven architecture, Middleware, Dependency Injection, Streams.' },
    { title: 'Database & Redis', slug: 'postgresql', icon: '🐘', desc: 'Indexing, ACID, Query Optimization, Caching strategies, Locks.' },
    { title: 'System Design & Docker', slug: 'docker', icon: '🐳', desc: 'Microservices, Containerization, Load Balancing, Scalability.' },
  ];

  const studentFeatures = [
    {
      icon: '🎓',
      title: 'Bám Sát Môn Học Đại Học',
      desc: 'Hệ thống câu hỏi phỏng vấn bao quát phạm vi Cấu trúc dữ liệu & Giải thuật, Cơ sở dữ liệu SQL, Mạng máy tính, Lập trình hướng đối tượng (OOP) và Web.',
    },
    {
      icon: '📄',
      title: 'Phỏng Vấn Giả Lập Theo CV',
      desc: 'Tải file CV PDF cá nhân lên để AI phân tích kỹ năng, kinh nghiệm dự án và đưa ra bộ câu hỏi phỏng vấn chuẩn khớp với vị trí Intern/Fresher.',
    },
    {
      icon: '⚡',
      title: 'Đáp Án Chuẩn Production & AI Feedback',
      desc: 'Mỗi câu hỏi kèm giải thích ngắn gọn, minh họa code rõ ràng và nhận xét chấm điểm chi tiết từ AI để giúp sinh viên tiến bộ nhanh chóng.',
    },
  ];

  return (
    <div className="space-y-16 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="text-center py-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
          🎓 Nền Tảng Luyện Phỏng Vấn IT Cho Sinh Viên & Fresher
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Chinh Phục Phỏng Vấn <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 bg-clip-text text-transparent">Công Nghệ IT</span> & Dự Án CV
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Nền tảng dành riêng cho sinh viên CNTT muốn ôn luyện câu hỏi phỏng vấn môn học Đại học, phỏng vấn thực tập sinh (Intern) và phỏng vấn giả lập AI theo file CV cá nhân.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/questions"
            className="px-6 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/40"
          >
            Khám Phá Ngân Hàng Câu Hỏi
          </Link>
          <Link
            href="/interview"
            className="px-6 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            🤖 Phỏng Vấn AI Theo CV
          </Link>
        </div>
      </section>

      {/* Target Audience Value Props Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Giải Pháp Luyện Phỏng Vấn Toàn Diện Cho Sinh Viên IT
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thiết kế chuyên biệt giúp bạn sẵn sàng bước vào kỳ thi chuyên ngành lẫn các buổi phỏng vấn tuyển dụng thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentFeatures.map((f, idx) => (
            <article
              key={idx}
              className="p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm hover:border-blue-500/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-2xl flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Topics Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Chủ Đề & Môn Học IT Trọng Tâm
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ôn luyện kiến thức cốt lõi và câu hỏi phỏng vấn phổ biến theo từng công nghệ.
            </p>
          </div>
          <Link href="/questions" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicSubjects.map((t) => (
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
