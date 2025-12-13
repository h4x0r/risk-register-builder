'use client';

import { Button } from '@/components/ui/button';
import { useRiskRegister } from '@/hooks/useRiskRegister';

export function LanguageToggle() {
  const { language, setLanguage } = useRiskRegister();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')}
    >
      {language === 'zh-TW' ? '繁中' : 'EN'} / {language === 'zh-TW' ? 'EN' : '繁中'}
    </Button>
  );
}
