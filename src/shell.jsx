// Shell — sidebar plano, topbar minimal, footer

const BrandGlyph = (props) => window.BrandGlyph(props);
const Eyebrow = (props) => window.Eyebrow(props);

const NAV = [
  { id: "overview",   label: "Descripción general",  tiers: [1,2,3] },
  { id: "platforms",  label: "Plataformas",           tiers: [1,2,3] },
  { id: "cryptos",    label: "Criptoactivos",         tiers: [1,2,3] },
  { id: "banks",      label: "Rieles bancarios",      tiers: [1,2,3] },
  { id: "indices",    label: "Índices",               tiers: [1,2,3] },
  { id: "merchants",  label: "Comerciantes",          tiers: [2,3] },
  { id: "alerts",     label: "Alertas",               tiers: [2,3] },
  { id: "reports",    label: "Reportes",              tiers: [1,2,3] },
];

const NAV_TIPS = {
  overview:   "Síntesis ejecutiva del mercado P2P boliviano: KPIs de cabecera, comentario editorial y rankings agregados de plataformas, criptoactivos y rieles bancarios.",
  platforms:  "Ranking institucional de las plataformas P2P. Cuota, ofertas de compra y venta, completion y spread.",
  cryptos:    "Mix de criptoactivos del mercado: stablecoins (USDT, USDC, DAI) y no-stables (BTC, ETH). Dominancia y volumen 24h.",
  banks:      "Bank Exposure Score por riel bancario. Capacidad rastreada, menciones y participación sobre el total.",
  indices:    "Suite propietaria de los 13 índices BBIM, organizada en 4 familias: precio, liquidez, estructura y cumplimiento.",
  merchants:  "Concentración (MCI), capacidad observada y perfil de riesgo (MRP) por operador.",
  alerts:     "Sistema de alertas configurables sobre los índices. Crea reglas con umbrales y operadores (>, <, ≥, ≤).",
  reports:    "Repositorio cronológico de reportes descargables: Ejecutivo (mensual), Analítico (quincenal), Regulatorio (bajo solicitud).",
};

function Sidebar({ active, onSelect, tier, alertCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <BrandGlyph />
          <div className="brand-name">BP2PIM</div>
        </div>
        <div className="brand-tag">Bolivia P2P<br/>Intelligence Monitor</div>
      </div>
      <nav className="nav">
        <div className="nav-section">
          {NAV.map(item => {
            const accessible = item.tiers.includes(tier);
            return (
              <div
                key={item.id}
                className={`nav-item ${accessible ? "" : "locked"}`}
                data-active={active === item.id}
                title={NAV_TIPS[item.id]}
                onClick={() => onSelect(item.id)}
              >
                <span>{item.label}</span>
                {item.id === "alerts" && accessible && alertCount > 0 && (
                  <span className="chip chip-high" style={{ fontSize: 9.5, padding: "1px 6px" }}>{alertCount}</span>
                )}
                {!accessible && (
                  <span className="tag">T{Math.min(...item.tiers)}+</span>
                )}
              </div>
            );
          })}
        </div>
      </nav>
      <div className="sidebar-foot">
        <div className="row"><span>Captura</span><span className="num" style={{ color: "var(--ink-1)" }}>Abr · 2026</span></div>
        <div className="row"><span>Versión</span><span className="num" style={{ color: "var(--ink-1)" }}>v1.0 · MVP</span></div>
        <div className="row"><span>Cadencia</span><span className="num" style={{ color: "var(--ink-1)" }}>{tier === 1 ? "Mensual" : tier === 2 ? "Diaria" : "EOD / T+1"}</span></div>
      </div>
    </aside>
  );
}

function Topbar({ tier, setTier, crumbs }) {
  const tierLabels = {
    1: "Tier 1 — Ejecutivo: dashboard mensual + PDF. Sin descarga de datos.",
    2: "Tier 2 — Profesional: diario + API. Suite de 9 índices con series temporales y alertas.",
    3: "Tier 3 — Regulador: EOD/T+1. 13 índices con la familia de cumplimiento y riesgo sistémico."
  };
  return (
    <div className="topbar">
      <div className="crumbs">
        <span>BLOCKFINITY</span>
        <span className="sep">/</span>
        <span>BP2PIM</span>
        <span className="sep">/</span>
        <strong>{crumbs}</strong>
      </div>
      <div className="topbar-right">
        <div className="tier-switch" role="tablist" aria-label="Nivel de acceso">
          {[1,2,3].map(t => (
            <button key={t} data-on={tier === t} onClick={() => setTier(t)} title={tierLabels[t]}>
              Tier {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageHead({ eyebrow, title, desc, meta }) {
  return (
    <>
      <div className="page-head">
        <div>
          <Eyebrow withLine>{eyebrow}</Eyebrow>
          <h1 className="page-title">{title}</h1>
          <div className="page-desc">{desc}</div>
        </div>
        {meta && (
          <div className="page-meta">
            {meta.map((m, i) => (
              <div key={i}><span style={{ color: "var(--ink-5)" }}>{m.label} </span><span className="v">{m.value}</span></div>
            ))}
          </div>
        )}
      </div>
      <div className="page-head-divider"></div>
    </>
  );
}

function Foot() {
  return (
    <div className="foot">
      <span>Blockfinity Research · Inteligencia Institucional</span>
      <span>Confidencial — uso interno · v1.0 · 2026</span>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, PageHead, Foot, NAV });
