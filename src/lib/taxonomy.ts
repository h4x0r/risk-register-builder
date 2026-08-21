import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  SOURCE_LABELS,
  PILLAR_LABELS,
  STRIDE_LABELS,
  THREAT_PRESETS,
} from './constants';
import { Language, ThreatCategory, ThreatEntry, ThreatPreset } from '@/types';

/**
 * Where a pre-expansion category lands when the entry's id is NOT in the preset
 * library — a user-authored threat, or a preset since renamed.
 *
 * This is a fallback and nothing more. An id that is known migrates by preset,
 * because the old 'technical' bucket held both power-outage (now infrastructure)
 * and fire (now physical). A category-only mapping would collapse those two into
 * one bucket and quietly mis-file every share link issued against the old model.
 */
export const LEGACY_CATEGORY_FALLBACK: Record<string, ThreatCategory> = {
  natural: 'natural',
  technical: 'technology',
  security: 'physical',
};

const PRESET_BY_ID: Map<string, ThreatPreset> = new Map(
  THREAT_PRESETS.map((preset) => [preset.id, preset])
);

const CURRENT_CATEGORIES: ReadonlySet<string> = new Set<string>([...CATEGORY_ORDER, 'custom']);

/**
 * Bring one entry up to the current taxonomy.
 *
 * Tags the caller already set are never overwritten — a user who reclassified
 * `fire` as arson keeps that judgement. Tags are only ever backfilled where the
 * entry has none, and only from a preset that actually matches the id: nothing is
 * invented for a threat the library has never heard of.
 */
export function migrateEntry(entry: ThreatEntry): ThreatEntry {
  const preset = PRESET_BY_ID.get(entry.id);

  const category = CURRENT_CATEGORIES.has(entry.category)
    ? entry.category
    : preset?.category ?? LEGACY_CATEGORY_FALLBACK[entry.category] ?? 'custom';

  if (!preset) {
    return category === entry.category ? entry : { ...entry, category };
  }

  return {
    ...entry,
    category,
    source: entry.source ?? preset.source,
    pillars: entry.pillars ?? preset.pillars,
    stride: entry.stride ?? preset.stride,
  };
}

export function migrateEntries(entries: ThreatEntry[]): ThreatEntry[] {
  return entries.map(migrateEntry);
}

/**
 * Free-text preset search across both languages and every category.
 *
 * The library is past a hundred entries, so a category-scoped dropdown alone is no
 * longer a usable way in. A blank query returns nothing rather than everything —
 * returning the whole library would defeat the filter it is meant to be.
 */
export function searchPresets(query: string): ThreatPreset[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const needle = trimmed.toLowerCase();
  return THREAT_PRESETS.filter(
    (preset) =>
      preset.nameEn.toLowerCase().includes(needle) ||
      preset.nameZh.includes(trimmed) ||
      preset.id.includes(needle)
  );
}

/**
 * The four taxonomy axes as display strings, for exports and print views.
 *
 * Absent tags render as "-" rather than being interpolated straight into a
 * template: a spreadsheet cell reading "undefined" looks like data, and a reader
 * has no way to tell it from a real value.
 */
export function taxonomyLabels(
  entry: ThreatEntry,
  language: Language
): { category: string; source: string; pillars: string; stride: string } {
  const pick = (l: { zh: string; en: string }) => (language === 'zh-TW' ? l.zh : l.en);
  const DASH = '-';

  return {
    category: pick(CATEGORY_LABELS[entry.category]),
    source: entry.source ? pick(SOURCE_LABELS[entry.source]) : DASH,
    pillars: entry.pillars?.length
      ? entry.pillars.map((p) => pick(PILLAR_LABELS[p])).join(', ')
      : DASH,
    stride: entry.stride?.length
      ? entry.stride.map((s) => STRIDE_LABELS[s].short).join(', ')
      : DASH,
  };
}

/** Presets belonging to one category, in library order. */
export function presetsForCategory(category: ThreatCategory): ThreatPreset[] {
  return THREAT_PRESETS.filter((preset) => preset.category === category);
}
