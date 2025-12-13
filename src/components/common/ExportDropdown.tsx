'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { exportToExcel } from '@/lib/export/excel';
import { exportToPdf } from '@/lib/export/pdf';
import { exportToPptx } from '@/lib/export/pptx';
import { t } from '@/lib/i18n';

export function ExportDropdown() {
  const { entries, language } = useRiskRegister();
  const [exporting, setExporting] = useState(false);

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={entries.length === 0 || exporting}>
          {exporting ? '...' : t('export', language)} ▼
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pptx')}>
          PowerPoint (.pptx)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
