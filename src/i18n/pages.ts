/**
 * Translations for the static Astro pages (occupation, sector, homepage nav).
 * Keep strings minimal — only what's rendered outside the React dashboard,
 * which has its own react-i18next setup.
 */

export type PageLang = "es" | "en";

export const pageStrings = {
  es: {
    // Navigation / breadcrumbs
    home: "Inicio",
    sectors: "Sectores",
    backToMap: "← Mapa interactivo",
    explore: "Explorar datos",
    viewSectors: "📊 Ver los {n} sectores",
    viewOccupations: "📋 Tabla de {n} ocupaciones",
    // Common labels
    occupations: "Ocupaciones",
    employment: "Empleo",
    totalEmployment: "Empleo total",
    totalWorkers: "Total trabajadores",
    avgSalary: "Salario medio",
    avgExposure: "Exposición media",
    avgSectorExposure: "Exposición media IA",
    weightedByEmployment: "ponderado por empleo",
    highRisk: "Alto riesgo",
    highRiskOver7: "Alto riesgo (>7)",
    scoreGt7: "score > 7/10",
    pctOfEmployment: "{p}% del empleo",
    employees: "Empleados",
    wageIndex: "Índice salarial expuesto",
    wageIndexFormula: "empleo × salario × score",
    // Occupation page
    exposureLabel: "Exposición a la IA",
    veryHigh: "Muy alta",
    high: "Alta",
    moderate: "Moderada",
    low: "Baja",
    veryLow: "Muy baja",
    theoreticalCaveat: "Estimación teórica — no predicción",
    subComponents: "Sub-componentes del score",
    displacement: "Potencial desplazamiento",
    aiCapability: "Capacidad IA actual",
    adoptionFriction: "Fricción a la adopción",
    regulatoryProtection: "Protección regulatoria",
    formula: "Fórmula",
    rescored: "Rescored",
    automationVector: "Vector de automatización",
    automationVectorEn: "Automation vector (English)",
    employmentConfidence: "Confianza empleo",
    seeInDashboard: "→ Ver en el dashboard interactivo",
    // Sector detail
    employmentDisclaimer: "Las cifras de empleo son estimaciones basadas en EPA Q4 2025 y Censo 2021. Los scores son teóricos — no predicciones.",
    note: "Nota",
    score: "Score",
    occupation: "Ocupación",
    cnoCode: "CNO",
    salary: "Salario",
    euAiAct: "EU AI Act",
    occupationsCountInSector: "{n} ocupaciones con score > 7/10",
    occupationSingularPluralWithScore: "{n} ocupación{s} con score > 7/10",
    // Sector index
    sectorsTitle: "Sectores económicos",
    sectorsSubtitle: "{sectors} sectores · {occupations} ocupaciones · {workers} trabajadores · Score medio IA: {avg}/10",
    // Footer
    sourceLabel: "Fuente:",
    sourceLine: "EPA Q4 2025, INE Census 2021, SEPE 2024 · Metodología v30 · CC BY 4.0 · Autores: Álvaro de Nicolás, Miguel Sureda",
    // Language toggle
    switchLang: "English",
  },
  en: {
    home: "Home",
    sectors: "Sectors",
    backToMap: "← Interactive map",
    explore: "Explore the data",
    viewSectors: "📊 Browse the {n} sectors",
    viewOccupations: "📋 Table of {n} occupations",
    occupations: "Occupations",
    employment: "Employment",
    totalEmployment: "Total employment",
    totalWorkers: "Total workers",
    avgSalary: "Avg. salary",
    avgExposure: "Average exposure",
    avgSectorExposure: "Avg. AI exposure",
    weightedByEmployment: "employment-weighted",
    highRisk: "High risk",
    highRiskOver7: "High risk (>7)",
    scoreGt7: "score > 7/10",
    pctOfEmployment: "{p}% of employment",
    employees: "Employees",
    wageIndex: "Exposed wage index",
    wageIndexFormula: "employment × salary × score",
    exposureLabel: "AI exposure",
    veryHigh: "Very high",
    high: "High",
    moderate: "Moderate",
    low: "Low",
    veryLow: "Very low",
    theoreticalCaveat: "Theoretical estimate — not a forecast",
    subComponents: "Score sub-components",
    displacement: "Displacement potential",
    aiCapability: "Current AI capability",
    adoptionFriction: "Adoption friction",
    regulatoryProtection: "Regulatory protection",
    formula: "Formula",
    rescored: "Rescored",
    automationVector: "Automation vector",
    automationVectorEn: "Automation vector (Spanish)",
    employmentConfidence: "Employment confidence",
    seeInDashboard: "→ View in the interactive dashboard",
    employmentDisclaimer: "Employment figures are estimates based on EPA Q4 2025 and the 2021 Census. Scores are theoretical — not forecasts.",
    note: "Note",
    score: "Score",
    occupation: "Occupation",
    cnoCode: "CNO",
    salary: "Salary",
    euAiAct: "EU AI Act",
    occupationsCountInSector: "{n} occupations with score > 7/10",
    occupationSingularPluralWithScore: "{n} occupation{s} with score > 7/10",
    sectorsTitle: "Economic sectors",
    sectorsSubtitle: "{sectors} sectors · {occupations} occupations · {workers} workers · Avg. AI score: {avg}/10",
    sourceLabel: "Source:",
    sourceLine: "EPA Q4 2025, INE Census 2021, SEPE 2024 · Methodology v30 · CC BY 4.0 · Authors: Álvaro de Nicolás, Miguel Sureda",
    switchLang: "Español",
  },
} as const;

export type PageKey = keyof typeof pageStrings["es"];

export function t(lang: PageLang, key: PageKey, vars?: Record<string, string | number>): string {
  const raw = pageStrings[lang][key] as string;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export function localeCode(lang: PageLang): string {
  return lang === "es" ? "es-ES" : "en-US";
}

export function scoreLabel(lang: PageLang, score: number): string {
  if (score >= 8) return t(lang, "veryHigh");
  if (score >= 6) return t(lang, "high");
  if (score >= 4) return t(lang, "moderate");
  if (score >= 2) return t(lang, "low");
  return t(lang, "veryLow");
}

/** Prefix an internal path with the locale segment when not default. */
export function langPath(lang: PageLang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === "es") return clean;
  return `/en${clean === "/" ? "/" : clean}`;
}
