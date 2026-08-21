import {
  PptPillar,
  SecurityProperty,
  StrideClass,
  ThreatCategory,
  ThreatPreset,
  ThreatSource,
} from '@/types';

/**
 * Preset threat library.
 *
 * Category order follows docs/taxonomy.md. Every preset carries its NIST SP 800-30
 * threat source and its People/Process/Technology pillars; STRIDE is applied only
 * where the threat acts on an information system or the data it holds.
 *
 * The ten ids present before the taxonomy expansion are preserved verbatim
 * (typhoon-storm-surge, heavy-rain-flooding, power-outage, elevator-failure, fire,
 * gas-leak, civil-unrest, cyber-attack, lone-wolf, intrusion) so that share links
 * issued against the old model still resolve to a real preset.
 */
export const THREAT_PRESETS: ThreatPreset[] = [
  // ── 自然及環境災害 (Natural & Environmental Hazards) ──────────────────
  { id: 'typhoon-storm-surge', nameZh: '超強颱風與風暴潮', nameEn: 'Super Typhoon and Storm Surge', category: 'natural', source: 'environmental', pillars: ['process'] },
  { id: 'heavy-rain-flooding', nameZh: '暴雨（黑／紅）及水浸', nameEn: 'Heavy Rain (Black/Red) and Flooding', category: 'natural', source: 'environmental', pillars: ['process'] },
  { id: 'landslide', nameZh: '山泥傾瀉', nameEn: 'Landslide', category: 'natural', source: 'environmental', pillars: ['process'] },
  { id: 'earthquake', nameZh: '地震', nameEn: 'Earthquake', category: 'natural', source: 'environmental', pillars: ['process'] },
  { id: 'extreme-heat', nameZh: '極端酷熱', nameEn: 'Extreme Heat', category: 'natural', source: 'environmental', pillars: ['people', 'process'] },
  { id: 'lightning-strike', nameZh: '雷擊', nameEn: 'Lightning Strike', category: 'natural', source: 'environmental', pillars: ['technology'] },
  { id: 'pandemic', nameZh: '大流行疫症', nameEn: 'Pandemic / Infectious Disease Outbreak', category: 'natural', source: 'environmental', pillars: ['people', 'process'] },
  { id: 'air-pollution', nameZh: '嚴重空氣污染', nameEn: 'Severe Air Pollution', category: 'natural', source: 'environmental', pillars: ['people', 'process'] },

  // ── 基礎設施與公用服務中斷 (Infrastructure & Utility Disruption) ──────
  { id: 'power-outage', nameZh: '停電', nameEn: 'Power Outage', category: 'infrastructure', source: 'structural', pillars: ['technology', 'process'] },
  { id: 'generator-failure', nameZh: '後備發電機故障', nameEn: 'Backup Generator Failure', category: 'infrastructure', source: 'structural', pillars: ['technology', 'process'] },
  { id: 'water-supply-failure', nameZh: '食水供應中斷', nameEn: 'Water Supply Failure', category: 'infrastructure', source: 'structural', pillars: ['process'] },
  { id: 'telecom-outage', nameZh: '電訊服務中斷', nameEn: 'Telecommunications Outage', category: 'infrastructure', source: 'structural', pillars: ['technology'] },
  { id: 'internet-outage', nameZh: '互聯網服務中斷', nameEn: 'Internet / ISP Outage', category: 'infrastructure', source: 'structural', pillars: ['technology'] },
  { id: 'hvac-failure', nameZh: '空調系統故障', nameEn: 'HVAC Failure', category: 'infrastructure', source: 'structural', pillars: ['technology'] },
  { id: 'elevator-failure', nameZh: '升降機故障', nameEn: 'Elevator Failure', category: 'infrastructure', source: 'structural', pillars: ['technology', 'process'] },
  { id: 'transport-disruption', nameZh: '公共交通中斷', nameEn: 'Public Transport Disruption', category: 'infrastructure', source: 'environmental', pillars: ['people', 'process'] },
  { id: 'fuel-shortage', nameZh: '燃料短缺', nameEn: 'Fuel Shortage', category: 'infrastructure', source: 'structural', pillars: ['process'] },

  // ── 實體保安與設施 (Physical Security & Facility) ─────────────────────
  { id: 'fire', nameZh: '火災', nameEn: 'Fire', category: 'physical', source: 'accidental', pillars: ['process', 'technology'] },
  { id: 'gas-leak', nameZh: '氣體洩漏', nameEn: 'Gas Leak', category: 'physical', source: 'accidental', pillars: ['process', 'technology'] },
  { id: 'hazmat-release', nameZh: '危險品洩漏', nameEn: 'Hazardous Material Release', category: 'physical', source: 'accidental', pillars: ['people', 'process'] },
  { id: 'structural-collapse', nameZh: '建築結構倒塌', nameEn: 'Structural Collapse', category: 'physical', source: 'structural', pillars: ['process'] },
  { id: 'intrusion', nameZh: '入侵', nameEn: 'Intrusion / Break-in', category: 'physical', source: 'adversarial', pillars: ['people', 'technology'], stride: ['spoofing', 'elevation'] },
  { id: 'unauthorised-entry', nameZh: '未經授權進入及尾隨闖入', nameEn: 'Unauthorised Entry / Tailgating', category: 'physical', source: 'adversarial', pillars: ['people', 'process'], stride: ['spoofing'] },
  { id: 'perimeter-breach', nameZh: '周界防線失守', nameEn: 'Perimeter Breach', category: 'physical', source: 'adversarial', pillars: ['technology', 'process'] },
  { id: 'theft-of-assets', nameZh: '資產失竊', nameEn: 'Theft of Physical Assets', category: 'physical', source: 'adversarial', pillars: ['people', 'process'] },
  { id: 'device-loss', nameZh: '流動裝置遺失或被盜', nameEn: 'Loss or Theft of Mobile Devices', category: 'physical', source: 'accidental', pillars: ['people', 'technology'], stride: ['infoDisclosure'] },
  { id: 'vandalism', nameZh: '蓄意破壞', nameEn: 'Vandalism / Criminal Damage', category: 'physical', source: 'adversarial', pillars: ['process'] },
  { id: 'access-control-failure', nameZh: '門禁系統故障', nameEn: 'Access Control System Failure', category: 'physical', source: 'structural', pillars: ['technology'], stride: ['spoofing', 'elevation'] },
  { id: 'cctv-failure', nameZh: '閉路電視系統失效', nameEn: 'CCTV / Surveillance System Failure', category: 'physical', source: 'structural', pillars: ['technology'], stride: ['repudiation'] },
  { id: 'civil-unrest', nameZh: '社會動盪', nameEn: 'Civil Unrest', category: 'physical', source: 'adversarial', pillars: ['people', 'process'] },
  { id: 'protest-blockade', nameZh: '示威堵塞', nameEn: 'Protest / Blockade', category: 'physical', source: 'adversarial', pillars: ['process'] },
  { id: 'terrorist-attack', nameZh: '恐怖襲擊', nameEn: 'Terrorist Attack', category: 'physical', source: 'adversarial', pillars: ['people', 'process'] },
  { id: 'lone-wolf', nameZh: '獨狼攻擊', nameEn: 'Lone Wolf Attack', category: 'physical', source: 'adversarial', pillars: ['people', 'process'] },
  { id: 'bomb-threat', nameZh: '炸彈威脅', nameEn: 'Bomb Threat', category: 'physical', source: 'adversarial', pillars: ['people', 'process'] },
  { id: 'drone-incursion', nameZh: '無人機入侵', nameEn: 'Unauthorised Drone Incursion', category: 'physical', source: 'adversarial', pillars: ['technology', 'process'] },

  // ── 人員與內部威脅 (People & Insider Threat) ──────────────────────────
  { id: 'malicious-insider', nameZh: '惡意內部人員', nameEn: 'Malicious Insider', category: 'personnel', source: 'adversarial', pillars: ['people', 'process'], stride: ['tampering', 'infoDisclosure', 'elevation'] },
  { id: 'insider-collusion', nameZh: '內部串謀舞弊', nameEn: 'Insider Collusion / Fraud', category: 'personnel', source: 'adversarial', pillars: ['people', 'process'], stride: ['repudiation', 'tampering'] },
  { id: 'negligent-insider', nameZh: '員工疏忽及人為錯誤', nameEn: 'Negligent Insider / Human Error', category: 'personnel', source: 'accidental', pillars: ['people', 'process'], stride: ['infoDisclosure'] },
  { id: 'social-engineering', nameZh: '社交工程', nameEn: 'Social Engineering (Pretexting / Vishing)', category: 'personnel', source: 'adversarial', pillars: ['people'], stride: ['spoofing'] },
  { id: 'workplace-violence', nameZh: '工作場所暴力', nameEn: 'Workplace Violence', category: 'personnel', source: 'adversarial', pillars: ['people', 'process'] },
  { id: 'unsafe-work-practice', nameZh: '不安全工作行為', nameEn: 'Unsafe Work Practices', category: 'personnel', source: 'accidental', pillars: ['people', 'process'] },
  { id: 'key-person-dependency', nameZh: '關鍵人員依賴', nameEn: 'Key Person Dependency', category: 'personnel', source: 'structural', pillars: ['people', 'process'] },
  { id: 'staff-shortage', nameZh: '人手短缺及流失', nameEn: 'Staff Shortage / Attrition', category: 'personnel', source: 'structural', pillars: ['people', 'process'] },
  { id: 'industrial-action', nameZh: '勞資糾紛及罷工', nameEn: 'Industrial Action / Strike', category: 'personnel', source: 'adversarial', pillars: ['people', 'process'] },
  { id: 'screening-failure', nameZh: '背景審查不足', nameEn: 'Inadequate Background Screening', category: 'personnel', source: 'structural', pillars: ['people', 'process'] },
  { id: 'leaver-access-retained', nameZh: '離職人員權限未撤銷', nameEn: 'Retained Access After Departure', category: 'personnel', source: 'structural', pillars: ['people', 'process'], stride: ['elevation', 'infoDisclosure'] },

  // ── 網絡攻擊 (Cyber Attack) ───────────────────────────────────────────
  { id: 'cyber-attack', nameZh: '網絡攻擊', nameEn: 'Cyber Attack (General)', category: 'cyber', source: 'adversarial', pillars: ['technology', 'process'], stride: ['spoofing', 'tampering', 'infoDisclosure', 'dos', 'elevation'] },
  { id: 'ransomware', nameZh: '勒索軟件', nameEn: 'Ransomware', category: 'cyber', source: 'adversarial', pillars: ['technology', 'process'], stride: ['tampering', 'dos'] },
  { id: 'phishing', nameZh: '網絡釣魚', nameEn: 'Phishing', category: 'cyber', source: 'adversarial', pillars: ['people', 'technology'], stride: ['spoofing'] },
  { id: 'business-email-compromise', nameZh: '商業電郵詐騙', nameEn: 'Business Email Compromise', category: 'cyber', source: 'adversarial', pillars: ['people', 'process'], stride: ['spoofing'] },
  { id: 'deepfake-fraud', nameZh: '人工智能深偽詐騙', nameEn: 'AI Deepfake-Enabled Fraud', category: 'cyber', source: 'adversarial', pillars: ['people', 'process'], stride: ['spoofing'] },
  { id: 'malware-infection', nameZh: '惡意軟件感染', nameEn: 'Malware Infection', category: 'cyber', source: 'adversarial', pillars: ['technology'], stride: ['tampering'] },
  { id: 'ddos', nameZh: '分散式阻斷服務攻擊', nameEn: 'Distributed Denial of Service', category: 'cyber', source: 'adversarial', pillars: ['technology'], stride: ['dos'] },
  { id: 'web-application-attack', nameZh: '網頁應用程式攻擊', nameEn: 'Web Application Attack (Injection / XSS)', category: 'cyber', source: 'adversarial', pillars: ['technology'], stride: ['tampering', 'elevation'] },
  { id: 'credential-stuffing', nameZh: '撞庫攻擊', nameEn: 'Credential Stuffing', category: 'cyber', source: 'adversarial', pillars: ['technology', 'people'], stride: ['spoofing'] },
  { id: 'account-takeover', nameZh: '帳戶盜用', nameEn: 'Account Takeover', category: 'cyber', source: 'adversarial', pillars: ['technology', 'people'], stride: ['spoofing', 'elevation'] },
  { id: 'privilege-escalation', nameZh: '權限提升攻擊', nameEn: 'Privilege Escalation', category: 'cyber', source: 'adversarial', pillars: ['technology'], stride: ['elevation'] },
  { id: 'zero-day-exploit', nameZh: '零日漏洞攻擊', nameEn: 'Zero-Day Exploit', category: 'cyber', source: 'adversarial', pillars: ['technology'], stride: ['tampering', 'elevation'] },
  { id: 'unpatched-exploitation', nameZh: '利用未修補漏洞', nameEn: 'Exploitation of Unpatched Vulnerability', category: 'cyber', source: 'adversarial', pillars: ['technology', 'process'], stride: ['elevation'] },
  { id: 'advanced-persistent-threat', nameZh: '進階持續威脅', nameEn: 'Advanced Persistent Threat', category: 'cyber', source: 'adversarial', pillars: ['technology', 'process'], stride: ['spoofing', 'tampering', 'infoDisclosure', 'elevation'] },
  { id: 'wireless-attack', nameZh: '無線網絡攻擊', nameEn: 'Rogue Access Point / Wireless Attack', category: 'cyber', source: 'adversarial', pillars: ['technology'], stride: ['spoofing', 'infoDisclosure'] },
  { id: 'ot-iot-compromise', nameZh: '物聯網及營運技術系統入侵', nameEn: 'IoT / OT System Compromise', category: 'cyber', source: 'adversarial', pillars: ['technology'], stride: ['tampering', 'dos'] },
  { id: 'cryptojacking', nameZh: '加密貨幣挖礦劫持', nameEn: 'Cryptojacking', category: 'cyber', source: 'adversarial', pillars: ['technology'], stride: ['dos'] },
  { id: 'website-defacement', nameZh: '網站被竄改', nameEn: 'Website Defacement', category: 'cyber', source: 'adversarial', pillars: ['technology'], stride: ['tampering'] },

  // ── 資訊與數據保護 (Information & Data Protection) ────────────────────
  { id: 'data-breach', nameZh: '資料外洩', nameEn: 'Data Breach', category: 'information', source: 'adversarial', pillars: ['technology', 'process'], stride: ['infoDisclosure'] },
  { id: 'accidental-disclosure', nameZh: '意外披露個人資料', nameEn: 'Accidental Disclosure of Personal Data', category: 'information', source: 'accidental', pillars: ['people', 'process'], stride: ['infoDisclosure'] },
  { id: 'data-loss', nameZh: '資料遺失或無法復原', nameEn: 'Data Loss / Irrecoverable Deletion', category: 'information', source: 'accidental', pillars: ['technology', 'process'], stride: ['dos'] },
  { id: 'backup-failure', nameZh: '備份失效', nameEn: 'Backup Failure', category: 'information', source: 'structural', pillars: ['technology', 'process'], stride: ['dos'] },
  { id: 'data-integrity-corruption', nameZh: '資料完整性受損', nameEn: 'Data Integrity Corruption', category: 'information', source: 'accidental', pillars: ['technology'], stride: ['tampering'] },
  { id: 'improper-disposal', nameZh: '文件或儲存媒體處置不當', nameEn: 'Improper Disposal of Records or Media', category: 'information', source: 'accidental', pillars: ['people', 'process'], stride: ['infoDisclosure'] },
  { id: 'clear-desk-exposure', nameZh: '桌面及螢幕資料外露', nameEn: 'Clear Desk / Screen Exposure', category: 'information', source: 'accidental', pillars: ['people', 'process'], stride: ['infoDisclosure'] },
  { id: 'eavesdropping', nameZh: '通訊竊聽', nameEn: 'Communications Eavesdropping', category: 'information', source: 'adversarial', pillars: ['technology'], stride: ['infoDisclosure'] },
  { id: 'corporate-espionage', nameZh: '商業間諜活動', nameEn: 'Corporate Espionage', category: 'information', source: 'adversarial', pillars: ['people', 'technology'], stride: ['infoDisclosure'] },
  { id: 'ip-theft', nameZh: '知識產權盜竊', nameEn: 'Intellectual Property Theft', category: 'information', source: 'adversarial', pillars: ['people', 'process'], stride: ['infoDisclosure'] },
  { id: 'excessive-access', nameZh: '權限過度授予', nameEn: 'Excessive Access Rights', category: 'information', source: 'structural', pillars: ['process', 'technology'], stride: ['elevation'] },
  { id: 'shadow-it', nameZh: '影子資訊科技', nameEn: 'Shadow IT / Unsanctioned Cloud Use', category: 'information', source: 'accidental', pillars: ['people', 'process'], stride: ['infoDisclosure'] },
  { id: 'audit-log-gap', nameZh: '審計日誌缺失', nameEn: 'Inadequate Audit Logging', category: 'information', source: 'structural', pillars: ['technology', 'process'], stride: ['repudiation'] },
  { id: 'weak-cryptography', nameZh: '加密措施不足', nameEn: 'Weak or Absent Encryption', category: 'information', source: 'structural', pillars: ['technology'], stride: ['infoDisclosure', 'tampering'] },

  // ── 技術與系統故障 (Technology & System Failure) ──────────────────────
  { id: 'hardware-failure', nameZh: '硬件故障', nameEn: 'Hardware Failure', category: 'technology', source: 'structural', pillars: ['technology'], stride: ['dos'] },
  { id: 'software-defect', nameZh: '軟件缺陷', nameEn: 'Software Defect', category: 'technology', source: 'structural', pillars: ['technology'], stride: ['dos', 'tampering'] },
  { id: 'network-failure', nameZh: '網絡設備故障', nameEn: 'Network Equipment Failure', category: 'technology', source: 'structural', pillars: ['technology'], stride: ['dos'] },
  { id: 'storage-failure', nameZh: '儲存系統故障', nameEn: 'Storage System Failure', category: 'technology', source: 'structural', pillars: ['technology'], stride: ['dos'] },
  { id: 'database-corruption', nameZh: '資料庫損毀', nameEn: 'Database Corruption', category: 'technology', source: 'structural', pillars: ['technology'], stride: ['tampering', 'dos'] },
  { id: 'cloud-service-outage', nameZh: '雲端服務中斷', nameEn: 'Cloud Service Outage', category: 'technology', source: 'structural', pillars: ['technology', 'process'], stride: ['dos'] },
  { id: 'capacity-exhaustion', nameZh: '系統容量耗盡', nameEn: 'System Capacity Exhaustion', category: 'technology', source: 'structural', pillars: ['technology', 'process'], stride: ['dos'] },
  { id: 'misconfiguration', nameZh: '系統組態錯誤', nameEn: 'Misconfiguration / Configuration Drift', category: 'technology', source: 'accidental', pillars: ['technology', 'process'], stride: ['infoDisclosure', 'elevation'] },
  { id: 'failed-change', nameZh: '變更或部署失敗', nameEn: 'Failed Change / Deployment', category: 'technology', source: 'accidental', pillars: ['process', 'technology'], stride: ['dos'] },
  { id: 'legacy-end-of-life', nameZh: '過時或終止支援系統', nameEn: 'Legacy / End-of-Life Systems', category: 'technology', source: 'structural', pillars: ['technology', 'process'], stride: ['elevation'] },
  { id: 'integration-failure', nameZh: '系統整合失敗', nameEn: 'System Integration Failure', category: 'technology', source: 'structural', pillars: ['technology', 'process'], stride: ['dos'] },

  // ── 營運與流程 (Operational & Process) ────────────────────────────────
  { id: 'process-execution-failure', nameZh: '流程執行失誤', nameEn: 'Process Execution Failure', category: 'operational', source: 'accidental', pillars: ['people', 'process'] },
  { id: 'inadequate-bcp', nameZh: '業務持續計劃不足', nameEn: 'Inadequate Business Continuity Plan', category: 'operational', source: 'structural', pillars: ['process'] },
  { id: 'untested-dr', nameZh: '災難復原未經演練', nameEn: 'Untested Disaster Recovery', category: 'operational', source: 'structural', pillars: ['process', 'technology'] },
  { id: 'weak-incident-response', nameZh: '事故應變能力不足', nameEn: 'Weak Incident Response Capability', category: 'operational', source: 'structural', pillars: ['people', 'process'] },
  { id: 'crisis-comms-failure', nameZh: '危機溝通失效', nameEn: 'Crisis Communication Failure', category: 'operational', source: 'structural', pillars: ['people', 'process'] },
  { id: 'weak-change-management', nameZh: '變更管理缺失', nameEn: 'Weak Change Management', category: 'operational', source: 'structural', pillars: ['process'] },
  { id: 'segregation-of-duties-gap', nameZh: '職責分工不足', nameEn: 'Inadequate Segregation of Duties', category: 'operational', source: 'structural', pillars: ['people', 'process'] },
  { id: 'inadequate-training', nameZh: '培訓及保安意識不足', nameEn: 'Inadequate Training & Security Awareness', category: 'operational', source: 'structural', pillars: ['people', 'process'] },
  { id: 'outdated-procedures', nameZh: '程序文件缺失或過時', nameEn: 'Missing or Outdated Procedures', category: 'operational', source: 'structural', pillars: ['process'] },
  { id: 'asset-inventory-gap', nameZh: '資產清單不完整', nameEn: 'Incomplete Asset Inventory', category: 'operational', source: 'structural', pillars: ['process', 'technology'] },
  { id: 'poor-capacity-planning', nameZh: '產能規劃不足', nameEn: 'Poor Capacity Planning', category: 'operational', source: 'structural', pillars: ['process'] },

  // ── 第三方與供應鏈 (Third Party & Supply Chain) ───────────────────────
  { id: 'vendor-breach', nameZh: '供應商資料外洩', nameEn: 'Vendor Data Breach', category: 'supplychain', source: 'adversarial', pillars: ['process', 'technology'], stride: ['infoDisclosure'] },
  { id: 'software-supply-chain-attack', nameZh: '軟件供應鏈攻擊', nameEn: 'Software Supply Chain Attack', category: 'supplychain', source: 'adversarial', pillars: ['technology', 'process'], stride: ['tampering', 'elevation'] },
  { id: 'hardware-supply-chain-tampering', nameZh: '硬件供應鏈植入', nameEn: 'Hardware Supply Chain Tampering', category: 'supplychain', source: 'adversarial', pillars: ['technology', 'process'], stride: ['tampering'] },
  { id: 'vendor-insolvency', nameZh: '供應商倒閉', nameEn: 'Vendor Insolvency / Failure', category: 'supplychain', source: 'structural', pillars: ['process'] },
  { id: 'outsourced-service-outage', nameZh: '外判服務中斷', nameEn: 'Outsourced Service Outage', category: 'supplychain', source: 'structural', pillars: ['process', 'technology'], stride: ['dos'] },
  { id: 'sla-non-performance', nameZh: '服務水平協議未達標', nameEn: 'SLA Non-Performance', category: 'supplychain', source: 'structural', pillars: ['process'] },
  { id: 'vendor-concentration', nameZh: '供應商集中風險', nameEn: 'Vendor Concentration Risk', category: 'supplychain', source: 'structural', pillars: ['process'] },
  { id: 'fourth-party-risk', nameZh: '第四方分包風險', nameEn: 'Fourth-Party / Sub-Contractor Risk', category: 'supplychain', source: 'structural', pillars: ['process'] },
  { id: 'weak-contract-terms', nameZh: '合約保安條款不足', nameEn: 'Inadequate Contractual Security Terms', category: 'supplychain', source: 'structural', pillars: ['process'] },

  // ── 法律、監管與合規 (Legal, Regulatory & Compliance) ─────────────────
  { id: 'pdpo-breach', nameZh: '違反《個人資料（私隱）條例》', nameEn: 'Personal Data (Privacy) Ordinance Breach', category: 'compliance', source: 'accidental', pillars: ['process', 'people'] },
  { id: 'gdpr-non-compliance', nameZh: '違反歐盟《通用資料保障條例》', nameEn: 'GDPR Non-Compliance', category: 'compliance', source: 'accidental', pillars: ['process'] },
  { id: 'cross-border-transfer', nameZh: '跨境資料轉移限制', nameEn: 'Cross-Border Data Transfer Restriction', category: 'compliance', source: 'structural', pillars: ['process'] },
  { id: 'records-retention-breach', nameZh: '紀錄保存不合規', nameEn: 'Records Retention Non-Compliance', category: 'compliance', source: 'accidental', pillars: ['process'] },
  { id: 'regulatory-change', nameZh: '監管要求變更', nameEn: 'Regulatory Change', category: 'compliance', source: 'structural', pillars: ['process'] },
  { id: 'adverse-audit-finding', nameZh: '審計缺失', nameEn: 'Adverse Audit Finding', category: 'compliance', source: 'structural', pillars: ['process'] },
  { id: 'licence-lapse', nameZh: '牌照或認證失效', nameEn: 'Licence / Certification Lapse', category: 'compliance', source: 'structural', pillars: ['process'] },
  { id: 'software-licensing-violation', nameZh: '軟件授權違規', nameEn: 'Software Licensing Violation', category: 'compliance', source: 'accidental', pillars: ['process', 'technology'] },
  { id: 'litigation', nameZh: '訴訟風險', nameEn: 'Litigation', category: 'compliance', source: 'adversarial', pillars: ['process'] },
];

