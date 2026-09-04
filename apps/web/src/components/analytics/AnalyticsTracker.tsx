'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // 1. Do NOT track if logged-in user is ADMIN or isAdmin flag is true
    if (isAdmin || user?.role === 'ADMIN') {
      return;
    }

    // 2. Do NOT track admin routes (/admin, /admin/*)
    if (!pathname || pathname.startsWith('/admin') || lastTrackedPath.current === pathname) {
      return;
    }

    lastTrackedPath.current = pathname;

    // Get or initialize persistent visitor ID
    let visitorId = localStorage.getItem('vinterview_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem('vinterview_visitor_id', visitorId);
    }

    // Send tracking request silently
    api.trackPageView(pathname, visitorId).catch(() => {
      // Ignore background tracking error
    });
  }, [pathname, user, isAdmin]);

  return null;
}
