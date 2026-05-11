/**
 * Build-time data loading utilities for Astro pages.
 * Reads the JSON datasets and provides typed helpers for getStaticPaths.
 */

import type { RawOccupation } from "@/lib/occupationData";
import type { Lang } from "@/i18n/static";
import { SECTOR_LABELS, sectorLabel } from "@/i18n/static";
import esDataRaw from "../../public/data/spain_502_v15_subcomp_complete.json";
import enDataRaw from "../../public/data/spain_502_v15_subcomp_complete_en.json";

const esData = esDataRaw as RawOccupation[];
// The EN dataset ships translated `sector` strings. Normalise to the Spanish
// canonical key so that all internal logic (joins, sector tables, slugs) stays
// consistent regardless of which JSON we read from.
const SECTOR_EN_TO_ES: Record<string, string> = {
  "Administration": "Administración",
  "Agriculture": "Agricultura",
  "Crafts & Manufacturing": "Artesanía y manufactura",
  "Construction": "Construcción",
  "Management": "Dirección",
  "Elementary": "Elementales",
  "Industry": "Industria",
  "Food Industry": "Industria alimentaria",
  "Military": "Militar",
  "Professionals": "Profesionales",
  "Services": "Servicios",
  "Support Technicians": "Técnicos apoyo",
};
const enData = (enDataRaw as RawOccupation[]).map((d) => ({
  ...d,
  sector: SECTOR_EN_TO_ES[d.sector] ?? d.sector,
}));

// ─── Slug generation ────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function occupationSlug(occ: RawOccupation): string {
  return `${occ.cno}-${slugify(occ.nombre)}`;
}

export function sectorSlug(sector: string): string {
  return slugify(sector);
}

// Locale-aware slugs. ES paths stay the same as before (back-compat); EN paths
// use the English sector/occupation names so URLs read naturally in English.
export function occupationSlugFor(esOcc: RawOccupation, enOcc: RawOccupation | undefined, lang: Lang): string {
  if (lang === "en" && enOcc) return `${esOcc.cno}-${slugify(enOcc.nombre)}`;
  return occupationSlug(esOcc);
}

export function sectorSlugFor(canonicalSpanish: string, lang: Lang): string {
  return slugify(sectorLabel(canonicalSpanish, lang));
}

// ─── Data loading ───────────────────────────────────────────────────────────

export function loadAllOccupations() {
  const enByCno = new Map(enData.map((d) => [d.cno, d]));
  return { es: esData, en: enData, enByCno };
}

// ─── Sector statistics ──────────────────────────────────────────────────────

export interface SectorStat {
  sector: string;
  slug: string;
  count: number;
  employment: number;
  avgScore: number;
  avgSalary: number;
  highRiskCount: number;
  occupations: RawOccupation[];
}

export function getSectorStats(data: RawOccupation[]): SectorStat[] {
  const sectors = [...new Set(data.map((d) => d.sector))].sort();
  return sectors.map((sector) => {
    const occs = data.filter((d) => d.sector === sector);
    const emp = occs.reduce((s, d) => s + d.empleo, 0);
    const avgScore = +(occs.reduce((s, d) => s + d.vulnerabilidad_ia_score, 0) / occs.length).toFixed(2);
    const avgSalary = Math.round(occs.reduce((s, d) => s + d.salario_medio_eur, 0) / occs.length);
    const highRiskCount = occs.filter((d) => d.vulnerabilidad_ia_score >= 7).length;
    return { sector, slug: sectorSlug(sector), count: occs.length, employment: emp, avgScore, avgSalary, highRiskCount, occupations: occs };
  });
}

// ─── Aggregate statistics ───────────────────────────────────────────────────

