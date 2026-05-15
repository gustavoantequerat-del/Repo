import { BrandGlyph, Eyebrow } from './Atoms.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';

const NAV = [
  { group: 'Panorama', items: [
    { id: 'overview',   label: 'Overview',         tiers: [1,2,3] },
    { id: 'platforms',  label: 'Platforms',        tiers: [1,2,3] },
    { id: 'cryptos',    label: 'Cryptocurrencies', tiers: [1,2,3] },
  ]},
  { group: 'Estructura', items: [
    { id: 'banks',      label: 'Banking Rails',    tiers: [2,3] },
    { id: 'indices',    label: 'Indices',          tiers: [1,2,3] },
    { id: 'merchants',  label: 'Merchants',        tiers: [2,3] },
  ]},
  { group: 'Operación', items: [
    { id: 'alerts',     label: 'Alertas',          tiers: [2,3] },
    { id: 'scenarios',  label: 'Escenarios',       tiers: [3] },
    { id: 'reports',    label: 'Reports',          tiers: [1,2,3] },
  ]},
];

const NAV_TIPS = {
  overview:   'Síntesis ejecutiva del mercado P2P boliviano: KPIs de cabecera, comentario del Head of Research y top de plataformas, criptos y rails.',
  platforms:  'Ranking institucional de las plataformas P2P públicas. Cuota, ofertas de compra y venta, completion y spread.',
  cryptos:    'Mix de criptoactivos del mercado: stablecoins (USDT, USDC, DAI) y no-stables (BTC, ETH). Dominancia y volumen 24h.',
  banks:      'Bank Exposure Score por carril bancario. Capacidad rastreada, menciones y participación sobre el total.',
  indices:    'Suite propietaria de los 13 índices BBIM, organizada en 4 familias: precio, liquidez, estructura y cumplimiento.',
  merchants:  'Concentración (MCI), capacidad observada y perfil de riesgo (MRP) por operador.',
  alerts:     'Sistema de alertas configurables sobre los 13 índices. Crea reglas con umbrales y operadores (>, <, ≥, ≤).',
  scenarios:  'Simulación determinística de sensibilidad del mercado: shocks de FX, retiro de stablecoins y restricciones regulatorias.',
  reports:    'Repositorio cronológico de reportes descargables: Executive (mensual), Analytical (quincenal), Regulatory (bajo solicitud).',
};

export function Sidebar({ active, onSelect, tier, alertCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <BrandGlyph />
          <div>
            <div className="brand-name">BP2PIM</div>
          </div>
        </div>
        <div className="brand-tag">Bolivia P2P<br/>Intelligence Monitor</div>
      </div>
      <nav className="nav">
        {NAV.map(group => (
          <div className="nav-section" key={group.group}>
            <div className="nav-section-title">{group.group}</div>
            {group.items.map(item => {
              const accessible = item.tiers.includes(tier);
              return (
                <div
                  key={item.id}
                  className={`nav-item ${accessible ? '' : 'locked'}`}
                  data-active={active === item.id}
                  title={NAV_TIPS[item.id]}
                  onClick={() => onSelect(item.id)}
                >
                  <span>{item.label}</span>
                  {item.id === 'alerts' && accessible && alertCount > 0 && (
                    <span className="chip chip-high" style={{ fontSize: 9.5, padding: '1px 6px' }}>{alertCount}</span>
                  )}
                  {!accessible && (
                    <span className="tag">T{Math.min(...item.tiers)}+</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="row"><span>Snapshot</span><span className="num" style={{ color: 'var(--ink-1)' }}>Abr · 2026</span></div>
        <div className="row"><span>Build</span><span className="num" style={{ color: 'var(--ink-1)' }}>v1.0 · MVP</span></div>
        <div className="row"><span>Cadencia</span><span className="num" style={{ color: 'var(--ink-1)' }}>{tier === 1 ? 'Mensual' : tier === 2 ? 'Diaria' : 'EOD / T+1'}</span></div>
      </div>
    </aside>
  );
}

export function Topbar({ tier, setTier, crumbs }) {
  const tierLabels = {
    1: 'Tier 1 — Executive: dashboard mensual + PDF. Sin descarga de datos.',
    2: 'Tier 2 — Professional: diario + API. Suite completa de 13 índices, alertas y proyecciones.',
    3: 'Tier 3 — Regulator: EOD/T+1. Entidades nombradas, flow monitor y escenarios.',
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
          {[1, 2, 3].map(t => (
            <button key={t} data-on={tier === t} onClick={() => setTier(t)} title={tierLabels[t]}>
              Tier {t}
            </button>
          ))}
        </div>
        <button className="btn-ghost">Filtros</button>
        <button className="btn-primary">Exportar</button>
      </div>
    </div>
  );
}

export function PageHead({ eyebrow, title, desc, meta }) {
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
              <div key={i}><span style={{ color: 'var(--ink-5)' }}>{m.label} </span><span className="v">{m.value}</span></div>
            ))}
          </div>
        )}
      </div>
      <div className="page-head-divider"></div>
    </>
  );
}

export function Foot() {
  return (
    <div className="foot">
      <span>Blockfinity Research · Inteligencia Institucional</span>
      <span>Confidencial — uso interno · v1.0 · 2026</span>
    </div>
  );
}
