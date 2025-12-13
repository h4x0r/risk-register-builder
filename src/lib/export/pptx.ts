'use client';

import PptxGenJS from 'pptxgenjs';
import { ThreatEntry, Language } from '@/types';
import { calculateRiskLevel, getRiskLevelLabel, getMatrixPosition } from '@/lib/calculations';

export async function exportToPptx(entries: ThreatEntry[], language: Language): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = language === 'zh-TW' ? '風險登記冊' : 'Risk Register';
  pptx.author = 'Risk Register Builder';

  // Slide 1: Title
  const slide1 = pptx.addSlide();
  slide1.addText(language === 'zh-TW' ? '風險登記冊' : 'Risk Register', {
    x: 0.5,
    y: 2.5,
    w: '90%',
    h: 1,
    fontSize: 44,
    bold: true,
    color: 'B1302A',
    align: 'center',
  });
  slide1.addText(new Date().toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US'), {
    x: 0.5,
    y: 3.8,
    w: '90%',
    h: 0.5,
    fontSize: 18,
    color: '666666',
    align: 'center',
  });

  // Slide 2: Vulnerability Analysis Table (脆弱分析)
  const slide2 = pptx.addSlide();
  slide2.addText(language === 'zh-TW' ? '脆弱分析' : 'Vulnerability Analysis', {
    x: 0.5,
    y: 0.3,
    w: '90%',
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: 'B1302A',
  });

  const headers2 = language === 'zh-TW'
    ? ['緊急事故種類', '發生機率', '人命安全', '財產安全', '業務運作', '內部資源', '外部資源', '風險等級']
    : ['Emergency Type', 'Prob', 'Life', 'Asset', 'Business', 'Internal', 'External', 'Risk'];

  const headerRow2: PptxGenJS.TableRow = headers2.map((h) => ({
    text: h,
    options: { bold: true, fill: { color: '4472C4' }, color: 'FFFFFF', align: 'center' as const },
  }));

  const dataRows2: PptxGenJS.TableRow[] = entries.map((entry) => {
    const riskLevel = calculateRiskLevel(entry);
    return [
      { text: language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name), options: { bold: true } },
      { text: String(entry.probability), options: { align: 'center' as const } },
      { text: String(entry.impactLife), options: { align: 'center' as const } },
      { text: String(entry.impactAsset), options: { align: 'center' as const } },
      { text: String(entry.impactBusiness), options: { align: 'center' as const } },
      { text: String(entry.controlInternal), options: { align: 'center' as const } },
      { text: String(entry.controlExternal), options: { align: 'center' as const } },
      {
        text: getRiskLevelLabel(riskLevel, language),
        options: {
          align: 'center' as const,
          bold: true,
          fill: { color: riskLevel === 'high' ? 'FF0000' : riskLevel === 'medium' ? 'FFFF00' : '00FF00' },
        },
      },
    ];
  });

  const rows2: PptxGenJS.TableRow[] = [headerRow2, ...dataRows2];

  slide2.addTable(rows2, {
    x: 0.3,
    y: 1.2,
    w: 9.4,
    colW: [1.8, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
    fontSize: 11,
    border: { type: 'solid', pt: 0.5, color: '999999' },
    valign: 'middle',
  });

  // Slide 3: Risk Register Table (風險登記冊)
  const slide3 = pptx.addSlide();
  slide3.addText(language === 'zh-TW' ? '風險登記冊範本' : 'Risk Register Template', {
    x: 0.5,
    y: 0.3,
    w: '90%',
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: 'B1302A',
    align: 'center',
  });

  const headers3 = language === 'zh-TW'
    ? ['威脅 (Threat)', '脆弱性 (Vulnerability)', '影響 (Impact)', '風險等級', '緩解策略']
    : ['Threat', 'Vulnerability', 'Impact', 'Risk Level', 'Mitigation Strategy'];

  const headerRow3: PptxGenJS.TableRow = headers3.map((h) => ({
    text: h,
    options: { bold: true, fill: { color: '4472C4' }, color: 'FFFFFF', align: 'center' as const },
  }));

  const dataRows3: PptxGenJS.TableRow[] = entries.map((entry) => {
    const riskLevel = calculateRiskLevel(entry);
    const matrixPos = getMatrixPosition(entry);
    return [
      { text: language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name), options: { bold: true } },
      { text: String(matrixPos.y), options: { align: 'center' as const } },
      { text: String(matrixPos.x), options: { align: 'center' as const } },
      {
        text: getRiskLevelLabel(riskLevel, language),
        options: {
          align: 'center' as const,
          bold: true,
          fill: { color: riskLevel === 'high' ? 'FF0000' : riskLevel === 'medium' ? 'FFFF00' : '00FF00' },
        },
      },
      { text: entry.mitigationStrategy || '-' },
    ];
  });

  const rows3: PptxGenJS.TableRow[] = [headerRow3, ...dataRows3];

  slide3.addTable(rows3, {
    x: 0.3,
    y: 1.2,
    w: 9.4,
    colW: [1.5, 2.2, 2.0, 1.0, 2.7],
    fontSize: 11,
    border: { type: 'solid', pt: 0.5, color: '999999' },
    valign: 'middle',
  });

  // Download
  await pptx.writeFile({ fileName: `risk-register-${new Date().toISOString().split('T')[0]}.pptx` });
}
