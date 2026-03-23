# Netlify App Gap Report — empleo-ai.netlify.app vs Production (v29a/v14)

**Date:** 2026-03-23
**Compared:** empleo-ai.netlify.app (Netlify) vs alvarodenicolas.com/interactive/empleos-ia/index.html (Production)
**Verdict:** The Netlify app is running a pre-v14, pre-Prompt 1+2 codebase. It needs **both Lovable prompts deployed in full** plus a data source update to v14. Essentially every change documented in Status Updates 8–10 is missing.

---

## SEVERITY LEGEND

- 🔴 **CRITICAL** — Wrong data displayed to users (stale pre-v14 numbers)
- 🟠 **SIGNIFICANT** — Missing UI/disclosure features from Prompts 1+2
- 🟡 **MODERATE** — Terminology violations (exposición → vulnerabilidad)
- 🔵 **MINOR** — Version references, cosmetic alignment

---

## 1. KPI RIBBON — STALE DATA (🔴 CRITICAL)

| KPI Card | Netlify (WRONG) | Production (CORRECT) | Fix |
|----------|-----------------|---------------------|-----|
| Empleos | **22.463.300** / 22.5M | **22.732.223** / 22.7M | Update data source to v14 (+268,923 from admin-override) |
| Alta exposición/vulnerabilidad | **12.5%** / 2,810,573 | **12.1%** / 2,752,961 | Update data source to v14 |
| Wage index | **257.1B €** | **252.8B €** | Update data source to v14 |
| Sensitivity table base | 257.1B €, 12.5% | 252.8B €, 12.1% | Update data source to v14 |
| Sensitivity −20% | 308.5B € | 303.4B € | Recalculate with v14 |
| Sensitivity +20% | 205.6B € | 202.3B € | Recalculate with v14 |

**Root cause:** The Netlify app is still running v13 data (pre-admin-override for 5 CNO group 59 occupations). Needs v14 dataset.

---

## 2. KPI RIBBON — MISSING LABELS & MICROCOPY (🟠 SIGNIFICANT)

| Element | Netlify | Production | Fix |
|---------|---------|------------|-----|
| Wage KPI title | "ÍNDICE MASA SALARIAL × EXPOSICIÓN" | "Índice teórico de concentración salarial" | Rename per Prompt 1 §A |
| Wage KPI subtitle | "Empleo × Salario × (Score/10)" only | **"Indicador teórico — no euros en riesgo"** + formula | Add subtitle per Prompt 1 §A |
| Empleos microcopy | None | "Estimación ocupacional modelizada, no dato observado a 4 dígitos." | Add per Prompt 1 §A |
| Vulnerabilidad media microcopy | None | "Estimación interpretativa, no medición exacta." | Add per Prompt 1 §A |
| Alta vulnerabilidad microcopy | None | "Umbral orientativo; banda de sensibilidad: 11,7%–15,2%." | Add per Prompt 1 §A |
| Wage KPI info tooltip | Missing | Full explanation of concentration index | Add per Prompt 1 §A |
| Score label "Bajo" | Shows "Bajo" | Shows "Baja" (feminine form) | Fix gender agreement |

---

## 3. INTERPRETATION STRIP — ENTIRELY MISSING (🟠 SIGNIFICANT)

Production has 3 caveat chips between KPI ribbon and treemap:
1. **"Vulnerabilidad teórica ≠ desplazamiento real"** (with tooltip)
2. **"Empleo 4 dígitos = estimación"** (with tooltip)
3. **"EU AI Act = contexto regulatorio, no riesgo laboral"** (with tooltip)

Netlify: **None of these exist.** Deploy Prompt 1 §B in full.

---

## 4. DETAIL PANEL — MISSING SECTIONS (🟠 SIGNIFICANT)

Clicking an occupation on Netlify shows a minimal panel. Production has 5 structured blocks. Here's what's missing:

