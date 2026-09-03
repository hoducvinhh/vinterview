'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid tracking exact duplicate calls on initial mount / strict mode
    if (!pathname || lastTrackedPath.current === pathname) return;

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
  }, [pathname]);

  return null;
}
