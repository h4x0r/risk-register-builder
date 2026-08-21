import { describe, it, expect } from 'vitest';
import { migrateEntry, LEGACY_CATEGORY_FALLBACK } from './taxonomy';
import {
  THREAT_PRESETS,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  SOURCE_LABELS,
  PILLAR_LABELS,
  STRIDE_LABELS,
  STRIDE_PROPERTY,
  PROPERTY_LABELS,
  STRIDE_INAPPLICABLE_CATEGORIES,
} from './constants';
import { ThreatCategory, ThreatEntry } from '@/types';

const baseScores = {
  probability: 3,
  impactLife: 3,
  impactAsset: 3,
  impactBusiness: 3,
  controlInternal: 3,
  controlExternal: 3,
  mitigationStrategy: '',
};

/** An entry as it would have been encoded into a share link before the taxonomy expansion. */
function legacyEntry(id: string, category: string): ThreatEntry {
  return { id, name: id, category: category as ThreatCategory, ...baseScores };
}

describe('migrateEntry', () => {
  it('re-homes a legacy "technical" entry by preset id, not by category', () => {
    // power-outage was 'technical'; under the new spine it is an essential-services loss.
    const migrated = migrateEntry(legacyEntry('power-outage', 'technical'));

    expect(migrated.category).toBe('infrastructure');
    expect(migrated.source).toBe('structural');
    expect(migrated.pillars).toContain('technology');
  });

  it('sends fire to physical rather than technology, proving id beats category', () => {
    // Both fire and power-outage were 'technical', but they belong in different
    // categories now. A category-only migration would collapse them together.
    const fire = migrateEntry(legacyEntry('fire', 'technical'));
    const power = migrateEntry(legacyEntry('power-outage', 'technical'));

    expect(fire.category).toBe('physical');
    expect(power.category).toBe('infrastructure');
    expect(fire.category).not.toBe(power.category);
  });

  it('maps the legacy "security" presets onto their new homes', () => {
    expect(migrateEntry(legacyEntry('cyber-attack', 'security')).category).toBe('cyber');
    expect(migrateEntry(legacyEntry('intrusion', 'security')).category).toBe('physical');
    expect(migrateEntry(legacyEntry('lone-wolf', 'security')).category).toBe('physical');
    expect(migrateEntry(legacyEntry('civil-unrest', 'security')).category).toBe('physical');
  });

  it('backfills STRIDE tags from the preset library', () => {
    const migrated = migrateEntry(legacyEntry('cyber-attack', 'security'));
    expect(migrated.stride).toEqual(
      THREAT_PRESETS.find((p) => p.id === 'cyber-attack')!.stride
    );
  });

  it('falls back on the legacy category when the id is unknown', () => {
    expect(migrateEntry(legacyEntry('some-custom-thing', 'technical')).category).toBe('technology');
    expect(migrateEntry(legacyEntry('some-custom-thing', 'security')).category).toBe('physical');
  });

  it('leaves source and pillars undefined for an unknown id', () => {
    // Nothing is known about a user-authored threat, and inventing a tag would be
    // worse than leaving the field empty.
    const migrated = migrateEntry(legacyEntry('some-custom-thing', 'security'));
    expect(migrated.source).toBeUndefined();
    expect(migrated.pillars).toBeUndefined();
  });

  it('preserves categories that are still valid', () => {
    expect(migrateEntry(legacyEntry('typhoon-storm-surge', 'natural')).category).toBe('natural');
    expect(migrateEntry(legacyEntry('anything', 'custom')).category).toBe('custom');
  });

  it('preserves scores and mitigation text untouched', () => {
    const entry: ThreatEntry = {
      ...legacyEntry('fire', 'technical'),
      probability: 5,
      impactLife: 4,
      mitigationStrategy: '安裝自動灑水系統',
    };
    const migrated = migrateEntry(entry);

    expect(migrated.probability).toBe(5);
    expect(migrated.impactLife).toBe(4);
    expect(migrated.mitigationStrategy).toBe('安裝自動灑水系統');
  });

  it('does not overwrite tags an entry already carries', () => {
    const entry: ThreatEntry = {
      ...legacyEntry('fire', 'physical'),
      source: 'adversarial', // deliberately reclassified as arson by the user
      pillars: ['people'],
    };
    const migrated = migrateEntry(entry);

    expect(migrated.source).toBe('adversarial');
    expect(migrated.pillars).toEqual(['people']);
  });

  it('covers every legacy category with a fallback', () => {
    // The old model had exactly these four.
    expect(Object.keys(LEGACY_CATEGORY_FALLBACK).sort()).toEqual(
      ['natural', 'security', 'technical'].sort()
    );
  });
});

