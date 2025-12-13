import { Language } from '@/types';

export const translations = {
  // App Header
  appTitle: {
    'zh-TW': '風險登記冊建置工具',
    en: 'Risk Register Builder',
  },
  wizardMode: {
    'zh-TW': '精靈模式',
    en: 'Wizard Mode',
  },
  expertMode: {
    'zh-TW': '專家模式',
    en: 'Expert Mode',
  },
  export: {
    'zh-TW': '匯出',
    en: 'Export',
  },

  // Wizard Steps
  step1Title: {
    'zh-TW': '新增威脅',
    en: 'Add Threats',
  },
  step2Title: {
    'zh-TW': '評分',
    en: 'Score Threats',
  },
  step3Title: {
    'zh-TW': '檢視風險登記冊',
    en: 'Review Risk Register',
  },
  step4Title: {
    'zh-TW': '匯出',
    en: 'Export',
  },

  // Step 1
  selectThreats: {
    'zh-TW': '選擇威脅',
    en: 'Select Threats',
  },
  customThreat: {
    'zh-TW': '自訂威脅',
    en: 'Custom Threat',
  },
  addCustom: {
    'zh-TW': '新增自訂',
    en: 'Add Custom',
  },
  selected: {
    'zh-TW': '已選擇',
    en: 'Selected',
  },
  items: {
    'zh-TW': '項',
    en: 'items',
  },

  // Step 2
  probability: {
    'zh-TW': '發生機率',
    en: 'Probability',
  },
  impactAssessment: {
    'zh-TW': '評估影響',
    en: 'Impact Assessment',
  },
  lifeSafety: {
    'zh-TW': '人命安全',
    en: 'Life Safety',
  },
  assetSafety: {
    'zh-TW': '財產安全',
    en: 'Asset Safety',
  },
  businessOps: {
    'zh-TW': '業務運作',
    en: 'Business Operations',
  },
  controlCapability: {
    'zh-TW': '控制能力',
    en: 'Control Capability',
  },
  internalResources: {
    'zh-TW': '內部資源',
    en: 'Internal Resources',
  },
  externalResources: {
    'zh-TW': '外部資源',
    en: 'External Resources',
  },
  low: {
    'zh-TW': '低',
    en: 'Low',
  },
  high: {
    'zh-TW': '高',
    en: 'High',
  },
  weak: {
    'zh-TW': '弱',
    en: 'Weak',
  },
  strong: {
    'zh-TW': '強',
    en: 'Strong',
  },
  vulnerabilityDesc: {
    'zh-TW': '脆弱性描述',
    en: 'Vulnerability Description',
  },
  impactDesc: {
    'zh-TW': '影響描述',
    en: 'Impact Description',
  },
  mitigationStrategy: {
    'zh-TW': '緩解策略',
    en: 'Mitigation Strategy',
  },

  // Step 3
  riskMatrix: {
    'zh-TW': '風險矩陣',
    en: 'Risk Matrix',
  },
  riskRegister: {
    'zh-TW': '風險登記冊',
    en: 'Risk Register',
  },
  summary: {
    'zh-TW': '摘要',
    en: 'Summary',
  },
  totalItems: {
    'zh-TW': '總項目',
    en: 'Total Items',
  },
  highRisk: {
    'zh-TW': '高風險',
    en: 'High Risk',
  },
  mediumRisk: {
    'zh-TW': '中風險',
    en: 'Medium Risk',
  },
  lowRisk: {
    'zh-TW': '低風險',
    en: 'Low Risk',
  },
  impact: {
    'zh-TW': '影響',
    en: 'Impact',
  },

  // Table Headers
  threat: {
    'zh-TW': '威脅',
    en: 'Threat',
  },
  vulnerability: {
    'zh-TW': '脆弱性',
    en: 'Vulnerability',
  },
  riskLevel: {
    'zh-TW': '風險等級',
    en: 'Risk Level',
  },

  // Step 4
  selectExportFormat: {
    'zh-TW': '選擇匯出格式',
    en: 'Select Export Format',
  },
  excelDesc: {
    'zh-TW': 'Excel 試算表 - 完整數據，可編輯',
    en: 'Excel Spreadsheet - Full data, editable',
  },
  pdfDesc: {
    'zh-TW': 'PDF 報告 - 列印友好，專業格式',
    en: 'PDF Report - Print-friendly, professional',
  },
  pptxDesc: {
    'zh-TW': 'PowerPoint 簡報 - 符合課程範本格式',
    en: 'PowerPoint - Matches course template',
  },
  exportAll: {
    'zh-TW': '匯出全部',
    en: 'Export All',
  },

  // Navigation
  next: {
    'zh-TW': '下一步',
    en: 'Next',
  },
  previous: {
    'zh-TW': '上一步',
    en: 'Previous',
  },
  nextThreat: {
    'zh-TW': '下一個威脅',
    en: 'Next Threat',
  },
  prevThreat: {
    'zh-TW': '上一個威脅',
    en: 'Previous Threat',
  },

  // Categories
  naturalDisasters: {
    'zh-TW': '自然災害',
    en: 'Natural Disasters',
  },
  technicalHazards: {
    'zh-TW': '科技與設施危害',
    en: 'Technical & Facility Hazards',
  },
  securityThreats: {
    'zh-TW': '保安與敵意行為',
    en: 'Security & Hostile Actions',
  },
  custom: {
    'zh-TW': '自訂',
    en: 'Custom',
  },

  // Expert Mode
  addThreat: {
    'zh-TW': '新增威脅',
    en: 'Add Threat',
  },
  vulnerabilityAnalysis: {
    'zh-TW': '脆弱分析',
    en: 'Vulnerability Analysis',
  },

  // Misc
  or: {
    'zh-TW': '或',
    en: 'or',
  },
  add: {
    'zh-TW': '新增',
    en: 'Add',
  },
  delete: {
    'zh-TW': '刪除',
    en: 'Delete',
  },
  edit: {
    'zh-TW': '編輯',
    en: 'Edit',
  },
  save: {
    'zh-TW': '儲存',
    en: 'Save',
  },
  cancel: {
    'zh-TW': '取消',
    en: 'Cancel',
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, language: Language): string {
  return translations[key][language];
}

export function useTranslation(language: Language) {
  return (key: TranslationKey) => t(key, language);
}
