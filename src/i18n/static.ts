/**
 * Server-side i18n dictionary used by Astro SSG pages.
 *
 * The React island uses `react-i18next` (runtime). Astro pages are rendered at
 * build time and need a synchronous lookup — this module provides both.
 *
 * Usage:
 *   const t = strings(lang);
 *   t.sector.heading        // string
 *   t.sectorCard.occupations({ count: 3 })  // template
 */

export type Lang = "es" | "en";

export const LOCALES: Record<Lang, { code: string; htmlLang: string; ogLocale: string }> = {
  es: { code: "es", htmlLang: "es", ogLocale: "es_ES" },
  en: { code: "en", htmlLang: "en", ogLocale: "en_US" },
};

export const STATIC = {
  es: {
    common: {
      siteName: "Vulnerabilidad Laboral a la IA · España 2026",
      indexTitle: "Vulnerabilidad de Empleos a la IA en España",
      breadcrumbHome: "Inicio",
      breadcrumbSectors: "Sectores",
      breadcrumbMap: "← Mapa interactivo",
      backHome: "← Volver al inicio",
      source: "Fuente:",
      sourceLine: "EPA Q4 2025, INE Census 2021, SEPE 2024 · Metodología v30 · CC BY 4.0 ·",
      authorsLine: "Autores: Álvaro de Nicolás, Miguel Sureda",
      methodologyShort: "Metodología v30 · Dataset v15",
      euAct: "EU AI Act",
      score: "Score",
      employment: "Empleo",
      employees: "Empleados",
      avgSalary: "Salario medio",
      occupations: "ocupaciones",
      occupation: "Ocupación",
      sector: "Sector",
      cno: "CNO",
      workersUnit: (n: string) => `${n} trabajadores`,
      explore: "Explorar datos",
      occupationsCountLabel: (n: number) => `${n} ocupaciones`,
    },
    notFound: {
      title: "Página no encontrada",
      description: "La página que buscas no existe.",
    },
    home: {
      description: (count: number, employment: string) =>
        `Análisis interactivo de vulnerabilidad a la IA de las ${count} ocupaciones del mercado laboral español · ${employment} trabajadores · EPA Q4 2025 · Metodología v30 · Dataset v15`,
      seeAllSectors: (n: number) => `📊 Ver los ${n} sectores`,
      funcasComparison: "📐 Comparativa Funcas · r=0,936",
      tableLink: (n: number) => `📋 Tabla de ${n} ocupaciones`,
    },
    sectorIndex: {
      title: "Sectores del mercado laboral español — Vulnerabilidad a la IA",
      description: (sectorCount: number, occCount: number, employment: string) =>
        `Análisis de vulnerabilidad a la IA de los ${sectorCount} sectores económicos del mercado laboral español. ${employment} trabajadores en ${occCount} ocupaciones CNO-11.`,
      h1: "Sectores económicos",
      subline: (sectorCount: number, occCount: number, employment: string, avg: string) =>
        `${sectorCount} sectores · ${occCount} ocupaciones · ${employment} trabajadores · Score medio IA: ${avg}/10`,
      totalWorkers: "Total trabajadores",
      avgExposure: "Exposición media",
      highRisk: "Alto riesgo (>7)",
      occShort: "ocup.",
      ofEmployment: (pct: string) => `${pct}% del empleo`,
      cardOccupations: "Ocupaciones",
      cardEmployment: "Empleo",
      cardSalary: "Salario medio",
      cardHighRisk: (n: number) => `${n} ocupación${n > 1 ? "es" : ""} con score > 7/10`,
      jsonLdName: "Sectores del mercado laboral español — Vulnerabilidad IA",
    },
    sectorDetail: {
      titleSuffix: "— Vulnerabilidad a la IA por sector",
      description: (sectorName: string, count: number, employment: string, avg: string, highRisk: number) =>
        `Sector ${sectorName}: ${count} ocupaciones, ${employment} trabajadores, score medio de vulnerabilidad IA ${avg}/10. ${highRisk} ocupaciones de alto riesgo.`,
      subline: (count: number, employment: string, avg: string) =>
        `${count} ocupaciones · ${employment} trabajadores · Score medio IA: ${avg}/10`,
      employmentTotal: "Empleo total",
      epaSource: "EPA Q4 2025",
      exposureIA: "Exposición media IA",
      employmentWeighted: "ponderado por empleo",
      highRiskShort: "Alto riesgo",
      scoreGt: "score > 7/10",
      note: "Nota:",
      noteText: "Las cifras de empleo son estimaciones basadas en EPA Q4 2025 y Censo 2021. Los scores son teóricos — no predicciones.",
      jsonLdName: (sectorName: string) => `Ocupaciones del sector ${sectorName} — Vulnerabilidad IA`,
    },
    occupation: {
      titleSuffix: (score: string) => `— Vulnerabilidad IA ${score}/10`,
      description: (name: string, cno: string, score: string, employment: string, salary: string, sector: string) =>
        `${name} (CNO ${cno}): score de vulnerabilidad a la IA de ${score}/10, ${employment} empleados, salario medio ${salary} €. Sector: ${sector}.`,
      exposureLabel: "Exposición a la IA:",
      levelVeryHigh: "Muy alta",
      levelHigh: "Alta",
      levelModerate: "Moderada",
      levelLow: "Baja",
      levelVeryLow: "Muy baja",
      theoreticalCaveat: "Estimación teórica — no predicción",
      wageIndexLabel: "Índice salarial expuesto",
      wageFormula: "empleo × salario × score",
      subcomponentsTitle: "Sub-componentes del score",
      dLabel: "Potencial desplazamiento",
      cLabel: "Capacidad IA actual",
      fLabel: "Barrera física",
      rLabel: "Fricción regulatoria",
      formula: "Fórmula:",
      rescored: (from: string, to: string) => `Rescored: ${from} → ${to}`,
      vectorTitle: "Vector de automatización",
      vectorEnTitle: "Automation vector (English)",
      employmentConfidence: "Confianza empleo:",
      ctaDashboard: "→ Ver en el dashboard interactivo",
      altLangLabel: "English version",
    },
    threshold: {
      heading: "Cuántos trabajadores hay por encima de cada umbral",
      subheading: "Acumulado descendente desde score 9 a 2 · 22.732.223 trabajadores totales · Dataset v15",
      funcasLink: "Ver comparativa Funcas →",
      reading:
        'Lectura: el 11,73% de la fuerza laboral española se concentra en 41 ocupaciones con vulnerabilidad ≥7,5. La cifra equivale en orden de magnitud a la destrucción central estimada por Funcas (≈2M empleos en 10 años) sin asumir velocidad de adopción.',
      rawDataCsv: "Datos brutos en",
    },
    sectorSummary: {
      heading: "Análisis por sector: vulnerabilidad a la IA",
      occupationsShort: "ocupaciones",
      workersShort: "trab.",
      avgScoreLabel: "Score medio:",
      highRiskShort: (n: number) => `(${n} alto riesgo)`,
    },
    occupationTable: {
      heading: (n: number) => `${n} ocupaciones del mercado laboral español: vulnerabilidad a la IA`,
      weightedHeading: "Score medio ponderado por empleo:",
      metaLine: (occ: number, emp: string, avg: string) =>
        `Datos: EPA Q4 2025, INE Census 2021, SEPE 2024 · Metodología v30 · Dataset v15 · ${emp} trabajadores · Score medio (no ponderado): ${avg}/10`,
      caption: (n: number) =>
        `Análisis de vulnerabilidad a la inteligencia artificial de las ${n} ocupaciones CNO-11 del mercado laboral español. Puntuación 0 (mínima vulnerabilidad) a 10 (máxima vulnerabilidad).`,
      colCno: "CNO",
      colOccupation: "Ocupación",
      colSector: "Sector",
      colEmployment: "Empleo",
      colSalary: "Salario medio",
      colScore: "Score IA",
      colEuAct: "EU AI Act",
      colImpact: "Tipo impacto",
    },
    paths: {
      sectorIndex: "/sector/",
      ocupacionPrefix: "/ocupacion",
      sectorPrefix: "/sector",
      root: "/",
      funcasComparison: "/comparativa-funcas.html",
    },
  },
  en: {
    common: {
      siteName: "Labour Vulnerability to AI · Spain 2026",
      indexTitle: "Job Vulnerability to AI in Spain",
      breadcrumbHome: "Home",
      breadcrumbSectors: "Sectors",
      breadcrumbMap: "← Interactive map",
      backHome: "← Back to home",
      source: "Source:",
      sourceLine: "LFS Q4 2025, INE Census 2021, SEPE 2024 · Methodology v30 · CC BY 4.0 ·",
      authorsLine: "Authors: Álvaro de Nicolás, Miguel Sureda",
      methodologyShort: "Methodology v30 · Dataset v15",
      euAct: "EU AI Act",
      score: "Score",
      employment: "Employment",
      employees: "Employees",
      avgSalary: "Average salary",
      occupations: "occupations",
      occupation: "Occupation",
      sector: "Sector",
      cno: "CNO",
      workersUnit: (n: string) => `${n} workers`,
      explore: "Explore data",
      occupationsCountLabel: (n: number) => `${n} occupations`,
    },
    notFound: {
      title: "Page not found",
      description: "The page you are looking for does not exist.",
    },
    home: {
      description: (count: number, employment: string) =>
        `Interactive analysis of AI vulnerability across ${count} occupations of the Spanish labour market · ${employment} workers · LFS Q4 2025 · Methodology v30 · Dataset v15`,
      seeAllSectors: (n: number) => `📊 See the ${n} sectors`,
      funcasComparison: "📐 FUNCAS comparison · r = 0.936",
      tableLink: (n: number) => `📋 Table of ${n} occupations`,
    },
    sectorIndex: {
      title: "Sectors of the Spanish labour market — AI vulnerability",
      description: (sectorCount: number, occCount: number, employment: string) =>
        `AI vulnerability analysis across the ${sectorCount} economic sectors of the Spanish labour market. ${employment} workers across ${occCount} CNO-11 occupations.`,
      h1: "Economic sectors",
      subline: (sectorCount: number, occCount: number, employment: string, avg: string) =>
        `${sectorCount} sectors · ${occCount} occupations · ${employment} workers · Avg. AI exposure: ${avg}/10`,
      totalWorkers: "Total workers",
      avgExposure: "Avg. exposure",
      highRisk: "High risk (>7)",
      occShort: "occ.",
      ofEmployment: (pct: string) => `${pct}% of employment`,
      cardOccupations: "Occupations",
      cardEmployment: "Employment",
      cardSalary: "Average salary",
      cardHighRisk: (n: number) => `${n} occupation${n > 1 ? "s" : ""} with score > 7/10`,
      jsonLdName: "Sectors of the Spanish labour market — AI vulnerability",
    },
    sectorDetail: {
      titleSuffix: "— AI vulnerability by sector",
      description: (sectorName: string, count: number, employment: string, avg: string, highRisk: number) =>
        `Sector ${sectorName}: ${count} occupations, ${employment} workers, average AI vulnerability score ${avg}/10. ${highRisk} high-risk occupations.`,
      subline: (count: number, employment: string, avg: string) =>
        `${count} occupations · ${employment} workers · Avg. AI exposure: ${avg}/10`,
      employmentTotal: "Total employment",
      epaSource: "LFS Q4 2025",
      exposureIA: "Avg. AI exposure",
      employmentWeighted: "weighted by employment",
      highRiskShort: "High risk",
      scoreGt: "score > 7/10",
      note: "Note:",
      noteText: "Employment figures are estimates based on LFS Q4 2025 and Census 2021. Scores are theoretical — not predictions.",
      jsonLdName: (sectorName: string) => `Occupations in the ${sectorName} sector — AI vulnerability`,
    },
    occupation: {
      titleSuffix: (score: string) => `— AI vulnerability ${score}/10`,
      description: (name: string, cno: string, score: string, employment: string, salary: string, sector: string) =>
        `${name} (CNO ${cno}): AI vulnerability score ${score}/10, ${employment} employees, average salary ${salary} €. Sector: ${sector}.`,
      exposureLabel: "AI exposure:",
      levelVeryHigh: "Very high",
      levelHigh: "High",
      levelModerate: "Moderate",
      levelLow: "Low",
      levelVeryLow: "Very low",
      theoreticalCaveat: "Theoretical estimate — not a prediction",
      wageIndexLabel: "Exposed wage index",
      wageFormula: "employment × salary × score",
      subcomponentsTitle: "Score sub-components",
      dLabel: "Displacement potential",
      cLabel: "Current AI capability",
      fLabel: "Physical barrier",
      rLabel: "Regulatory friction",
      formula: "Formula:",
      rescored: (from: string, to: string) => `Rescored: ${from} → ${to}`,
      vectorTitle: "Automation vector",
      vectorEnTitle: "Automation vector (Spanish)",
      employmentConfidence: "Employment confidence:",
      ctaDashboard: "→ Open in the interactive dashboard",
      altLangLabel: "Versión en español",
    },
    threshold: {
      heading: "How many workers sit above each threshold",
      subheading: "Cumulative top-down from score 9 to 2 · 22,732,223 total workers · Dataset v15",
      funcasLink: "See FUNCAS comparison →",
      reading:
        "Reading: 11.73% of the Spanish workforce is concentrated in 41 occupations with vulnerability ≥7.5. The figure matches in order of magnitude the central destruction estimate by FUNCAS (~2M jobs over 10 years) without assuming any adoption speed.",
      rawDataCsv: "Raw data in",
    },
    sectorSummary: {
      heading: "Sector analysis: AI vulnerability",
      occupationsShort: "occupations",
      workersShort: "workers",
      avgScoreLabel: "Avg. score:",
      highRiskShort: (n: number) => `(${n} high risk)`,
    },
    occupationTable: {
      heading: (n: number) => `${n} occupations of the Spanish labour market: AI vulnerability`,
      weightedHeading: "Average score weighted by employment:",
      metaLine: (occ: number, emp: string, avg: string) =>
        `Data: LFS Q4 2025, INE Census 2021, SEPE 2024 · Methodology v30 · Dataset v15 · ${emp} workers · Average score (unweighted): ${avg}/10`,
      caption: (n: number) =>
        `Analysis of AI vulnerability across the ${n} CNO-11 occupations of the Spanish labour market. Score from 0 (minimum vulnerability) to 10 (maximum vulnerability).`,
      colCno: "CNO",
      colOccupation: "Occupation",
      colSector: "Sector",
      colEmployment: "Employment",
      colSalary: "Average salary",
      colScore: "AI score",
      colEuAct: "EU AI Act",
      colImpact: "Impact type",
    },
    paths: {
      sectorIndex: "/en/sector/",
      ocupacionPrefix: "/en/occupation",
      sectorPrefix: "/en/sector",
      root: "/en/",
      funcasComparison: "/en/funcas-comparison.html",
    },
  },
} as const;

