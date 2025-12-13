'use client';

import { useRiskRegister } from '@/hooks/useRiskRegister';
import { StepIndicator } from '@/components/common/StepIndicator';
import { Step1AddThreats } from '@/components/wizard/Step1-AddThreats';
import { Step2ScoreThreats } from '@/components/wizard/Step2-ScoreThreats';
import { Step3ReviewRegister } from '@/components/wizard/Step3-ReviewRegister';
import { Step4Export } from '@/components/wizard/Step4-Export';

export function WizardView() {
  const { currentStep } = useRiskRegister();

  return (
    <div className="space-y-8">
      <StepIndicator />
      <div className="min-h-[60vh]">
        {currentStep === 1 && <Step1AddThreats />}
        {currentStep === 2 && <Step2ScoreThreats />}
        {currentStep === 3 && <Step3ReviewRegister />}
        {currentStep === 4 && <Step4Export />}
      </div>
    </div>
  );
}
