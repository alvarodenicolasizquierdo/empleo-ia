import { useTranslation } from "react-i18next";
import { trackLanguageChange } from "@/lib/analytics";

declare global {
  interface Window {
    __pageLang?: "es" | "en";
    __altLangHref?: string | null;
  }
}

/**
 * Switching language used to be purely client-side (i18next.changeLanguage).
 * Now that the site has real `/en/` mirror routes, the toggle navigates to
 * the equivalent mirror URL so `<html lang>`, meta tags, og:locale, hreflang
 * and the React island all line up. If the page didn't expose `__altLangHref`
 * we fall back to client-side i18n only.
 */
export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const switchTo = (newLang: "es" | "en") => {
    if (newLang === i18n.language) return;
    trackLanguageChange(newLang);
    try { localStorage.setItem("lang", newLang); } catch {}
    if (typeof window !== "undefined") {
      const alt = window.__altLangHref;
      // Preserve current query string + hash so dashboard filters survive.
      if (alt) {
        const target = alt + window.location.search + window.location.hash;
        window.location.assign(target);
        return;
      }
    }
    i18n.changeLanguage(newLang);
  };
  return (
    <button
      onClick={() => switchTo(isEn ? "es" : "en")}
      style={{
        display: "inline-flex", alignItems: "center", gap: 0,
        background: "#f0ece4", border: "1px solid #d8d4cc", borderRadius: 16,
        padding: 2, cursor: "pointer", fontSize: 11, fontWeight: 600,
        lineHeight: 1,
      }}
      title={isEn ? "Cambiar a español" : "Switch to English"}
    >
      <span style={{
        padding: "4px 10px", borderRadius: 14,
        background: !isEn ? "#1a1a1a" : "transparent",
        color: !isEn ? "#faf8f4" : "#999",
        transition: "all 0.15s",
      }}>ES</span>
      <span style={{
        padding: "4px 10px", borderRadius: 14,
        background: isEn ? "#1a1a1a" : "transparent",
        color: isEn ? "#faf8f4" : "#999",
        transition: "all 0.15s",
      }}>EN</span>
    </button>
  );
}