| Block | Netlify | Production | Fix |
|-------|---------|------------|-----|
| Score label | "Exposición Bajo" | "Vulnerabilidad [level]" + "Vulnerabilidad teórica, no desplazamiento automático" | Prompt 1 §C.1 |
| Wage label in panel | "ÍNDICE MASA SALARIAL × EXPOSICIÓN" | "Índice teórico conc. salarial" + "Indicador teórico — no euros en riesgo" | Prompt 1 §C.1 |
| **D/C/F/R sub-components** | **Entirely missing** | Full horizontal bar chart with D/C/F/R values + scoring method label | Deploy Prompt 1 §C.2 |
| **Contexto regulatorio** | EU AI Act badge mixed with tipo_impacto in same line | Separate "Contexto regulatorio" section with explainer "Proxy regulatorio de contexto de uso, no dictamen legal." | Deploy Prompt 1 §C.3 |
| **Calidad de la estimación** | **Entirely missing** | employment_confidence tier (A+/A/B) with colored badge + explanation | Deploy Prompt 1 §C.4 |
| **Interpretación rápida** | **Entirely missing** | Plain-language interpretation block with sober analytical tone | Deploy Prompt 1 §C.5 |
| Sustitución semantics | Shows raw "Aumentación"/"Sustitución" | "Sustitución parcial de tareas" with helper text for sub-7 scores | Deploy Prompt 1 §C.5 |

---

## 5. DISCLOSURE LAYERS — ENTIRELY MISSING (🟠 SIGNIFICANT)

Production has the full 3-level caveat system from Prompt 2. Netlify has **none of it**:

| Feature | Netlify | Production | Fix |
|---------|---------|------------|-----|
| **"Cómo leer este mapa"** | Does not exist | Expandable accordion with 6 reader-first bullets | Deploy Prompt 2 §B |
| **"Metodología y limitaciones"** | Does not exist | Full 7-section disclosure panel (Qué mide, Qué NO mide, Empleo, Salarios, Puntuaciones, EU AI Act, Fuentes) | Deploy Prompt 2 §C |

---

## 6. TERMINOLOGY — "EXPOSICIÓN" vs "VULNERABILIDAD" (🟡 MODERATE)

The Netlify app still uses "exposición" throughout. Every instance needs replacement per CLAUDE.md rule.

| Location | Netlify (WRONG) | Production (CORRECT) |
|----------|-----------------|---------------------|
| Subtitle | "según su grado de **exposición** a la IA" | "según su grado de **vulnerabilidad** a la IA" |
| KPI header | "**EXPOSICIÓN** MEDIA PONDERADA" | "**Vulnerabilidad** media ponderada" |
| KPI header | "ALTA **EXPOSICIÓN** ≥7" | "Alta **vulnerabilidad** ≥7" |
| KPI header | "ÍNDICE MASA SALARIAL × **EXPOSICIÓN**" | "Índice teórico de concentración salarial" |
| Filter slider | "EXP." | "Vuln." |
| Histogram title | "Distribución de ocupaciones por nivel de **exposición**" | "...por nivel de **vulnerabilidad**" |
| Histogram labels | "← BAJA **EXPOSICIÓN**" / "ALTA **EXPOSICIÓN** →" | "← Baja **vulnerabilidad**" / "Alta **vulnerabilidad** →" |
| Detail panel score | "**Exposición** Bajo" | "**Vulnerabilidad** [level]" |
| Detail panel wage | "ÍNDICE MASA SALARIAL × **EXPOSICIÓN**" | "Índice teórico conc. salarial" |
| Footer methodology | "Puntuaciones de **exposición** IA" | "vulnerabilidad" |
| Footer wage index | "Índice masa salarial × **exposición**" | "Índice teórico de concentración salarial" |
| Footer note | "**exposición** teórica, no desplazamiento" | "**vulnerabilidad** teórica" (except theory-practice gap caveat) |
| Sensitivity table | "Alta exp. (≥7)" / "Índice masa sal." | "Alta vuln. (≥7)" / "Índice conc. sal." |
| Sensitivity scenarios | "(más/menos exposición)" | "(más/menos vulnerabilidad)" |
| Meta tags (og:description) | Contains "exposición" | Should use "vulnerabilidad" |

