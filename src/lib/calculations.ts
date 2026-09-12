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

/** Band any score on the published thresholds. One place, so nothing can drift. */
export function riskLevelForScore(score: number): RiskLevel {
  if (score <= RISK_THRESHOLDS.low.max) return 'low';
  if (score <= RISK_THRESHOLDS.medium.max) return 'medium';
  return 'high';
}

export function calculateRiskLevel(entry: ThreatEntry): RiskLevel {
  return riskLevelForScore(calculateResidualRisk(entry));
}

/**
 * How much of the inherent risk survives the controls: 0 = controls absorb it all,
 * 1 = controls do nothing. Controls are scored 1 = strong, 5 = weak.
 */
export function getControlFactor(entry: ThreatEntry): number {
  return (calculateControlSum(entry) - 2) / 8;
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

const clampToGrid = (value: number) => Math.min(5, Math.max(1, Math.round(value)));

// For matrix positioning (1-5 scale on both axes)
export function getMatrixPosition(entry: ThreatEntry): { x: number; y: number } {
  const avgImpact = calculateImpactSum(entry) / 3;
  return {
    x: Math.round(avgImpact),  // Impact: 1-5 (x-axis)
    y: entry.probability,       // Probability: 1-5 (y-axis)
  };
}

/**
 * Where the threat sits once controls are counted.
 *
 * A cell at (x, y) stands for impact sum 3x against probability y, so the score it
 * represents is 3xy. Residual risk is inherent x f, so scaling BOTH axes by sqrt(f)
 * gives 3(x*sqrt f)(y*sqrt f) = 3xy*f — the cell a threat lands in is its residual
 * score. Cell shade, dot position and the printed risk level then agree because they
 * are the same number, not because someone kept three rules in step by hand.
 *
 * Splitting the factor evenly is the only choice available: this model scores control
 * capability as a single strength and does not say whether a control suppresses the
 * likelihood or softens the impact. Anything other than an even split would be
 * asserting a distinction the inputs never captured.
 */
export function getResidualMatrixPosition(entry: ThreatEntry): { x: number; y: number } {
  const axisFactor = Math.sqrt(getControlFactor(entry));

  // Scale the UNROUNDED impact mean and round once. Rounding to the grid first and
  // then scaling rounds twice and moves more threats into a cell whose shade
  // disagrees with their printed level.
  const meanImpact = calculateImpactSum(entry) / 3;

  return {
    x: clampToGrid(meanImpact * axisFactor),
    y: clampToGrid(entry.probability * axisFactor),
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

/**
 * Shade for the cell at (x, y), shared by both matrices.
 *
 * The cell stands for impact sum 3x at probability y, so it scores 3xy. Banding that
 * directly means one grid serves the inherent and residual views identically — the
 * only thing that moves between them is the threat, which is the comparison the pair
 * of matrices exists to show.
 */
export function getCellRiskLevel(x: number, y: number): RiskLevel {
  return riskLevelForScore(3 * x * y);
}
