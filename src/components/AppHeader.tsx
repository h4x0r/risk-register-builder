'use client';

import { useRiskRegister } from '@/hooks/useRiskRegister';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ModeToggle } from '@/components/common/ModeToggle';
import { ExportDropdown } from '@/components/common/ExportDropdown';
import { t } from '@/lib/i18n';

export function AppHeader() {
  const { language, viewMode } = useRiskRegister();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <h1 className="text-lg font-bold text-primary">
          {t('appTitle', language)}
        </h1>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ModeToggle />
          {viewMode === 'expert' && <ExportDropdown />}
        </div>
      </div>
    </header>
  );
}
