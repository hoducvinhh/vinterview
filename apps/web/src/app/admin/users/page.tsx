'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAuth } from '@/context/AuthContext';
import { api, User } from '@/lib/api';

const emptyForm = { email: '', password: '', name: '', role: 'USER' as User['role'] };

export default function AdminUsersPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (term = search) => {
    try {
      setLoading(true);
      const response = await api.getUsers(term);
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) fetchUsers('');
  }, [authLoading, isAuthenticated, isAdmin]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.email || (!editingId && !form.password)) return;

    try {
      setSaving(true);
      const payload = {
        email: form.email,
        name: form.name,
        role: form.role,
        ...(form.password ? { password: form.password } : {}),
      };
      if (editingId) await api.updateUser(editingId, payload);
      else await api.createUser({ ...payload, password: form.password });
      setForm(emptyForm);
      setEditingId(null);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Không thể lưu người dùng.');
    } finally {
      setSaving(false);
    }
  };

  const editUser = (user: User) => {
    setEditingId(user.id);
    setForm({ email: user.email, password: '', name: user.name || '', role: user.role });
  };

  const deleteUser = async (user: User) => {
    if (!window.confirm(`Xóa tài khoản ${user.email}?`)) return;
    try {
      await api.deleteUser(user.id);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa người dùng.');
    }
  };

  if (authLoading || loading) return <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse"><div className="h-64 bg-slate-200 dark:bg-slate-900 rounded-xl" /></div>;

  if (!isAuthenticated || !isAdmin) {
    return <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4"><div className="text-4xl">🔒</div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Truy Cập Bị Từ Chối</h1><p className="text-xs text-slate-500">Bạn cần đăng nhập bằng tài khoản ADMIN.</p><Link href="/login" className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg inline-block">Đăng nhập</Link></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <AdminHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md h-fit space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{editingId ? '✏️ Chỉnh Sửa Người Dùng' : '➕ Thêm Người Dùng'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" className="admin-input" />
            <input required={!editingId} minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingId ? 'Mật khẩu mới (tùy chọn)' : 'Mật khẩu *'} className="admin-input" />
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Họ tên" className="admin-input" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })} className="admin-input"><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select>
            <div className="flex gap-2"><button disabled={saving} className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg">{saving ? 'Đang lưu...' : editingId ? 'Cập Nhật' : 'Tạo Tài Khoản'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-3 text-xs bg-slate-100 dark:bg-slate-950 rounded-lg">Hủy</button>}</div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><h2 className="text-base font-bold text-slate-900 dark:text-white">Người Dùng ({users.length})</h2><div className="flex gap-2"><input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchUsers()} placeholder="Tìm email hoặc tên..." className="admin-input" /><button onClick={() => fetchUsers()} className="px-3 text-xs font-semibold text-white bg-slate-700 rounded-lg">Tìm</button></div></div>
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-3 rounded-lg text-xs font-semibold">⚠️ {error}</div>}
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase"><th className="py-3 px-3">Tài khoản</th><th className="py-3 px-3">Vai trò</th><th className="py-3 px-3">Ngày tạo</th><th className="py-3 px-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{users.map((user) => <tr key={user.id}><td className="py-3.5 px-3"><div className="font-bold text-slate-900 dark:text-white">{user.name || 'Chưa cập nhật'}</div><div className="text-slate-500">{user.email}</div></td><td className="py-3.5 px-3"><span className={`px-2 py-1 rounded border font-semibold ${user.role === 'ADMIN' ? 'text-amber-600 bg-amber-500/10 border-amber-500/20' : 'text-blue-600 bg-blue-500/10 border-blue-500/20'}`}>{user.role}</span></td><td className="py-3.5 px-3 text-slate-500">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td><td className="py-3.5 px-3 text-right space-x-2"><button onClick={() => editUser(user)} className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-950 rounded">Sửa</button><button onClick={() => deleteUser(user)} className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-rose-500/10 rounded">Xóa</button></td></tr>)}</tbody></table></div>
        </div>
      </div>
    </div>
  );
}