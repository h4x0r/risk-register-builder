'use client';

import { create } from 'zustand';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LEARN_TOPICS, getLearnTopic, Bilingual, LearnTopic, CitationAccess } from '@/lib/education';
import { MathText } from '@/components/learn/MathText';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { t } from '@/lib/i18n';
import { Language } from '@/types';
import { cn } from '@/lib/utils';

interface LearnDialogState {
  open: boolean;
  topicId: string;
  /** Open the panel, optionally straight to a topic. */
  openLearn: (topicId?: string) => void;
  setOpen: (open: boolean) => void;
}

/**
 * Dialog state lives in its own store so that any chip, heading or header button
 * can open the panel at the right topic without threading callbacks through the
 * whole tree. Domain state stays in useRiskRegister.
 */
export const useLearnDialog = create<LearnDialogState>((set) => ({
  open: false,
  topicId: LEARN_TOPICS[0].id,
  openLearn: (topicId) => set((state) => ({ open: true, topicId: topicId ?? state.topicId })),
  setOpen: (open) => set({ open }),
}));

function pick(value: Bilingual, language: Language): string {
  return language === 'zh-TW' ? value.zh : value.en;
}

/**
 * Three access states, not two. "Abstract only" earns its own colour because a
 * student who clicks expecting a paper and gets a title card has been misled.
 */
const ACCESS_STYLE: Record<CitationAccess, string> = {
  free: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  abstract: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200',
  paid: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
};

const ACCESS_LABEL: Record<CitationAccess, 'freeToRead' | 'abstractOnly' | 'paidStandard'> = {
  free: 'freeToRead',
  abstract: 'abstractOnly',
  paid: 'paidStandard',
};

function TopicBody({ topic, language }: { topic: LearnTopic; language: Language }) {
  return (
    <article className="space-y-4">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">{pick(topic.title, language)}</h2>
          {topic.standard && (
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {topic.standard}
            </span>
          )}
        </div>
        <p className="border-l-2 border-primary bg-muted/50 py-2 pl-3 text-sm font-medium">
          <MathText>{pick(topic.summary, language)}</MathText>
        </p>
      </header>

      {topic.paragraphs.map((paragraph, i) => (
        <p key={i} className="text-sm leading-relaxed text-foreground/90">
          <MathText>{pick(paragraph, language)}</MathText>
        </p>
      ))}

      {topic.table && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {topic.table.headers.map((header, i) => (
                  <th key={i} className="p-2 text-left font-medium">
                    {pick(header, language)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topic.table.rows.map((row, r) => (
                <tr key={r} className="border-b">
                  {row.map((cell, c) => (
                    <td key={c} className={cn('p-2 align-top', c === 0 && 'font-medium whitespace-nowrap')}>
                      <MathText>{pick(cell, language)}</MathText>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="space-y-2 border-t pt-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('furtherReading', language)}
        </h3>
        <ul className="space-y-1.5">
          {topic.citations.map((cite) => (
            <li key={`${topic.id}-${cite.url}`} className="text-sm">
              <a
                href={cite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                {cite.ref}
              </a>
              <span className="text-muted-foreground"> — {pick(cite.title, language)}</span>
              <span
                className={cn('ml-2 rounded px-1.5 py-0.5 text-[10px] font-medium', ACCESS_STYLE[cite.access])}
              >
                {t(ACCESS_LABEL[cite.access], language)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export function LearnDialog() {
  const language = useRiskRegister((state) => state.language);
  const { open, topicId, setOpen } = useLearnDialog();
  const setTopic = useLearnDialog((state) => state.openLearn);

  const topic = getLearnTopic(topicId) ?? LEARN_TOPICS[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 p-0 sm:max-w-5xl">
        <DialogHeader className="space-y-1 border-b px-6 pb-3 pt-5 text-left">
          <DialogTitle>{t('learnTitle', language)}</DialogTitle>
          <DialogDescription className="text-xs">
            {t('learnSubtitle', language)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 md:grid-cols-[14rem_1fr]">
          <nav
            aria-label={t('learnTitle', language)}
            className="max-h-32 overflow-y-auto border-b p-2 md:max-h-none md:border-b-0 md:border-r"
          >
            <ul className="flex gap-1 md:flex-col">
              {LEARN_TOPICS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setTopic(item.id)}
                    aria-current={item.id === topic.id ? 'true' : undefined}
                    className={cn(
                      'w-full whitespace-nowrap rounded px-2 py-1.5 text-left text-sm transition-colors md:whitespace-normal',
                      item.id === topic.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    {pick(item.title, language)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-h-0 overflow-y-auto px-6 py-5">
            <TopicBody topic={topic} language={language} />
            <p className="mt-6 border-t pt-3 text-[10px] leading-relaxed text-muted-foreground">
              {t('educationCopyright', language)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Inline affordance that opens the panel at a topic. Used on the taxonomy chips so
 * the explanation is one click from the point where the judgement is being made,
 * rather than in a manual nobody opens.
 */
export function LearnLink({
  topicId,
  className,
  title,
  children,
}: {
  topicId: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const openLearn = useLearnDialog((state) => state.openLearn);

  return (
    <button type="button" onClick={() => openLearn(topicId)} title={title} className={className}>
      {children}
    </button>
  );
}
