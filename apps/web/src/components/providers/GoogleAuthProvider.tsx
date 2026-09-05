'use client';

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'build-time-dummy-client-id';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
