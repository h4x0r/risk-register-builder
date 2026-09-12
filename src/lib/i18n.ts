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

  // Matrix & flow
  inherentRisk: {
    'zh-TW': '固有風險',
    en: 'Inherent Risk',
  },
  residualRisk: {
    'zh-TW': '剩餘風險',
    en: 'Residual Risk',
  },
  controls: {
    'zh-TW': '控制措施',
    en: 'Controls',
  },
  inherentMatrix: {
    'zh-TW': '固有風險矩陣',
    en: 'Inherent Matrix',
  },
  residualMatrix: {
    'zh-TW': '剩餘風險矩陣',
    en: 'Residual Matrix',
  },
  beforeControls: {
    'zh-TW': '施加控制措施之前',
    en: 'Before controls',
  },
  afterControls: {
    'zh-TW': '施加控制措施之後',
    en: 'After controls',
  },
  emptyCell: {
    'zh-TW': '此格沒有項目',
    en: 'No threats in this cell',
  },
  noEntriesYet: {
    'zh-TW': '尚未加入威脅。從上方選擇或自訂一項，即可開始評估。',
    en: 'No threats yet. Pick one above, or add your own, to start the assessment.',
  },

  // Rationale
  rationale: {
    'zh-TW': '評分理由',
    en: 'Rationale',
  },
  rationaleHint: {
    'zh-TW': '記下選擇此評分的理由。沒有理由的分數無法覆核，亦難以在日後辯護。',
    en: 'Record why you chose this score. A number with no reasoning behind it cannot be reviewed, challenged, or defended later.',
  },
  rationalePlaceholder: {
    'zh-TW': '為何是這個分數？依據甚麼證據或假設？',
    en: 'Why this score? On what evidence or assumption?',
  },
  rationaleRecorded: {
    'zh-TW': '已記錄理由',
    en: 'rationale recorded',
  },
  rationaleMissing: {
    'zh-TW': '未填理由',
    en: 'no rationale',
  },
  showRationale: {
    'zh-TW': '展開評分理由',
    en: 'Show rationale',
  },
  deleteEntry: {
    'zh-TW': '刪除此項',
    en: 'Delete this entry',
  },
  confirmDelete: {
    'zh-TW': '確定刪除？',
    en: 'Delete?',
  },
  deleteWarning: {
    'zh-TW': '刪除後，該項的評分、理由及緩解策略將一併移除。',
    en: 'Deleting removes its scores, rationale and mitigation along with it.',
  },
  hideRationale: {
    'zh-TW': '收起評分理由',
    en: 'Hide rationale',
  },

  // Export
  exportPng: {
    'zh-TW': 'PNG 圖像 — 兩個矩陣及登記冊快照',
    en: 'PNG image — both matrices and the register',
  },
  exportingPng: {
    'zh-TW': '正在產生圖像…',
    en: 'Rendering image…',
  },

  // Disclaimer
  disclaimerShort: {
    'zh-TW': '本工具只協助整理判斷，不會代為判斷。',
    en: 'This tool organises your judgement. It does not supply it.',
  },
  disclaimerTitle: {
    'zh-TW': '使用聲明及責任歸屬',
    en: 'Scope of This Tool and Where Responsibility Sits',
  },
  disclaimerBody: {
    'zh-TW':
      '本工具是一項教學與整理輔助工具。所有威脅的選取、評分、控制能力評估及緩解決定，均由使用者作出，其準確性、完整性與適切性亦由使用者負責。工具所計算的分數為序數排序，用於分流與討論，並非風險的量度，亦不構成保安、法律、財務或監管方面的意見。',
    en:
      'This is a teaching and organising aid. Every threat selected, every score entered, every judgement of control capability and every mitigation decision is made by you, and their accuracy, completeness and suitability remain yours. The figures it computes are ordinal rankings for triage and discussion — they are not measurements of risk, and they are not security, legal, financial or regulatory advice.',
  },
  disclaimerResponsibility: {
    'zh-TW':
      '輸出結果應交由具備資格的人員覆核，並按貴機構的實際情況、風險準則及適用法規加以驗證後，方可用作任何決定的依據。使用者須就依據本工具輸出所作的一切決定及後果承擔全部責任。',
    en:
      'Output should be reviewed by a suitably qualified person and validated against your organisation\'s own circumstances, risk criteria and applicable law before it informs any decision. Responsibility for decisions taken on the basis of this output, and for their consequences, rests entirely with you.',
  },
  disclaimerData: {
    'zh-TW':
      '所有資料只儲存於你的瀏覽器本機，以及你自行產生的分享連結之內；本工具不會將資料傳送或儲存於伺服器。分享連結會把完整內容編碼於網址中，請按敏感程度自行斟酌傳閱對象。',
    en:
      'Your data stays in your own browser and in any share link you generate; nothing is transmitted to or stored on a server. A share link encodes the full contents in the URL, so treat it with the sensitivity the contents deserve.',
  },
  disclaimerAcknowledge: {
    'zh-TW': '明白',
    en: 'Understood',
  },
  readDisclaimer: {
    'zh-TW': '閱讀完整聲明',
    en: 'Read the full notice',
  },

  // Learning
  learn: {
    'zh-TW': '學習',
    en: 'Learn',
  },
  learnTitle: {
    'zh-TW': '風險管理標準與框架',
    en: 'Risk Standards & Frameworks',
  },
  learnSubtitle: {
    'zh-TW': '本工具的分類軸取自公開標準；計分公式與風險等級門檻則是本課程的約定，並非任何標準的規定。以下說明各自的出處、用法與限制。',
    en: 'The classification axes come from published standards; the scoring formula and the risk bands are conventions of this course, not requirements of any standard. Here is where each comes from, how to use it, and where it stops working.',
  },
  furtherReading: {
    'zh-TW': '參考資料',
    en: 'References',
  },
  freeToRead: {
    'zh-TW': '全文免費',
    en: 'Free full text',
  },
  abstractOnly: {
    'zh-TW': '只有摘要',
    en: 'Abstract only',
  },
  paidStandard: {
    'zh-TW': '須購買',
    en: 'Paid',
  },
  whyThisMatters: {
    'zh-TW': '重點',
    en: 'The point',
  },
  learnMoreAbout: {
    'zh-TW': '了解更多：',
    en: 'Learn about:',
  },
  educationCopyright: {
    'zh-TW': '教學內容版權所有 © 2026 許君泰（Albert Hui）。所引用之標準，版權歸各出版機構所有。',
    en: 'Teaching content © 2026 Albert Hui. All rights reserved. Cited standards remain the copyright of their respective publishers.',
  },

  // Taxonomy
  searchThreats: {
    'zh-TW': '搜尋威脅庫',
    en: 'Search threat library',
  },
  searchResults: {
    'zh-TW': '搜尋結果',
    en: 'Search results',
  },
  noMatches: {
    'zh-TW': '沒有相符的威脅',
    en: 'No matching threats',
  },
  threatSource: {
    'zh-TW': '威脅來源',
    en: 'Threat Source',
  },
  pptPillar: {
    'zh-TW': '人員／流程／科技',
    en: 'People / Process / Technology',
  },
  strideClass: {
    'zh-TW': 'STRIDE 分類',
    en: 'STRIDE Class',
  },
  securityProperty: {
    'zh-TW': '受影響的保安屬性',
    en: 'Security Property Affected',
  },
  category: {
    'zh-TW': '類別',
    en: 'Category',
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
