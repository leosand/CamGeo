# CamGeo Governance

This document defines how the CamGeo project is run: roles, decision-making, and conflict resolution. It is written to be **collegial and mostly horizontal**: everyone can propose, discuss and contribute — but a small structure exists so that decisions actually get made and the project stays coherent.

## 1. Mission

Produce open, well-documented, AI-ready geospatial data for Cameroon, using open methods, free data sources, and local expertise.

## 2. Values

1. **Open by default** — code, data, methods and decisions are public unless there is a strong reason (privacy, security, sensitive ecological data).
2. **Collegiality** — decisions are made together, after open discussion. No single person owns the project.
3. **Evidence over opinion** — methodological choices are justified by data, tests, or cited references.
4. **Local relevance** — Cameroonian knowledge (field experts, universities, NGOs) has a central voice, not a decorative one.
5. **Kindness and rigor** — we challenge ideas, never people (see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)).

## 3. Roles

### 3.1 Contributor
Anyone who contributes in any form: code, map validation, documentation, translation, local knowledge, issue reports. No application needed — just contribute.

### 3.2 Maintainer
A contributor with sustained, high-quality activity who takes responsibility for a part of the project (a working group, a repository area, a data product).

**How to become a maintainer:**
- At least 3 months of activity, **and**
- At least 5 merged pull requests *or* an equivalent body of non-code work (e.g. 50+ validated training samples, a full documentation section), **and**
- Nominated by an existing maintainer, approved by lazy consensus (see §5) of the relevant working group.

Maintainers who are inactive for 6+ months move to "emeritus" status (honorary, no obligations, can return at any time).

### 3.3 Working Groups (WGs)
Small teams (ideally 3–8 people) that own a domain. Initial working groups:

| Working group | Owns |
|---|---|
| **Data & Sensors** | Satellite data sources, mosaics, catalogues, storage formats |
| **Methods & ML** | Classification algorithms, features, benchmarks, model evaluation |
| **Validation & Local Knowledge** | Training samples, field validation, accuracy reports, partner network |
| **Community & Outreach** | Documentation, onboarding, translation (EN/FR), partnerships, communication |

Each WG has at least one maintainer as **coordinator**. The coordinator is a facilitator, not a boss: they keep discussions moving and make sure decisions are written down.

### 3.4 Steering Committee (SC)
A small group (3 to 5 people) that handles **only** cross-cutting or contested matters:
- Approving major releases (new data collections)
- Changes to licences, governance, or project scope
- Money, partnerships, and legal questions
- Resolving conflicts that WGs could not resolve

**Composition:** initially the project founder plus early maintainers. Once the project has 5+ active maintainers, SC members are **elected by maintainers for 1-year terms**. The SC elects a rotating **chair** (tie-breaking voice only, no veto). SC discussions and votes are minuted and published in the repository.

## 4. "Horizontal, but not too much" — what this means in practice

- **Anyone can open an issue or a proposal.** You do not need permission or a title.
- **WGs decide in their own domain.** The Methods WG decides how the classifier works; the SC does not override technical choices unless they affect the whole project.
- **The SC is a referee, not a command chain.** It intervenes when a decision crosses WG boundaries, when consensus fails, or when legal/financial risk exists.
- **Everything is written down.** Decisions live in issues, pull requests, or the decision log (`docs/decisions/`), so the "why" is never lost.

## 5. Decision-making

| Level | Type of decision | Process |
|---|---|---|
| **1 — Everyday** | Small fixes, typos, minor code changes | Pull request + one maintainer review. No discussion needed. |
| **2 — Standard** | New features, new scripts, doc changes | Pull request + review by the relevant WG. **Lazy consensus**: if nobody objects within 72 hours, it passes. |
| **3 — Significant** | Methodology changes, new data sources, changes to the class legend, accuracy targets | **RFC** (request for comments): open an issue using the RFC template. Discussion open for at least 7 days. Lazy consensus of the relevant WG; if objections remain unresolved, escalate to Level 4. |
| **4 — Major** | Releases, licence changes, governance changes, budget, formal partnerships | SC vote after public discussion. Simple majority. Minimum 7-day window. Votes and rationale published. |

**Lazy consensus** means: silence = agreement. It keeps the project moving without endless meetings, while anyone can still block a bad idea simply by speaking up with reasons.

## 6. Meetings and rhythm

- **Async first**: most work happens in issues and pull requests, so people in any time zone can take part.
- **Monthly open community call** (1 hour, optional): progress, demos, questions. Notes published in the repository.
- **WGs self-organize** their own calls if they want them.
- **Release review**: before each data collection release, the Validation WG presents accuracy results in a public issue.

## 7. Conflict resolution

1. Discuss in the relevant issue or pull request, assuming good faith.
2. If stuck, ask the WG coordinator to facilitate.
3. If still stuck, escalate to the SC, which hears both sides and decides by vote.
4. Conduct violations are handled under [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), not through technical debate.

## 8. Changing this document

Governance changes are Level 4 decisions: RFC open for at least 14 days, then SC vote with a published rationale.

---

*Version 0.1 — Drafted August 2026. This is a living document.*
