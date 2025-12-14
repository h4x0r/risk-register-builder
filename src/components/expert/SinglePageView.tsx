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
import { THREAT_PRESETS, CATEGORY_LABELS, DEFAULT_ENTRY_VALUES } from '@/lib/constants';
import { calculateRiskLevel, getRiskLevelLabel, getRiskLevelColor, getMatrixPosition } from '@/lib/calculations';
import { t } from '@/lib/i18n';
import { ThreatCategory, ThreatEntry } from '@/types';
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

export function SinglePageView() {
  const { entries, language, addEntry, updateEntry, removeEntry } = useRiskRegister();
  const [selectedCategory, setSelectedCategory] = useState<ThreatCategory>('natural');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customName, setCustomName] = useState('');

  const categories: ThreatCategory[] = ['natural', 'technical', 'security'];
  const presets = THREAT_PRESETS.filter((p) => p.category === selectedCategory);

  const handleAddPreset = () => {
    if (!selectedPreset) return;
    const preset = THREAT_PRESETS.find((p) => p.id === selectedPreset);
    if (!preset || entries.some((e) => e.id === preset.id)) return;

    addEntry({
      id: preset.id,
      name: preset.nameZh,
      nameEn: preset.nameEn,
      category: preset.category,
      ...DEFAULT_ENTRY_VALUES,
    });
    setSelectedPreset('');
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
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ThreatCategory)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {language === 'zh-TW' ? CATEGORY_LABELS[cat].zh : CATEGORY_LABELS[cat].en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={language === 'zh-TW' ? '選擇威脅' : 'Select threat'} />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem
                    key={preset.id}
                    value={preset.id}
                    disabled={entries.some((e) => e.id === preset.id)}
                  >
                    {language === 'zh-TW' ? preset.nameZh : preset.nameEn}
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
              className="w-48"
            />
            <Button onClick={handleAddCustom} disabled={!customName.trim()} size="sm">
              + {t('add', language)}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Inherent Risk: Threat, Probability, Impact */}
        <Card className="lg:col-span-6">
          <CardHeader className="py-3">
            <CardTitle className="text-base">
              {language === 'zh-TW' ? '固有風險' : 'Inherent Risk'}
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
                      <td className="p-2 font-medium border-r">
                        {language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}
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
            <CardTitle className="text-base">{t('riskMatrix', language)}</CardTitle>
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
          <CardTitle className="text-base">{t('riskRegister', language)}</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left font-medium">{t('threat', language)}</th>
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
                      <td className="p-2 font-medium">
                        {language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}
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
