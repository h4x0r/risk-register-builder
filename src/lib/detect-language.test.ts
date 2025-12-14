import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectSystemLanguage } from './detect-language';
import { Language } from '@/types';

describe('detectSystemLanguage', () => {
  const originalNavigator = global.navigator;

  beforeEach(() => {
    // Reset navigator mock before each test
    vi.stubGlobal('navigator', { language: 'en-US', languages: ['en-US', 'en'] });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns zh-TW for Chinese Traditional browser language', () => {
    vi.stubGlobal('navigator', { language: 'zh-TW', languages: ['zh-TW', 'zh'] });
    expect(detectSystemLanguage()).toBe('zh-TW');
  });

  it('returns zh-TW for zh-Hant browser language', () => {
    vi.stubGlobal('navigator', { language: 'zh-Hant', languages: ['zh-Hant'] });
    expect(detectSystemLanguage()).toBe('zh-TW');
  });

  it('returns zh-TW for zh-HK browser language', () => {
    vi.stubGlobal('navigator', { language: 'zh-HK', languages: ['zh-HK'] });
    expect(detectSystemLanguage()).toBe('zh-TW');
  });

  it('returns en for English browser language', () => {
    vi.stubGlobal('navigator', { language: 'en-US', languages: ['en-US'] });
    expect(detectSystemLanguage()).toBe('en');
  });

  it('returns en for other languages (fallback)', () => {
    vi.stubGlobal('navigator', { language: 'de-DE', languages: ['de-DE'] });
    expect(detectSystemLanguage()).toBe('en');
  });

  it('checks navigator.languages array when primary does not match', () => {
    vi.stubGlobal('navigator', { language: 'en-US', languages: ['en-US', 'zh-TW'] });
    // Primary language should take precedence
    expect(detectSystemLanguage()).toBe('en');
  });
});
