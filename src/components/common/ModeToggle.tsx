'use client';

import { useRiskRegister } from '@/hooks/useRiskRegister';
import { t } from '@/lib/i18n';

export function ModeToggle() {
  const { viewMode, setViewMode, language } = useRiskRegister();

  return (
    <div className="flex items-center gap-2 rounded-full border p-1">
      <button
        className={`rounded-full px-3 py-1 text-sm transition-colors ${
          viewMode === 'wizard'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted'
        }`}
        onClick={() => setViewMode('wizard')}
      >
        {t('wizardMode', language)}
      </button>
      <button
        className={`rounded-full px-3 py-1 text-sm transition-colors ${
          viewMode === 'expert'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted'
        }`}
        onClick={() => setViewMode('expert')}
      >
        {t('expertMode', language)}
      </button>
    </div>
  );
}
