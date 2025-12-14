import { Language } from '@/types';

const CHINESE_TRADITIONAL_CODES = ['zh-TW', 'zh-Hant', 'zh-HK', 'zh-MO'];

export function detectSystemLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language || '';

  // Check if browser language is Chinese Traditional
  if (CHINESE_TRADITIONAL_CODES.some(code => browserLang.startsWith(code))) {
    return 'zh-TW';
  }

  // Default to English
  return 'en';
}
