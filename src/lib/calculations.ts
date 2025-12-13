import { ThreatEntry, RiskLevel } from '@/types';
import { RISK_THRESHOLDS } from './constants';

export function calculateImpactSum(entry: ThreatEntry): number {
  return entry.impactLife + entry.impactAsset + entry.impactBusiness;
}

export function calculateInherentThreat(entry: ThreatEntry): number {
  return calculateImpactSum(entry) * entry.probability;
}

export function calculateControlSum(entry: ThreatEntry): number {
  return entry.controlInternal + entry.controlExternal;
}

export function calculateResidualRisk(entry: ThreatEntry): number {
  const inherent = calculateInherentThreat(entry);
  const controlSum = calculateControlSum(entry);
  return inherent * (controlSum - 2) / 8;
}

export function calculateRiskLevel(entry: ThreatEntry): RiskLevel {
  const residual = calculateResidualRisk(entry);
  if (residual <= RISK_THRESHOLDS.low.max) return 'low';
  if (residual <= RISK_THRESHOLDS.medium.max) return 'medium';
  return 'high';
}

export function getRiskLevelLabel(level: RiskLevel, language: 'zh-TW' | 'en'): string {
  const labels: Record<RiskLevel, { zh: string; en: string }> = {
    low: { zh: '低', en: 'Low' },
    medium: { zh: '中', en: 'Medium' },
    high: { zh: '高', en: 'High' },
  };
  return language === 'zh-TW' ? labels[level].zh : labels[level].en;
}

export function getRiskLevelColor(level: RiskLevel): string {
  return RISK_THRESHOLDS[level].colorClass;
}

export function getRiskLevelTextColor(level: RiskLevel): string {
  return RISK_THRESHOLDS[level].textClass;
}

// For matrix positioning (1-5 scale on both axes)
export function getMatrixPosition(entry: ThreatEntry): { x: number; y: number } {
  const avgImpact = calculateImpactSum(entry) / 3;
  return {
    x: Math.round(avgImpact),  // Impact: 1-5 (x-axis)
    y: entry.probability,       // Probability: 1-5 (y-axis)
  };
}

// Get all entries at a specific matrix cell
export function getEntriesAtCell(
  entries: ThreatEntry[],
  x: number,
  y: number
): ThreatEntry[] {
  return entries.filter((entry) => {
    const pos = getMatrixPosition(entry);
    return pos.x === x && pos.y === y;
  });
}

// Get matrix cell risk level based on position
export function getCellRiskLevel(x: number, y: number): RiskLevel {
  // Create a mock entry to calculate risk level for this cell position
  // Using middle control values (3, 3) as baseline
  const mockEntry: ThreatEntry = {
    id: 'mock',
    name: 'mock',
    category: 'custom',
    probability: y,
    impactLife: x,
    impactAsset: x,
    impactBusiness: x,
    controlInternal: 3,
    controlExternal: 3,
    mitigationStrategy: '',
  };
  return calculateRiskLevel(mockEntry);
}
