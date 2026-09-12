/**
 * Risk taxonomy.
 *
 * Four orthogonal axes, each borrowed from a published standard rather than invented:
 *
 *  1. ThreatCategory — the domain spine. Aligned to the ISO/IEC 27005 threat-type
 *     groupings (physical damage, natural events, loss of essential services,
 *     compromise of information, technical failures, unauthorised actions,
 *     compromise of functions), widened to cover people, third-party and
 *     regulatory risk so one register can hold both a typhoon and a ransomware event.
 *     The list is Annex C of ISO/IEC 27005:2018; the 2022 edition moves it to Annex A.
 *  2. ThreatSource — NIST SP 800-30 Rev. 1, Table D-2 (Taxonomy of Threat Sources).
 *  3. PptPillar — the People / Process / Technology triad. Multi-valued: phishing
 *     is people AND technology, and pretending otherwise loses information.
 *  4. StrideClass — Microsoft STRIDE. Only meaningful for information-system
 *     threats, so it is optional and absent on natural/physical entries.
 *
 * See docs/taxonomy.md for why STRIDE is a tag and not the spine, and why the
 * scoring model is FAIR-informed but is NOT an implementation of FAIR.
 */

/** Axis 1 — domain category. The spine of the register. */
export type ThreatCategory =
  | 'natural'         // ISO 27005: natural events
  | 'infrastructure'  // ISO 27005: loss of essential services
  | 'physical'        // ISO 27005: physical damage + hostile physical acts
  | 'personnel'       // People and insider threat
  | 'cyber'           // ISO 27005: unauthorised actions (adversarial, network-borne)
  | 'information'     // ISO 27005: compromise of information
  | 'technology'      // ISO 27005: technical failures / compromise of functions
  | 'operational'     // Process and business-continuity failure
  | 'supplychain'     // Third-party, vendor and supply-chain risk
  | 'compliance'      // Legal, regulatory and contractual exposure
  | 'custom';

/** Axis 2 — NIST SP 800-30 Rev. 1 Table D-2 threat source. */
export type ThreatSource =
  | 'adversarial'    // Deliberate act by an individual, group or organisation
  | 'accidental'     // Erroneous action taken without malicious intent
  | 'structural'     // Equipment, software or environmental-control failure
  | 'environmental'; // Natural or man-made disaster outside the organisation

/** Axis 3 — People / Process / Technology. Where the vulnerability and the control live. */
export type PptPillar = 'people' | 'process' | 'technology';

/** Axis 4 — Microsoft STRIDE. Optional; only applied to information-system threats. */
export type StrideClass =
  | 'spoofing'
  | 'tampering'
  | 'repudiation'
  | 'infoDisclosure'
  | 'dos'
  | 'elevation';

/** Security property a STRIDE class violates. Derived from STRIDE, never stored. */
export type SecurityProperty =
  | 'authenticity'
  | 'integrity'
  | 'nonRepudiation'
  | 'confidentiality'
  | 'availability'
  | 'authorization';

export type RiskLevel = 'low' | 'medium' | 'high';

export type Language = 'zh-TW' | 'en';

/** The six scored judgements. Each one can carry the reasoning behind it. */
export type RatingKey =
  | 'probability'
  | 'impactLife'
  | 'impactAsset'
  | 'impactBusiness'
  | 'controlInternal'
  | 'controlExternal';

export const RATING_KEYS: RatingKey[] = [
  'probability',
  'impactLife',
  'impactAsset',
  'impactBusiness',
  'controlInternal',
  'controlExternal',
];

/**
 * Why each score was chosen.
 *
 * A number with no reasoning behind it cannot be reviewed, challenged or defended
 * six months later, which is most of what a risk register is for. Stored sparsely:
 * an unwritten rationale is absent rather than an empty string, which keeps share
 * links short.
 */
export type Rationale = Partial<Record<RatingKey, string>>;

export interface ThreatEntry {
  id: string;
  name: string;
  nameEn?: string;
  category: ThreatCategory;

  // Taxonomy tags. Optional so that share links created before the taxonomy
  // existed still decode; migrateEntry() backfills them where the id is known.
  source?: ThreatSource;
  pillars?: PptPillar[];
  stride?: StrideClass[];

  // Input scores (1-5)
  probability: number;           // 發生機率: 1=低, 5=高
  impactLife: number;            // 人命安全: 1=低, 5=高
  impactAsset: number;           // 財產安全: 1=低, 5=高
  impactBusiness: number;        // 業務運作: 1=低, 5=高
  controlInternal: number;       // 內部資源: 1=強, 5=弱
  controlExternal: number;       // 外部資源: 1=強, 5=弱

  // The reasoning behind each of the six scores above.
  rationale?: Rationale;

  // Risk register fields
  mitigationStrategy: string;        // 緩解策略
}

export interface ThreatPreset {
  id: string;
  nameZh: string;
  nameEn: string;
  category: ThreatCategory;
  source: ThreatSource;
  pillars: PptPillar[];
  stride?: StrideClass[];
}

export interface RiskRegisterState {
  entries: ThreatEntry[];
  language: Language;
}

export interface RiskRegisterActions {
  addEntry: (entry: ThreatEntry) => void;
  updateEntry: (id: string, updates: Partial<ThreatEntry>) => void;
  removeEntry: (id: string) => void;
  setLanguage: (lang: Language) => void;
  hydrateEntries: (entries: ThreatEntry[]) => void;
  reset: () => void;
}

export type RiskRegisterStore = RiskRegisterState & RiskRegisterActions;
