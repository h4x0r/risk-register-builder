'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { exportToExcel } from '@/lib/export/excel';
import { exportToPdf } from '@/lib/export/pdf';
import { exportToPptx } from '@/lib/export/pptx';
import { t } from '@/lib/i18n';

export function Step4Export() {
  const { entries, language, setStep } = useRiskRegister();
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: 'excel' | 'pdf' | 'pptx') => {
    setExporting(format);
    try {
      switch (format) {
        case 'excel':
          await exportToExcel(entries, language);
          break;
        case 'pdf':
          await exportToPdf(entries, language);
          break;
        case 'pptx':
          await exportToPptx(entries, language);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  const handleExportAll = async () => {
    setExporting('all');
    try {
      await exportToExcel(entries, language);
      await exportToPptx(entries, language);
      await exportToPdf(entries, language);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      id: 'excel',
      title: 'XLSX',
      description: t('excelDesc', language),
      icon: (
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M3 9h18M3 15h18" />
        </svg>
      ),
    },
    {
      id: 'pdf',
      title: 'PDF',
      description: t('pdfDesc', language),
      icon: (
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: 'pptx',
      title: 'PPTX',
      description: t('pptxDesc', language),
      icon: (
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h12M6 12h8M6 16h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('selectExportFormat', language)}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {exportOptions.map((option) => (
          <Card
            key={option.id}
            className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
            onClick={() => handleExport(option.id as 'excel' | 'pdf' | 'pptx')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 text-primary">{option.icon}</div>
              <CardTitle>{option.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                {option.description}
              </CardDescription>
              <Button
                className="mt-4 w-full"
                variant="outline"
                disabled={exporting !== null}
              >
                {exporting === option.id ? (
                  <span className="animate-pulse">
                    {language === 'zh-TW' ? '匯出中...' : 'Exporting...'}
                  </span>
                ) : (
                  language === 'zh-TW' ? '下載' : 'Download'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(3)}>
          ← {t('previous', language)}
        </Button>
        <Button
          onClick={handleExportAll}
          disabled={exporting !== null}
          size="lg"
        >
          {exporting === 'all' ? (
            <span className="animate-pulse">
              {language === 'zh-TW' ? '匯出中...' : 'Exporting...'}
            </span>
          ) : (
            <>↓ {t('exportAll', language)}</>
          )}
        </Button>
      </div>
    </div>
  );
}
