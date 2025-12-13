'use client';

import { ThreatEntry, Language, RiskLevel } from '@/types';
import { calculateRiskLevel, getRiskLevelLabel } from '@/lib/calculations';

// Simple PDF generation using browser print
export async function exportToPdf(entries: ThreatEntry[], language: Language): Promise<void> {
  const riskCounts: Record<RiskLevel, number> = {
    high: entries.filter((e) => calculateRiskLevel(e) === 'high').length,
    medium: entries.filter((e) => calculateRiskLevel(e) === 'medium').length,
    low: entries.filter((e) => calculateRiskLevel(e) === 'low').length,
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${language === 'zh-TW' ? '風險登記冊' : 'Risk Register'}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #B1302A; text-align: center; }
        h2 { color: #333; border-bottom: 2px solid #B1302A; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #4472C4; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border: 1px solid #ddd; }
        tr:nth-child(even) { background: #f9f9f9; }
        .risk-high { background: #ff4444; color: white; padding: 4px 8px; border-radius: 4px; }
        .risk-medium { background: #ffbb33; color: black; padding: 4px 8px; border-radius: 4px; }
        .risk-low { background: #00C851; color: white; padding: 4px 8px; border-radius: 4px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .summary-item { flex: 1; padding: 15px; border-radius: 8px; text-align: center; }
        .summary-high { background: #ffebee; border: 2px solid #ff4444; }
        .summary-medium { background: #fff8e1; border: 2px solid #ffbb33; }
        .summary-low { background: #e8f5e9; border: 2px solid #00C851; }
        .date { text-align: center; color: #666; margin-bottom: 30px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>${language === 'zh-TW' ? '風險登記冊' : 'Risk Register'}</h1>
      <p class="date">${new Date().toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US')}</p>

      <h2>${language === 'zh-TW' ? '摘要' : 'Summary'}</h2>
      <div class="summary">
        <div class="summary-item summary-high">
          <div style="font-size: 24px; font-weight: bold;">${riskCounts.high}</div>
          <div>${language === 'zh-TW' ? '高風險' : 'High Risk'}</div>
        </div>
        <div class="summary-item summary-medium">
          <div style="font-size: 24px; font-weight: bold;">${riskCounts.medium}</div>
          <div>${language === 'zh-TW' ? '中風險' : 'Medium Risk'}</div>
        </div>
        <div class="summary-item summary-low">
          <div style="font-size: 24px; font-weight: bold;">${riskCounts.low}</div>
          <div>${language === 'zh-TW' ? '低風險' : 'Low Risk'}</div>
        </div>
      </div>

      <h2>${language === 'zh-TW' ? '風險登記冊' : 'Risk Register'}</h2>
      <table>
        <thead>
          <tr>
            <th>${language === 'zh-TW' ? '威脅' : 'Threat'}</th>
            <th>${language === 'zh-TW' ? '脆弱性' : 'Vulnerability'}</th>
            <th>${language === 'zh-TW' ? '影響' : 'Impact'}</th>
            <th>${language === 'zh-TW' ? '風險等級' : 'Risk Level'}</th>
            <th>${language === 'zh-TW' ? '緩解策略' : 'Mitigation Strategy'}</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map((entry) => {
            const riskLevel = calculateRiskLevel(entry);
            return `
              <tr>
                <td><strong>${language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}</strong></td>
                <td>${entry.vulnerabilityDescription || '-'}</td>
                <td>${entry.impactDescription || '-'}</td>
                <td><span class="risk-${riskLevel}">${getRiskLevelLabel(riskLevel, language)}</span></td>
                <td>${entry.mitigationStrategy || '-'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <h2>${language === 'zh-TW' ? '脆弱分析' : 'Vulnerability Analysis'}</h2>
      <table>
        <thead>
          <tr>
            <th>${language === 'zh-TW' ? '緊急事故種類' : 'Emergency Type'}</th>
            <th>${language === 'zh-TW' ? '發生機率' : 'Probability'}</th>
            <th>${language === 'zh-TW' ? '人命安全' : 'Life Safety'}</th>
            <th>${language === 'zh-TW' ? '財產安全' : 'Asset Safety'}</th>
            <th>${language === 'zh-TW' ? '業務運作' : 'Business Ops'}</th>
            <th>${language === 'zh-TW' ? '內部資源' : 'Internal'}</th>
            <th>${language === 'zh-TW' ? '外部資源' : 'External'}</th>
            <th>${language === 'zh-TW' ? '風險等級' : 'Risk'}</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map((entry) => {
            const riskLevel = calculateRiskLevel(entry);
            return `
              <tr>
                <td><strong>${language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}</strong></td>
                <td style="text-align: center;">${entry.probability}</td>
                <td style="text-align: center;">${entry.impactLife}</td>
                <td style="text-align: center;">${entry.impactAsset}</td>
                <td style="text-align: center;">${entry.impactBusiness}</td>
                <td style="text-align: center;">${entry.controlInternal}</td>
                <td style="text-align: center;">${entry.controlExternal}</td>
                <td><span class="risk-${riskLevel}">${getRiskLevelLabel(riskLevel, language)}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
