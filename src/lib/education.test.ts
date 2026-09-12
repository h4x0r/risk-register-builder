import { describe, it, expect } from 'vitest';
import { LEARN_TOPICS, LEARN_TOPIC_IDS, getLearnTopic, Bilingual } from './education';
import { CATEGORY_ORDER, STRIDE_LABELS, RISK_THRESHOLDS, DEFAULT_ENTRY_VALUES } from './constants';
import { calculateInherentThreat, calculateResidualRisk, getResidualMatrixPosition } from './calculations';
import { ThreatEntry } from '@/types';

/** Every bilingual string in a topic, flattened, with a path for the failure message. */
function allBilingual(): { path: string; value: Bilingual }[] {
  const out: { path: string; value: Bilingual }[] = [];
  for (const topic of LEARN_TOPICS) {
    out.push({ path: `${topic.id}.title`, value: topic.title });
    out.push({ path: `${topic.id}.summary`, value: topic.summary });
    topic.paragraphs.forEach((p, i) => out.push({ path: `${topic.id}.paragraphs[${i}]`, value: p }));
    topic.table?.headers.forEach((h, i) => out.push({ path: `${topic.id}.table.headers[${i}]`, value: h }));
    topic.table?.rows.forEach((row, r) =>
      row.forEach((cell, c) => out.push({ path: `${topic.id}.table.rows[${r}][${c}]`, value: cell }))
    );
    topic.citations.forEach((cite, i) =>
      out.push({ path: `${topic.id}.citations[${i}].title`, value: cite.title })
    );
  }
  return out;
}

