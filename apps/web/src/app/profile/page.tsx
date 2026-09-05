'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, UserProgressData } from '@/lib/api';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Vinterview1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Vinterview2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow',
  'https://api.dicebear.com/7.x/identicon/svg?seed=DevPro',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const [stats, setStats] = useState<UserProgressData | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setHeadline(user.headline || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || AVATAR_PRESETS[0]);
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setWebsiteUrl(user.websiteUrl || '');
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      api.getUserProgressStats()
        .then((res) => setStats(res.data))
        .catch(() => null);

      api.getUserBookmarks()
        .then((res) => setBookmarkCount(res.data?.length || 0))
        .catch(() => null);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await updateProfile({
        name,
        headline,
        bio,
        avatarUrl,
        githubUrl,
        linkedinUrl,
        websiteUrl,
      });
      setMessage({ type: 'success', text: 'Cập nhật hồ sơ cá nhân thành công!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Cập nhật thất bại. Vui lòng thử lại.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Đang tải thông tin hồ sơ...</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={avatarUrl || AVATAR_PRESETS[0]}
              alt={user.name || user.email}
              className="w-24 h-24 rounded-2xl bg-white/10 p-1 border-2 border-white/30 object-cover shadow-lg backdrop-blur-sm"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-slate-950 w-5 h-5 rounded-full" title="Online"></span>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user.name || user.email.split('@')[0]}</h1>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-purple-500 text-white' : 'bg-white/20 text-white border border-white/30'}`}>
                {user.role}
              </span>
            </div>

            <p className="text-sm text-blue-100 font-medium">
              {headline || 'Lập trình viên / Học viên trên Vinterview'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-blue-200">
              <span className="flex items-center gap-1">
                <span>📧</span> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <span>📅</span> Tham gia: {joinDate}
              </span>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex sm:flex-col gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-center"
            >
              📊 Bảng tiến độ
            </Link>
            <Link
              href="/bookmarks"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-center"
            >
              🔖 Đã lưu ({bookmarkCount})
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Overview */}
        <div className="space-y-6">
          {/* Quick Overview Card */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚡</span> Kết Quả Ôn Tập
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">
                  {stats?.stats.completedQuestions || 0}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Câu đã hoàn thành</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-2xl font-black text-amber-500 block">
                  {bookmarkCount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Câu hỏi đã lưu</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Tỷ lệ hoàn thành câu hỏi</span>
                <span className="text-blue-600 dark:text-blue-400">{stats?.stats.completionPercentage || 0}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${stats?.stats.completionPercentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Social Links Overview */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🌐</span> Liên Kết Cá Nhân
            </h2>

            <div className="space-y-3 text-xs">
              {githubUrl ? (
                <a href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <span className="text-lg">💻</span>
                  <span className="truncate font-medium">{githubUrl}</span>
                </a>
              ) : (
                <p className="text-slate-400 italic">Chưa thêm liên kết GitHub</p>
              )}

              {linkedinUrl ? (
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <span className="text-lg">💼</span>
                  <span className="truncate font-medium">{linkedinUrl}</span>
                </a>
              ) : (
                <p className="text-slate-400 italic">Chưa thêm liên kết LinkedIn</p>
              )}

              {websiteUrl ? (
                <a href={websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <span className="text-lg">🔗</span>
                  <span className="truncate font-medium">{websiteUrl}</span>
                </a>
              ) : (
                <p className="text-slate-400 italic">Chưa thêm trang web cá nhân</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Chỉnh Sửa Hồ Sơ Cá Nhân
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cập nhật thông tin chi tiết để nhà tuyển dụng hoặc cộng đồng nhận biết bạn trên hệ thống Vinterview.
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-xs font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Chọn Ảnh Đại Diện (Avatar)
                </label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`relative w-12 h-12 rounded-xl p-1 border-2 transition-all overflow-hidden ${avatarUrl === url ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={url} alt={`Avatar Preset ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Hoặc nhập URL ảnh đại diện tùy chỉnh (https://...)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Name & Headline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Chức Danh / Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Ví dụ: Senior Backend Developer @ Tech Corp"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Giới Thiệu Bản Thân (Bio)
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Chia sẻ kinh nghiệm làm việc, mục tiêu nghề nghiệp hoặc các công nghệ bạn yêu thích..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Mạng Xã Hội & Website
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Trang Web Cá Nhân
                    </label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu Thay Đổi Hồ Sơ</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
