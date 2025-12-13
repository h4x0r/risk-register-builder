'use client';

import { useRiskRegister } from '@/hooks/useRiskRegister';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ExportDropdown } from '@/components/common/ExportDropdown';
import { t } from '@/lib/i18n';

export function AppHeader() {
  const { language } = useRiskRegister();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-bold text-primary">
          {t('appTitle', language)}
        </h1>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ExportDropdown />
        </div>
      </div>
    </header>
  );
}
