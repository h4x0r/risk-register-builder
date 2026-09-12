'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRiskRegister, createCustomEntry } from '@/hooks/useRiskRegister';
import { RiskMatrix, RiskMatrixLegend } from '@/components/risk-matrix/RiskMatrix';
import {
  THREAT_PRESETS,
  CATEGORY_ORDER,
  SOURCE_LABELS,
  PILLAR_LABELS,
  STRIDE_LABELS,
  STRIDE_PROPERTY,
  PROPERTY_LABELS,
  DEFAULT_ENTRY_VALUES,
} from '@/lib/constants';
import { searchPresets, presetsForCategory, categoryLabel } from '@/lib/taxonomy';
import { LearnLink } from '@/components/learn/LearnDialog';
import {
  calculateRiskLevel,
  getRiskLevelLabel,
  getMatrixPosition,
  getResidualMatrixPosition,
  calculateInherentThreat,
  calculateResidualRisk,
} from '@/lib/calculations';
import { t, TranslationKey } from '@/lib/i18n';
import {
  Language,
  RatingKey,
  INHERENT_RATING_KEYS,
  CONTROL_RATING_KEYS,
  ThreatCategory,
  ThreatEntry,
  ThreatSource,
  RiskLevel,
} from '@/types';
import { cn } from '@/lib/utils';

const RISK_VAR: Record<RiskLevel, string> = {
  low: 'var(--risk-low)',
  medium: 'var(--risk-medium)',
  high: 'var(--risk-high)',
};

const SOURCE_STYLES: Record<ThreatSource, string> = {
  adversarial: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200',
  accidental: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  structural: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200',
  environmental: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
};

/** Label for each scored judgement, reused by the table head and the rationale drawer. */
const RATING_LABEL: Record<RatingKey, TranslationKey> = {
  probability: 'probability',
  impactLife: 'lifeSafety',
  impactAsset: 'assetSafety',
  impactBusiness: 'businessOps',
  controlInternal: 'internalResources',
  controlExternal: 'externalResources',
};

