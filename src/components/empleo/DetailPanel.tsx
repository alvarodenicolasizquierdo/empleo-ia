import { useTranslation } from "react-i18next";
import { ScoreBadge } from "./Badge";
import {
  type Occupation, getScoreColor, getScoreLabel,
  fmt, fmtE, EU_LABELS, EU_COLORS, getTipoLabelContextual
} from "@/lib/occupationData";

interface DetailProps {
  item: Occupation | null;
  onClose: () => void;
}

export function DetailPanel({ item, onClose }: DetailProps) {
  const { t } = useTranslation();
  if (!item) return null;
  const wage = item.empleo * item.salario * (item.score / 10);
  const S = "'Cormorant Garamond', serif";
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: "min(400px, 88vw)",
      background: "#faf8f4", borderLeft: "2px solid #e0dcd4", zIndex: 1000,
      padding: "28px 24px", overflowY: "auto",
      animation: "slideR 0.2s ease-out",
      boxShadow: "-12px 0 40px rgba(0,0,0,0.12)",
    }}>
      <style>{`@keyframes slideR{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      <button onClick={onClose} style={{
        position: "absolute", top: 12, right: 12, background: "#f0ece4",
        border: "1px solid #d8d4cc", color: "#888", fontSize: 15, cursor: "pointer",
        borderRadius: "50%", width: 32, height: 32,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>&#10005;</button>

      {/* Header */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: "#999", marginBottom: 6 }}>
        CNO {item.cno} &middot; {item.sector}
      </div>
      <h2 style={{
        fontSize: 24, fontFamily: S, color: "#1a1a1a",
        margin: "0 0 16px", lineHeight: 1.2, paddingRight: 36, fontWeight: 600
      }}>{item.name}</h2>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <ScoreBadge score={item.score} size="lg" />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: getScoreColor(item.score) }}>
            {t("detail.exposure")} {getScoreLabel(item.score)}
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>{item.score.toFixed(1)} / 10</div>
          <div style={{ fontSize: 10, color: "#b08050", marginTop: 2, fontStyle: "italic" }}>{t("detail.theoreticalCaveat")}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {([[t("detail.employees"), fmt(item.empleo)], [t("detail.avgSalary"), fmtE(item.salario)]] as const).map(([l, v]) => (
          <div key={l} style={{ padding: 12, background: "#f0ece4", borderRadius: 6 }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", color: "#999", marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", fontFamily: S }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Automation vector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", color: "#999", marginBottom: 6 }}>{t("detail.automationVector")}</div>
        <div style={{
          fontSize: 13, color: "#444", lineHeight: 1.5, padding: 10,
          background: "#f0ece4", borderRadius: 5, borderLeft: `3px solid ${getScoreColor(item.score)}`
        }}>{item.vector}</div>
      </div>

      {/* Impact type */}
      <div style={{ marginBottom: 12 }}>
        <span style={{
          padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 600,
          background: "#f0ece4", color: "#666", border: "1px solid #e0dcd4"
        }}>{getTipoLabelContextual(item.tipo, item.score)}</span>
      </div>

      {/* Contexto regulatorio */}
      <div style={{ marginBottom: 16, padding: "10px 14px", background: `${EU_COLORS[item.euRisk]}0d`, borderRadius: 6, border: `1px solid ${EU_COLORS[item.euRisk]}22` }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", color: "#999", marginBottom: 5, fontWeight: 600 }}>{t("detail.regulatoryContext")}</div>
        <span style={{
          padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600,
          background: `${EU_COLORS[item.euRisk]}18`, color: EU_COLORS[item.euRisk],
          border: `1px solid ${EU_COLORS[item.euRisk]}33`
        }}>EU AI Act: {EU_LABELS[item.euRisk]}</span>
        <div style={{ fontSize: 10, color: "#888", fontStyle: "italic", marginTop: 5 }}>{t("detail.regulatoryExplainer")}</div>
      </div>

      {/* Employment confidence */}
      {item.employmentConfidence && (
        <div style={{ marginBottom: 16, padding: "10px 14px", background: "#f0ece4", borderRadius: 6 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", color: "#999", marginBottom: 5, fontWeight: 600 }}>{t("detail.estimationQuality")}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700,
              background: item.employmentConfidence === "A+" ? "#3a7d9e22" : item.employmentConfidence === "A" ? "#5494ab22" : "#d4a85a22",
              color: item.employmentConfidence === "A+" ? "#2b6a8e" : item.employmentConfidence === "A" ? "#3a7d9e" : "#b08050",
              border: `1px solid ${item.employmentConfidence === "A+" ? "#3a7d9e44" : item.employmentConfidence === "A" ? "#5494ab44" : "#d4a85a44"}`,
            }}>{item.employmentConfidence}</span>
            <span style={{ fontSize: 10, color: "#555" }}>
              {item.employmentConfidence === "A+" ? t("detail.confidenceAPlus") :
               item.employmentConfidence === "A" ? t("detail.confidenceA") :
               t("detail.confidenceB")}
            </span>
          </div>
        </div>
      )}

      {/* Wage index */}
      <div style={{ padding: 14, background: "#f0ece4", borderRadius: 6, marginBottom: 12 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", color: "#999", marginBottom: 6 }}>{t("detail.wageIndex")}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#c8633a", fontFamily: S }}>
          {wage >= 1e9 ? (wage / 1e9).toFixed(1) + "B \u20AC" : (wage / 1e6).toFixed(0) + "M \u20AC"}
        </div>
        <div style={{ fontSize: 10, color: "#c8633a", marginTop: 2, fontWeight: 600 }}>{t("detail.wageSubtitle")}</div>
        <div style={{ fontSize: 10, color: "#999", marginTop: 3 }}>
          {t("detail.formula")}: {fmt(item.empleo)} &times; {fmtE(item.salario)} &times; ({item.score.toFixed(1)}/10)
        </div>
      </div>

      {/* Reliability */}
      <div style={{ padding: "8px 12px", background: "#f0ece4", borderRadius: 5, fontSize: 10, color: "#888", lineHeight: 1.5 }}>
        <strong style={{ color: "#999" }}>{t("detail.reliability")}</strong> <span dangerouslySetInnerHTML={{ __html: t("detail.reliabilityText") }} />
      </div>
    </div>
  );
}
