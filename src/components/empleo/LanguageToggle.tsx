import { useTranslation } from "react-i18next";
import { trackLanguageChange } from "@/lib/analytics";

/**
 * Map the current URL to its counterpart-language URL.
 * ES pages live at `/`, `/sector/...`, `/ocupacion/...`.
 * EN pages live at `/en/`, `/en/sector/...`, `/en/occupation/...`.
 * Query string and hash are preserved.
 */
function counterpartPath(pathname: string, targetLang: "es" | "en"): string {
  if (targetLang === "en") {
    if (pathname === "/" || pathname === "") return "/en/";
    if (pathname.startsWith("/en/") || pathname === "/en") return pathname;
    if (pathname.startsWith("/ocupacion/")) return "/en/occupation/" + pathname.slice("/ocupacion/".length);
    if (pathname.startsWith("/sector/")) return "/en" + pathname;
    return "/en" + pathname;
  }
  // targetLang === "es"
  if (pathname === "/en/" || pathname === "/en") return "/";
  if (pathname.startsWith("/en/occupation/")) return "/ocupacion/" + pathname.slice("/en/occupation/".length);
  if (pathname.startsWith("/en/sector/")) return pathname.slice("/en".length);
  if (pathname.startsWith("/en/")) return pathname.slice("/en".length);
  return pathname;
}

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";
  return (
    <button
      onClick={() => {
        const newLang: "es" | "en" = isEn ? "es" : "en";
        trackLanguageChange(newLang);
        const { pathname, search, hash } = window.location;
        window.location.href = counterpartPath(pathname, newLang) + search + hash;
      }}
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
