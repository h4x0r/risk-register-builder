'use client';

import { useState, useEffect } from 'react';
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
import { generateShareUrl, URL_LENGTH_WARNING_THRESHOLD } from '@/lib/url-state';
import { t } from '@/lib/i18n';

export function ExportDropdown() {
  const { entries, language } = useRiskRegister();
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleExport = async (format: 'excel' | 'pdf' | 'pptx') => {
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
      }
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
      if (isLong) {
        setToast({
          message: language === 'zh-TW'
            ? '連結已複製（連結較長，部分瀏覽器可能無法開啟）'
            : 'Link copied (link is long, may not work in all browsers)',
          type: 'warning',
        });
      } else {
        setToast({
          message: language === 'zh-TW' ? '連結已複製' : 'Link copied to clipboard',
          type: 'success',
        });
      }
    } catch {
      setToast({
        message: language === 'zh-TW' ? '複製失敗' : 'Failed to copy',
        type: 'warning',
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={entries.length === 0 || exporting}>
            {exporting ? '...' : t('export', language)} ▼
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('excel')}>
            📊 Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            📄 PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pptx')}>
            📽️ PowerPoint (.pptx)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyLink}>
            🔗 {language === 'zh-TW' ? '複製連結' : 'Copy Link'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-yellow-500 text-black'
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
