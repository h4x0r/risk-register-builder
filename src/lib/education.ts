/**
 * In-app teaching content.
 *
 * Copyright © 2026 Albert Hui (許君泰). All rights reserved.
 *
 * The explanatory text in this file is original authored work. The standards it
 * cites belong to their respective publishers (ISO, NIST, FIRST, The Open Group,
 * Microsoft and others) and are referenced, not reproduced.
 *
 * This tool is a teaching aid, so every axis it asks a student to use is explained
 * here against the standard it comes from, with a link for further study.
 *
 * Note what this file does NOT claim: the classification axes come from published
 * standards, but the scoring formula and the risk bands are conventions of this
 * course. Saying otherwise would borrow authority the arithmetic has not earned.
 *
 * Rules for anything added to this file:
 *  - Every URL is checked to return real content before it ships. A dead link, or a
 *    link to a login wall presented as a reading, teaches students that citations
 *    are decorative.
 *  - `access` says what a student actually gets: the full text, only an abstract, or
 *    a paywall. ISO standards are paid; the Cox paper resolves to an abstract.
 *  - Where a standard's editions differ, say which edition the claim comes from.
 *    ISO/IEC 27005 moved its threat examples between editions, and a student who
 *    opens the 2022 text looking for Annex C will not find it.
 */

export interface Bilingual {
  zh: string;
  en: string;
}

export type CitationAccess = 'free' | 'abstract' | 'paid';

export interface Citation {
  /** Standard designations are not translated — "ISO/IEC 27005:2018" reads the same everywhere. */
  ref: string;
  title: Bilingual;
  url: string;
  /**
   * What a student actually gets on clicking. "abstract" matters: telling someone a
   * paper is free when only its abstract is reachable wastes their time and quietly
   * teaches that access labels are decorative.
   */
  access: CitationAccess;
}

export interface LearnTable {
  headers: Bilingual[];
  rows: Bilingual[][];
}

export interface LearnTopic {
  id: string;
  title: Bilingual;
  /** Badge shown next to the title. */
  standard?: string;
  /** The one-line teachable moment. */
  summary: Bilingual;
  paragraphs: Bilingual[];
  table?: LearnTable;
  citations: Citation[];
}

const CITE = {
  iso31000: {
    ref: 'ISO 31000:2018',
    title: { zh: '風險管理 — 指引', en: 'Risk management — Guidelines' },
    url: 'https://www.iso.org/standard/65694.html',
    access: 'paid',
  },
  iso27005_2022: {
    ref: 'ISO/IEC 27005:2022',
    title: {
      zh: '資訊保安、網絡安全及私隱保護 — 管理資訊保安風險指引',
      en: 'Information security, cybersecurity and privacy protection — Guidance on managing information security risks',
    },
    url: 'https://www.iso.org/standard/80585.html',
    access: 'paid',
  },
  iso27001: {
    ref: 'ISO/IEC 27001:2022',
    title: { zh: '資訊保安管理系統 — 要求', en: 'Information security management systems — Requirements' },
    url: 'https://www.iso.org/standard/27001',
    access: 'paid',
  },
  iso27002: {
    ref: 'ISO/IEC 27002:2022',
    title: { zh: '資訊保安控制措施', en: 'Information security controls' },
    url: 'https://www.iso.org/standard/75652.html',
    access: 'paid',
  },
  iso22301: {
    ref: 'ISO 22301:2019',
    title: { zh: '業務持續管理系統', en: 'Business continuity management systems' },
    url: 'https://www.iso.org/standard/75106.html',
    access: 'paid',
  },
  nist80030: {
    ref: 'NIST SP 800-30 Rev. 1',
    title: { zh: '風險評估實施指南（表 D-2：威脅來源分類）', en: 'Guide for Conducting Risk Assessments (Table D-2, Taxonomy of Threat Sources)' },
    url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30r1.pdf',
    access: 'free',
  },
  nist80030Page: {
    ref: 'NIST SP 800-30 Rev. 1',
    title: { zh: 'NIST 出版物頁面（含摘要及下載）', en: 'NIST publication page (abstract and downloads)' },
    url: 'https://csrc.nist.gov/pubs/sp/800/30/r1/final',
    access: 'free',
  },
  nistGlossaryRisk: {
    ref: 'NIST CSRC Glossary',
    title: { zh: '「風險」的官方定義', en: 'The official definition of "risk"' },
    url: 'https://csrc.nist.gov/glossary/term/risk',
    access: 'free',
  },
  nistCsf: {
    ref: 'NIST CSWP 29',
    title: { zh: 'NIST 網絡安全框架（CSF）2.0', en: 'The NIST Cybersecurity Framework (CSF) 2.0' },
    url: 'https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final',
    access: 'free',
  },
  nist80053: {
    ref: 'NIST SP 800-53 Rev. 5',
    title: { zh: '資訊系統及組織的保安與私隱控制措施', en: 'Security and Privacy Controls for Information Systems and Organizations' },
    url: 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final',
    access: 'free',
  },
  nist80061: {
    ref: 'NIST SP 800-61 Rev. 3',
    title: { zh: '事故應變建議與考量', en: 'Incident Response Recommendations and Considerations' },
    url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/final',
    access: 'free',
  },
  strideMs: {
    ref: 'Microsoft',
    title: { zh: '威脅建模工具 — 威脅類型（STRIDE）', en: 'Threat Modeling Tool — Threats (STRIDE)' },
    url: 'https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats',
    access: 'free',
  },
  strideSdl: {
    ref: 'Microsoft SDL',
    title: { zh: '保安開發生命周期：威脅建模', en: 'Security Development Lifecycle: Threat Modelling' },
    url: 'https://www.microsoft.com/en-us/securityengineering/sdl/threatmodeling',
    access: 'free',
  },
  owaspTm: {
    ref: 'OWASP',
    title: { zh: '威脅建模', en: 'Threat Modeling' },
    url: 'https://owasp.org/www-community/Threat_Modeling',
    access: 'free',
  },
  fairWhat: {
    ref: 'FAIR Institute',
    title: { zh: '甚麼是 FAIR？', en: 'What is FAIR?' },
    url: 'https://www.fairinstitute.org/what-is-fair',
    access: 'free',
  },
  fairLoss: {
    ref: 'FAIR Institute',
    title: { zh: '損失量級與六種損失形式', en: 'What Is Loss Magnitude? (the six Forms of Loss)' },
    url: 'https://www.fairinstitute.org/blog/fair-risk-basics-what-is-loss-magnitude',
    access: 'free',
  },
  openGroupRisk: {
    ref: 'The Open Group',
    title: { zh: '風險分析（O-RA）與風險分類（O-RT）標準', en: 'Risk Analysis (O-RA) and Risk Taxonomy (O-RT) standards' },
    url: 'https://www.opengroup.org/forum/security/riskanalysis',
    access: 'free',
  },
  cox2008: {
    ref: 'Cox (2008), Risk Analysis 28(2):497–512, doi:10.1111/j.1539-6924.2008.01030.x',
    title: { zh: '〈風險矩陣有甚麼問題？〉', en: '"What\'s Wrong with Risk Matrices?"' },
    url: 'https://pubmed.ncbi.nlm.nih.gov/18419665/',
    access: 'abstract',
  },
  attack: {
    ref: 'MITRE ATT&CK',
    title: { zh: '對手戰術與技術知識庫', en: 'Adversary tactics and techniques knowledge base' },
    url: 'https://attack.mitre.org/',
    access: 'free',
  },
  cis: {
    ref: 'CIS Controls',
    title: { zh: 'CIS 關鍵保安控制措施', en: 'CIS Critical Security Controls' },
    url: 'https://www.cisecurity.org/controls',
    access: 'free',
  },
  pdpo: {
    ref: 'PCPD',
    title: { zh: '《個人資料（私隱）條例》概覽', en: 'The Personal Data (Privacy) Ordinance at a glance' },
    url: 'https://www.pcpd.org.hk/english/data_privacy_law/ordinance_at_a_Glance/ordinance.html',
    access: 'free',
  },
  pdpoDpp: {
    ref: 'PCPD',
    title: { zh: '六項保障資料原則', en: 'The Six Data Protection Principles' },
    url: 'https://www.pcpd.org.hk/english/data_privacy_law/6_data_protection_principles/principles.html',
    access: 'free',
  },
  cvss: {
    ref: 'FIRST — CVSS v4.0',
    title: { zh: '通用漏洞評分系統規格文件', en: 'Common Vulnerability Scoring System v4.0 Specification' },
    url: 'https://www.first.org/cvss/specification-document',
    access: 'free',
  },
  epss: {
    ref: 'FIRST — EPSS',
    title: { zh: '漏洞利用預測評分系統', en: 'Exploit Prediction Scoring System' },
    url: 'https://www.first.org/epss/',
    access: 'free',
  },
  kev: {
    ref: 'CISA',
    title: { zh: '已知遭利用漏洞目錄', en: 'Known Exploited Vulnerabilities Catalog' },
    url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    access: 'free',
  },
  hko: {
    ref: '香港天文台 / HKO',
    title: { zh: '熱帶氣旋警告信號', en: 'Tropical Cyclone Warning Signals' },
    url: 'https://www.hko.gov.hk/en/wxinfo/climat/warndb/warndb1.shtml',
    access: 'free',
  },
} satisfies Record<string, Citation>;