export function getAggregateStats(data: RawOccupation[]) {
  const totalEmployment = data.reduce((s, d) => s + d.empleo, 0);
  // Unweighted: simple mean across the 502 occupations.
  const avgScore = +(data.reduce((s, d) => s + d.vulnerabilidad_ia_score, 0) / data.length).toFixed(2);
  // Weighted by employment (canonical headline figure per Zenodo).
  const avgScoreWeighted = +(data.reduce((s, d) => s + d.vulnerabilidad_ia_score * d.empleo, 0) / totalEmployment).toFixed(2);
  // High vulnerability = score ≥ 7 (canonical threshold matching the dashboard KPI and Zenodo).
  const highRiskOccs = data.filter((d) => d.vulnerabilidad_ia_score >= 7);
  const highRiskCount = highRiskOccs.length;
  const highRiskEmployment = highRiskOccs.reduce((s, d) => s + d.empleo, 0);
  const highRiskPct = +((highRiskEmployment / totalEmployment) * 100).toFixed(1);

  const lowRiskOccs = data.filter((d) => d.vulnerabilidad_ia_score < 3);
  const lowRiskAvgSalary = Math.round(lowRiskOccs.reduce((s, d) => s + d.salario_medio_eur, 0) / lowRiskOccs.length);
  const highRiskAvgSalary = highRiskOccs.length > 0 ? Math.round(highRiskOccs.reduce((s, d) => s + d.salario_medio_eur, 0) / highRiskOccs.length) : 0;

  const top5 = [...data].sort((a, b) => b.vulnerabilidad_ia_score - a.vulnerabilidad_ia_score).slice(0, 5);
  const bottom5 = [...data].sort((a, b) => a.vulnerabilidad_ia_score - b.vulnerabilidad_ia_score).slice(0, 5);

  const euHighRisk = data.filter((d) => d.eu_ai_act.toLowerCase().includes("alto") || d.eu_ai_act.toLowerCase().includes("high"));
  const euLimited = data.filter((d) => d.eu_ai_act.toLowerCase().includes("limitado") || d.eu_ai_act.toLowerCase().includes("limited"));
  const euMinimal = data.filter((d) => d.eu_ai_act.toLowerCase().includes("mínimo") || d.eu_ai_act.toLowerCase().includes("minimal"));

  return {
    totalEmployment, avgScore, avgScoreWeighted, highRiskCount, highRiskEmployment, highRiskPct,
    lowRiskAvgSalary, highRiskAvgSalary, top5, bottom5,
    euHighRisk, euLimited, euMinimal,
  };
}

// ─── JSON-LD generators ────────────────────────────────────────────────────

const BASE_URL = "https://empleo-ai.anlakstudio.com";

export function generateDatasetJsonLd(data: RawOccupation[], lang: Lang = "es") {
  const stats = getAggregateStats(data);
  const localeStr = lang === "en" ? "en-US" : "es-ES";
  const employmentFmt = stats.totalEmployment.toLocaleString(localeStr);
  const i18n = lang === "en"
    ? {
        name: "Job Vulnerability to AI in Spain",
        description: `Interactive analysis of AI vulnerability across ${data.length} occupations of the Spanish labour market. Dataset v15, methodology v30.`,
        datasetName: "Labour Vulnerability to AI · Spain 2026",
        datasetDesc: `${data.length} CNO-11 occupations, ${employmentFmt} workers, LFS Q4 2025, Census 2021`,
      }
    : {
        name: "Vulnerabilidad de Empleos a la IA en España",
        description: `Análisis interactivo de vulnerabilidad a la IA de las ${data.length} ocupaciones del mercado laboral español. Dataset v15, metodología v30.`,
        datasetName: "Vulnerabilidad Laboral a la IA · España 2026",
        datasetDesc: `${data.length} ocupaciones CNO-11, ${employmentFmt} trabajadores, EPA Q4 2025, Censo 2021`,
      };
  const pageUrl = lang === "en" ? `${BASE_URL}/en/` : BASE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": i18n.name,
    "description": i18n.description,
    "url": pageUrl,
    "applicationCategory": "DataVisualization",
    "operatingSystem": "Web",
    "inLanguage": lang === "en" ? "en" : "es",
    "author": [
      { "@type": "Person", "name": "Álvaro de Nicolás" },
      { "@type": "Person", "name": "Miguel Sureda" },
    ],
    "about": {
      "@type": "Dataset",
      "name": i18n.datasetName,
      "description": i18n.datasetDesc,
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "temporalCoverage": "2025",
      "identifier": [
        "https://doi.org/10.5281/zenodo.19076797",
      ],
      "distribution": [
        { "@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": `${BASE_URL}/data/spain_502_v15_subcomp_complete.json` },
        { "@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": `${BASE_URL}/data/spain_502_v15_subcomp_complete_en.json` },
        { "@type": "DataDownload", "encodingFormat": "text/csv", "contentUrl": `${BASE_URL}/data/spain_v15_threshold_lookup.csv` },
        { "@type": "DataDownload", "encodingFormat": "text/csv", "contentUrl": `${BASE_URL}/data/funcas_validation_data.csv` },
        { "@type": "DataDownload", "encodingFormat": "application/pdf", "contentUrl": `${BASE_URL}/data/funcas_validation_addendum.pdf` },
        { "@type": "DataDownload", "encodingFormat": "text/plain", "contentUrl": `${BASE_URL}/llms-full.txt` },
      ],
      "variableMeasured": [
        { "@type": "PropertyValue", "name": "AI Vulnerability Score", "minValue": 0, "maxValue": 10 },
        { "@type": "PropertyValue", "name": "Employment", "unitText": "workers" },
        { "@type": "PropertyValue", "name": "Average Salary", "unitCode": "EUR" },
      ],
      "measurementTechnique": "4D sub-component formula: (D×C/10)×(1-F/20)×(1-R/20)",
    },
  };
}

