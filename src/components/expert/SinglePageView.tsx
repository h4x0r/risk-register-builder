'use client';

import { useState } from 'react';
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
import { RiskMatrix } from '@/components/risk-matrix/RiskMatrix';
import {
  THREAT_PRESETS,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  SOURCE_LABELS,
  PILLAR_LABELS,
  STRIDE_LABELS,
  STRIDE_PROPERTY,
  PROPERTY_LABELS,
  DEFAULT_ENTRY_VALUES,
} from '@/lib/constants';
import { searchPresets, presetsForCategory, categoryLabel } from '@/lib/taxonomy';
import { LearnLink } from '@/components/learn/LearnDialog';
import { calculateRiskLevel, getRiskLevelLabel, getRiskLevelColor, getMatrixPosition } from '@/lib/calculations';
import { t } from '@/lib/i18n';
import { Language, ThreatCategory, ThreatEntry, ThreatSource } from '@/types';
import { cn } from '@/lib/utils';

function CompactRating({ value, onChange, reversed }: { value: number; onChange: (v: number) => void; reversed?: boolean }) {
  const values = reversed ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1">
      {values.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            'h-6 w-6 rounded-full text-xs font-medium transition-all active:scale-95',
            value === v
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted-foreground/30'
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

/** NIST SP 800-30 threat source, colour-coded so the register scans at a glance. */
const SOURCE_STYLES: Record<ThreatSource, string> = {
  adversarial: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
  accidental: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  structural: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  environmental: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
};

/**
 * The taxonomy tags for one entry, rendered under its name.
 *
 * Native `title` tooltips rather than the Radix tooltip: these are glosses on an
 * abbreviation, not interactive content, and they must survive print and PDF export.
 */
function TaxonomyChips({ entry, language }: { entry: ThreatEntry; language: Language }) {
  const pick = (l: { zh: string; en: string }) => (language === 'zh-TW' ? l.zh : l.en);

  if (!entry.source && !entry.pillars?.length && !entry.stride?.length) return null;

  // Every chip is a way into the lesson behind it, so the explanation sits one click
  // from the judgement rather than in a manual nobody opens.
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
          className="rounded border border-purple-300 bg-purple-50 px-1 py-0.5 font-mono text-[10px] font-bold text-purple-800 transition-opacity hover:opacity-75 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200"
        >
          {STRIDE_LABELS[cls].short}
        </LearnLink>
      ))}
    </div>
  );
}

/** A "why" affordance beside a section heading. */
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

