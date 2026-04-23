import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./es.json";
import en from "./en.json";

// Detect locale from URL path first (/en/... → English), then fall back to
// the user's saved preference, then Spanish.
function detectInitialLang(): "es" | "en" {
  if (typeof window === "undefined") return "es";
  if (window.location.pathname === "/en" || window.location.pathname.startsWith("/en/")) {
    return "en";
  }
  const saved = localStorage.getItem("lang");
  return saved === "en" ? "en" : "es";
}

i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: detectInitialLang(),
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

export default i18n;
