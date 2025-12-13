# Risk Register Builder — Design Document

**Date:** 2025-12-13
**Status:** Validated

---

## Overview

A web-based tool for building risk registers based on TVRA (Threat, Vulnerability, Risk Assessment) methodology from the HKIOS ESM-L4 course.

## Core Formula

```
Inherent Threat = (人命安全 + 財產安全 + 業務運作) × 發生機率
Residual Risk = Inherent Threat × (Control Sum - 2) / 8
```

Where:
- Control Sum = 內部資源 + 外部資源
- Scale: 1-5 for all inputs
- Controls: 1=強(strong), 5=弱(weak)
- Impact/Probability: 1=低(low), 5=高(high)

**Risk Level Thresholds:**
- 低 (Low): 0-15
- 中 (Medium): 16-40
- 高 (High): 41-75

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js (App Router) |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Language | TypeScript |
| Data Persistence | localStorage |
| i18n | Custom (繁體中文 / English) |

**Export Libraries:**
- Excel: `exceljs`
- PDF: `@react-pdf/renderer`
- PPTX: `pptxgenjs`

---

## Features

### UI Modes
1. **Wizard Mode (default)** — Guided 4-step flow for first-time users
2. **Expert Mode** — Single page view for power users

### Wizard Steps
1. **Add Threats** — Select from categorized presets or add custom
2. **Score Threats** — Rate probability, impact, and controls
3. **Review Register** — View risk matrix + generated register
4. **Export** — Download as Excel, PDF, or PPTX

### Language Support
- Bilingual toggle: 繁體中文 / English
- All UI labels and exports support both languages

### Risk Matrix
- Interactive 5×5 heatmap
- Threats plotted as animated markers
- Click to filter by zone
- Hover for details

### Threat Presets
Categories:
- 自然災害 (Natural Disasters): 超強颱風, 風暴潮, 暴雨, 水浸
- 科技與設施 (Technical): 停電, 升降機故障, 火災, 氣體洩漏
- 保安與敵意 (Security): 社會動盪, 網絡攻擊, 獨狼攻擊, 入侵
- 自訂 (Custom): User-defined

---

## Data Model

```typescript
interface ThreatEntry {
  id: string;
  name: string;
  category: 'natural' | 'technical' | 'security' | 'custom';

  // Input scores (1-5)
  probability: number;
  impactLife: number;
  impactAsset: number;
  impactBusiness: number;
  controlInternal: number;  // 1=強, 5=弱
  controlExternal: number;  // 1=強, 5=弱

  // Risk register fields
  vulnerabilityDescription: string;
  mitigationStrategy: string;
}

interface RiskRegisterState {
  entries: ThreatEntry[];
  viewMode: 'wizard' | 'expert';
  language: 'zh-TW' | 'en';
  currentStep: number;
}
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn components
│   ├── wizard/
│   │   ├── StepIndicator.tsx
│   │   ├── Step1-AddThreats.tsx
│   │   ├── Step2-ScoreThreats.tsx
│   │   ├── Step3-ReviewRegister.tsx
│   │   └── Step4-Export.tsx
│   ├── expert/
│   │   └── SinglePageView.tsx
│   ├── risk-matrix/
│   │   ├── RiskMatrix.tsx
│   │   └── ThreatMarker.tsx
│   └── common/
│       ├── LanguageToggle.tsx
│       ├── ModeToggle.tsx
│       └── ExportButtons.tsx
├── lib/
│   ├── calculations.ts
│   ├── constants.ts
│   ├── i18n.ts
│   ├── storage.ts
│   └── export/
│       ├── excel.ts
│       ├── pdf.ts
│       └── pptx.ts
├── hooks/
│   ├── useRiskRegister.ts
│   └── useLocalStorage.ts
└── types/
    └── index.ts
```

---

## UI Specifications

### Scoring Interface

Rating scales displayed with endpoint labels only (no numbers):

**Probability & Impact:**
```
          低           高
          ○   ○   ○   ○   ○
```

**Controls (reversed direction):**
```
          弱           強
          ○   ○   ○   ○   ○
```

Internal mapping:
- 低/弱 (leftmost) = 1 for impact/probability, 5 for controls
- 高/強 (rightmost) = 5 for impact/probability, 1 for controls

### Risk Level Colors
- 高 (High): Red (`bg-red-500`)
- 中 (Medium): Yellow (`bg-yellow-500`)
- 低 (Low): Green (`bg-green-500`)

---

## Export Formats

### Excel (.xlsx)
- Sheet 1: 脆弱分析 (raw scores)
- Sheet 2: 風險登記冊 (register output)

### PDF
- Cover page with title + date
- Risk matrix visualization
- Summary statistics
- Full risk register table

### PPTX
- Matches HKIOS course template format
- Slide 1: Title
- Slide 2: 脆弱分析 table
- Slide 3: 風險登記冊 table

---

## Implementation Notes

1. **Calculations are derived, not stored** — Risk level computed on render
2. **localStorage persistence** — Auto-save on every change
3. **Animations** — Use Framer Motion for matrix marker placement
4. **Responsive** — Mobile-friendly wizard, desktop-optimized expert mode
