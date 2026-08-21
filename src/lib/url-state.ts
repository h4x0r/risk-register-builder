import LZString from 'lz-string';
import { ThreatEntry } from '@/types';
import { migrateEntries } from './taxonomy';

export const URL_LENGTH_WARNING_THRESHOLD = 2000;

export function encodeEntries(entries: ThreatEntry[]): string {
  if (entries.length === 0) return '';
  const json = JSON.stringify(entries);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeEntries(encoded: string): ThreatEntry[] | null {
  if (!encoded) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    // Links issued before the taxonomy expansion carry the old three-category
    // model, so every decode runs through the migration.
    return migrateEntries(JSON.parse(json) as ThreatEntry[]);
  } catch {
    return null;
  }
}

export function generateShareUrl(
  entries: ThreatEntry[],
  baseUrl: string
): { url: string; isLong: boolean } {
  const encoded = encodeEntries(entries);
  const url = encoded ? `${baseUrl}?data=${encoded}` : baseUrl;
  return {
    url,
    isLong: url.length > URL_LENGTH_WARNING_THRESHOLD,
  };
}