describe('learning content integrity', () => {
  it('has unique topic ids', () => {
    expect(new Set(LEARN_TOPIC_IDS).size).toBe(LEARN_TOPIC_IDS.length);
  });

  it('resolves every id through getLearnTopic', () => {
    for (const id of LEARN_TOPIC_IDS) {
      expect(getLearnTopic(id), id).toBeDefined();
    }
    expect(getLearnTopic('no-such-topic')).toBeUndefined();
  });

  it('covers every taxonomy axis the app asks a student to use', () => {
    // If the UI asks for a judgement, the app owes the student an explanation of it.
    for (const id of ['categories', 'sources', 'ppt', 'stride', 'scoring', 'matrix']) {
      expect(LEARN_TOPIC_IDS, `missing topic "${id}"`).toContain(id);
    }
  });

  it('writes every string in both languages', () => {
    for (const { path, value } of allBilingual()) {
      expect(value.zh?.trim(), `${path} missing zh`).toBeTruthy();
      expect(value.en?.trim(), `${path} missing en`).toBeTruthy();
    }
  });

  it('writes real Traditional Chinese, not an English placeholder', () => {
    for (const { path, value } of allBilingual()) {
      expect(/[一-鿿]/.test(value.zh), `${path} zh contains no Chinese`).toBe(true);
    }
  });

  it('gives every topic a summary and at least one paragraph', () => {
    for (const topic of LEARN_TOPICS) {
      expect(topic.paragraphs.length, `${topic.id} has no paragraphs`).toBeGreaterThan(0);
    }
  });

  it('cites at least one source on every topic', () => {
    // A teaching claim with no citation is an assertion, which is what this app is
    // trying to teach students not to accept.
    for (const topic of LEARN_TOPICS) {
      expect(topic.citations.length, `${topic.id} cites nothing`).toBeGreaterThan(0);
    }
  });

  it('gives every citation an https URL and a reference label', () => {
    for (const topic of LEARN_TOPICS) {
      for (const cite of topic.citations) {
        expect(cite.url, `${topic.id}: ${cite.ref}`).toMatch(/^https:\/\/[^\s]+$/);
        expect(cite.ref.trim(), `${topic.id} citation missing ref`).not.toBe('');
        expect(typeof cite.free, `${topic.id}: ${cite.ref} must declare free`).toBe('boolean');
      }
    }
  });

  it('has no placeholder or example URLs', () => {
    // A dead or invented link in a teaching aid is worse than no link.
    for (const topic of LEARN_TOPICS) {
      for (const cite of topic.citations) {
        expect(cite.url, `${topic.id}: ${cite.ref}`).not.toMatch(/example\.com|localhost|TODO|#$/i);
      }
    }
  });

  it('marks ISO standards as paid and NIST as free', () => {
    // Telling a student a paywalled standard is "further reading" without saying so
    // wastes their time; this keeps the flag honest as citations are added.
    const all = LEARN_TOPICS.flatMap((t) => t.citations);
    for (const cite of all.filter((c) => c.url.includes('iso.org'))) {
      expect(cite.free, `${cite.ref} is on iso.org and must be marked paid`).toBe(false);
    }
    for (const cite of all.filter((c) => c.url.includes('nist.gov'))) {
      expect(cite.free, `${cite.ref} is a NIST publication and is free`).toBe(true);
    }
  });

  it('explains the STRIDE table consistently with the STRIDE the app applies', () => {
    // The lesson and the code must not drift apart.
    const stride = getLearnTopic('stride');
    expect(stride?.table?.rows.length).toBe(Object.keys(STRIDE_LABELS).length);
  });

  it('maps every category in the spine within the categories lesson', () => {
    const categories = getLearnTopic('categories');
    expect(categories?.table?.rows.length).toBe(CATEGORY_ORDER.length);
  });
});

/**
 * The scoring lesson states the arithmetic in prose. Prose drifts from code silently,
 * and a teaching aid that explains a formula the app no longer uses is worse than one
 * that explains nothing. These tie the sentences to the values they describe.
 */
describe('the scoring lesson matches the code it describes', () => {
  const scoring = getLearnTopic('scoring')!;
  const text = { en: scoring.paragraphs.map((p) => p.en).join(' '), zh: scoring.paragraphs.map((p) => p.zh).join(' ') };

  const entry = (over: Partial<ThreatEntry>): ThreatEntry => ({
    id: 'x', name: 'x', category: 'custom', ...DEFAULT_ENTRY_VALUES, ...over,
  });

  it('quotes the risk bands the code actually applies', () => {
    // Matching a bare number is not enough: the same paragraph says "a score of 20"
    // to make a different point, so a loose check passes even when the band changes.
    // The assertion has to pin the whole band phrase.
    const { low, medium } = RISK_THRESHOLDS;
    expect(text.en, 'en band phrase does not match RISK_THRESHOLDS').toContain(
      `≤ ${low.max} low, ≤ ${medium.max} medium, > ${medium.max} high`
    );
    expect(text.zh, 'zh band phrase does not match RISK_THRESHOLDS').toContain(
      `≤ ${low.max} 低、≤ ${medium.max} 中、> ${medium.max} 高`
    );
  });

  it('quotes an inherent-risk range that the formula can actually produce', () => {
    const min = calculateInherentThreat(entry({ probability: 1, impactLife: 1, impactAsset: 1, impactBusiness: 1 }));
    const max = calculateInherentThreat(entry({ probability: 5, impactLife: 5, impactAsset: 5, impactBusiness: 5 }));

    expect(min).toBe(3);
    expect(max).toBe(75);
    expect(text.en).toContain('3–75');
  });

  it('is right that the residual matrix bottoms out in the corner cell', () => {
    // The matrix lesson states this as a limit of the picture. If the positioning
    // ever changes so it is no longer true, the lesson has to stop saying it.
    const pos = getResidualMatrixPosition(
      entry({ probability: 5, impactLife: 5, impactAsset: 5, impactBusiness: 5, controlInternal: 1, controlExternal: 1 })
    );
    expect(pos).toEqual({ x: 1, y: 1 });

    const matrix = getLearnTopic('matrix')!;
    const text = matrix.paragraphs.map((p) => p.en).join(' ');
    expect(text).toContain('bottom-left cell');
    expect(text).toContain('√f');
  });

  it('is right that strongest controls drive residual risk to zero', () => {
    // The lesson calls this out as a simplification. If the formula ever changes so
    // that it is no longer true, the lesson must stop saying it.
    const strongest = calculateResidualRisk(entry({ controlInternal: 1, controlExternal: 1 }));
    const weakest = calculateResidualRisk(entry({ controlInternal: 5, controlExternal: 5 }));

    expect(strongest).toBe(0);
    expect(weakest).toBe(calculateInherentThreat(entry({})));
  });
});