export function generateFaqJsonLd(data: RawOccupation[], lang: Lang = "es", enByCno?: Map<string, RawOccupation>) {
  const stats = getAggregateStats(data);
  const sectors = getSectorStats(data);
  const resilientSectors = [...sectors].sort((a, b) => a.avgScore - b.avgScore).slice(0, 3);
  const localeStr = lang === "en" ? "en-US" : "es-ES";

  const nameOf = (d: RawOccupation): string => {
    if (lang === "en" && enByCno) return enByCno.get(d.cno)?.nombre ?? d.nombre;
    return d.nombre;
  };

  const top5Names = stats.top5.map((d) => `${nameOf(d)} (${d.vulnerabilidad_ia_score}/10)`).join(", ");
  const bottom5Names = stats.bottom5.map((d) => `${nameOf(d)} (${d.vulnerabilidad_ia_score}/10)`).join(", ");
  const resilientNames = resilientSectors.map((s) => `${sectorLabel(s.sector, lang)} (${s.avgScore}/10)`).join(", ");
  const euHighExamples = stats.euHighRisk.slice(0, 5).map((d) => nameOf(d)).join(", ");
  const totalEmp = stats.totalEmployment.toLocaleString(localeStr);
  const highRiskEmp = stats.highRiskEmployment.toLocaleString(localeStr);
  const highRiskAvg = stats.highRiskAvgSalary.toLocaleString(localeStr);
  const lowRiskAvg = stats.lowRiskAvgSalary.toLocaleString(localeStr);

  const questions = lang === "en"
    ? [
        ["What jobs are most vulnerable to artificial intelligence in Spain?",
         `The 5 occupations with the highest AI vulnerability score are: ${top5Names}. These occupations show high automation capability and low regulatory friction under the 4-dimension methodology (D, C, F, R).`],
        ["How many workers are at risk from artificial intelligence in Spain?",
         `Out of ${totalEmp} workers analysed (LFS Q4 2025), ${highRiskEmp} work in occupations with a vulnerability score ≥7/10, which represents ${stats.highRiskPct}% of total employment. This covers ${stats.highRiskCount} of the ${data.length} CNO-11 occupations.`],
        ["Which sectors are most resilient to AI automation in Spain?",
         `Sectors with the lowest average AI vulnerability are: ${resilientNames}. These sectors combine high specialised physical work, direct human interaction, and significant regulatory barriers.`],
        ["How is the AI vulnerability index of each job calculated?",
         "The index uses a 4-dimension formula: (D×C/10)×(1-F/20)×(1-R/20), where D = displacement potential, C = current AI capability, F = adoption friction, R = regulatory barriers. Each dimension is scored 0–10 via consensus of multiple AI models and manual validation. Employment data come from INE LFS Q4 2025 and Census 2021."],
        ["Which occupations are high-risk under the EU AI Act in Spain?",
         `${stats.euHighRisk.length} occupations are classified as "High risk" under the EU AI Act, including: ${euHighExamples}. These occupations involve decisions that significantly affect people's rights.`],
        ["What is the average salary of the most and least AI-vulnerable jobs?",
         `Occupations with high vulnerability (score ≥7) have an average salary of ${highRiskAvg} €/year, while the most resilient (score <3) average ${lowRiskAvg} €/year. The employment-weighted average score of the Spanish labour market is ${stats.avgScoreWeighted}/10 (${stats.avgScore}/10 unweighted).`],
        ["Which jobs in Spain are safest from artificial intelligence?",
         `The 5 occupations with the lowest AI vulnerability are: ${bottom5Names}. These professions require specialised physical skills, direct human empathy, or strict regulatory frameworks that limit automation.`],
        ["How does this dataset relate to the FUNCAS study on AI and employment in Spain?",
         `The FUNCAS study (Rodríguez-Fernández, April 2026) estimates 1.7–2.3 million jobs destroyed by AI in Spain over ten years, aggregated to the 9 broad CNO-11 groups. This dataset operates at the 4-digit level (502 occupations) with an independent methodology. When v15 scores are aggregated to the 1-digit level and compared with the FUNCAS AIOE-CNO, the Pearson correlation is r = 0.936 (Spearman ρ = 0.830). Two independent methodologies with disjoint inputs converge at the macro level; v15 adds 4-digit occupational granularity. Full detail at /comparativa-funcas.html.`],
      ]
    : [
        ["¿Qué empleos son más vulnerables a la inteligencia artificial en España?",
         `Las 5 ocupaciones con mayor puntuación de vulnerabilidad a la IA son: ${top5Names}. Estas ocupaciones presentan alta capacidad de automatización y baja fricción regulatoria según la metodología de 4 dimensiones (D, C, F, R).`],
        ["¿Cuántos trabajadores están en riesgo por la inteligencia artificial en España?",
         `De los ${totalEmp} trabajadores analizados (EPA Q4 2025), ${highRiskEmp} trabajan en ocupaciones con una puntuación de vulnerabilidad ≥7/10, lo que representa el ${stats.highRiskPct}% del empleo total. Esto abarca ${stats.highRiskCount} de las ${data.length} ocupaciones CNO-11.`],
        ["¿Qué sectores son más resistentes a la automatización por IA en España?",
         `Los sectores con menor puntuación media de vulnerabilidad a la IA son: ${resilientNames}. Estos sectores combinan alto componente de trabajo físico especializado, interacción humana directa y barreras regulatorias significativas.`],
        ["¿Cómo se calcula el índice de vulnerabilidad a la IA de cada empleo?",
         "El índice utiliza una fórmula de 4 dimensiones: (D×C/10)×(1-F/20)×(1-R/20), donde D=potencial de desplazamiento, C=capacidad actual de la IA, F=fricción a la adopción y R=barreras regulatorias. Cada dimensión se puntúa de 0 a 10 mediante consenso de múltiples modelos de IA y validación manual. Los datos de empleo provienen de la EPA Q4 2025 y el Censo 2021 del INE."],
        ["¿Qué ocupaciones tienen riesgo alto según la EU AI Act en España?",
         `${stats.euHighRisk.length} ocupaciones están clasificadas como "Alto riesgo" según la EU AI Act, incluyendo: ${euHighExamples}. Estas ocupaciones implican decisiones que afectan significativamente a los derechos de las personas.`],
        ["¿Cuál es el salario medio de los empleos más y menos vulnerables a la IA?",
         `Las ocupaciones con alta vulnerabilidad (score ≥7) tienen un salario medio de ${highRiskAvg} €/año, mientras que las más resistentes (score <3) promedian ${lowRiskAvg} €/año. El score medio ponderado por empleo del mercado laboral español es ${stats.avgScoreWeighted}/10 (${stats.avgScore}/10 sin ponderar).`],
        ["¿Qué empleos en España son más seguros frente a la inteligencia artificial?",
         `Las 5 ocupaciones con menor vulnerabilidad a la IA son: ${bottom5Names}. Estas profesiones requieren habilidades físicas especializadas, empatía humana directa o marcos regulatorios estrictos que limitan la automatización.`],
        ["¿Cómo se relaciona este dataset con el estudio Funcas sobre IA y empleo en España?",
         `El estudio Funcas (Rodríguez-Fernández, abril 2026) estima 1,7-2,3 millones de empleos destruidos por IA en España en diez años, agregados a los 9 grandes grupos CNO-11. Este dataset opera al cuarto dígito (502 ocupaciones) con una metodología independiente. Cuando se agregan los scores de v15 al primer dígito y se comparan con el AIOE-CNO de Funcas, la correlación de Pearson es r = 0,936 (Spearman ρ = 0,830). Dos metodologías independientes con inputs disjuntos convergen al nivel macro; v15 añade granularidad ocupacional al cuarto dígito. Detalle completo en /comparativa-funcas.html.`],
      ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": lang === "en" ? "en" : "es",
    "mainEntity": questions.map(([name, text]) => ({
      "@type": "Question",
      "name": name,
      "acceptedAnswer": { "@type": "Answer", "text": text },
    })),
  };
}
