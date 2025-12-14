'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { SinglePageView } from '@/components/expert/SinglePageView';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { decodeEntries } from '@/lib/url-state';

function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const hydrateEntries = useRiskRegister((state) => state.hydrateEntries);

  // Prevent hydration mismatch and handle URL state
  useEffect(() => {
    setMounted(true);

    // Check for data parameter in URL
    const data = searchParams.get('data');
    if (data) {
      const entries = decodeEntries(data);
      if (entries && entries.length > 0) {
        hydrateEntries(entries);
        // Clean up URL after hydration
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [searchParams, hydrateEntries]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <SinglePageView />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
