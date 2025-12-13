'use client';

import ExcelJS from 'exceljs';
import { ThreatEntry, Language } from '@/types';
import { calculateRiskLevel, getRiskLevelLabel } from '@/lib/calculations';

export async function exportToExcel(entries: ThreatEntry[], language: Language): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Risk Register Builder';
  workbook.created = new Date();

  // Sheet 1: Vulnerability Analysis (脆弱分析)
  const sheet1 = workbook.addWorksheet(language === 'zh-TW' ? '脆弱分析' : 'Vulnerability Analysis');

  // Headers
  const headers1 = language === 'zh-TW'
    ? ['緊急事故種類', '發生機率', '人命安全', '財產安全', '業務運作', '內部資源', '外部資源', '風險等級']
    : ['Emergency Type', 'Probability', 'Life Safety', 'Asset Safety', 'Business Ops', 'Internal Resources', 'External Resources', 'Risk Level'];

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
      getRiskLevelLabel(riskLevel, language),
    ]);
  });

  // Set column widths
  sheet1.columns = [
    { width: 20 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
  ];

  // Sheet 2: Risk Register (風險登記冊)
  const sheet2 = workbook.addWorksheet(language === 'zh-TW' ? '風險登記冊' : 'Risk Register');

  const headers2 = language === 'zh-TW'
    ? ['威脅', '脆弱性', '影響', '風險等級', '緩解策略']
    : ['Threat', 'Vulnerability', 'Impact', 'Risk Level', 'Mitigation Strategy'];

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
    sheet2.addRow([
      language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name),
      entry.vulnerabilityDescription || '-',
      entry.impactDescription || '-',
      getRiskLevelLabel(riskLevel, language),
      entry.mitigationStrategy || '-',
    ]);
  });

  // Set column widths
  sheet2.columns = [
    { width: 20 },
    { width: 30 },
    { width: 25 },
    { width: 12 },
    { width: 40 },
  ];

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
