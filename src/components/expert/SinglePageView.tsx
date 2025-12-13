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
import { THREAT_PRESETS, CATEGORY_LABELS } from '@/lib/constants';
import { calculateRiskLevel, getRiskLevelLabel, getRiskLevelColor } from '@/lib/calculations';
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
      probability: 3,
      impactLife: 3,
      impactAsset: 3,
      impactBusiness: 3,
      controlInternal: 3,
      controlExternal: 3,
      vulnerabilityDescription: '',
      impactDescription: '',
      mitigationStrategy: '',
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

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Vulnerability Analysis Table */}
        <Card className="lg:col-span-3">
          <CardHeader className="py-3">
            <CardTitle className="text-base">{t('vulnerabilityAnalysis', language)}</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left font-medium">{t('threat', language)}</th>
                    <th className="p-2 text-center font-medium" colSpan={4}>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t('low', language)}</span>
                        <span>{t('high', language)}</span>
                      </div>
                    </th>
                    <th className="p-2 text-center font-medium" colSpan={2}>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t('weak', language)}</span>
                        <span>{t('strong', language)}</span>
                      </div>
                    </th>
                    <th className="p-2 text-center font-medium">{t('riskLevel', language)}</th>
                    <th className="p-2"></th>
                  </tr>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th></th>
                    <th className="p-1">{language === 'zh-TW' ? '機率' : 'Prob'}</th>
                    <th className="p-1">{language === 'zh-TW' ? '生命' : 'Life'}</th>
                    <th className="p-1">{language === 'zh-TW' ? '財產' : 'Asset'}</th>
                    <th className="p-1">{language === 'zh-TW' ? '業務' : 'Biz'}</th>
                    <th className="p-1">{language === 'zh-TW' ? '內部' : 'Int'}</th>
                    <th className="p-1">{language === 'zh-TW' ? '外部' : 'Ext'}</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const riskLevel = calculateRiskLevel(entry);
                    return (
                      <tr key={entry.id} className="border-b">
                        <td className="p-2 font-medium">
                          {language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}
                        </td>
                        <td className="p-2">
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
                        <td className="p-2">
                          <CompactRating
                            value={entry.controlInternal}
                            onChange={(v) => updateEntry(entry.id, { controlInternal: v })}
                            reversed
                          />
                        </td>
                        <td className="p-2">
                          <CompactRating
                            value={entry.controlExternal}
                            onChange={(v) => updateEntry(entry.id, { controlExternal: v })}
                            reversed
                          />
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => removeEntry(entry.id)}
                          >
                            ×
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Risk Matrix */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">{t('riskMatrix', language)}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-2">
            <RiskMatrix />
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
                  return (
                    <tr key={entry.id} className="border-b">
                      <td className="p-2 font-medium">
                        {language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}
                      </td>
                      <td className="p-2">
                        <Input
                          value={entry.vulnerabilityDescription}
                          onChange={(e) => updateEntry(entry.id, { vulnerabilityDescription: e.target.value })}
                          className="h-8 text-sm"
                          placeholder="-"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={entry.impactDescription}
                          onChange={(e) => updateEntry(entry.id, { impactDescription: e.target.value })}
                          className="h-8 text-sm"
                          placeholder="-"
                        />
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
