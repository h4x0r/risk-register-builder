'use client';

import { useEffect, useState } from 'react';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { AppHeader } from '@/components/AppHeader';
import { WizardView } from '@/components/WizardView';
import { SinglePageView } from '@/components/expert/SinglePageView';

export default function Home() {
  const { viewMode } = useRiskRegister();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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
        {viewMode === 'wizard' ? <WizardView /> : <SinglePageView />}
      </main>
    </div>
  );
}