/**
 * Category ids in display order. `custom` is deliberately excluded — it is a
 * destination for user-created entries, never a source of presets.
 */
export const CATEGORY_ORDER: ThreatCategory[] = [
  'natural',
  'infrastructure',
  'physical',
  'personnel',
  'cyber',
  'information',
  'technology',
  'operational',
  'supplychain',
  'compliance',
];

export const CATEGORY_LABELS: Record<ThreatCategory, { zh: string; en: string }> = {
  natural: { zh: '自然及環境災害', en: 'Natural & Environmental Hazards' },
  infrastructure: { zh: '基礎設施與公用服務', en: 'Infrastructure & Utilities' },
  physical: { zh: '實體保安與設施', en: 'Physical Security & Facility' },
  personnel: { zh: '人員與內部威脅', en: 'People & Insider Threat' },
  cyber: { zh: '網絡攻擊', en: 'Cyber Attack' },
  information: { zh: '資訊與數據保護', en: 'Information & Data Protection' },
  technology: { zh: '技術與系統故障', en: 'Technology & System Failure' },
  operational: { zh: '營運與流程', en: 'Operational & Process' },
  supplychain: { zh: '第三方與供應鏈', en: 'Third Party & Supply Chain' },
  compliance: { zh: '法律、監管與合規', en: 'Legal, Regulatory & Compliance' },
  custom: { zh: '自訂', en: 'Custom' },
};

