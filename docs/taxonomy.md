# Risk Taxonomy

## Summary

The register classifies each threat on **four orthogonal axes**, each taken from a
published standard rather than invented here:

| Axis | Source | Values | Required |
|---|---|---|---|
| **Category** | ISO/IEC 27005 threat types, widened | 10 domains + `custom` | yes |
| **Threat source** | NIST SP 800-30 Rev. 1, Table D-2 | Adversarial, Accidental, Structural, Environmental | on presets |
| **People / Process / Technology** | classic PPT triad | multi-valued | on presets |
| **STRIDE** | Microsoft (Garg & Kohnfelder) | S, T, R, I, D, E | information-system threats only |

The scoring model is unchanged: a 1–5 ordinal screen, not a quantitative analysis.

## Why STRIDE is a tag and not the spine

STRIDE is a threat-modelling mnemonic for a **software system's data-flow diagram**.
Its six classes describe things that can be done *to an information system*, and each
maps cleanly onto a security property:

| STRIDE | Property violated |
|---|---|
| Spoofing | Authenticity |
| Tampering | Integrity |
| Repudiation | Non-repudiation |
| Information disclosure | Confidentiality |
| Denial of service | Availability |
| Elevation of privilege | Authorization |

That is exactly why it cannot be the register's spine. This register has to hold a
super typhoon, an elevator failure, a strike and a vendor insolvency alongside
ransomware. None of those is a "Spoofing" — and forcing them into a STRIDE bucket
would produce a classification that is tidy and meaningless.

So STRIDE is applied as an **optional per-entry lens**, and
`STRIDE_INAPPLICABLE_CATEGORIES` names the three categories (`natural`,
`infrastructure`, `compliance`) where a STRIDE tag would be a category error. A test
enforces it — if someone tags a typhoon with `dos`, the suite goes red.

## Why the scoring is FAIR-informed but is not FAIR

FAIR (Factor Analysis of Information Risk; The Open Group O-RA/O-RT) is a
**quantitative** ontology. It decomposes:

```
Risk = Loss Event Frequency × Loss Magnitude
Loss Event Frequency = Threat Event Frequency × Vulnerability
```

and expresses those as frequency distributions and monetary loss, resolved by
simulation. Loss Magnitude is bucketed into six **Forms of Loss**: Productivity,
Response, Replacement, Competitive Advantage, Fines & Judgements, Reputation.

This tool multiplies 1–5 ordinals. Ordinals are not frequencies and their products
are not dollars. **Calling this "a FAIR implementation" would be an overstatement**,
so the code and the exported footnote say "FAIR-informed ordinal screening" instead.

What FAIR *is* good for here is vocabulary, and the existing model already lines up
with it:

| This tool | FAIR factor |
|---|---|
| `probability` | Threat Event Frequency |
| `controlInternal` / `controlExternal` | Resistance Strength — the input to FAIR's "Vulnerability" |
| `impactLife` / `impactAsset` / `impactBusiness` | Loss Magnitude (three of the six forms) |

### Known gap, deliberately not closed

Mapping the impact dimensions against FAIR's six Forms of Loss shows the register
captures **Productivity, Replacement and (partly) Response** and captures **neither
Fines & Judgements nor Reputation**. For an information-security register that is a
real omission: a PDPO or GDPR breach is often mostly regulatory and reputational
loss, and this model scores it near zero on those.

Closing it means adding impact dimensions, which changes `calculateImpactSum`, the
risk-matrix position and the exported course-template layout. That is a scoring
change rather than a taxonomy change, so it is recorded here and left alone.

## The category spine

Ten domains, ordered as they appear in the UI. ISO/IEC 27005's threat-type groupings
supply the backbone; personnel, supply-chain and compliance widen it so that people,
process and third-party risk have a home.

| Category | ISO 27005 lineage | Typical source |
|---|---|---|
| `natural` — Natural & Environmental Hazards | Natural events | Environmental |
| `infrastructure` — Infrastructure & Utilities | Loss of essential services | Structural |
| `physical` — Physical Security & Facility | Physical damage | Adversarial / Accidental |
| `personnel` — People & Insider Threat | (widened) | Adversarial / Accidental |
| `cyber` — Cyber Attack | Unauthorised actions | Adversarial |
| `information` — Information & Data Protection | Compromise of information | Adversarial / Accidental |
| `technology` — Technology & System Failure | Technical failures, compromise of functions | Structural |
| `operational` — Operational & Process | (widened) | Structural |
| `supplychain` — Third Party & Supply Chain | (widened) | Structural / Adversarial |
| `compliance` — Legal, Regulatory & Compliance | (widened) | Structural / Accidental |

`custom` exists for user-authored threats and never appears in the preset picker.

## On the People / Process / Technology axis

PPT is normally a *control* triad, not a threat triad, and this axis keeps that
meaning: it marks **where the vulnerability sits and where the control must be
applied**, not what the threat is made of.

It is deliberately **multi-valued**. Phishing is people *and* technology; a failed
change is process *and* technology. Forcing a single pillar would throw away the
part that usually decides the mitigation.

## Migration of pre-existing share links

Share links encode entries into the URL, so links issued against the old
three-category model (`natural` / `technical` / `security`) are already in the wild.
`migrateEntry` brings them forward on **every** decode.

It keys on **preset id, not category**. The old `technical` bucket held both
`power-outage` (now `infrastructure`) and `fire` (now `physical`); a category→category
table would collapse them into one bucket and mis-file the link with no error
raised. `LEGACY_CATEGORY_FALLBACK` is used only when the id is unknown — a
user-authored threat — and in that case source and pillars are left **undefined**
rather than guessed.

Tags the entry already carries are never overwritten, so a user who reclassified
`fire` as arson keeps that judgement.

## References

- ISO/IEC 27005:2022 — *Information security, cybersecurity and privacy protection —
  Guidance on managing information security risks*.
  <https://www.iso.org/standard/80585.html>
- NIST SP 800-30 Rev. 1 — *Guide for Conducting Risk Assessments*, Table D-2,
  Taxonomy of Threat Sources.
  <https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30r1.pdf>
- Microsoft — STRIDE, *Threat Modeling Tool threats*.
  <https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats>
- The Open Group — *Risk Taxonomy (O-RT)* and *Risk Analysis (O-RA)*.
  <https://pubs.opengroup.org/onlinepubs/9699919899/toc.pdf>
- FAIR Institute — *What Is Loss Magnitude?* (the six Forms of Loss).
  <https://www.fairinstitute.org/blog/fair-risk-basics-what-is-loss-magnitude>
