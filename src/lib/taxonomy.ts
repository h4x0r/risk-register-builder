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
 * Bumped whenever the taxonomy changes shape. Zustand runs `migrate` for any
 * persisted state below this version.
 */
export const TAXONOMY_SCHEMA_VERSION = 1;

/**
 * Bring localStorage-persisted state up to the current taxonomy.
 *
 * Entries persist outside the share-link path, so rehydration never passes through
 * decodeEntries and needs migrating in its own right — a returning user arrives
 * holding `category: 'technical'`, which has no label and takes the page down.
 *
 * Deliberately tolerant of shape: this input is whatever happens to be in the
 * browser, including state written by a build that no longer exists.
 */
export function migratePersistedState(persisted: unknown): { entries: ThreatEntry[]; [key: string]: unknown } {
  const state = (persisted ?? {}) as Record<string, unknown>;
  const entries = Array.isArray(state.entries) ? (state.entries as ThreatEntry[]) : [];

  return { ...state, entries: migrateEntries(entries) };
}

/**
 * Category label, falling back to the raw value when the category is unknown.
 *
 * Defence in depth behind migratePersistedState: showing an odd raw string is a
 * visible signal that something needs migrating, where a bare lookup would throw
 * and take the whole page with it.
 */
export function categoryLabel(category: ThreatCategory, language: Language): string {
  const label = CATEGORY_LABELS[category];
  if (!label) return String(category);
  return language === 'zh-TW' ? label.zh : label.en;
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
    category: categoryLabel(entry.category, language),
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