export function SinglePageView() {
  const { entries, language, addEntry, updateEntry, removeEntry } = useRiskRegister();
  const [selectedCategory, setSelectedCategory] = useState<ThreatCategory>('natural');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');

  // A free-text query searches the whole library; otherwise the category scopes it.
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

  return (
    <div className="space-y-4">
      {/* Add Threat Section */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">{t('addThreat', language)}</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
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
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ORDER.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {language === 'zh-TW' ? CATEGORY_LABELS[cat].zh : CATEGORY_LABELS[cat].en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={t('searchThreats', language)}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedPreset('');
              }}
              className="w-44"
            />
            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
              <SelectTrigger className="w-64">
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
                        {language === 'zh-TW'
                          ? CATEGORY_LABELS[preset.category].zh
                          : CATEGORY_LABELS[preset.category].en}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddPreset} disabled={!selectedPreset} size="sm">
              + {t('add', language)}
            </Button>
            <span className="text-muted-foreground self-center">{t('or', language)}</span>
            <Input
              placeholder={language === 'zh-TW' ? '自訂威脅名稱' : 'Custom threat name'}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-44"
            />
            <Button onClick={handleAddCustom} disabled={!customName.trim()} size="sm">
              + {t('add', language)}
            </Button>
            <span className="ml-auto self-center text-xs text-muted-foreground">
              {searching
                ? `${t('searchResults', language)}: ${presets.length}`
                : `${THREAT_PRESETS.length} ${language === 'zh-TW' ? '項威脅' : 'threats'}`}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Inherent Risk: Threat, Probability, Impact */}
        <Card className="lg:col-span-6">
          <CardHeader className="py-3">
            <CardTitle className="text-base">
              {language === 'zh-TW' ? '固有風險' : 'Inherent Risk'}
              <LearnHint topicId="risk-basics" label={t('learnMoreAbout', language)} />
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left font-medium border-r" rowSpan={3}>{t('threat', language)}</th>
                    <th className="p-2 text-center font-medium border-r">{t('probability', language)}</th>
                    <th className="p-2 text-center font-medium" colSpan={3}>{t('impact', language)}</th>
                  </tr>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="p-1 border-r"></th>
                    <th className="p-1">{language === 'zh-TW' ? '生命' : 'Life'}</th>
                    <th className="p-1">{language === 'zh-TW' ? '財產' : 'Asset'}</th>
                    <th className="p-1">{language === 'zh-TW' ? '業務' : 'Biz'}</th>
                  </tr>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="p-1 border-r">
                      <div className="flex justify-between">
                        <span>{t('low', language)}</span>
                        <span>←→</span>
                        <span>{t('high', language)}</span>
                      </div>
                    </th>
                    <th className="p-1">
                      <div className="flex justify-between">
                        <span>{t('low', language)}</span>
                        <span>→</span>
                        <span>{t('high', language)}</span>
                      </div>
                    </th>
                    <th className="p-1">
                      <div className="flex justify-between">
                        <span>{t('low', language)}</span>
                        <span>→</span>
                        <span>{t('high', language)}</span>
                      </div>
                    </th>
                    <th className="p-1">
                      <div className="flex justify-between">
                        <span>{t('low', language)}</span>
                        <span>→</span>
                        <span>{t('high', language)}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-2 font-medium border-r align-top">
                        {language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}
                        <TaxonomyChips entry={entry} language={language} />
                      </td>
                      <td className="p-2 border-r">
                        <CompactRating
                          value={entry.probability}
                          onChange={(v) => updateEntry(entry.id, { probability: v })}
                        />
                      </td>
                      <td className="p-2">
                        <CompactRating
                          value={entry.impactLife}
                          onChange={(v) => updateEntry(entry.id, { impactLife: v })}
                        />
                      </td>
                      <td className="p-2">
                        <CompactRating
                          value={entry.impactAsset}
                          onChange={(v) => updateEntry(entry.id, { impactAsset: v })}
                        />
                      </td>
                      <td className="p-2">
                        <CompactRating
                          value={entry.impactBusiness}
                          onChange={(v) => updateEntry(entry.id, { impactBusiness: v })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Risk Matrix (Center) */}
        <Card className="lg:col-span-3">
          <CardHeader className="py-3 px-3">
            <CardTitle className="text-base">
              {t('riskMatrix', language)}
              <LearnHint topicId="matrix" label={t('learnMoreAbout', language)} />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-2">
            <RiskMatrix entries={entries} />
          </CardContent>
        </Card>

        {/* Residual Risk: Control, Risk Level */}
        <Card className="lg:col-span-3">
          <CardHeader className="py-3">
            <CardTitle className="text-base">
              {language === 'zh-TW' ? '剩餘風險' : 'Residual Risk'}
              <LearnHint topicId="scoring" label={t('learnMoreAbout', language)} />
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground border-b pb-2">
                <div className="flex-1 text-center">
                  <div className="font-medium text-foreground text-sm">{t('controlCapability', language)}</div>
                  <div className="flex justify-between mt-1">
                    <span>{t('weak', language)}</span>
                    <span>→</span>
                    <span>{t('strong', language)}</span>
                  </div>
                </div>
                <div className="w-12 text-center font-medium text-foreground text-sm">{t('riskLevel', language)}</div>
                <div className="w-6"></div>
              </div>
              {/* Entries */}
              {entries.map((entry) => {
                const riskLevel = calculateRiskLevel(entry);
                return (
                  <div key={entry.id} className="flex items-center gap-2 border-b pb-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground w-8">{language === 'zh-TW' ? '外部' : 'Ext'}</span>
                        <CompactRating
                          value={entry.controlExternal}
                          onChange={(v) => updateEntry(entry.id, { controlExternal: v })}
                          reversed
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground w-8">{language === 'zh-TW' ? '內部' : 'Int'}</span>
                        <CompactRating
                          value={entry.controlInternal}
                          onChange={(v) => updateEntry(entry.id, { controlInternal: v })}
                          reversed
                        />
                      </div>
                    </div>
                    <div className="w-12 text-center">
                      <span
                        className={cn(
                          'inline-block rounded px-2 py-0.5 text-xs font-medium text-white',
                          getRiskLevelColor(riskLevel)
                        )}
                      >
                        {getRiskLevelLabel(riskLevel, language)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => removeEntry(entry.id)}
                    >
                      ×
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Register Table */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">
            {t('riskRegister', language)}
            <LearnHint topicId="treatment" label={t('learnMoreAbout', language)} />
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left font-medium">{t('threat', language)}</th>
                  <th className="p-2 text-left font-medium">
                    {t('category', language)}
                    <LearnHint topicId="categories" label={t('learnMoreAbout', language)} />
                  </th>
                  <th className="p-2 text-left font-medium">{t('vulnerability', language)}</th>
                  <th className="p-2 text-left font-medium">{t('impact', language)}</th>
                  <th className="p-2 text-center font-medium">{t('riskLevel', language)}</th>
                  <th className="p-2 text-left font-medium">{t('mitigationStrategy', language)}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const riskLevel = calculateRiskLevel(entry);
                  const matrixPos = getMatrixPosition(entry);
                  return (
                    <tr key={entry.id} className="border-b">
                      <td className="p-2 font-medium align-top">
                        {language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}
                        <TaxonomyChips entry={entry} language={language} />
                      </td>
                      <td className="p-2 align-top text-xs text-muted-foreground">
                        {categoryLabel(entry.category, language)}
                      </td>
                      <td className="p-2 text-center font-medium">
                        {matrixPos.y}
                      </td>
                      <td className="p-2 text-center font-medium">
                        {matrixPos.x}
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={cn(
                            'inline-block rounded px-2 py-0.5 text-xs font-medium text-white',
                            getRiskLevelColor(riskLevel)
                          )}
                        >
                          {getRiskLevelLabel(riskLevel, language)}
                        </span>
                      </td>
                      <td className="p-2">
                        <Input
                          value={entry.mitigationStrategy}
                          onChange={(e) => updateEntry(entry.id, { mitigationStrategy: e.target.value })}
                          className="h-8 text-sm"
                          placeholder="-"
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
  );
}
