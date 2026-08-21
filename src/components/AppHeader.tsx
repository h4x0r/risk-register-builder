'use client';

import Image from 'next/image';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ExportDropdown } from '@/components/common/ExportDropdown';
import { Button } from '@/components/ui/button';
import { LearnDialog, useLearnDialog } from '@/components/learn/LearnDialog';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { t } from '@/lib/i18n';

export function AppHeader() {
  const { language } = useRiskRegister();
  const openLearn = useLearnDialog((state) => state.openLearn);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <a
            href="https://www.hkios.hk/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/hkios-logo.png"
              alt="HKIOS"
              width={120}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </a>
          <span className="text-muted-foreground text-lg font-light">×</span>
          <a
            href="https://www.securityronin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/security-ronin-logo.png"
              alt="Security Ronin"
              width={120}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </a>
          <span className="text-muted-foreground mx-2">|</span>
          <h1 className="text-lg font-semibold">{t('appTitle', language)}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openLearn()}
            aria-haspopup="dialog"
          >
            <span aria-hidden="true" className="mr-1">📖</span>
            {t('learn', language)}
          </Button>
          <LanguageToggle />
          <ExportDropdown />
        </div>
      </div>
      <LearnDialog />
    </header>
  );
}
