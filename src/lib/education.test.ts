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

  it('keeps the quantitative thread consecutive, since topics cross-refer to "the next topic"', () => {
    // equations ends by pointing at ALE, and ALE ends by pointing at FAIR. Reordering
    // the array without these staying adjacent turns those sentences into lies —
    // which is exactly what happened once.
    const order = LEARN_TOPIC_IDS;
    expect(order.indexOf('quantify')).toBe(order.indexOf('equations') + 1);
    expect(order.indexOf('fair')).toBe(order.indexOf('quantify') + 1);
  });

  it('teaches the four Ts without misattributing them to the Orange Book', () => {
    // Checked against the 2020 Orange Book PDF with a passing control: "terminate",
    // "tolerate" and "four Ts" are all ABSENT from it. The common attribution is
    // stale, so the lesson must name the mnemonic AND flag where it does not come
    // from, and must restore the opportunity option the four Ts drop.
    const treatment = getLearnTopic('treatment')!;
    const text = treatment.paragraphs.map((p) => p.en).join(' ');

    for (const t of ['Terminate', 'Treat', 'Transfer', 'Tolerate']) {
      expect(treatment.summary.en, `summary omits ${t}`).toContain(t);
    }
    expect(text).toContain('does not use the words');
    expect(text).toContain('pursue an opportunity');
    expect(treatment.citations.some((c) => c.url.includes('orange-book'))).toBe(true);
  });

  it('folds Take into Tolerate and maps the four Ts onto all seven ISO options', () => {
    // Deliberately NOT five Ts. In a security register, taking risk to pursue an
    // opportunity is a business decision made upstream that creates the exposure —
    // it is not a way of treating one. Where opportunity does drive the call, the
    // action is still tolerating; only the recorded reason differs.
    const topic = getLearnTopic('treatment')!;
    const text = topic.paragraphs.map((p) => p.en).join(' ');

    expect(topic.summary.en).not.toContain('Take');
    expect(text).toContain('This course does not');
    expect(text).toContain('still tolerating');

    // The counts must add up, which is the reason the merge is defensible.
    expect(text).toContain('seven options');
    expect(text).toContain('no remainder');
    expect(text).toContain('Tolerate two');

    // No fifth row survives in the mapping table.
    const options = topic.table!.rows.map((r) => r[0].en);
    expect(options).toHaveLength(4);
    expect(options.join(' ')).not.toContain('(Take)');
  });

  it('keeps ALE out of the FAIR topic', () => {
    // ALE is not part of FAIR. Filing it there would teach the conflation this
    // content spends its time correcting.
    const fair = getLearnTopic('fair')!;
    const fairText = fair.paragraphs.map((p) => p.en).join(' ');
    expect(fairText).not.toContain('Annualised Loss Expectancy');
    expect(fairText).not.toContain('ARO');

    const quantify = getLearnTopic('quantify')!;
    expect(quantify.paragraphs.map((p) => p.en).join(' ')).toContain('Annualised Loss Expectancy');
  });

  it('does not cite SP 800-30 for ALE, which does not appear in it', () => {
    // Checked against the Rev. 1 PDF with a passing control: "annualized loss
    // expectancy" and "single loss expectancy" are both absent. NIST defines ALE in
    // the NISTIR 8286 series instead.
    const quantify = getLearnTopic('quantify')!;
    for (const cite of quantify.citations) {
      expect(cite.url, `${cite.ref} must not be SP 800-30`).not.toContain('800-30');
      expect(cite.url).not.toContain('800/30');
    }
    expect(quantify.citations.some((c) => c.url.includes('8286') || c.url.includes('annualized_loss')))
      .toBe(true);
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

  it('addresses the reader, not their instructor', () => {
    // The panel is read by students. A sentence like "Teach them side by side"
    // speaks past the reader to whoever is running the course, and tells them what
    // to do with a fact instead of what the fact means. Caught once in the
    // provenance note; this stops it coming back.
    const INSTRUCTOR_VOICE = [
      /\bteach (them|this|students|it) /i,
      /\byour students\b/i,
      /\bthe class\b/i,
      /\bremind students\b/i,
      /\bexplain to (them|students)\b/i,
      /\blearners should\b/i,
    ];

    for (const { path, value } of allBilingual()) {
      for (const pattern of INSTRUCTOR_VOICE) {
        expect(pattern.test(value.en), `${path} (en) speaks to an instructor: ${value.en.slice(0, 90)}`).toBe(false);
      }
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
        expect(['free', 'abstract', 'paid'], `${topic.id}: ${cite.ref} access`).toContain(cite.access);
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

  it('labels access honestly for paywalls, abstracts and full text', () => {
    // Telling a student a paywalled standard is "further reading" without saying so
    // wastes their time; so does sending them to an abstract labelled "free".
    const all = LEARN_TOPICS.flatMap((t) => t.citations);
    for (const cite of all.filter((c) => c.url.includes('iso.org'))) {
      expect(cite.access, `${cite.ref} is on iso.org and must be paid`).toBe('paid');
    }
    for (const cite of all.filter((c) => c.url.includes('nist.gov'))) {
      expect(cite.access, `${cite.ref} is a NIST publication and is free`).toBe('free');
    }
    // A PubMed record is the abstract, not the paper.
    for (const cite of all.filter((c) => c.url.includes('pubmed.ncbi.nlm.nih.gov'))) {
      expect(cite.access, `${cite.ref} resolves to an abstract`).toBe('abstract');
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
    // The derivation is now set as LaTeX, so assert on the source the renderer reads.
    expect(text).toContain('\\sqrt{f}');
    // And the honest limit measured in invariant-probe.test.ts must be stated.
    expect(text).toContain('one in six');
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
