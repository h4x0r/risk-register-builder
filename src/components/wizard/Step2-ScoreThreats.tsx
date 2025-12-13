'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { t } from '@/lib/i18n';
import { ThreatEntry } from '@/types';
import { cn } from '@/lib/utils';

interface RatingScaleProps {
  value: number;
  onChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
  reversed?: boolean;
}

function RatingScale({ value, onChange, leftLabel, rightLabel, reversed }: RatingScaleProps) {
  const values = reversed ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="flex justify-between">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={cn(
              'h-6 w-6 rounded-full text-xs font-medium transition-all active:scale-95',
              value === v
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted hover:border-primary/50'
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Step2ScoreThreats() {
  const { entries, updateEntry, language, setStep } = useRiskRegister();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentEntry = entries[currentIndex];

  if (!currentEntry) {
    return (
      <div className="text-center">
        <p>{language === 'zh-TW' ? '沒有威脅項目' : 'No threats to score'}</p>
        <Button onClick={() => setStep(1)} className="mt-4">
          ← {t('previous', language)}
        </Button>
      </div>
    );
  }

  const handleUpdate = (field: keyof ThreatEntry, value: number | string) => {
    updateEntry(currentEntry.id, { [field]: value });
  };

  const handleNext = () => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setStep(1);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {language === 'zh-TW' ? currentEntry.name : (currentEntry.nameEn || currentEntry.name)}
        </h2>
        <p className="text-muted-foreground">
          ({currentIndex + 1}/{entries.length})
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Probability and Impact Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="w-24 shrink-0">{t('probability', language)}</Label>
              <div className="flex-1">
                <RatingScale
                  value={currentEntry.probability}
                  onChange={(v) => handleUpdate('probability', v)}
                  leftLabel=""
                  rightLabel=""
                />
              </div>
            </div>

            <Separator />
            <p className="text-sm font-medium text-muted-foreground">
              {t('impactAssessment', language)}
            </p>

            <div className="flex items-center gap-4">
              <Label className="w-24 shrink-0">{t('lifeSafety', language)}</Label>
              <div className="flex-1">
                <RatingScale
                  value={currentEntry.impactLife}
                  onChange={(v) => handleUpdate('impactLife', v)}
                  leftLabel=""
                  rightLabel=""
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-24 shrink-0">{t('assetSafety', language)}</Label>
              <div className="flex-1">
                <RatingScale
                  value={currentEntry.impactAsset}
                  onChange={(v) => handleUpdate('impactAsset', v)}
                  leftLabel=""
                  rightLabel=""
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-24 shrink-0">{t('businessOps', language)}</Label>
              <div className="flex-1">
                <RatingScale
                  value={currentEntry.impactBusiness}
                  onChange={(v) => handleUpdate('impactBusiness', v)}
                  leftLabel=""
                  rightLabel=""
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {/* Controls Section - Reversed */}
          <p className="text-sm font-medium text-muted-foreground mb-4">
            {t('controlCapability', language)}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="w-24 shrink-0">{t('internalResources', language)}</Label>
              <div className="flex-1">
                <RatingScale
                  value={currentEntry.controlInternal}
                  onChange={(v) => handleUpdate('controlInternal', v)}
                  leftLabel=""
                  rightLabel=""
                  reversed
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-24 shrink-0">{t('externalResources', language)}</Label>
              <div className="flex-1">
                <RatingScale
                  value={currentEntry.controlExternal}
                  onChange={(v) => handleUpdate('controlExternal', v)}
                  leftLabel=""
                  rightLabel=""
                  reversed
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>{t('vulnerabilityDesc', language)}</Label>
            <Input
              value={currentEntry.vulnerabilityDescription}
              onChange={(e) => handleUpdate('vulnerabilityDescription', e.target.value)}
              placeholder={language === 'zh-TW' ? '例：面向海港的大型玻璃大堂' : 'e.g., Large glass lobby facing the harbor'}
              className="mt-1"
            />
          </div>
          <div>
            <Label>{t('impactDesc', language)}</Label>
            <Input
              value={currentEntry.impactDescription}
              onChange={(e) => handleUpdate('impactDescription', e.target.value)}
              placeholder={language === 'zh-TW' ? '例：員工/公眾嚴重受傷' : 'e.g., Serious injury to staff/public'}
              className="mt-1"
            />
          </div>
          <div>
            <Label>{t('mitigationStrategy', language)}</Label>
            <Input
              value={currentEntry.mitigationStrategy}
              onChange={(e) => handleUpdate('mitigationStrategy', e.target.value)}
              placeholder={language === 'zh-TW' ? '例：貼上防風膜；封鎖大堂' : 'e.g., Apply window film; Block lobby'}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev}>
          ← {currentIndex === 0 ? t('previous', language) : t('prevThreat', language)}
        </Button>
        <Button onClick={handleNext}>
          {currentIndex === entries.length - 1 ? t('next', language) : t('nextThreat', language)} →
        </Button>
      </div>
    </div>
  );
}