---

## 7. VERSION REFERENCES — STALE (🔵 MINOR but visible)

| Location | Netlify (WRONG) | Production (CORRECT) | Target |
|----------|-----------------|---------------------|--------|
| Histogram link | **"Metodología V23 (PDF)"** | "Zenodo V28 (DOI)" | v28 (or v29a after Zenodo upload) |
| Footer methodology link | **"Metodología completa (44 notas técnicas)"** | "Metodología completa (56 notas técnicas)" | 56 notes |
| Footer byline | **"Metodología V23"** | "Metodología v28" | v28 (or v29a) |
| Footer body | "22,46M ocupados" | "22,73M" | v14 data |
| Footer body | References stale calibration factors text | Updated text per Prompt 1 §E | Full rewrite |
| Sensitivity table header text | Old wording | Updated per production | Align |

---

## 8. FOOTER METHODOLOGY TEXT — NEEDS FULL REWRITE (🟠 SIGNIFICANT)

The entire footer methodology block on Netlify is stale (references V23, 22.46M, 44 notes, exposición terminology). Production has a completely rewritten footer per Prompt 1 §E with:
- v14 numbers (22,73M)
- 56 notas técnicas
- v28 methodology reference
- "vulnerabilidad" terminology
- Updated Zenodo DOI link
- Updated byline: "Metodología v28 · 56 notas técnicas · Validación inter-modelo: κw = 0,667"

The Netlify footer also still references "Nuestro 20,2%" (should reference 12.1% share) and "20% de empleos en riesgo de automatización" (OECD comparison with stale numbers).

---

## 9. DATA-LEVEL EMPLOYMENT NOTE — STALE (🟡 MODERATE)

Netlify note: "Las cifras a 4 dígitos se han distribuido proporcionalmente dentro de cada subgrupo a 3 dígitos, ponderadas con datos del Censo 2021 del INE (145 subgrupos)."

Production note: Updated to reference "cascada 4 capas" methodology and "Estimación cascada 4 capas — no dato observado a 4 dígitos."

---

## 10. SHARE LINKS — WRONG DOMAIN (🔵 MINOR)

Production share links (X, LinkedIn, WhatsApp, Email) point to alvarodenicolas.com. Netlify likely still points to old domains or netlify.app. Verify and update to canonical production URL per Prompt 1 §0h.

---

## SUMMARY — ACTION REQUIRED

The Netlify app needs essentially a **full deployment of both Lovable Prompts (1+2)** with **v14 data**. This is not a patch — it's the complete UI overhaul that was already deployed to production.

### Priority order:
1. **Update dataset to v14** (fixes all stale numbers — 🔴 Critical)
2. **Deploy Prompt 1 Phase 0** (pre-flight cleanup: all exposición→vulnerabilidad renames, stale version refs, stale numbers) — 🟡/🔴
3. **Deploy Prompt 1 implementation** (KPI microcopy, interpretation strip, detail panel refactor with D/C/F/R, Contexto regulatorio separation, Calidad estimación, Interpretación rápida, Sustitución semantics) — 🟠
4. **Deploy Prompt 2** (3-level caveat system: "Cómo leer este mapa" + "Metodología y limitaciones" panel) — 🟠
5. **Update version references** to v28/v29a, 56 notes — 🔵
6. **Rewrite footer** per Prompt 1 §E — 🟠

### Issue tracker cross-reference:
All 4 issues that were FIXED in v29a on production (#20, #22, #24, #25) are **still OPEN on Netlify**. Plus, the Netlify app has additional regressions (stale V23 references, pre-v14 data) that production already resolved in v28.

### Estimated scope:
This is a full Prompt 1 + Prompt 2 deployment to the Netlify/Lovable codebase — the same work that was already done for the production site. The two attached prompt files (PROMPT_1_LOVABLE_UI_FIX_v2 and PROMPT_2_LOVABLE_METHODOLOGY_DISCLOSURE_v2) contain all the specifications needed.
