'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Question, QuestionsMeta } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { DeleteModal } from '@/components/admin/DeleteModal';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [meta, setMeta] = useState<QuestionsMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQuestions = async (searchQuery: string = '') => {
    try {
      setLoading(true);
      const res = await api.getQuestions({ limit: 50, search: searchQuery });
      setQuestions(res.data);
      setMeta(res.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách câu hỏi quản trị.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(search);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions(search);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await api.deleteQuestion(deleteTarget.id);
      setDeleteTarget(null);
      await fetchQuestions(search); // Refresh list
    } catch (err: any) {
      alert(`Lỗi xóa câu hỏi: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <AdminHeader />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Quản Lý Câu Hỏi Phỏng Vấn</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Tạo mới, cập nhật và quản lý ngân hàng câu hỏi cùng đáp án chuẩn.
          </p>
        </div>

        <Link
          href="/admin/questions/new"
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:shadow-blue-600/40 flex items-center gap-1.5 cursor-pointer"
        >
          <span>+</span> Tạo Câu Hỏi Mới
        </Link>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm câu hỏi theo tiêu đề..."
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors cursor-pointer"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Error View */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Questions Table */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500 animate-pulse">
          Đang tải danh sách câu hỏi...
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Tiêu Đề</th>
                  <th className="py-3.5 px-4">Độ Khó</th>
                  <th className="py-3.5 px-4">Công Nghệ</th>
                  <th className="py-3.5 px-4">Danh Mục</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {questions.map((q) => {
                  const diffVariant =
                    q.difficulty === 'EASY'
                      ? 'easy'
                      : q.difficulty === 'MEDIUM'
                      ? 'medium'
                      : 'hard';

                  return (
                    <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200 max-w-xs truncate">
                        <Link
                          href={`/questions/${q.slug}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          target="_blank"
                        >
                          {q.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={diffVariant}>{q.difficulty}</Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="tech">{q.technology.name}</Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="category">{q.category.name}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/questions/${q.id}/edit`}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-white bg-slate-100 dark:bg-slate-950 hover:bg-blue-600 border border-slate-300 dark:border-slate-800 rounded transition-colors"
                          >
                            Sửa
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(q)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 rounded transition-colors cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {questions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      Chưa có câu hỏi nào trong cơ sở dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {meta && (
            <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
              <span>Tổng số câu hỏi: {meta.total}</span>
              <span>Trang {meta.page} / {meta.totalPages}</span>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || ''}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