function RatingScale({
  value,
  onChange,
  reversed,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  reversed?: boolean;
  label: string;
}) {
  const values = reversed ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];

  return (
    <div role="radiogroup" aria-label={label} className="flex gap-[3px]">
      {values.map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          aria-label={`${label} ${v}`}
          onClick={() => onChange(v)}
          className={cn(
            'h-6 w-6 rounded-[3px] font-mono text-[11px] transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            value === v
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function TaxonomyChips({ entry, language }: { entry: ThreatEntry; language: Language }) {
  const pick = (l: { zh: string; en: string }) => (language === 'zh-TW' ? l.zh : l.en);

  if (!entry.source && !entry.pillars?.length && !entry.stride?.length) return null;

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {entry.source && (
        <LearnLink
          topicId="sources"
          title={`${t('learnMoreAbout', language)} ${t('threatSource', language)} — NIST SP 800-30 Rev. 1`}
          className={cn(
            'rounded px-1.5 py-0.5 text-[10px] font-medium transition-opacity hover:opacity-75',
            SOURCE_STYLES[entry.source]
          )}
        >
          {pick(SOURCE_LABELS[entry.source])}
        </LearnLink>
      )}
      {entry.pillars?.map((pillar) => (
        <LearnLink
          key={pillar}
          topicId="ppt"
          title={`${t('learnMoreAbout', language)} ${t('pptPillar', language)}`}
          className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground transition-opacity hover:opacity-75"
        >
          {pick(PILLAR_LABELS[pillar])}
        </LearnLink>
      ))}
      {entry.stride?.map((cls) => (
        <LearnLink
          key={cls}
          topicId="stride"
          title={`STRIDE — ${pick(STRIDE_LABELS[cls])} · ${t('securityProperty', language)}: ${pick(PROPERTY_LABELS[STRIDE_PROPERTY[cls]])}`}
          className="rounded border border-purple-300 bg-purple-50 px-1 py-0.5 font-mono text-[10px] font-bold text-purple-900 transition-opacity hover:opacity-75 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200"
        >
          {STRIDE_LABELS[cls].short}
        </LearnLink>
      ))}
    </div>
  );
}

function LearnHint({ topicId, label }: { topicId: string; label: string }) {
  return (
    <LearnLink
      topicId={topicId}
      title={label}
      className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/40 text-[10px] font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      ?
    </LearnLink>
  );
}

/** How many of the given judgements carry a recorded reason. */
function rationaleCount(entry: ThreatEntry, keys: RatingKey[]): number {
  return keys.filter((key) => (entry.rationale?.[key] ?? '').trim().length > 0).length;
}

/**
 * Rationale boxes for one group of scores.
 *
 * Scoped to the keys the surrounding card actually displays. Showing all six here
 * would offer boxes for scores that are not on screen — control capability is
 * judged two stages to the right — and make the completeness counter disagree with
 * the ratings beside it.
 */
function RationaleDrawer({
  entry,
  language,
  keys,
  onChange,
}: {
  entry: ThreatEntry;
  language: Language;
  keys: RatingKey[];
  onChange: (key: RatingKey, value: string) => void;
}) {
  return (
    <div className="space-y-3 rounded-[4px] border border-dashed bg-muted/40 p-3">
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {t('rationaleHint', language)}
      </p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {keys.map((key) => (
          <label key={key} className="block">
            <span className="mb-1 flex items-baseline justify-between text-[11px] font-medium">
              {t(RATING_LABEL[key], language)}
              <span className="font-mono text-[10px] text-muted-foreground">
                {entry[key] as number}
              </span>
            </span>
            <textarea
              value={entry.rationale?.[key] ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
              rows={2}
              placeholder={t('rationalePlaceholder', language)}
              className={cn(
                'w-full resize-y rounded-[3px] border bg-card px-2 py-1.5 text-xs leading-relaxed',
                'placeholder:text-muted-foreground/60',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * The n/total completeness counter that opens a rationale drawer.
 *
 * `total` is the size of the group this card owns, not all six judgements — the
 * counter has to agree with the ratings sitting next to it.
 */
function RationaleToggle({
  open,
  filled,
  total,
  language,
  onClick,
}: {
  open: boolean;
  filled: number;
  total: number;
  language: Language;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      title={open ? t('hideRationale', language) : t('showRationale', language)}
      className={cn(
        'no-print flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors hover:bg-muted',
        filled === total
          ? 'text-[var(--risk-low)]'
          : filled > 0
            ? 'text-[var(--risk-medium)]'
            : 'text-muted-foreground'
      )}
    >
      {filled}/{total}
      <ChevronDown
        className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
        aria-hidden="true"
      />
    </button>
  );
}

/**
 * Delete, behind a second click.
 *
 * An entry now carries scores, up to six rationales and a mitigation decision, and
 * none of that is recoverable once it is gone. A confirm step costs one click and
 * removes the whole class of accidental loss; a modal for every row would cost more
 * than it saves. The armed state disarms itself so it cannot be left primed.
 */
function DeleteEntryButton({
  language,
  label,
  onDelete,
  compact,
}: {
  language: Language;
  label: string;
  onDelete: () => void;
  compact?: boolean;
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  if (armed) {
    return (
      <span className="no-print inline-flex items-center gap-1 whitespace-nowrap">
        <button
          type="button"
          onClick={onDelete}
          title={t('deleteWarning', language)}
          className="whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
          style={{ background: 'var(--risk-high)' }}
        >
          {t('confirmDelete', language)}
        </button>
        <button
          type="button"
          onClick={() => setArmed(false)}
          aria-label={t('cancel', language)}
          className="whitespace-nowrap rounded px-1 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
        >
          {t('cancel', language)}
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setArmed(true)}
      aria-label={`${t('deleteEntry', language)} — ${label}`}
      title={t('deleteEntry', language)}
      className={cn(
        'no-print inline-flex shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-[var(--risk-high)]',
        compact ? 'h-6 w-6' : 'h-7 w-7'
      )}
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}

/** Numbered stage marker over each column, so the flow reads left to right. */
function StepRail({ language }: { language: Language }) {
  const steps: { n: string; label: string; span: string }[] = [
    { n: '01', label: t('inherentRisk', language), span: 'col-span-4' },
    { n: '02', label: t('inherentMatrix', language), span: 'col-span-2' },
    { n: '03', label: t('controls', language), span: 'col-span-4' },
    { n: '04', label: t('residualMatrix', language), span: 'col-span-2' },
  ];

  return (
    <ol className="hidden grid-cols-12 gap-3 lg:grid" aria-hidden="true">
      {steps.map((step, i) => (
        <li key={step.n} className={cn('flex items-center gap-2', step.span)}>
          <span className="font-mono text-[10px] font-semibold text-[var(--brand)]">{step.n}</span>
          <span className="truncate text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {step.label}
          </span>
          <span className="h-px flex-1 bg-border" />
          {i < steps.length - 1 && (
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />
          )}
        </li>
      ))}
    </ol>
  );
}

export function SinglePageView() {
  const { entries, language, addEntry, updateEntry, removeEntry } = useRiskRegister();
  const [selectedCategory, setSelectedCategory] = useState<ThreatCategory>('natural');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const searching = searchQuery.trim().length > 0;
  const presets = searching ? searchPresets(searchQuery) : presetsForCategory(selectedCategory);

  const handleAddPreset = () => {
    if (!selectedPreset) return;
    const preset = THREAT_PRESETS.find((p) => p.id === selectedPreset);
    if (!preset || entries.some((e) => e.id === preset.id)) return;

    addEntry({
      id: preset.id,
      name: preset.nameZh,
      nameEn: preset.nameEn,
      category: preset.category,
      source: preset.source,
      pillars: preset.pillars,
      stride: preset.stride,
      ...DEFAULT_ENTRY_VALUES,
    });
    setSelectedPreset('');
    setSearchQuery('');
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    addEntry(createCustomEntry(customName.trim()));
    setCustomName('');
  };

  const setRationale = (entry: ThreatEntry, key: RatingKey, value: string) => {
    const next = { ...(entry.rationale ?? {}) };
    if (value.trim()) next[key] = value;
    else delete next[key];
    updateEntry(entry.id, { rationale: Object.keys(next).length ? next : undefined });
  };

  const nameOf = (entry: ThreatEntry) =>
    language === 'zh-TW' ? entry.name : entry.nameEn || entry.name;

  const empty = entries.length === 0;

  return (
    <div className="space-y-4">
      {/* ── Add a threat ─────────────────────────────────────────────── */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={selectedCategory}
              onValueChange={(v) => {
                setSelectedCategory(v as ThreatCategory);
                setSelectedPreset('');
                setSearchQuery('');
              }}
              disabled={searching}
            >
              <SelectTrigger className="w-56" aria-label={t('category', language)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ORDER.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabel(cat, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder={t('searchThreats', language)}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedPreset('');
                }}
                className="w-48 pl-7"
              />
            </div>

            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
              <SelectTrigger className="w-64" aria-label={t('threat', language)}>
                <SelectValue
                  placeholder={
                    searching && presets.length === 0
                      ? t('noMatches', language)
                      : language === 'zh-TW' ? '選擇威脅' : 'Select threat'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem
                    key={preset.id}
                    value={preset.id}
                    disabled={entries.some((e) => e.id === preset.id)}
                  >
                    {language === 'zh-TW' ? preset.nameZh : preset.nameEn}
                    {searching && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {categoryLabel(preset.category, language)}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAddPreset} disabled={!selectedPreset} size="sm">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              {t('add', language)}
            </Button>

            <span className="text-xs text-muted-foreground">{t('or', language)}</span>

            <Input
              placeholder={language === 'zh-TW' ? '自訂威脅名稱' : 'Custom threat name'}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              className="w-44"
            />
            <Button onClick={handleAddCustom} disabled={!customName.trim()} size="sm" variant="secondary">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              {t('add', language)}
            </Button>

            <span className="ml-auto font-mono text-[11px] text-muted-foreground">
              {searching
                ? `${t('searchResults', language)} ${presets.length}`
                : `${THREAT_PRESETS.length} ${language === 'zh-TW' ? '項' : 'presets'}`}
            </span>
          </div>
        </CardContent>
      </Card>

      {empty ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {t('noEntriesYet', language)}
          </CardContent>
        </Card>
      ) : (
        /* Everything inside this node is what the PNG export captures. */
        <div id="risk-capture-root" className="space-y-3 bg-background">
          <StepRail language={language} />

          {/* items-start so each card ends where its content ends. Stretching them to
              a common height leaves large empty bordered boxes beside the tallest. */}
          <div className="grid gap-3 lg:grid-cols-12 lg:items-start">
            {/* ── 01 Inherent inputs ───────────────────────────────── */}
            <Card className="lg:col-span-4">
              <CardHeader className="py-2.5">
                <CardTitle className="font-display text-base font-medium">
                  {t('inherentRisk', language)}
                  <LearnHint topicId="risk-basics" label={t('learnMoreAbout', language)} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 py-2">
                {entries.map((entry) => {
                  const open = expanded === `${entry.id}::inherent`;
                  const filled = rationaleCount(entry, INHERENT_RATING_KEYS);

                  return (
                    <div key={entry.id} data-testid={`inherent-row-${entry.id}`} className="border-b pb-2 last:border-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{nameOf(entry)}</div>
                          <TaxonomyChips entry={entry} language={language} />
                        </div>
                        <RationaleToggle
                          open={open}
                          filled={filled}
                          total={INHERENT_RATING_KEYS.length}
                          language={language}
                          onClick={() => setExpanded(open ? null : `${entry.id}::inherent`)}
                        />
                      </div>

                      <div className="mt-2 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5">
                        <span className="text-[11px] text-muted-foreground">
                          {t('probability', language)}
                        </span>
                        <RatingScale
                          label={`${nameOf(entry)} ${t('probability', language)}`}
                          value={entry.probability}
                          onChange={(v) => updateEntry(entry.id, { probability: v })}
                        />
                        {(['impactLife', 'impactAsset', 'impactBusiness'] as const).map((key) => (
                          <FragmentRow
                            key={key}
                            label={t(RATING_LABEL[key], language)}
                            value={entry[key]}
                            onChange={(v) => updateEntry(entry.id, { [key]: v })}
                            name={nameOf(entry)}
                          />
                        ))}
                      </div>

                      {open && (
                        <div className="mt-2.5">
                          <RationaleDrawer
                            entry={entry}
                            language={language}
                            keys={INHERENT_RATING_KEYS}
                            onChange={(key, value) => setRationale(entry, key, value)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* ── 02 Inherent matrix ───────────────────────────────── */}
            <Card className="lg:col-span-2 lg:self-start">
              <CardHeader className="px-3 py-2.5">
                <CardTitle className="font-display text-sm font-medium">
                  {t('inherentMatrix', language)}
                  <LearnHint topicId="matrix" label={t('learnMoreAbout', language)} />
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">{t('beforeControls', language)}</p>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <RiskMatrix mode="inherent" entries={entries} />
              </CardContent>
            </Card>

            {/* ── 03 Controls ──────────────────────────────────────── */}
            <Card className="lg:col-span-4">
              <CardHeader className="py-2.5">
                <CardTitle className="font-display text-base font-medium">
                  {t('controls', language)}
                  <LearnHint topicId="scoring" label={t('learnMoreAbout', language)} />
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  {t('weak', language)} 5 ← → 1 {t('strong', language)}
                </p>
              </CardHeader>
              <CardContent className="space-y-2 py-2">
                {entries.map((entry) => {
                  const level = calculateRiskLevel(entry);
                  const open = expanded === `${entry.id}::controls`;
                  const filled = rationaleCount(entry, CONTROL_RATING_KEYS);

                  return (
                    <div
                      key={entry.id}
                      data-testid={`controls-row-${entry.id}`}
                      className="border-b pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="truncate text-xs font-medium">{nameOf(entry)}</div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            {CONTROL_RATING_KEYS.map((key) => (
                              <span key={key} className="flex items-center gap-1.5">
                                <span className="w-8 text-[10px] text-muted-foreground">
                                  {t(RATING_LABEL[key], language).slice(0, 2)}
                                </span>
                                <RatingScale
                                  label={`${nameOf(entry)} ${t(RATING_LABEL[key], language)}`}
                                  value={entry[key]}
                                  reversed
                                  onChange={(v) => updateEntry(entry.id, { [key]: v })}
                                />
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="font-mono text-[10px] tabular text-muted-foreground">
                            {calculateInherentThreat(entry).toFixed(0)} →{' '}
                            {calculateResidualRisk(entry).toFixed(1)}
                          </div>
                          <span
                            className="mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                            style={{ background: RISK_VAR[level] }}
                          >
                            {getRiskLevelLabel(level, language)}
                          </span>
                        </div>

                        <RationaleToggle
                          open={open}
                          filled={filled}
                          total={CONTROL_RATING_KEYS.length}
                          language={language}
                          onClick={() => setExpanded(open ? null : `${entry.id}::controls`)}
                        />
                      </div>

                      {open && (
                        <div className="mt-2.5">
                          <RationaleDrawer
                            entry={entry}
                            language={language}
                            keys={CONTROL_RATING_KEYS}
                            onChange={(key, value) => setRationale(entry, key, value)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* ── 04 Residual matrix ───────────────────────────────── */}
            <Card className="lg:col-span-2 lg:self-start">
              <CardHeader className="px-3 py-2.5">
                <CardTitle className="font-display text-sm font-medium">
                  {t('residualMatrix', language)}
                  <LearnHint topicId="scoring" label={t('learnMoreAbout', language)} />
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">{t('afterControls', language)}</p>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <RiskMatrix mode="residual" entries={entries} />
              </CardContent>
            </Card>
          </div>

          <RiskMatrixLegend className="justify-end px-1" />

          {/* ── Register ──────────────────────────────────────────── */}
          <Card>
            <CardHeader className="py-2.5">
              <CardTitle className="font-display text-base font-medium">
                {t('riskRegister', language)}
                <LearnHint topicId="treatment" label={t('learnMoreAbout', language)} />
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="risk-register-table">
                  <thead>
                    <tr className="border-b text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="p-2 text-left font-medium">{t('threat', language)}</th>
                      <th className="p-2 text-left font-medium">
                        {t('category', language)}
                        <LearnHint topicId="categories" label={t('learnMoreAbout', language)} />
                      </th>
                      <th className="p-2 text-center font-medium">{t('inherentRisk', language)}</th>
                      <th className="p-2 text-center font-medium">{t('residualRisk', language)}</th>
                      <th className="p-2 text-center font-medium">{t('riskLevel', language)}</th>
                      <th className="p-2 text-left font-medium">{t('mitigationStrategy', language)}</th>
                      {/* Wide enough for the armed confirm state, so arming does not
                          reflow the row or wrap the labels. */}
                      <th className="no-print w-28 p-2">
                        <span className="sr-only">{t('deleteEntry', language)}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => {
                      const level = calculateRiskLevel(entry);
                      const inherentPos = getMatrixPosition(entry);
                      const residualPos = getResidualMatrixPosition(entry);
                      return (
                        <tr key={entry.id} className="border-b align-top">
                          <td className="p-2 font-medium">
                            {nameOf(entry)}
                            <TaxonomyChips entry={entry} language={language} />
                          </td>
                          <td className="p-2 text-xs text-muted-foreground">
                            {categoryLabel(entry.category, language)}
                          </td>
                          <td className="p-2 text-center font-mono text-xs tabular">
                            {inherentPos.x}×{inherentPos.y}
                            <span className="ml-1 opacity-60">
                              {calculateInherentThreat(entry).toFixed(0)}
                            </span>
                          </td>
                          <td className="p-2 text-center font-mono text-xs tabular">
                            {residualPos.x}×{residualPos.y}
                            <span className="ml-1 opacity-60">
                              {calculateResidualRisk(entry).toFixed(1)}
                            </span>
                          </td>
                          <td className="p-2 text-center">
                            <span
                              className="inline-block rounded px-2 py-0.5 text-[11px] font-semibold text-white"
                              style={{ background: RISK_VAR[level] }}
                            >
                              {getRiskLevelLabel(level, language)}
                            </span>
                          </td>
                          <td className="p-2">
                            <Input
                              value={entry.mitigationStrategy}
                              onChange={(e) =>
                                updateEntry(entry.id, { mitigationStrategy: e.target.value })
                              }
                              className="h-8 text-sm"
                              placeholder="—"
                              aria-label={`${t('mitigationStrategy', language)} ${nameOf(entry)}`}
                            />
                          </td>
                          <td className="no-print p-2 text-right">
                            <DeleteEntryButton
                              language={language}
                              label={nameOf(entry)}
                              onDelete={() => removeEntry(entry.id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/** One labelled rating row inside the inherent card's two-column grid. */
function FragmentRow({
  label,
  value,
  onChange,
  name,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  name: string;
}) {
  return (
    <>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <RatingScale label={`${name} ${label}`} value={value} onChange={onChange} />
    </>
  );
}