/** NIST SP 800-30 Rev. 1, Table D-2. */
export const SOURCE_LABELS: Record<ThreatSource, { zh: string; en: string }> = {
  adversarial: { zh: '敵對', en: 'Adversarial' },
  accidental: { zh: '意外', en: 'Accidental' },
  structural: { zh: '結構性', en: 'Structural' },
  environmental: { zh: '環境', en: 'Environmental' },
};

export const PILLAR_LABELS: Record<PptPillar, { zh: string; en: string }> = {
  people: { zh: '人員', en: 'People' },
  process: { zh: '流程', en: 'Process' },
  technology: { zh: '科技', en: 'Technology' },
};

/** Microsoft STRIDE. Short forms are the canonical single letters. */
export const STRIDE_LABELS: Record<StrideClass, { zh: string; en: string; short: string }> = {
  spoofing: { zh: '偽冒身分', en: 'Spoofing', short: 'S' },
  tampering: { zh: '竄改', en: 'Tampering', short: 'T' },
  repudiation: { zh: '否認', en: 'Repudiation', short: 'R' },
  infoDisclosure: { zh: '資訊洩露', en: 'Information Disclosure', short: 'I' },
  dos: { zh: '阻斷服務', en: 'Denial of Service', short: 'D' },
  elevation: { zh: '權限提升', en: 'Elevation of Privilege', short: 'E' },
};

