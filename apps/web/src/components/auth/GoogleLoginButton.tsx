'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function GoogleLoginButton() {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;

    try {
      setLoading(true);
      setError(null);
      await googleLogin(credentialResponse.credential);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {error && (
        <div className="mb-3 text-xs text-red-500 dark:text-red-400 text-center font-medium bg-red-50 dark:bg-red-950/40 p-2 rounded-lg w-full">
          {error}
        </div>
      )}
      {loading ? (
        <div className="py-2.5 px-4 text-sm text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
          Đang xác thực với Google...
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Đăng nhập bằng Google thất bại hoặc bị hủy.')}
            shape="rectangular"
            theme="outline"
            text="continue_with"
            width="380"
          />
        </div>
      )}
    </div>
  );
}
