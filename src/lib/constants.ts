import { ThreatCategory, ThreatPreset } from '@/types';

export const THREAT_PRESETS: ThreatPreset[] = [
  // 自然災害 (Natural Disasters)
  { id: 'typhoon', nameZh: '超強颱風', nameEn: 'Super Typhoon', category: 'natural' },
  { id: 'storm-surge', nameZh: '風暴潮', nameEn: 'Storm Surge', category: 'natural' },
  { id: 'heavy-rain', nameZh: '暴雨 (黑/紅)', nameEn: 'Heavy Rain (Black/Red)', category: 'natural' },
  { id: 'flooding', nameZh: '水浸', nameEn: 'Flooding', category: 'natural' },

  // 科技與設施危害 (Technical & Facility Hazards)
  { id: 'power-outage', nameZh: '停電', nameEn: 'Power Outage', category: 'technical' },
  { id: 'elevator-failure', nameZh: '升降機故障', nameEn: 'Elevator Failure', category: 'technical' },
  { id: 'fire', nameZh: '火災', nameEn: 'Fire', category: 'technical' },
  { id: 'gas-leak', nameZh: '氣體洩漏', nameEn: 'Gas Leak', category: 'technical' },

  // 保安與敵意行為 (Security & Hostile Actions)
  { id: 'civil-unrest', nameZh: '社會動盪', nameEn: 'Civil Unrest', category: 'security' },
  { id: 'cyber-attack', nameZh: '網絡攻擊', nameEn: 'Cyber Attack', category: 'security' },
  { id: 'lone-wolf', nameZh: '獨狼攻擊', nameEn: 'Lone Wolf Attack', category: 'security' },
  { id: 'intrusion', nameZh: '入侵', nameEn: 'Intrusion', category: 'security' },
];

export const CATEGORY_LABELS: Record<ThreatCategory, { zh: string; en: string }> = {
  natural: { zh: '自然災害', en: 'Natural Disasters' },
  technical: { zh: '科技與設施危害', en: 'Technical & Facility Hazards' },
  security: { zh: '保安與敵意行為', en: 'Security & Hostile Actions' },
  custom: { zh: '自訂', en: 'Custom' },
};

export const RISK_THRESHOLDS = {
  low: { max: 6, colorClass: 'bg-green-500', textClass: 'text-green-700' },
  medium: { max: 18, colorClass: 'bg-yellow-500', textClass: 'text-yellow-700' },
  high: { max: 75, colorClass: 'bg-red-500', textClass: 'text-red-700' },
};

export const WIZARD_STEPS = [
  { step: 1, labelZh: '新增威脅', labelEn: 'Add Threats' },
  { step: 2, labelZh: '評分', labelEn: 'Score Threats' },
  { step: 3, labelZh: '檢視', labelEn: 'Review' },
  { step: 4, labelZh: '匯出', labelEn: 'Export' },
];

export const DEFAULT_ENTRY_VALUES = {
  probability: 3,
  impactLife: 3,
  impactAsset: 3,
  impactBusiness: 3,
  controlInternal: 3,
  controlExternal: 3,
  vulnerabilityDescription: '',
  impactDescription: '',
  mitigationStrategy: '',
};
