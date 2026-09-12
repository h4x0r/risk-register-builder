import { describe, it, expect } from 'vitest';
import {
  getResidualMatrixPosition,
  getCellRiskLevel,
  calculateRiskLevel,
} from './calculations';
import { DEFAULT_ENTRY_VALUES } from './constants';
import { ThreatEntry } from '@/types';

function everyCombination(visit: (entry: ThreatEntry) => void) {
  for (let p = 1; p <= 5; p++)
    for (let l = 1; l <= 5; l++)
      for (let a = 1; a <= 5; a++)
        for (let b = 1; b <= 5; b++)
          for (let ci = 1; ci <= 5; ci++)
            for (let ce = 1; ce <= 5; ce++)
              visit({
                id: 'x', name: 'x', category: 'custom', ...DEFAULT_ENTRY_VALUES,
                probability: p, impactLife: l, impactAsset: a, impactBusiness: b,
                controlInternal: ci, controlExternal: ce,
              });
}

/**
 * The residual matrix places a continuous score on a 5x5 grid, and a grid that
 * coarse cannot hold it exactly. These bound how much is lost, so the lesson that
 * describes the limit stays tied to the real number rather than to an assumption.
 *
 * This exists because an earlier version of the lesson claimed cell shade and
 * printed level "agree by construction". They do not. Three hand-picked cases
 * happened to agree; a sweep of all 15625 found otherwise.
 */
describe('what the 5x5 grid loses', () => {
  it('keeps the cell-shade disagreement rate inside the bound the lesson states', () => {
    let total = 0;
    let mismatched = 0;

    everyCombination((entry) => {
      total++;
      const pos = getResidualMatrixPosition(entry);
      if (getCellRiskLevel(pos.x, pos.y) !== calculateRiskLevel(entry)) mismatched++;
    });

    expect(total).toBe(15625);

    // Measured at 16.2%. The lesson tells students "roughly one in six", so a change
    // that pushed this materially either way would make the lesson wrong.
    const rate = mismatched / total;
    expect(rate).toBeGreaterThan(0.10);
    expect(rate).toBeLessThan(0.22);
  });

  it('always positions a threat on the grid', () => {
    everyCombination((entry) => {
      const pos = getResidualMatrixPosition(entry);
      expect(pos.x).toBeGreaterThanOrEqual(1);
      expect(pos.x).toBeLessThanOrEqual(5);
      expect(pos.y).toBeGreaterThanOrEqual(1);
      expect(pos.y).toBeLessThanOrEqual(5);
    });
  });
});