export type StringsForLang = (typeof STATIC)["es"];

export function strings(lang: Lang): StringsForLang {
  return STATIC[lang] as StringsForLang;
}

// Sector code → display name per locale. The dataset's canonical sector key is
// the Spanish string (see canonicalSector in occupationData.ts).
export const SECTOR_LABELS: Record<Lang, Record<string, string>> = {
  es: {
    "Administración": "Administración",
    "Agricultura": "Agricultura",
    "Artesanía y manufactura": "Artesanía y manufactura",
    "Construcción": "Construcción",
    "Dirección": "Dirección",
    "Elementales": "Elementales",
    "Industria": "Industria",
    "Industria alimentaria": "Industria alimentaria",
    "Militar": "Militar",
    "Profesionales": "Profesionales",
    "Servicios": "Servicios",
    "Técnicos apoyo": "Técnicos apoyo",
  },
  en: {
    "Administración": "Administration",
    "Agricultura": "Agriculture",
    "Artesanía y manufactura": "Crafts & Manufacturing",
    "Construcción": "Construction",
    "Dirección": "Management",
    "Elementales": "Elementary",
    "Industria": "Industry",
    "Industria alimentaria": "Food Industry",
    "Militar": "Military",
    "Profesionales": "Professionals",
    "Servicios": "Services",
    "Técnicos apoyo": "Support Technicians",
  },
};

export const sectorLabel = (canonicalSpanish: string, lang: Lang): string =>
  SECTOR_LABELS[lang][canonicalSpanish] ?? canonicalSpanish;
