'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { RiskMatrix } from '@/components/risk-matrix/RiskMatrix';
import { calculateRiskLevel, getRiskLevelLabel, getRiskLevelColor } from '@/lib/calculations';
import { t } from '@/lib/i18n';
import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

export function Step3ReviewRegister() {
  const { entries, language, setStep } = useRiskRegister();

  const riskCounts: Record<RiskLevel, number> = {
    high: entries.filter((e) => calculateRiskLevel(e) === 'high').length,
    medium: entries.filter((e) => calculateRiskLevel(e) === 'medium').length,
    low: entries.filter((e) => calculateRiskLevel(e) === 'low').length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Risk Matrix */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('riskMatrix', language)}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RiskMatrix />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('summary', language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>{t('totalItems', language)}:</span>
                <span className="font-bold">{entries.length}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    {t('highRisk', language)}:
                  </span>
                  <span className="font-bold">{riskCounts.high}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-red-500 transition-all"
                    style={{ width: `${(riskCounts.high / entries.length) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    {t('mediumRisk', language)}:
                  </span>
                  <span className="font-bold">{riskCounts.medium}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-yellow-500 transition-all"
                    style={{ width: `${(riskCounts.medium / entries.length) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    {t('lowRisk', language)}:
                  </span>
                  <span className="font-bold">{riskCounts.low}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${(riskCounts.low / entries.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Register Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('riskRegister', language)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">{t('threat', language)}</th>
                  <th className="p-3 text-left font-medium">{t('vulnerability', language)}</th>
                  <th className="p-3 text-left font-medium">{t('impact', language)}</th>
                  <th className="p-3 text-center font-medium">{t('riskLevel', language)}</th>
                  <th className="p-3 text-left font-medium">{t('mitigationStrategy', language)}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const riskLevel = calculateRiskLevel(entry);
                  return (
                    <tr key={entry.id} className="border-b">
                      <td className="p-3 font-medium">
                        {language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {entry.vulnerabilityDescription || '-'}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {entry.impactDescription || '-'}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-white',
                            getRiskLevelColor(riskLevel)
                          )}
                        >
                          {getRiskLevelLabel(riskLevel, language)}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {entry.mitigationStrategy || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          ← {t('previous', language)}
        </Button>
        <Button onClick={() => setStep(4)}>
          {t('next', language)} →
        </Button>
      </div>
    </div>
  );
}
