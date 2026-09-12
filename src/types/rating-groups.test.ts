import { describe, it, expect } from 'vitest';
import {
  RATING_KEYS,
  INHERENT_RATING_KEYS,
  CONTROL_RATING_KEYS,
  RatingKey,
  ThreatEntry,
} from './index';
import { DEFAULT_ENTRY_VALUES } from '@/lib/constants';

/**
 * Each card shows a rationale box per score it displays, so the grouping has to
 * partition the six judgements exactly. A key in neither group gets no box at all;
 * a key in both gets two, and the completeness counters stop adding up.
 */
describe('rating key grouping', () => {
  it('partitions every rating key exactly once', () => {
    const combined = [...INHERENT_RATING_KEYS, ...CONTROL_RATING_KEYS];

    expect(combined.slice().sort()).toEqual(RATING_KEYS.slice().sort());
    expect(new Set(combined).size).toBe(combined.length);
  });

  it('puts the four inherent judgements together and the two control ones apart', () => {
    expect(INHERENT_RATING_KEYS).toHaveLength(4);
    expect(CONTROL_RATING_KEYS).toHaveLength(2);

    // The split follows which card scores them, so control keys are the control fields.
    for (const key of CONTROL_RATING_KEYS) {
      expect(key.startsWith('control'), `${key} is not a control field`).toBe(true);
    }
    for (const key of INHERENT_RATING_KEYS) {
      expect(key.startsWith('control'), `${key} is a control field`).toBe(false);
    }
  });

  it('names only keys that exist on an entry', () => {
    // A typo here would render a box that reads and writes nothing.
    const entry: ThreatEntry = { id: 'x', name: 'x', category: 'custom', ...DEFAULT_ENTRY_VALUES };
    for (const key of RATING_KEYS) {
      expect(typeof entry[key as RatingKey], `${key} missing from ThreatEntry`).toBe('number');
    }
  });
});
