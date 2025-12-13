'use client';

import { useRiskRegister } from '@/hooks/useRiskRegister';
import { WIZARD_STEPS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function StepIndicator() {
  const { currentStep, language } = useRiskRegister();

  return (
    <div className="flex items-center justify-center gap-2">
      {WIZARD_STEPS.map((step, index) => (
        <div key={step.step} className="flex items-center">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
              currentStep > step.step
                ? 'bg-primary text-primary-foreground'
                : currentStep === step.step
                ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {currentStep > step.step ? '✓' : step.step}
          </div>
          <span
            className={cn(
              'ml-2 hidden text-sm sm:inline',
              currentStep >= step.step
                ? 'text-foreground'
                : 'text-muted-foreground'
            )}
          >
            {language === 'zh-TW' ? step.labelZh : step.labelEn}
          </span>
          {index < WIZARD_STEPS.length - 1 && (
            <div
              className={cn(
                'mx-4 h-0.5 w-8 sm:w-12',
                currentStep > step.step ? 'bg-primary' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
