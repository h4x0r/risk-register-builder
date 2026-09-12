'use client';

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { t } from '@/lib/i18n';
import { Language } from '@/types';

/**
 * The plain-text notice, shared by the UI and every export.
 *
 * One source: a disclaimer that says one thing on screen and something weaker in
 * the exported workbook is worth less than no disclaimer at all.
 */
export function disclaimerText(language: Language): string {
  return [
    t('disclaimerBody', language),
    t('disclaimerResponsibility', language),
    t('disclaimerData', language),
  ].join(' ');
}

/** Short form for tight spaces — export footers, slide notes, the page footer. */
export function disclaimerLine(language: Language): string {
  return `${t('disclaimerTitle', language)}: ${t('disclaimerBody', language)}`;
}

export function DisclaimerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const language = useRiskRegister((state) => state.language);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[var(--risk-medium)]" aria-hidden="true" />
            {t('disclaimerTitle', language)}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t('disclaimerShort', language)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <p className="border-l-2 border-[var(--risk-medium)] bg-muted/50 py-2 pl-3 font-medium">
            {t('disclaimerShort', language)}
          </p>
          <p>{t('disclaimerBody', language)}</p>
          <p>{t('disclaimerResponsibility', language)}</p>
          <p className="text-muted-foreground">{t('disclaimerData', language)}</p>
        </div>

        <div className="flex justify-end">
          <Button size="sm" onClick={() => onOpenChange(false)}>
            {t('disclaimerAcknowledge', language)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Always-visible footer notice.
 *
 * Deliberately part of the page rather than a dismissible banner: the point is that
 * the limits of the tool are legible at the moment someone is reading its output,
 * not that they were acknowledged once and cleared away.
 */
export function DisclaimerFooter() {
  const language = useRiskRegister((state) => state.language);
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="mt-8 border-t bg-muted/30">
        <div className="container flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-4 text-xs text-muted-foreground">
          <ShieldAlert
            className="h-3.5 w-3.5 shrink-0 text-[var(--risk-medium)]"
            aria-hidden="true"
          />
          <p className="max-w-4xl leading-relaxed">
            <span className="font-medium text-foreground">{t('disclaimerShort', language)}</span>{' '}
            {t('disclaimerBody', language)}
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="underline underline-offset-2 hover:text-foreground"
          >
            {t('readDisclaimer', language)}
          </button>
        </div>
      </footer>
      <DisclaimerDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