/**
 * Security property each STRIDE class violates. Derived rather than stored, so the
 * mapping cannot drift out of step with the STRIDE tag on an entry.
 */
export const STRIDE_PROPERTY: Record<StrideClass, SecurityProperty> = {
  spoofing: 'authenticity',
  tampering: 'integrity',
  repudiation: 'nonRepudiation',
  infoDisclosure: 'confidentiality',
  dos: 'availability',
  elevation: 'authorization',
};

export const PROPERTY_LABELS: Record<SecurityProperty, { zh: string; en: string }> = {
  authenticity: { zh: '真確性', en: 'Authenticity' },
  integrity: { zh: '完整性', en: 'Integrity' },
  nonRepudiation: { zh: '不可否認性', en: 'Non-Repudiation' },
  confidentiality: { zh: '機密性', en: 'Confidentiality' },
  availability: { zh: '可用性', en: 'Availability' },
  authorization: { zh: '授權控制', en: 'Authorization' },
};

/**
 * Categories where a STRIDE tag would be a category error: the threat does not act
 * on an information system, so no STRIDE class can describe it. Enforced by test.
 */
export const STRIDE_INAPPLICABLE_CATEGORIES: ThreatCategory[] = [
  'natural',
  'infrastructure',
  'compliance',
];

export const RISK_THRESHOLDS = {
  low: { max: 6, colorClass: 'bg-green-500', textClass: 'text-green-700' },
  medium: { max: 18, colorClass: 'bg-yellow-500', textClass: 'text-yellow-700' },
  high: { max: 75, colorClass: 'bg-red-500', textClass: 'text-red-700' },
};

export const DEFAULT_ENTRY_VALUES = {
  probability: 3,
  impactLife: 3,
  impactAsset: 3,
  impactBusiness: 3,
  controlInternal: 3,
  controlExternal: 3,
  mitigationStrategy: '',
};
