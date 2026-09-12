'use client';

import ExcelJS from 'exceljs';
import { ThreatEntry, Language } from '@/types';
import {
  calculateRiskLevel,
  getRiskLevelLabel,
  getMatrixPosition,
  getResidualMatrixPosition,
  calculateInherentThreat,
  calculateResidualRisk,
} from '@/lib/calculations';
import { taxonomyLabels } from '@/lib/taxonomy';
import { t } from '@/lib/i18n';
import { RATING_KEYS } from '@/types';

export async function exportToExcel(entries: ThreatEntry[], language: Language): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Risk Register Builder';
  workbook.created = new Date();

  // Sheet 1: Vulnerability Analysis (脆弱分析)
  const sheet1 = workbook.addWorksheet(language === 'zh-TW' ? '脆弱分析' : 'Vulnerability Analysis');

  // Headers
  // Score columns, then the reasoning behind each score in the same order. Keeping
  // the rationale beside the number is the point: a score that travels into a
  // spreadsheet without its reasoning cannot be reviewed by whoever opens it next.
  const ratingLabels = language === 'zh-TW'
    ? ['發生機率', '人命安全', '財產安全', '業務運作', '內部資源', '外部資源']
    : ['Probability', 'Life Safety', 'Asset Safety', 'Business Ops', 'Internal Resources', 'External Resources'];

  const headers1 = [
    language === 'zh-TW' ? '緊急事故種類' : 'Emergency Type',
    ...ratingLabels,
    language === 'zh-TW' ? '固有風險分數' : 'Inherent Score',
    language === 'zh-TW' ? '剩餘風險分數' : 'Residual Score',
    language === 'zh-TW' ? '風險等級' : 'Risk Level',
    ...ratingLabels.map((label) => (language === 'zh-TW' ? `理由：${label}` : `Rationale — ${label}`)),
  ];

  sheet1.addRow(headers1);

  // Style header row
  sheet1.getRow(1).font = { bold: true };
  sheet1.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  };
  sheet1.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Add data rows
  entries.forEach((entry) => {
    const riskLevel = calculateRiskLevel(entry);
    sheet1.addRow([
      language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name),
      entry.probability,
      entry.impactLife,
      entry.impactAsset,
      entry.impactBusiness,
      entry.controlInternal,
      entry.controlExternal,
      Number(calculateInherentThreat(entry).toFixed(1)),
      Number(calculateResidualRisk(entry).toFixed(1)),
      getRiskLevelLabel(riskLevel, language),
      ...RATING_KEYS.map((key) => entry.rationale?.[key] ?? ''),
    ]);
  });

  // Set column widths
  sheet1.columns = [
    { width: 24 },
    ...Array.from({ length: 6 }, () => ({ width: 12 })),
    { width: 14 },
    { width: 14 },
    { width: 12 },
    ...Array.from({ length: 6 }, () => ({ width: 38 })),
  ];
  // Rationale cells hold sentences, so let them wrap rather than run off the sheet.
  for (let i = 0; i < RATING_KEYS.length; i++) {
    sheet1.getColumn(11 + i).alignment = { wrapText: true, vertical: 'top' };
  }

  // Sheet 2: Risk Register (風險登記冊)
  const sheet2 = workbook.addWorksheet(language === 'zh-TW' ? '風險登記冊' : 'Risk Register');

  const headers2 = language === 'zh-TW'
    ? ['威脅', '類別', '威脅來源', '人員／流程／科技', 'STRIDE', '脆弱性', '影響', '固有風險格', '剩餘風險格', '風險等級', '緩解策略']
    : ['Threat', 'Category', 'Threat Source', 'People/Process/Technology', 'STRIDE', 'Vulnerability', 'Impact', 'Inherent Cell', 'Residual Cell', 'Risk Level', 'Mitigation Strategy'];

  sheet2.addRow(headers2);

  // Style header row
  sheet2.getRow(1).font = { bold: true };
  sheet2.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  };
  sheet2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Add data rows
  entries.forEach((entry) => {
    const riskLevel = calculateRiskLevel(entry);
    const matrixPos = getMatrixPosition(entry);
    const taxonomy = taxonomyLabels(entry, language);
    sheet2.addRow([
      language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name),
      taxonomy.category,
      taxonomy.source,
      taxonomy.pillars,
      taxonomy.stride,
      matrixPos.y, // Vulnerability = probability (Y-axis)
      matrixPos.x, // Impact = avg impact (X-axis)
      `${matrixPos.x}×${matrixPos.y}`,
      (() => {
        const residual = getResidualMatrixPosition(entry);
        return `${residual.x}×${residual.y}`;
      })(),
      getRiskLevelLabel(riskLevel, language),
      entry.mitigationStrategy || '-',
    ]);
  });

  // Set column widths
  sheet2.columns = [
    { width: 24 },
    { width: 22 },
    { width: 14 },
    { width: 24 },
    { width: 10 },
    { width: 12 },
    { width: 12 },
    { width: 14 },
    { width: 14 },
    { width: 12 },
    { width: 40 },
  ];

  // Sheet 3: the notice. A workbook travels further than the page it came from, so
  // the limits of the numbers travel with it rather than staying behind in the UI.
  const notice = workbook.addWorksheet(language === 'zh-TW' ? '使用聲明' : 'Notice');
  notice.getColumn(1).width = 120;
  notice.getColumn(1).alignment = { wrapText: true, vertical: 'top' };

  const noticeRows: string[] = [
    t('disclaimerTitle', language),
    '',
    t('disclaimerShort', language),
    '',
    t('disclaimerBody', language),
    '',
    t('disclaimerResponsibility', language),
    '',
    t('disclaimerData', language),
  ];
  noticeRows.forEach((line) => notice.addRow([line]));
  notice.getRow(1).font = { bold: true, size: 14 };
  notice.getRow(3).font = { bold: true };

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `risk-register-${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}