export const LEARN_TOPICS: LearnTopic[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'risk-basics',
    title: { zh: '風險的基本概念', en: 'What Risk Actually Is' },
    standard: 'ISO 31000:2018 · NIST SP 800-30',
    summary: {
      zh: '風險並非獨立存在的事物。它是威脅遇上脆弱性、而有價值的事物因此暴露於損失時所產生的結果。',
      en: 'Risk is not a thing that exists on its own. It is what happens when a threat meets a vulnerability and something of value is exposed to loss.',
    },
    paragraphs: [
      {
        zh: '把三者分開來看，是整個風險評估的基礎。「威脅」是可能造成損害的事件或行為者（颱風、勒索軟件、心懷不滿的員工）。「脆弱性」是讓該威脅得以造成損害的弱點（沒有後備電源、未修補的伺服器、無人覆核的權限）。「影響」則是一旦發生，你會失去甚麼。威脅單獨存在並不構成風險 —— 要對應到一個脆弱性，而該脆弱性又通往有價值的資產，保安風險才成立。要說明的是，這是保安領域的情境模型，不是風險的通用定義：ISO 31000 把風險定義為「不確定性對目標的影響」，範圍同時包括機會與威脅。本工具只處理威脅一側。',
        en: 'Keeping these three apart is the whole foundation of risk assessment. A threat is the event or actor that could cause harm — a typhoon, ransomware, a disgruntled employee. A vulnerability is the weakness that lets that threat cause harm — no backup power, an unpatched server, an access right nobody reviews. Impact is what you lose if it happens. A threat on its own is not a risk: it has to line up with a vulnerability that leads to something you value. Note that this is the security scenario model, not the general definition — ISO 31000 defines risk as the effect of uncertainty on objectives, which covers opportunity as well as threat. This tool works only on the threat side.',
      },
      {
        zh: '這正是為甚麼「颱風」在不同機構會得出完全不同的風險評級。威脅相同，脆弱性不同：一間有後備發電機、遠端工作安排和演練過的應變計劃的公司，與一間沒有的公司，面對同一場颱風的風險並不相等。',
        en: 'This is exactly why "typhoon" scores differently at different organisations. Same threat, different vulnerability: a firm with a generator, a remote-work arrangement and a rehearsed plan does not carry the same risk from that typhoon as a firm without them.',
      },
      {
        zh: '「固有風險」是假設現有控制措施不存在時的風險水平；「剩餘風險」是控制措施發揮作用後仍然存在的部分。管理層真正要決定的，是剩餘風險是否落在可接受的範圍內 —— 這也是本工具左右兩張表所對應的概念。',
        en: 'Inherent risk is the level before your controls are counted; residual risk is what is left after they do their work. The decision a manager actually makes is whether the residual risk sits inside what the organisation is willing to accept — which is what the two cards either side of the matrix in this tool represent.',
      },
    ],
    table: {
      headers: [
        { zh: '用語', en: 'Term' },
        { zh: '意思', en: 'Meaning' },
      ],
      rows: [
        [{ zh: '威脅 Threat', en: 'Threat' }, { zh: '可能造成損害的事件、情況或行為者', en: 'The event, condition or actor that could cause harm' }],
        [{ zh: '脆弱性 Vulnerability', en: 'Vulnerability' }, { zh: '讓威脅得以造成損害的弱點', en: 'The weakness that lets the threat cause harm' }],
        [{ zh: '影響 Impact', en: 'Impact' }, { zh: '事件發生後的損失程度', en: 'The size of the loss if the event occurs' }],
        [{ zh: '可能性 Likelihood', en: 'Likelihood' }, { zh: '在指定時段內發生的機會', en: 'The chance of it occurring within a stated period' }],
        [{ zh: '控制措施 Control', en: 'Control' }, { zh: '用以降低可能性或影響的措施', en: 'A measure that reduces likelihood or impact' }],
        [{ zh: '固有風險 Inherent risk', en: 'Inherent risk' }, { zh: '未計入控制措施前的風險水平', en: 'The level before controls are counted' }],
        [{ zh: '剩餘風險 Residual risk', en: 'Residual risk' }, { zh: '控制措施生效後仍然存在的風險', en: 'What remains after controls have done their work' }],
      ],
    },
    citations: [CITE.nistGlossaryRisk, CITE.iso31000, CITE.nist80030Page],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'equations',
    title: { zh: '風險公式與資產價值', en: 'The Risk Equations, and Asset Value' },
    standard: 'ISO/IEC 27005 · The Open Group O-RT',
    summary: {
      zh: '$\\text{風險} = \\text{可能性} \\times \\text{影響}$ 與 $\\text{風險} = \\text{威脅} \\times \\text{脆弱性} \\times \\text{資產價值}$ 是同一件事的兩種寫法，而不是可以相乘在一起的四個因子。',
      en: '$\\text{Risk} = \\text{Likelihood} \\times \\text{Impact}$ and $\\text{Risk} = \\text{Threat} \\times \\text{Vulnerability} \\times \\text{Asset Value}$ are two ways of writing the same thing — not four factors to multiply together.',
    },
    paragraphs: [
      {
        zh: '兩條公式的對應關係是：$$\\underbrace{\\text{威脅} \\times \\text{脆弱性}}_{\\text{可能性}} \\times \\underbrace{\\text{資產價值}}_{\\text{影響}}$$ 威脅 × 脆弱性就是可能性（損失事件發生的機會），資產價值就是影響（一旦發生會失去甚麼）。前者把可能性拆成「有人來攻擊的頻率」與「攻擊會得手的機會」；後者把它合併成一個數。粒度不同，說的是同一件事。',
        en: 'The two map onto each other: $$\\underbrace{\\text{Threat} \\times \\text{Vulnerability}}_{\\text{Likelihood}} \\times \\underbrace{\\text{Asset Value}}_{\\text{Impact}}$$ Threat × Vulnerability is Likelihood — the chance a loss event happens — and Asset Value is Impact, what you lose if it does. The first form splits likelihood into "how often something comes at you" and "how often it gets through"; the second collapses it into one number. Different granularity, same statement.',
      },
      {
        zh: '因此不要寫成 $\\text{風險} = \\text{可能性} \\times \\text{影響} \\times \\text{資產價值}$。影響本身已經是資產遭損失的量度；再乘一次資產價值，等於把同一件事計算兩次，高價值資產的分數會被系統性地放大。要麼用「可能性 × 影響」，要麼用「威脅 × 脆弱性 × 資產價值」，兩者擇一。',
        en: 'So do not write $\\text{Risk} = \\text{Likelihood} \\times \\text{Impact} \\times \\text{Asset Value}$. Impact already is the measure of loss to the asset; multiplying by asset value as well counts the same thing twice and systematically inflates anything valuable. Use Likelihood × Impact, or use Threat × Vulnerability × Asset Value — one or the other.',
      },
      {
        zh: '話雖如此，「教科書常常略過資產價值」這個批評是對的，而且重要。不知道甚麼東西受威脅，就無從判斷影響：同一場火災，燒毀的是備用文具櫃還是主要機房，風險完全不同。ISO/IEC 27005 把資產識別列為風險識別的起點，正是這個原因。資產價值不是額外的乘數，而是「影響」這個數字的來源 —— 略過它，評分就只是憑感覺。',
        en: 'That said, the complaint that textbooks skip asset value is right, and it matters. Without knowing what is exposed there is no basis for scoring impact: the same fire in a spare stationery cupboard and in the main server room are not the same risk. ISO/IEC 27005 makes asset identification the starting point of risk identification for exactly this reason. Asset value is not an extra multiplier — it is where the impact number comes from. Skip it and the score is just a feeling.',
      },
      {
        zh: '本工具處於哪個位置：「發生機率」是把威脅與脆弱性合併後的可能性；三個影響維度（人命、財產、業務）代表資產價值在不同方面的表現；「控制能力」則對應抵抗強度。本工具沒有獨立的資產清單 —— 這是一項實質限制：評分時請先明確寫下你心中所指的資產是甚麼，並把它記錄在評分理由欄，否則同一個分數在不同人心中可能指向不同的東西。',
        en: 'Where this tool sits: probability is likelihood with threat and vulnerability already merged; the three impact dimensions (life, asset, business) are asset value expressed along three axes; control capability corresponds to resistance strength. The tool has no separate asset register — a real limitation. Name the asset you have in mind before scoring and record it in the rationale box, or the same number will mean different things to different people.',
      },
      {
        zh: '最後一項常被遺漏的細節：可能性必須綁定一個時間窗。「高」本身沒有意義，「未來十二個月內發生的機會為高」才有。沒有時間窗，就無法與任何其他評估比較，也無法在事後檢驗判斷是否正確。',
        en: 'One more detail that is routinely dropped: likelihood needs a stated time window. "High" on its own means nothing; "high within the next twelve months" means something. Without a window the score cannot be compared with any other assessment, and it can never be checked against what actually happened.',
      },
    ],
    table: {
      headers: [
        { zh: '概念', en: 'Concept' },
        { zh: '經典資訊保安寫法', en: 'Classic infosec form' },
        { zh: 'FAIR 用語', en: 'FAIR term' },
        { zh: '本工具', en: 'In this tool' },
      ],
      rows: [
        [
          { zh: '可能性', en: 'Likelihood' },
          { zh: '威脅 × 脆弱性', en: 'Threat × Vulnerability' },
          { zh: '損失事件頻率', en: 'Loss Event Frequency' },
          { zh: '發生機率', en: 'Probability' },
        ],
        [
          { zh: '── 遇上的頻率', en: '── how often it comes at you' },
          { zh: '威脅', en: 'Threat' },
          { zh: '威脅事件頻率', en: 'Threat Event Frequency' },
          { zh: '（已合併）', en: '(merged in)' },
        ],
        [
          { zh: '── 得手的機會', en: '── how often it gets through' },
          { zh: '脆弱性', en: 'Vulnerability' },
          { zh: '脆弱性（抵抗強度）', en: 'Vulnerability (Resistance Strength)' },
          { zh: '控制能力', en: 'Control capability' },
        ],
        [
          { zh: '影響', en: 'Impact' },
          { zh: '資產價值', en: 'Asset Value' },
          { zh: '損失量級', en: 'Loss Magnitude' },
          { zh: '人命／財產／業務', en: 'Life / Asset / Business' },
        ],
      ],
    },
    citations: [CITE.iso27005_2022, CITE.openGroupRisk, CITE.fairLoss, CITE.nistGlossaryRisk],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'technical-risk',
    title: { zh: '從 CVE 到風險', en: 'From CVE to Risk' },
    standard: 'FIRST — CVSS v4.0 · EPSS',
    summary: {
      zh: '一個未修補的 sshd 是脆弱性；它面向互聯網還是隔離內網，是暴露程度。兩者都要計入，風險才成立。',
      en: 'An unpatched sshd is the vulnerability. Whether it faces the internet or an isolated LAN is exposure. Risk needs both.',
    },
    paragraphs: [
      {
        zh: '用一個具體例子把抽象詞語釘住。sshd 是 OpenSSH 的伺服器程式：一個長駐運作的服務，讓管理員經網絡登入並操控該台機器 —— 權限與坐在機器前面相差無幾。正因如此，它的漏洞份量不同於一般應用程式的漏洞：被攻破的不是其中一項功能，而是整台主機的大門。假設伺服器上跑著一個舊版 sshd，存在已公佈的漏洞 —— 這是脆弱性，是系統本身的弱點。如果這台伺服器只接在完全隔離的內部網絡上，能接觸到它的人極少；如果它直接暴露在互聯網，全球的掃描器每天都會碰它。弱點完全相同，風險相差幾個數量級 —— 差別在暴露程度。',
        en: 'Pin the abstract words to a concrete case. sshd is the OpenSSH server: a service that runs continuously and lets an administrator log in over the network and drive the machine, with much the same reach as sitting in front of it. That is why a flaw in it weighs differently from a flaw in an ordinary application — what gets breached is not one feature but the front door to the whole host. Say the server runs an old sshd with a published flaw: that is the vulnerability, a weakness in the system itself. If the server sits on a fully isolated internal network, very little can reach it; if it is exposed to the internet, scanners touch it daily. Identical weakness, risk differing by orders of magnitude — and the difference is exposure.',
      },
      {
        zh: '用語上值得精確一點：「面向互聯網還是隔離內網」嚴格來說是暴露程度（可達性），它決定的是威脅事件頻率 —— 有能力的攻擊者接觸到該資產的頻率。威脅本身指的是行為者或事件，暴露程度是他們有多容易碰到你。CVSS 把這一項正式命名為「攻擊向量」（Attack Vector），取值為 Network／Adjacent／Local／Physical，正正就是這個分別。',
        en: 'Worth being precise on terms: "internet-facing versus isolated LAN" is strictly exposure — reachability — and what it drives is threat event frequency, how often a capable attacker makes contact. The threat is the actor or event; exposure is how easily they reach you. CVSS names this formally as Attack Vector, valued Network / Adjacent / Local / Physical — exactly this distinction.',
      },
      {
        zh: 'CVSS v4.0 的四組指標，剛好對應風險的各個部分：基礎指標描述漏洞本身的性質（舊版 sshd 有多嚴重）；攻擊向量描述暴露程度；威脅指標組只有一項「漏洞利用成熟度」（Exploit Maturity），描述它是否正被實際利用；環境指標組的「機密性／完整性／可用性要求」（CR／IR／AR）則讓你按這項資產對你的價值調整分數 —— 這就是資產價值進入計算的地方。',
        en: "CVSS v4.0's four metric groups line up with the parts of risk: the Base metrics describe the flaw itself (how bad the old sshd is); Attack Vector describes exposure; the Threat group holds a single metric, Exploit Maturity, describing whether it is actually being exploited; and the Environmental group's Confidentiality / Integrity / Availability Requirements (CR / IR / AR) let you adjust for what this asset is worth to you — which is where asset value enters the calculation.",
      },
      {
        zh: '可能性那一側還有實證數據可用，不必全靠判斷。EPSS 由 FIRST 發佈，估算某個 CVE 在未來三十天內於真實環境被利用的機率；CISA 的「已知遭利用漏洞目錄」（KEV）則列出已確認正被利用的漏洞。一個同時出現在 KEV、EPSS 機率高、且攻擊向量為 Network 的漏洞，與一個只有理論利用可能、且只能本機觸發的漏洞，不應該排在同一優先次序。',
        en: 'The likelihood side has empirical data available, so it need not rest entirely on judgement. EPSS, published by FIRST, estimates the probability that a given CVE will be exploited in the wild within the next thirty days; CISA\'s Known Exploited Vulnerabilities catalog lists those confirmed to be under exploitation. A flaw that is in KEV, carries a high EPSS probability and has an Attack Vector of Network does not belong in the same queue as one that is theoretical and only locally triggerable.',
      },
      {
        zh: '一個必須說明的陷阱：「脆弱性」一詞有兩種互不相同的用法。在 CVE／CVSS 的世界裡，它指弱點本身（那個舊版 sshd）。在 FAIR 裡，它指的是「威脅事件演變成損失事件的機率」，由威脅能力與抵抗強度共同決定 —— 是一個百分比，不是一件東西。同時讀兩套材料的人，如果不知道這個分別，必然會混淆。',
        en: 'A trap worth naming: "vulnerability" carries two different meanings. In the CVE and CVSS world it is the weakness itself — that old sshd. In FAIR it is the probability that a threat event becomes a loss event, determined by threat capability against resistance strength — a percentage, not a thing. Anyone reading both without knowing this will end up confused.',
      },
      {
        zh: '最後，也是最常被誤用的一點：CVSS 基礎分數是嚴重性，不是風險。一個 9.8 分的漏洞出現在一台離線測試機上，可能遠不及一個 6.5 分的漏洞出現在付款閘道重要。把基礎分數直接當作修補優先次序，等於宣稱所有資產價值相同、所有暴露程度相同 —— 而這正是本節一開始要破除的假設。',
        en: 'Finally, the most commonly misused point: a CVSS Base score is severity, not risk. A 9.8 on an offline test box can matter far less than a 6.5 on the payment gateway. Treating base scores as a patch queue asserts that every asset is worth the same and every exposure is the same — which is the assumption this whole topic exists to break.',
      },
    ],
    table: {
      headers: [
        { zh: 'CVSS v4.0 指標組', en: 'CVSS v4.0 metric group' },
        { zh: '回答甚麼問題', en: 'Answers' },
        { zh: '對應風險的哪一部分', en: 'Part of risk' },
      ],
      rows: [
        [
          { zh: '基礎（Base）', en: 'Base' },
          { zh: '這個弱點本身有多嚴重？', en: 'How bad is the weakness itself?' },
          { zh: '脆弱性', en: 'Vulnerability' },
        ],
        [
          { zh: '攻擊向量（Attack Vector）', en: 'Attack Vector' },
          { zh: '從哪裡才碰得到它？', en: 'From where can it be reached?' },
          { zh: '暴露程度 → 威脅事件頻率', en: 'Exposure → threat event frequency' },
        ],
        [
          { zh: '威脅（Exploit Maturity）', en: 'Threat (Exploit Maturity)' },
          { zh: '現實中有人在用它嗎？', en: 'Is it actually being exploited?' },
          { zh: '威脅', en: 'Threat' },
        ],
        [
          { zh: '環境（CR／IR／AR）', en: 'Environmental (CR / IR / AR)' },
          { zh: '這項資產對我們有多重要？', en: 'How much does this asset matter to us?' },
          { zh: '資產價值 → 影響', en: 'Asset value → impact' },
        ],
      ],
    },
    citations: [CITE.cvss, CITE.epss, CITE.kev, CITE.fairWhat],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'process',
    title: { zh: '風險管理流程', en: 'The Risk Management Process' },
    standard: 'ISO 31000:2018 · ISO/IEC 27005:2022',
    summary: {
      zh: '風險登記冊是流程的產物，不是流程本身。填表之前，先確定範圍與準則。',
      en: 'A risk register is the output of a process, not the process itself. Scope and criteria come before the form.',
    },
    paragraphs: [
      {
        zh: 'ISO 31000:2018 第 6 章把流程分為：確立範圍、背景與準則（6.3）→ 風險評估，即識別、分析、評價（6.4）→ 風險處理（6.5）。另有三項貫穿全程的活動：溝通與諮詢（6.2）、監察與檢討（6.6），以及記錄與報告（6.7）。ISO/IEC 27005 把同一流程套用在資訊保安風險上。',
        en: 'Clause 6 of ISO 31000:2018 sets out: establish scope, context and criteria (6.3) → risk assessment, being identification, analysis and evaluation (6.4) → risk treatment (6.5). Three activities run alongside all of them: communication and consultation (6.2), monitoring and review (6.6), and recording and reporting (6.7). ISO/IEC 27005 applies the same process to information security risk.',
      },
      {
        zh: '最常被略過、而代價最高的一步，是第一步。「準則」是指你事先訂明甚麼算高風險、甚麼水平可以接受、由誰決定接受。若準則是在看過評分之後才訂立，那不是評價，而是把已有的結論合理化。',
        en: 'The step most often skipped, and the most expensive to skip, is the first one. Criteria means deciding in advance what counts as high, what level is acceptable, and who is entitled to accept it. Criteria set after the scores are in is not evaluation — it is justifying an answer you already have.',
      },
      {
        zh: '本工具覆蓋識別、分析與評價三步，並為每項風險保留「緩解策略」欄以記錄處理決定；評分理由欄與匯出檔則是 6.7 記錄與報告的一部分 —— 一份沒有記下判斷依據的登記冊，無法支撐任何事後覆核。範圍、準則與風險胃納屬於工具以外的管理決定。',
        en: 'This tool covers identification, analysis and evaluation, and keeps a mitigation column so the treatment decision is recorded against each risk; the rationale boxes and the exports are part of 6.7, recording and reporting — a register that does not record why is a register nobody can review afterwards. Scope, criteria and risk appetite are management decisions that live outside the tool.',
      },
    ],
    citations: [CITE.iso31000, CITE.iso27005_2022, CITE.iso27001],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'categories',
    title: { zh: '威脅分類（類別軸）', en: 'Threat Categories (the spine)' },
    standard: 'ISO/IEC 27005',
    summary: {
      zh: 'ISO/IEC 27005 的威脅類型是少數同時涵蓋實體損害與資訊侵害的公開目錄，因此成為本登記冊的分類骨幹。',
      en: "ISO/IEC 27005's threat types are one of the few published catalogues spanning both physical damage and compromise of information, which is why they form this register's spine.",
    },
    paragraphs: [
      {
        zh: '該目錄的分組包括：實體損害、自然事件、基本服務中斷、輻射干擾、資訊侵害、技術故障、未經授權的行動，以及功能損害。這種橫跨實體與資訊的覆蓋面正是關鍵 —— 一份既要記錄超強颱風、又要記錄勒索軟件的登記冊，需要一套能同時容納兩者的分類。',
        en: 'The groupings are: physical damage, natural events, loss of essential services, disturbance due to radiation, compromise of information, technical failures, unauthorised actions, and compromise of functions. That span is the point — a register that must hold a super typhoon and ransomware side by side needs a scheme with room for both.',
      },
      {
        zh: '版本差異值得留意：這份威脅例子清單以附錄 C（Examples of typical threats）的形式出現在 ISO/IEC 27005:2018；2022 年版重新編排，把相關材料併入附錄 A。若你翻開 2022 年版尋找附錄 C，會找不到。引用時應註明版本。',
        en: 'An edition note worth carrying: the list appears as Annex C (Examples of typical threats) in ISO/IEC 27005:2018. The 2022 edition restructures that material into Annex A. A student who opens the 2022 text looking for Annex C will not find it, so cite the edition you actually used.',
      },
      {
        zh: '本工具在該骨幹之上加入了四個類別 —— 人員與內部威脅、營運與流程、第三方與供應鏈、法律與合規 —— 因為單靠原目錄，人員風險與第三方風險沒有恰當的歸屬。任何擴充都應如此：說明你擴充了甚麼，以及為甚麼。',
        en: 'This tool adds four categories on top of that backbone — people and insider threat, operational and process, third party and supply chain, and legal and compliance — because the original list leaves people risk and third-party risk without a proper home. Any extension should work this way: say what you added, and why.',
      },
    ],
    table: {
      headers: [
        { zh: '本工具的類別', en: 'Category in this tool' },
        { zh: 'ISO/IEC 27005 對應', en: 'ISO/IEC 27005 lineage' },
      ],
      rows: [
        [{ zh: '自然及環境災害', en: 'Natural & Environmental Hazards' }, { zh: '自然事件', en: 'Natural events' }],
        [{ zh: '基礎設施與公用服務', en: 'Infrastructure & Utilities' }, { zh: '基本服務中斷', en: 'Loss of essential services' }],
        [{ zh: '實體保安與設施', en: 'Physical Security & Facility' }, { zh: '實體損害', en: 'Physical damage' }],
        [{ zh: '人員與內部威脅', en: 'People & Insider Threat' }, { zh: '本工具擴充', en: 'Added by this tool' }],
        [{ zh: '網絡攻擊', en: 'Cyber Attack' }, { zh: '未經授權的行動', en: 'Unauthorised actions' }],
        [{ zh: '資訊與數據保護', en: 'Information & Data Protection' }, { zh: '資訊侵害', en: 'Compromise of information' }],
        [{ zh: '技術與系統故障', en: 'Technology & System Failure' }, { zh: '技術故障、功能損害', en: 'Technical failures, compromise of functions' }],
        [{ zh: '營運與流程', en: 'Operational & Process' }, { zh: '本工具擴充', en: 'Added by this tool' }],
        [{ zh: '第三方與供應鏈', en: 'Third Party & Supply Chain' }, { zh: '本工具擴充', en: 'Added by this tool' }],
        [{ zh: '法律、監管與合規', en: 'Legal, Regulatory & Compliance' }, { zh: '本工具擴充', en: 'Added by this tool' }],
      ],
    },
    citations: [CITE.iso27005_2022, CITE.iso27001],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'sources',
    title: { zh: '威脅來源', en: 'Threat Sources' },
    standard: 'NIST SP 800-30 Rev. 1, Table D-2',
    summary: {
      zh: '對手會針對你的控制措施作出調整，硬碟不會。這個差別決定了你該用哪一類控制措施。',
      en: 'An adversary adapts to your controls. A hard drive does not. That difference decides which kind of control works.',
    },
    paragraphs: [
      {
        zh: 'NIST SP 800-30 Rev. 1 的表 D-2 把威脅來源分為四類：敵對（蓄意行為）、意外（無惡意的錯誤行為）、結構性（本機構自身的設備、軟件或環境控制失效）、環境。這是一條與類別軸互相獨立的軸線 —— 「火災」可以是意外，也可以是縱火。',
        en: 'NIST SP 800-30 Rev. 1, Table D-2 divides threat sources into four: Adversarial (deliberate acts), Accidental (erroneous action with no malicious intent), Structural (failure of the organisation\'s own equipment, software or environmental controls), and Environmental. It is an axis independent of the category — "fire" can be accidental or it can be arson.',
      },
      {
        zh: '「環境」一類比常見的理解要闊。表 D-2 除了自然或人為災害（火災、水災、風暴、地震等）之外，明確包括「基礎設施故障／中斷」，並列出電訊與電力供應。換言之，判準不是「災害」，而是「不在本機構控制範圍之內」：你自己的後備發電機故障屬結構性，供電網停電則屬環境。這個分別直接影響你該做甚麼 —— 前者靠維護，後者只能靠冗餘、備援安排與業務持續計劃。',
        en: 'The Environmental category is wider than it first reads. Beyond natural or man-made disaster (fire, flood, windstorm, earthquake), Table D-2 explicitly includes "Infrastructure Failure/Outage" and lists Telecommunications and Electrical Power beneath it. The criterion is not "disaster" but "outside the organisation\'s control": your own generator failing is Structural, the grid going down is Environmental. The distinction drives what you can actually do — maintenance for the first, redundancy, alternate arrangements and continuity planning for the second.',
      },
      {
        zh: '為甚麼要分？因為可用的控制手段不同。真正需要一個「行為者」才成立的是威懾 —— 硬碟不會因為你裝了閉路電視而改變行為。偵測與應變則對兩者同樣有效：硬碟健康監察、故障警報、自動切換與復原，正是針對結構性失效的偵測與應變控制。分別在於：對敵對來源，你要面對一個會觀察你的控制並繞過它的對手；對結構性與環境來源，失效模式不會反過來適應你。',
        en: 'Why separate them? Because the available controls differ. The one that genuinely needs an actor is deterrence — a disk does not change its behaviour because you installed CCTV. Detection and response work on both: disk-health monitoring, fault alarms, automatic failover and restoration are exactly detection and response applied to structural failure. The real difference is that an adversary observes your controls and works around them, while a failure mode does not adapt to you.',
      },
      {
        zh: '值得注意的是，NIST 本身容許按機構情況調整：表 D-2 的用法是「as tailored by the organization」。標準是起點，不是枷鎖 —— 但調整要說明。',
        en: 'Note that NIST expects the table to be adapted: Table D-2 is to be used "as tailored by the organization". A standard is a starting point, not a cage — provided you say what you changed.',
      },
    ],
    table: {
      headers: [
        { zh: '來源', en: 'Source' },
        { zh: '例子', en: 'Example' },
        { zh: '有效的控制思路', en: 'What actually works' },
      ],
      rows: [
        [{ zh: '敵對 Adversarial', en: 'Adversarial' }, { zh: '勒索軟件、入侵、內部人員舞弊', en: 'Ransomware, break-in, insider fraud' }, { zh: '威懾、偵測、應變、情報', en: 'Deterrence, detection, response, intelligence' }],
        [{ zh: '意外 Accidental', en: 'Accidental' }, { zh: '誤發電郵、組態錯誤', en: 'Misaddressed email, misconfiguration' }, { zh: '培訓、覆核、預設安全設計', en: 'Training, review, safe defaults' }],
        [{ zh: '結構性 Structural', en: 'Structural' }, { zh: '硬件故障、備份失效', en: 'Hardware failure, backup failure' }, { zh: '冗餘、維護、定期測試', en: 'Redundancy, maintenance, testing' }],
        [{ zh: '環境 Environmental', en: 'Environmental' }, { zh: '颱風、水浸、地震；電力及電訊中斷', en: 'Typhoon, flooding, earthquake; power and telecoms outage' }, { zh: '選址、冗餘與備援、業務持續計劃、保險', en: 'Siting, redundancy, continuity planning, insurance' }],
      ],
    },
    citations: [CITE.nist80030, CITE.nist80030Page],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ppt',
    title: { zh: '人員、流程、科技', en: 'People, Process, Technology' },
    standard: 'ISO/IEC 27002:2022',
    summary: {
      zh: '這一軸標示的是脆弱性所在與控制措施該落在哪裡，而不是威脅本身的構成。',
      en: 'This axis marks where the vulnerability sits and where the control must be applied — not what the threat is made of.',
    },
    paragraphs: [
      {
        zh: '「人員、流程、科技」是廣泛使用的管理視角，並非某一份標準的威脅分類。與它最接近的正式錨點是 ISO/IEC 27002:2022：該版本把 93 項控制措施重新編排為四大主題 —— 組織（37 項）、人員（8 項）、實體（14 項）、技術（34 項）。換言之，標準本身也認為控制措施必須橫跨這幾個面向。',
        en: 'People, Process, Technology is a widely used management lens rather than a published threat taxonomy. Its closest formal anchor is ISO/IEC 27002:2022, which reorganised its 93 controls into four themes — Organizational (37), People (8), Physical (14) and Technological (34). The standard itself takes the view that controls have to span these dimensions.',
      },
      {
        zh: '本工具允許一項威脅同時標記多個支柱，而這是刻意的。網絡釣魚同時屬於人員與科技：純技術方案（郵件過濾）擋不住全部，純人員方案（意識培訓）也擋不住全部。若強制單選，就會丟失通常決定緩解方向的那一半資訊。',
        en: 'This tool lets one threat carry more than one pillar, deliberately. Phishing is people and technology at once: a purely technical answer (mail filtering) does not stop all of it, and a purely human answer (awareness training) does not either. Forcing a single pillar throws away the half that usually decides the mitigation.',
      },
      {
        zh: '在課堂與實務上，這一軸最有用的地方是暴露失衡：若一份登記冊的緩解策略全部落在「科技」，通常代表流程與人員的風險根本沒有被識別，而不是它們不存在。',
        en: 'In practice the axis earns its place by exposing imbalance: if every mitigation in a register lands on Technology, that usually means the process and people risks were never identified, not that they are absent.',
      },
    ],
    citations: [CITE.iso27002, CITE.iso27001, CITE.nistCsf],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'stride',
    title: { zh: 'STRIDE 威脅建模', en: 'STRIDE Threat Modelling' },
    standard: 'Microsoft',
    summary: {
      zh: 'STRIDE 的六個類別各自對應一項被破壞的保安屬性 —— 這也是它只適用於資訊系統的原因。',
      en: 'Each of STRIDE\'s six classes maps to one security property being violated — which is also why it only applies to information systems.',
    },
    paragraphs: [
      {
        zh: 'STRIDE 由 Microsoft 提出，用於分析一個系統的資料流圖：對每一個元件與每一條資料流，逐一問「這裡可以被偽冒嗎？可以被竄改嗎？……」。它的價值在於系統化 —— 六個固定提示比自由聯想更難漏掉東西。要說明的是，這並不等於窮舉：六個提示能讓搜尋有條理，卻不保證涵蓋所有威脅。',
        en: 'STRIDE comes from Microsoft and is used against a system\'s data-flow diagram: for each element and each flow, you ask in turn "can this be spoofed? tampered with? …". Its value is that it is systematic — six fixed prompts miss less than free association does. It is worth saying plainly that this is not the same as exhaustive: the prompts make the search orderly, they do not guarantee coverage.',
      },
      {
        zh: '每一類都對應一項被破壞的保安屬性，這使 STRIDE 與經典的 CIA 三要素（機密性、完整性、可用性）銜接起來，並補上真確性、不可否認性與授權三項。',
        en: 'Each class maps onto a property being violated, which is what connects STRIDE to the classic CIA triad (confidentiality, integrity, availability) and extends it with authenticity, non-repudiation and authorization.',
      },
      {
        zh: '重要的限制：STRIDE 描述的是「對資訊系統做了甚麼」。超強颱風不是「偽冒身分」，供應商倒閉也不是「阻斷服務」。因此在本工具中，STRIDE 是可選的附加標籤，而非分類骨幹；自然災害、基礎設施與合規三個類別完全不使用它。把一套分類硬套在它描述不了的事物上，得出的結果整齊但沒有意義。',
        en: 'The limit matters: STRIDE describes things done to an information system. A super typhoon is not "Spoofing", and a vendor insolvency is not "Denial of Service". So in this tool STRIDE is an optional tag rather than the spine, and the natural, infrastructure and compliance categories do not use it at all. Stretching a scheme over things it cannot describe produces a classification that is tidy and meaningless.',
      },
    ],
    table: {
      headers: [
        { zh: 'STRIDE 類別', en: 'STRIDE' },
        { zh: '意思', en: 'Meaning' },
        { zh: '被破壞的屬性', en: 'Property violated' },
      ],
      rows: [
        [{ zh: 'S — 偽冒身分', en: 'S — Spoofing' }, { zh: '冒充他人或其他系統', en: 'Pretending to be someone or something else' }, { zh: '真確性', en: 'Authenticity' }],
        [{ zh: 'T — 竄改', en: 'T — Tampering' }, { zh: '未經授權修改資料或程式碼', en: 'Unauthorised modification of data or code' }, { zh: '完整性', en: 'Integrity' }],
        [{ zh: 'R — 否認', en: 'R — Repudiation' }, { zh: '否認曾作出某項行為且無從反證', en: 'Denying an action with no way to prove otherwise' }, { zh: '不可否認性', en: 'Non-repudiation' }],
        [{ zh: 'I — 資訊洩露', en: 'I — Information disclosure' }, { zh: '資訊落入無權查閱者手中', en: 'Information reaching those not entitled to it' }, { zh: '機密性', en: 'Confidentiality' }],
        [{ zh: 'D — 阻斷服務', en: 'D — Denial of service' }, { zh: '令服務無法提供', en: 'Making a service unavailable' }, { zh: '可用性', en: 'Availability' }],
        [{ zh: 'E — 權限提升', en: 'E — Elevation of privilege' }, { zh: '取得超出應有範圍的權限', en: 'Gaining rights beyond those granted' }, { zh: '授權控制', en: 'Authorization' }],
      ],
    },
    citations: [CITE.strideMs, CITE.strideSdl, CITE.owaspTm],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'fair',
    title: { zh: 'FAIR 與量化風險分析', en: 'FAIR and Quantitative Risk Analysis' },
    standard: 'The Open Group O-RA / O-RT',
    summary: {
      zh: 'FAIR 用金額與頻率表達風險。本工具用 1 至 5 的序數。兩者的結論不能互換。',
      en: 'FAIR expresses risk in money and frequency. This tool uses 1–5 ordinals. The two do not produce interchangeable conclusions.',
    },
    paragraphs: [
      {
        zh: 'FAIR（Factor Analysis of Information Risk）是 The Open Group 的量化風險分析標準。它把風險拆解為：風險 = 損失事件頻率 × 損失量級；而損失事件頻率 = 威脅事件頻率 × 脆弱性。各項因子以分布（而非單一數字）表達，再以模擬求出結果。',
        en: 'FAIR (Factor Analysis of Information Risk) is The Open Group\'s standard for quantitative risk analysis. It decomposes risk as: Risk = Loss Event Frequency × Loss Magnitude, where Loss Event Frequency = Threat Event Frequency × Vulnerability. The factors are expressed as distributions rather than single numbers and resolved by simulation.',
      },
      {
        zh: '損失量級再細分為六種損失形式：生產力、應變、重置、競爭優勢、罰款與判決、聲譽。這份清單本身就是很好的檢查表 —— 它會逼你問「除了修復成本，還會失去甚麼？」',
        en: 'Loss Magnitude is further split into six Forms of Loss: Productivity, Response, Replacement, Competitive Advantage, Fines & Judgements, and Reputation. That list is a useful checklist in its own right — it forces the question "besides the repair bill, what else is lost?"',
      },
      {
        zh: '必須說清楚：本工具並非 FAIR 的實作。它借用 FAIR 的詞彙與結構，但這只是鬆散的類比，不是因子對應：發生機率是一個等級，不是「每年若干次」的頻率；FAIR 的抵抗強度是針對特定威脅能力而言，而本工具的「內部／外部資源」是一個籠統的整體評估，可能同時影響事件頻率與損失量級。實際計算的，是 1 至 5 序數的乘積。序數不是頻率，序數的乘積也不是金額。把本工具的分數當作損失估算來引用，是一種過度解讀。',
        en: 'To be explicit: this tool is not an implementation of FAIR. It borrows FAIR\'s vocabulary and structure, but as loose analogy rather than factor correspondence: a probability band is not a frequency of events per year, and FAIR\'s Resistance Strength is defined against a specified threat capability, whereas "internal/external resources" here is one aggregate judgement that may bear on event frequency and loss magnitude alike. What it computes is a product of 1–5 ordinals. Ordinals are not frequencies, and their products are not currency. Quoting a score from this tool as a loss estimate is an overstatement.',
      },
      {
        zh: '順帶一提本工具的一項已知不足：現有三個影響維度（人命、財產、業務）並未覆蓋 FAIR 的「罰款與判決」及「聲譽」。對資訊保安風險而言這是實質缺口 —— 一宗《私隱條例》違規事件的損失，往往主要落在監管與聲譽上。',
        en: 'A known gap in this tool follows from that list: its three impact dimensions (life, asset, business) do not cover FAIR\'s Fines & Judgements or Reputation. For information security risk that is a real omission — the loss from a privacy breach often sits mostly in the regulatory and reputational columns.',
      },
    ],
    citations: [CITE.fairWhat, CITE.fairLoss, CITE.openGroupRisk],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'scoring',
    title: { zh: '本工具如何計分', en: 'How This Tool Scores' },
    summary: {
      zh: '分數用於排序，不代表量度。理解算式，才知道它能回答甚麼問題。',
      en: 'The scores rank; they do not measure. Knowing the arithmetic tells you which questions they can answer.',
    },
    paragraphs: [
      {
        zh: '$$\\text{固有風險} = (\\text{人命} + \\text{財產} + \\text{業務}) \\times \\text{發生機率}$$ 三個影響維度各為 1 至 5，合計 3 至 15；乘以 1 至 5 的機率，得出 3 至 75。',
        en: '$$\\text{Inherent} = (\\text{life} + \\text{asset} + \\text{business}) \\times \\text{probability}$$ The three impact dimensions are 1–5 each, so their sum runs 3–15; multiplied by a probability of 1–5, the result runs 3–75.',
      },
      {
        zh: '$$\\text{剩餘風險} = \\text{固有風險} \\times \\frac{C_{\\text{內}} + C_{\\text{外}} - 2}{8}$$ 控制能力以 1 = 強、5 = 弱評分，因此兩項皆為最強（1 + 1 = 2）時，因子為 0；兩項皆為最弱（5 + 5 = 10）時，因子為 1。風險等級門檻為：≤ 6 低、≤ 18 中、> 18 高。',
        en: '$$\\text{Residual} = \\text{Inherent} \\times \\frac{C_{\\text{int}} + C_{\\text{ext}} - 2}{8}$$ Control capability is scored 1 = strong, 5 = weak, so when both are strongest (1 + 1 = 2) the factor is 0, and when both are weakest (5 + 5 = 10) the factor is 1. The bands are: ≤ 6 low, ≤ 18 medium, > 18 high.',
      },
      {
        zh: '這裡有一個必須看見的簡化：當控制能力評為最強時，剩餘風險會變成 0。現實中沒有任何控制組合能把風險降至零 —— 剩餘風險永遠存在，只是小到可以接受。模型的這個下限是計算上的方便，不是對世界的描述。同理，序數相乘沒有真正的算術意義：分數 40 並不代表其危害是分數 20 的兩倍。',
        en: 'There is a simplification here that you should see: when control capability is scored strongest, residual risk becomes 0. No real set of controls reduces risk to zero — residual risk always remains, it merely becomes small enough to accept. That floor is a computational convenience, not a description of the world. In the same way, multiplying ordinals has no true arithmetic meaning: a score of 40 does not represent twice the harm of a score of 20.',
      },
      {
        zh: '那麼分數有甚麼用？用於分流與排序：在同一份登記冊、由同一批人以同一套準則評分的前提下，把注意力引導到最需要處理的項目。跨組織或跨時期比較分數，則需要先確認準則一致。',
        en: 'So what are the scores for? Triage and ranking: within one register, scored by one group against one set of criteria, they direct attention to what needs it most. Comparing scores across organisations or across time requires first checking that the criteria were the same.',
      },
    ],
    citations: [CITE.iso31000, CITE.nist80030Page, CITE.fairWhat],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'matrix',
    title: { zh: '風險矩陣及其限制', en: 'The Risk Matrix and Its Limits' },
    standard: 'Cox (2008)',
    summary: {
      zh: '風險矩陣溝通效果好，解析度卻低。知道它會在哪裡出錯，才用得安全。',
      en: 'Risk matrices communicate well and resolve poorly. Using one safely means knowing where it misleads.',
    },
    paragraphs: [
      {
        zh: '本工具的矩陣以發生機率為縱軸、三項影響的平均值（四捨五入）為橫軸，把每項威脅放入 5 × 5 的格子中。它的長處在於一眼可見的溝通效果：管理層能立即看出哪幾項落在右上角。',
        en: 'The matrix here puts probability on the vertical axis and the rounded mean of the three impacts on the horizontal, placing each threat in a 5 × 5 grid. Its strength is communication: a manager sees at a glance which items sit in the top-right corner.',
      },
      {
        zh: '其限制同樣真實，而且早有嚴謹的學術討論。Cox（2008）在《Risk Analysis》指出風險矩陣的幾個結構性問題：量級差異極大的風險可能落入同一格（範圍壓縮）；在某些情況下矩陣的排序甚至可能與實際風險相反；而格子的著色方式會直接左右結論，卻往往沒有明確理據。',
        en: 'The limits are equally real and have been examined rigorously. Cox (2008), in Risk Analysis, sets out several structural problems: risks differing by orders of magnitude can land in the same cell (range compression); in certain cases the matrix can rank pairs of risks the wrong way round; and how the cells are coloured drives the conclusion while rarely being justified.',
      },
      {
        zh: '要準確理解 Cox 的結論：他指出的不只是「不夠精確」，而是矩陣在某些情況下會把風險的先後次序排反，並因此把資源配置到錯誤的地方；共用同一套準則並不能消除這個結構性問題。因此，本課程繼續使用矩陣是一個教學上的取捨 —— 它易讀、易溝通 —— 而不是說該批評不成立。使用的條件是：把矩陣視為溝通與分流的工具，而不是量度工具；凡是會左右實際決定的排序，都必須另行覆核。當一項決定的代價足以令排序錯誤造成實質後果時，就應該改用量化方法（例如 FAIR），而不是把矩陣的格子再細分。',
        en: 'Read Cox\'s conclusion precisely: he documents not merely imprecision but ranking reversals, and resource allocation that follows them to the wrong place; shared criteria do not remove that structural problem. Continuing to use a matrix here is therefore a teaching trade-off — it is readable and it communicates — not a claim that the critique fails. The condition for using one is to treat it as an instrument for communication and triage rather than measurement, and to re-examine by hand any ranking that will drive a real decision. When a decision is costly enough that a mis-ranking would matter, move to a quantitative method such as FAIR rather than subdividing the cells.',
      },
      {
        zh: '本工具並排顯示兩個矩陣：左邊為固有風險（未計入控制措施），右邊為剩餘風險（計入之後）。兩個矩陣使用同一個格子底色，因此唯一移動的是威脅本身 —— 那正是這一對圖要展示的比較。',
        en: 'This tool shows two matrices side by side: inherent on the left, before controls are counted, and residual on the right, after. Both use the same cell shading, so the only thing that moves between them is the threat itself — which is the comparison the pair exists to make.',
      },
      {
        zh: '剩餘位置如何計算，值得說明清楚。位於 $(x, y)$ 的格子代表影響總和 $3x$ 與發生機率 $y$，其分數為 $3xy$；而剩餘風險 $= $ 固有風險 $\\times f$。因此把兩個座標軸各乘以 $\\sqrt{f}$，得 $$3\\left(x\\sqrt{f}\\right)\\left(y\\sqrt{f}\\right) = 3xy\\,f$$ 控制能力在本模型中只是一個整體強度，並未區分它是壓低發生機率還是減輕影響，因此把 f 平均分配到兩軸是唯一可用的做法；任何其他分配方式，都等於宣稱一項輸入從未記錄過的區別。',
        en: 'How the residual position is derived is worth stating plainly. A cell at $(x, y)$ stands for impact sum $3x$ against probability $y$, so it scores $3xy$; and residual risk is inherent $\\times f$. Scaling both axes by $\\sqrt{f}$ gives $$3\\left(x\\sqrt{f}\\right)\\left(y\\sqrt{f}\\right) = 3xy\\,f$$ Splitting f evenly across the two axes is the only option available: this model records control capability as a single strength and never says whether a control suppresses likelihood or softens impact. Any other split would assert a distinction the inputs never captured.',
      },
      {
        zh: '但那條等式只在連續值下成立。座標必須四捨五入到 5 × 5 的格子，於是格子底色與登記冊印出的風險等級並不總是一致 —— 把全部 15,625 種輸入組合逐一計算，約六分之一（16.2%）會落在等級不同的格子裡。這正是 Cox 所說的範圍壓縮：格子太粗，裝不下連續的分數。因此要記住：圓點本身的顏色永遠代表該威脅真正的風險等級，格子底色只是位置的屬性。有衝突時，以圓點為準。',
        en: 'That identity only holds in continuous values, though. The coordinates have to be rounded onto a 5 × 5 grid, so the cell tint and the level the register prints do not always agree — computing all 15,625 input combinations, about one in six (16.2%) lands in a cell shaded a different level. This is precisely Cox\'s range compression: the grid is too coarse to hold a continuous score. So read it this way: the dot\'s own colour always carries the threat\'s true level, while the cell tint is a property of the position. Where they disagree, the dot is right.',
      },
      {
        zh: '另外兩項限制。其一，當控制能力評為最強時，f = 0，剩餘位置會落在最左下角的格子 —— 這與計分方法一節提到的「剩餘風險歸零」是同一個簡化，現實中並不成立。其二，格子是離散的，四捨五入會令細微的控制改善看不出移動；沒有移動不等於沒有改善。',
        en: 'Two further limits. First, at the strongest control setting f is 0 and the residual position lands in the bottom-left cell — the same simplification noted under the scoring method, and not something that happens in reality. Second, the grid is discrete, so rounding can leave a small genuine improvement showing no movement at all. A dot that has not moved is not proof that nothing changed.',
      },
    ],
    citations: [CITE.cox2008, CITE.iso31000, CITE.fairWhat],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'treatment',
    title: { zh: '風險處理', en: 'Risk Treatment' },
    standard: 'ISO 31000:2018 · ISO/IEC 27005:2022',
    summary: {
      zh: '「緩解」只是四個選項之一。接受風險是正當的決定 —— 前提是有人有權作出並記錄在案。',
      en: 'Mitigation is one option of four. Accepting a risk is a legitimate decision — provided someone with the authority makes it, on the record.',
    },
    paragraphs: [
      {
        zh: '標準的處理選項通常歸納為四類：規避（不做該項活動）、降低／修改（施加控制措施）、分擔／轉移（保險、合約、外判）、保留／接受（在知情下承擔）。ISO 31000 亦包括「為追求機會而承擔風險」這一項。',
        en: 'Treatment options are usually grouped as four: avoid (do not undertake the activity), reduce or modify (apply controls), share or transfer (insurance, contracts, outsourcing), and retain or accept (carry it knowingly). ISO 31000 also includes taking on risk in order to pursue an opportunity.',
      },
      {
        zh: '兩點常見誤解值得指出。其一，轉移不等於消失：買了保險，聲譽損失與監管責任通常仍留在你身上。其二，接受不等於忽視 —— 有效的接受需要指明由誰接受、接受到甚麼水平、何時覆檢。沒有記錄的接受，實際上只是沒有人處理。',
        en: 'Two misconceptions are worth naming. First, transfer is not disappearance: buy insurance and the reputational loss and regulatory duty usually stay with you. Second, acceptance is not neglect — a real acceptance names who accepted it, at what level, and when it will be revisited. An acceptance nobody recorded is just nobody dealing with it.',
      },
      {
        zh: '在本工具中，登記冊的「緩解策略」欄是記錄該決定的位置。寫下所選的處理方式與負責人，比寫下一句籠統的「加強監控」有用得多。',
        en: 'In this tool the mitigation column of the register is where that decision is recorded. Naming the option chosen and who owns it is far more useful than a general sentence about strengthening monitoring.',
      },
    ],
    citations: [CITE.iso31000, CITE.iso27005_2022, CITE.iso22301],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'further',
    title: { zh: '延伸閱讀', en: 'Further Study' },
    summary: {
      zh: '以下資源按用途分組。標示為免費的可直接閱讀，ISO 標準則須購買。',
      en: 'Grouped by what they are for. Items marked free can be read directly; ISO standards must be purchased.',
    },
    paragraphs: [
      {
        zh: '管理體系與流程：ISO 31000 提供通用風險管理原則；ISO/IEC 27001 訂明資訊保安管理系統的要求，ISO/IEC 27002 提供對應的控制措施；ISO 22301 涵蓋業務持續管理。',
        en: 'Management systems and process: ISO 31000 gives general risk management principles; ISO/IEC 27001 sets the requirements for an information security management system and ISO/IEC 27002 supplies the matching controls; ISO 22301 covers business continuity.',
      },
      {
        zh: '控制措施目錄（免費）：NIST 網絡安全框架 2.0 提供高層次的成果導向結構；NIST SP 800-53 是詳盡的控制措施目錄；CIS Controls 則以優先次序見長，適合資源有限的機構入手。',
        en: 'Control catalogues (free): the NIST Cybersecurity Framework 2.0 gives a high-level outcome-oriented structure; NIST SP 800-53 is the detailed control catalogue; the CIS Controls are prioritised, which makes them a practical starting point for a resource-constrained organisation.',
      },
      {
        zh: '威脅情報與建模（免費）：MITRE ATT&CK 記錄真實對手的戰術與技術，可用於檢驗「網絡攻擊」一類條目是否過於籠統；OWASP 的威脅建模資料則適合配合 STRIDE 使用。事故應變方面可參考 NIST SP 800-61。',
        en: 'Threat intelligence and modelling (free): MITRE ATT&CK documents what real adversaries actually do, and is a good check on whether an entry like "cyber attack" is too coarse to act on; OWASP\'s threat modelling material pairs well with STRIDE. For incident response, see NIST SP 800-61.',
      },
      {
        zh: '香港本地：私隱專員公署的《個人資料（私隱）條例》資料與六項保障資料原則，是本地合規類風險的基礎；天文台的熱帶氣旋警告信號則是自然災害類條目在評估發生機率時的實際參考。',
        en: 'Hong Kong specifics: the Privacy Commissioner\'s material on the Personal Data (Privacy) Ordinance and the Six Data Protection Principles underpins the local compliance entries; the Observatory\'s Tropical Cyclone Warning Signals are the practical reference when scoring probability on the natural hazard entries.',
      },
    ],
    citations: [
      CITE.iso31000, CITE.iso27001, CITE.iso27002, CITE.iso22301,
      CITE.nistCsf, CITE.nist80053, CITE.nist80061, CITE.cis,
      CITE.attack, CITE.owaspTm,
      CITE.pdpo, CITE.pdpoDpp, CITE.hko,
    ],
  },
];

/** Topic ids, for deep-linking a chip or heading straight to the right explanation. */
export const LEARN_TOPIC_IDS = LEARN_TOPICS.map((topic) => topic.id);

export function getLearnTopic(id: string): LearnTopic | undefined {
  return LEARN_TOPICS.find((topic) => topic.id === id);
}
