export type ThreatCategory = 'natural' | 'technical' | 'security' | 'custom';

export type RiskLevel = 'low' | 'medium' | 'high';

export type Language = 'zh-TW' | 'en';

export type ViewMode = 'wizard' | 'expert';

export interface ThreatEntry {
  id: string;
  name: string;
  nameEn?: string;
  category: ThreatCategory;

  // Input scores (1-5)
  probability: number;           // 發生機率: 1=低, 5=高
  impactLife: number;            // 人命安全: 1=低, 5=高
  impactAsset: number;           // 財產安全: 1=低, 5=高
  impactBusiness: number;        // 業務運作: 1=低, 5=高
  controlInternal: number;       // 內部資源: 1=強, 5=弱
  controlExternal: number;       // 外部資源: 1=強, 5=弱

  // Risk register fields
  vulnerabilityDescription: string;  // 脆弱性
  impactDescription: string;         // 影響
  mitigationStrategy: string;        // 緩解策略
}

export interface ThreatPreset {
  id: string;
  nameZh: string;
  nameEn: string;
  category: ThreatCategory;
}

export interface RiskRegisterState {
  entries: ThreatEntry[];
  viewMode: ViewMode;
  language: Language;
  currentStep: number;
  selectedPresets: string[];
}

export interface RiskRegisterActions {
  addEntry: (entry: ThreatEntry) => void;
  updateEntry: (id: string, updates: Partial<ThreatEntry>) => void;
  removeEntry: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setLanguage: (lang: Language) => void;
  setStep: (step: number) => void;
  togglePreset: (presetId: string) => void;
  clearSelectedPresets: () => void;
  createEntriesFromPresets: () => void;
  reset: () => void;
}

export type RiskRegisterStore = RiskRegisterState & RiskRegisterActions;
