'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, FileSpreadsheet, FileText, Image as ImageIcon, Link2, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { exportToExcel } from '@/lib/export/excel';
import { exportToPdf } from '@/lib/export/pdf';
import { exportToPptx } from '@/lib/export/pptx';
import { exportToPng } from '@/lib/export/png';
import { generateShareUrl } from '@/lib/url-state';
import { t } from '@/lib/i18n';

type Format = 'excel' | 'pdf' | 'pptx' | 'png';

export function ExportDropdown() {
  const { entries, language } = useRiskRegister();
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleExport = async (format: Format) => {
    if (entries.length === 0) return;
    setExporting(true);
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
        case 'png':
          await exportToPng(language, new Date().toISOString().split('T')[0]);
          break;
      }
    } catch (error) {
      // A silent failure here reads as "nothing happened", and the user retries the
      // same click forever. Name the format and show why.
      setToast({
        message: `${format.toUpperCase()}: ${error instanceof Error ? error.message : String(error)}`,
        type: 'warning',
      });
    } finally {
      setExporting(false);
    }
  };

  const handleCopyLink = async () => {
    if (entries.length === 0) return;

    const baseUrl = window.location.origin + window.location.pathname;
    const { url, isLong } = generateShareUrl(entries, baseUrl);

    try {
      await navigator.clipboard.writeText(url);
      setToast(
        isLong
          ? {
              message: language === 'zh-TW'
                ? '連結已複製（連結較長，部分瀏覽器可能無法開啟）'
                : 'Link copied — it is long, and some browsers may not open it',
              type: 'warning',
            }
          : {
              message: language === 'zh-TW' ? '連結已複製' : 'Link copied to clipboard',
              type: 'success',
            }
      );
    } catch (error) {
      setToast({
        message: `${language === 'zh-TW' ? '複製失敗' : 'Could not copy'}: ${
          error instanceof Error ? error.message : String(error)
        }`,
        type: 'warning',
      });
    }
  };

  const items: { format: Format; icon: React.ReactNode; label: string; hint: string }[] = [
    {
      format: 'excel',
      icon: <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />,
      label: 'Excel (.xlsx)',
      hint: t('excelDesc', language),
    },
    {
      format: 'png',
      icon: <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />,
      label: 'PNG (.png)',
      hint: t('exportPng', language),
    },
    {
      format: 'pdf',
      icon: <FileText className="h-3.5 w-3.5" aria-hidden="true" />,
      label: 'PDF',
      hint: t('pdfDesc', language),
    },
    {
      format: 'pptx',
      icon: <Presentation className="h-3.5 w-3.5" aria-hidden="true" />,
      label: 'PowerPoint (.pptx)',
      hint: t('pptxDesc', language),
    },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={entries.length === 0 || exporting}>
            {exporting ? t('exportingPng', language) : t('export', language)}
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          {items.map((item) => (
            <DropdownMenuItem
              key={item.format}
              onClick={() => handleExport(item.format)}
              className="flex-col items-start gap-0.5"
            >
              <span className="flex items-center gap-2 font-medium">
                {item.icon}
                {item.label}
              </span>
              <span className="pl-[22px] text-xs text-muted-foreground">{item.hint}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
            {language === 'zh-TW' ? '複製分享連結' : 'Copy share link'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-50 max-w-lg -translate-x-1/2 rounded-md px-4 py-2 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2"
          style={{
            background: toast.type === 'success' ? 'var(--risk-low)' : 'var(--risk-medium)',
            color: 'white',
          }}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
