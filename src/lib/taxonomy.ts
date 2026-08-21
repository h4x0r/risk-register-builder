import { ThreatCategory, ThreatEntry } from '@/types';

/** Stub — see taxonomy.test.ts. Implemented in the next commit. */
export const LEGACY_CATEGORY_FALLBACK: Record<string, ThreatCategory> = {};

/** Stub — see taxonomy.test.ts. Implemented in the next commit. */
export function migrateEntry(entry: ThreatEntry): ThreatEntry {
  return entry;
}
