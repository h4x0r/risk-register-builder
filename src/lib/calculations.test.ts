import { describe, it, expect } from 'vitest';
import {
  riskLevelForScore,
  getControlFactor,
  getMatrixPosition,
  getResidualMatrixPosition,
  getCellRiskLevel,
  calculateInherentThreat,
  calculateResidualRisk,
  calculateRiskLevel,
} from './calculations';
import { RISK_THRESHOLDS, DEFAULT_ENTRY_VALUES } from './constants';
import { ThreatEntry } from '@/types';

const entry = (over: Partial<ThreatEntry> = {}): ThreatEntry => ({
  id: 'x', name: 'x', category: 'custom', ...DEFAULT_ENTRY_VALUES, ...over,
});

describe('riskLevelForScore', () => {
  it('bands on the thresholds the app publishes', () => {
    expect(riskLevelForScore(RISK_THRESHOLDS.low.max)).toBe('low');
    expect(riskLevelForScore(RISK_THRESHOLDS.low.max + 0.01)).toBe('medium');
    expect(riskLevelForScore(RISK_THRESHOLDS.medium.max)).toBe('medium');
    expect(riskLevelForScore(RISK_THRESHOLDS.medium.max + 0.01)).toBe('high');
  });

  it('agrees with calculateRiskLevel for a whole entry', () => {
    const e = entry({ probability: 4, impactLife: 4, impactAsset: 4, impactBusiness: 4 });
    expect(riskLevelForScore(calculateResidualRisk(e))).toBe(calculateRiskLevel(e));
  });
});

describe('getControlFactor', () => {
  it('is 0 when both controls are strongest and 1 when both are weakest', () => {
    // Controls are scored 1 = strong, 5 = weak.
    expect(getControlFactor(entry({ controlInternal: 1, controlExternal: 1 }))).toBe(0);
    expect(getControlFactor(entry({ controlInternal: 5, controlExternal: 5 }))).toBe(1);
    expect(getControlFactor(entry({ controlInternal: 3, controlExternal: 3 }))).toBe(0.5);
  });
});

describe('getResidualMatrixPosition', () => {
  it('equals the inherent position when controls do nothing', () => {
    const e = entry({ probability: 4, impactLife: 3, impactAsset: 3, impactBusiness: 3, controlInternal: 5, controlExternal: 5 });
    expect(getResidualMatrixPosition(e)).toEqual(getMatrixPosition(e));
  });

  it('collapses to the best cell when controls are strongest', () => {
    // The formula drives residual risk to 0 there, so the dot belongs in (1,1).
    // Clamping to 1 rather than 0 keeps it on the grid.
    const e = entry({ probability: 5, impactLife: 5, impactAsset: 5, impactBusiness: 5, controlInternal: 1, controlExternal: 1 });
    expect(getResidualMatrixPosition(e)).toEqual({ x: 1, y: 1 });
  });

  it('never leaves the 5x5 grid', () => {
    for (let p = 1; p <= 5; p++) {
      for (let i = 1; i <= 5; i++) {
        for (let c = 1; c <= 5; c++) {
          const pos = getResidualMatrixPosition(
            entry({ probability: p, impactLife: i, impactAsset: i, impactBusiness: i, controlInternal: c, controlExternal: c })
          );
          expect(pos.x, `x off grid at p${p} i${i} c${c}`).toBeGreaterThanOrEqual(1);
          expect(pos.x).toBeLessThanOrEqual(5);
          expect(pos.y, `y off grid at p${p} i${i} c${c}`).toBeGreaterThanOrEqual(1);
          expect(pos.y).toBeLessThanOrEqual(5);
        }
      }
    }
  });

  it('moves toward the origin as controls strengthen, never away', () => {
    // The whole point of the second matrix is that it shows improvement. If a
    // stronger control could push a dot further out, the picture would lie.
    const base = { probability: 5, impactLife: 4, impactAsset: 4, impactBusiness: 4 };
    let previous = getResidualMatrixPosition(entry({ ...base, controlInternal: 5, controlExternal: 5 }));

    for (let c = 4; c >= 1; c--) {
      const current = getResidualMatrixPosition(entry({ ...base, controlInternal: c, controlExternal: c }));
      expect(current.x, `x grew as controls strengthened to ${c}`).toBeLessThanOrEqual(previous.x);
      expect(current.y, `y grew as controls strengthened to ${c}`).toBeLessThanOrEqual(previous.y);
      previous = current;
    }
  });
});

describe('the matrix and the score tell the same story', () => {
  it('shades a cell by the score that cell represents', () => {
    // A cell at (x, y) stands for impact sum 3x and probability y, so its score is
    // 3xy. Deriving the band from that is what keeps cell colour, dot position and
    // the printed risk level from contradicting each other.
    for (let x = 1; x <= 5; x++) {
      for (let y = 1; y <= 5; y++) {
        expect(getCellRiskLevel(x, y), `cell ${x},${y}`).toBe(riskLevelForScore(3 * x * y));
      }
    }
  });

  it('lands an entry in a residual cell whose shade matches its own risk level', () => {
    // This is the invariant that makes the two matrices comparable: the residual
    // cell a dot occupies is shaded the same level the register prints for it.
    const cases: ThreatEntry[] = [
      entry({ probability: 5, impactLife: 5, impactAsset: 5, impactBusiness: 5, controlInternal: 5, controlExternal: 5 }),
      entry({ probability: 1, impactLife: 1, impactAsset: 1, impactBusiness: 1, controlInternal: 1, controlExternal: 1 }),
      entry({ probability: 4, impactLife: 4, impactAsset: 4, impactBusiness: 4, controlInternal: 5, controlExternal: 5 }),
    ];
    for (const e of cases) {
      const pos = getResidualMatrixPosition(e);
      expect(getCellRiskLevel(pos.x, pos.y), `entry p${e.probability} c${e.controlInternal}`).toBe(
        calculateRiskLevel(e)
      );
    }
  });

  it('keeps the inherent cell consistent with the uncontrolled score', () => {
    const e = entry({ probability: 4, impactLife: 4, impactAsset: 4, impactBusiness: 4 });
    const pos = getMatrixPosition(e);
    expect(getCellRiskLevel(pos.x, pos.y)).toBe(riskLevelForScore(calculateInherentThreat(e)));
  });
});
