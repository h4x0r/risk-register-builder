import { describe, it, expect } from 'vitest';
import { encodeEntries, decodeEntries, generateShareUrl, URL_LENGTH_WARNING_THRESHOLD } from './url-state';
import { ThreatEntry } from '@/types';

const mockEntry: ThreatEntry = {
  id: 'test-1',
  name: '測試威脅',
  nameEn: 'Test Threat',
  category: 'natural',
  probability: 4,
  impactLife: 3,
  impactAsset: 2,
  impactBusiness: 5,
  controlInternal: 3,
  controlExternal: 4,
  mitigationStrategy: '測試策略',
};

describe('URL State Encoding', () => {
  describe('encodeEntries', () => {
    it('encodes entries to a compressed string', () => {
      const encoded = encodeEntries([mockEntry]);

      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);
      // Encoded string should be URL-safe
      expect(encoded).toMatch(/^[A-Za-z0-9+/=-]*$/);
    });

    it('returns empty string for empty array', () => {
      const encoded = encodeEntries([]);
      expect(encoded).toBe('');
    });
  });

  describe('decodeEntries', () => {
    it('decodes compressed string back to original entries', () => {
      const encoded = encodeEntries([mockEntry]);
      const decoded = decodeEntries(encoded);

      expect(decoded).toEqual([mockEntry]);
    });

    it('returns null for invalid encoded string', () => {
      const decoded = decodeEntries('invalid-data');
      expect(decoded).toBeNull();
    });

    it('returns null for empty string', () => {
      const decoded = decodeEntries('');
      expect(decoded).toBeNull();
    });
  });

  describe('generateShareUrl', () => {
    it('generates URL with encoded data parameter', () => {
      const result = generateShareUrl([mockEntry], 'https://example.com');

      expect(result.url).toContain('https://example.com');
      expect(result.url).toContain('?data=');
    });

    it('returns object with isLong flag when URL exceeds threshold', () => {
      // Create many entries to exceed threshold
      const manyEntries = Array(50).fill(null).map((_, i) => ({
        ...mockEntry,
        id: `test-${i}`,
        mitigationStrategy: '這是一個很長的緩解策略描述'.repeat(10),
      }));

      const result = generateShareUrl(manyEntries, 'https://example.com');

      expect(result.url).toContain('?data=');
      expect(result.isLong).toBe(true);
    });

    it('returns isLong false for small data', () => {
      const result = generateShareUrl([mockEntry], 'https://example.com');
      expect(result.isLong).toBe(false);
    });
  });

  describe('URL_LENGTH_WARNING_THRESHOLD', () => {
    it('is set to 2000 characters', () => {
      expect(URL_LENGTH_WARNING_THRESHOLD).toBe(2000);
    });
  });
});
