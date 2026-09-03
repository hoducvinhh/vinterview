'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api, Category } from '@/lib/api';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminCategoriesPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states (Create / Edit)
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal states
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getCategories();
      setCategories(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách danh mục.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) {
      fetchCategories();
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      if (editingId) {
        await api.updateCategory(editingId, {
          name,
          ...(slug && { slug }),
          description,
        });
      } else {
        await api.createCategory({
          name,
          ...(slug && { slug }),
          description,
        });
      }

      // Reset form
      setName('');
      setSlug('');
      setDescription('');
      setEditingId(null);

      // Refresh list
      await fetchCategories();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    try {
      setDeleting(true);
      await api.deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
      await fetchCategories();
    } catch (err: any) {
      alert(`Không thể xóa: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-900 rounded-xl w-64 mb-6" />
        <div className="h-64 bg-slate-200 dark:bg-slate-900/60 rounded-xl border border-slate-300 dark:border-slate-800" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl">🔒</div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Truy Cập Bị Từ Chối</h1>
        <p className="text-xs text-slate-500">
          Bạn cần đăng nhập bằng tài khoản Quản trị viên (ADMIN) để quản lý danh mục.
        </p>
        <Link href="/login" className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg inline-block">
          Đăng Nhập ngay &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <AdminHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Create / Edit Category */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md h-fit space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {editingId ? '✏️ Chỉnh Sửa Danh Mục' : '➕ Thêm Danh Mục Mới'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên Danh Mục *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: System Architecture"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custom URL Slug (Để trống sẽ tự động tạo)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="VD: system-architecture"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mô Tả Danh Mục
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn gọn nội dung của danh mục..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all cursor-pointer"
              >
                {saving ? 'Đang lưu...' : editingId ? 'Cập Nhật Danh Mục' : 'Tạo Danh Mục Mới'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Danh Sách Danh Mục ({categories.length})
            </h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-3">Tên Danh Mục</th>
                  <th className="py-3 px-3">URL Slug</th>
                  <th className="py-3 px-3">Số Câu Hỏi</th>
                  <th className="py-3 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{cat.name}</div>
                      {cat.description && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{cat.description}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-blue-600 dark:text-blue-400">{cat.slug}</td>
                    <td className="py-3.5 px-3">
                      <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-mono font-bold border border-blue-500/20">
                        {cat.questionCount || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(cat)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-white bg-slate-100 dark:bg-slate-950 hover:bg-blue-600 border border-slate-300 dark:border-slate-800 rounded transition-colors cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(cat)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 rounded transition-colors cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Xác Nhận Xóa Danh Mục</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Bạn có chắc chắn muốn xóa danh mục <span className="font-bold text-slate-900 dark:text-white">"{deletingCategory.name}"</span>?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 border border-slate-300 dark:border-slate-800 rounded-lg cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {deleting ? 'Đang xóa...' : 'Xác Nhận Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