describe('preset library integrity', () => {
  it('has unique ids', () => {
    const ids = THREAT_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps every pre-expansion preset id resolvable', () => {
    // These ten shipped in share links before the taxonomy existed. Dropping one
    // silently degrades an old link to an untagged custom entry.
    const legacyIds = [
      'typhoon-storm-surge', 'heavy-rain-flooding', 'power-outage', 'elevator-failure',
      'fire', 'gas-leak', 'civil-unrest', 'cyber-attack', 'lone-wolf', 'intrusion',
    ];
    const ids = new Set(THREAT_PRESETS.map((p) => p.id));
    for (const id of legacyIds) {
      expect(ids.has(id), `legacy preset id "${id}" was dropped`).toBe(true);
    }
  });

  it('places every preset in a category that appears in CATEGORY_ORDER', () => {
    for (const preset of THREAT_PRESETS) {
      expect(CATEGORY_ORDER, `${preset.id}`).toContain(preset.category);
    }
  });

  it('gives every category at least one preset', () => {
    for (const category of CATEGORY_ORDER) {
      const count = THREAT_PRESETS.filter((p) => p.category === category).length;
      expect(count, `category "${category}" has no presets`).toBeGreaterThan(0);
    }
  });

  it('gives every preset at least one People/Process/Technology pillar', () => {
    for (const preset of THREAT_PRESETS) {
      expect(preset.pillars.length, `${preset.id} has no pillar`).toBeGreaterThan(0);
      expect(new Set(preset.pillars).size, `${preset.id} repeats a pillar`).toBe(preset.pillars.length);
    }
  });

  it('never applies STRIDE to a category where it is a category error', () => {
    // A typhoon is not "Denial of Service". This is the gate that stops the
    // STRIDE axis being stretched over threats it cannot describe.
    for (const preset of THREAT_PRESETS) {
      if (STRIDE_INAPPLICABLE_CATEGORIES.includes(preset.category)) {
        expect(preset.stride, `${preset.id} (${preset.category}) must not carry STRIDE`).toBeUndefined();
      }
    }
  });

  it('never repeats a STRIDE class within one preset', () => {
    for (const preset of THREAT_PRESETS) {
      if (!preset.stride) continue;
      expect(new Set(preset.stride).size, `${preset.id} repeats a STRIDE class`).toBe(preset.stride.length);
    }
  });

  it('labels every value on every axis in both languages', () => {
    const allCategories: ThreatCategory[] = [...CATEGORY_ORDER, 'custom'];
    for (const c of allCategories) {
      expect(CATEGORY_LABELS[c]?.zh, `category ${c}`).toBeTruthy();
      expect(CATEGORY_LABELS[c]?.en, `category ${c}`).toBeTruthy();
    }
    for (const s of Object.keys(SOURCE_LABELS) as (keyof typeof SOURCE_LABELS)[]) {
      expect(SOURCE_LABELS[s].zh && SOURCE_LABELS[s].en, `source ${s}`).toBeTruthy();
    }
    for (const p of Object.keys(PILLAR_LABELS) as (keyof typeof PILLAR_LABELS)[]) {
      expect(PILLAR_LABELS[p].zh && PILLAR_LABELS[p].en, `pillar ${p}`).toBeTruthy();
    }
    for (const s of Object.keys(STRIDE_LABELS) as (keyof typeof STRIDE_LABELS)[]) {
      expect(STRIDE_LABELS[s].zh && STRIDE_LABELS[s].en, `stride ${s}`).toBeTruthy();
    }
  });

  it('maps all six STRIDE classes onto distinct security properties', () => {
    const classes = Object.keys(STRIDE_LABELS);
    expect(classes.length).toBe(6);

    const properties = classes.map((c) => STRIDE_PROPERTY[c as keyof typeof STRIDE_PROPERTY]);
    expect(new Set(properties).size).toBe(6);
    for (const p of properties) {
      expect(PROPERTY_LABELS[p], `property ${p} is unlabelled`).toBeTruthy();
    }
  });

  it('gives every preset a bilingual name', () => {
    for (const preset of THREAT_PRESETS) {
      expect(preset.nameZh.trim(), `${preset.id} missing zh name`).not.toBe('');
      expect(preset.nameEn.trim(), `${preset.id} missing en name`).not.toBe('');
      // A Chinese name that is pure ASCII is an untranslated placeholder.
      expect(/[一-鿿]/.test(preset.nameZh), `${preset.id} zh name is not Chinese`).toBe(true);
    }
  });
});
