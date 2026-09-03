import { api } from '@/lib/api';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { QuestionFilters } from '@/components/questions/QuestionFilters';
import { Pagination } from '@/components/questions/Pagination';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    technology?: string;
    difficulty?: string;
  }>;
}

export default async function QuestionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const category = params.category || '';
  const technology = params.technology || '';
  const difficulty = params.difficulty || '';

  let questionsData;
  let categoriesData;
  let technologiesData;
  let errorMsg = null;

  try {
    const [qRes, cRes, tRes] = await Promise.all([
      api.getQuestions({
        page,
        limit: 12,
        search,
        category,
        technology,
        difficulty,
      }),
      api.getCategories(),
      api.getTechnologies(),
    ]);

    questionsData = qRes;
    categoriesData = cRes.data;
    technologiesData = tRes.data;
  } catch (err: any) {
    errorMsg = err.message || 'Không thể kết nối đến máy chủ API backend.';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Heading */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          📚 Ngân Hàng Câu Hỏi Phỏng Vấn
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Khám Phá & Luyện Tập Câu Hỏi
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
          Luyện tập các câu hỏi phỏng vấn chuẩn công ty công nghệ với lời giải chi tiết, code ví dụ và phân tích chuyên sâu.
        </p>
      </div>

      {/* Filter Section */}
      <QuestionFilters
        categories={categoriesData || []}
        technologies={technologiesData || []}
      />

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Questions List / Grid */}
      {questionsData && questionsData.data.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionsData.data.map((q) => (
              <QuestionCard
                key={q.id}
                id={q.id}
                title={q.title}
                slug={q.slug}
                difficulty={q.difficulty}
                category={q.category.name}
                technology={q.technology.name}
                contentSnippet={q.content}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination meta={questionsData.meta} />
        </div>
      ) : (
        !errorMsg && (
          <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Không tìm thấy câu hỏi phù hợp</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Hãy thử thay đổi bộ lọc tìm kiếm hoặc từ khóa để tìm các câu hỏi khác.
            </p>
          </div>
        )
      )}
    </div>
  );
}
