'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRiskRegister, createCustomEntry } from '@/hooks/useRiskRegister';
import { THREAT_PRESETS, CATEGORY_LABELS } from '@/lib/constants';
import { t } from '@/lib/i18n';
import { ThreatCategory } from '@/types';
import { cn } from '@/lib/utils';

export function Step1AddThreats() {
  const {
    language,
    selectedPresets,
    togglePreset,
    entries,
    addEntry,
    setStep,
    createEntriesFromPresets,
  } = useRiskRegister();
  const [customName, setCustomName] = useState('');
  const [customNameEn, setCustomNameEn] = useState('');

  const categories: ThreatCategory[] = ['natural', 'technical', 'security'];

  const handleAddCustom = () => {
    if (customName.trim()) {
      addEntry(createCustomEntry(customName.trim(), customNameEn.trim() || undefined));
      setCustomName('');
      setCustomNameEn('');
    }
  };

  const handleNext = () => {
    createEntriesFromPresets();
    setStep(2);
  };

  const totalSelected = selectedPresets.length + entries.filter(e => e.category === 'custom').length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {categories.map((category) => {
        const presets = THREAT_PRESETS.filter((p) => p.category === category);
        const label = CATEGORY_LABELS[category];

        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {language === 'zh-TW' ? label.zh : label.en}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => {
                  const isSelected = selectedPresets.includes(preset.id) ||
                    entries.some(e => e.id === preset.id);

                  return (
                    <Button
                      key={preset.id}
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => togglePreset(preset.id)}
                      disabled={entries.some(e => e.id === preset.id)}
                    >
                      {language === 'zh-TW' ? preset.nameZh : preset.nameEn}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {t('customThreat', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder={language === 'zh-TW' ? '中文名稱' : 'Chinese name'}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder={language === 'zh-TW' ? '英文名稱 (選填)' : 'English name (optional)'}
              value={customNameEn}
              onChange={(e) => setCustomNameEn(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddCustom} disabled={!customName.trim()}>
              {t('add', language)}
            </Button>
          </div>

          {entries.filter(e => e.category === 'custom').length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {entries
                .filter((e) => e.category === 'custom')
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
                  >
                    {language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}
                    <button
                      onClick={() => useRiskRegister.getState().removeEntry(entry.id)}
                      className="ml-1 hover:text-red-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t('selected', language)}: {totalSelected} {t('items', language)}
        </div>
        <Button
          onClick={handleNext}
          disabled={totalSelected === 0}
          size="lg"
        >
          {t('next', language)} →
        </Button>
      </div>
    </div>
  );
}
