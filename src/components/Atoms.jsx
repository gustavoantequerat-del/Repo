import { Tip } from './Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';

export function BrandGlyph() {
  return (
    <div className="brand-glyph" aria-hidden="true">
      <span></span><span></span><span></span><span></span>
    </div>
  );
}

export function RiskChip({ level, label }) {
  const map = { low: 'chip-low', med: 'chip-med', high: 'chip-high' };
  const text = label || ({ low: 'Bajo', med: 'Medio', high: 'Alto' }[level]);
  return (
    <Tip text={BP2_GLOSSARY.risk[level]} pos="left">
      <span className={`chip ${map[level] || 'chip-neutral'}`}>{text}</span>
    </Tip>
  );
}

export function Delta({ value }) {
  if (value == null) return <span className="num delta-flat">—</span>;
  const s = String(value);
  const up = s.startsWith('+') || (parseFloat(s) > 0 && !s.startsWith('−') && !s.startsWith('-'));
  const dn = s.startsWith('−') || s.startsWith('-');
  const cls = up ? 'delta-up' : dn ? 'delta-dn' : 'delta-flat';
  const arr = up ? '▲' : dn ? '▼' : '■';
  return (
    <span className={`num ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <span style={{ fontSize: 8 }}>{arr}</span>{s.replace(/^[+−-]/, '')}
    </span>
  );
}

export function fmtUsd(n) {
  if (typeof n !== 'number') return n;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`;
  return `$${n}`;
}

export function fmtNum(n) {
  if (typeof n !== 'number') return n;
  return n.toLocaleString('en-US');
}

export function Eyebrow({ children, withLine }) {
  return (
    <div className="eyebrow-row">
      <span className="eyebrow">{children}</span>
      {withLine && <span className="line"></span>}
    </div>
  );
}

export function TierRibbon({ tier }) {
  return (
    <span className="tier-ribbon">
      <span className="dot"></span> Tier {tier} · {tier === 1 ? 'Executive' : tier === 2 ? 'Professional' : 'Regulator'}
    </span>
  );
}

export function KpiStrip({ items }) {
  return (
    <div className="kpi-strip">
      {items.map((k, i) => (
        <div className="kpi" key={i}>
          <div className="kpi-row">
            <div className="kpi-label">
              {k.tip ? <Tip text={k.tip} icon>{k.label}</Tip> : k.label}
            </div>
            {k.risk && <RiskChip level={k.risk} />}
          </div>
          <div className="kpi-value">{k.value}{k.unit && <span className="kpi-unit">{k.unit}</span>}</div>
          {k.delta && (
            <div className="kpi-delta">
              <Delta value={k.delta} />
              {k.deltaNote && <span style={{ color: 'var(--ink-4)' }}> {k.deltaNote}</span>}
            </div>
          )}
          {k.foot && <div className="kpi-foot">{k.foot}</div>}
        </div>
      ))}
    </div>
  );
}

export function LockedHint({ tier, available, what }) {
  return (
    <div style={{
      border: '1px dashed var(--line-2)',
      padding: '32px 28px',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'var(--ink-4)',
      fontSize: 13,
      background: 'var(--surface-2)',
    }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Acceso restringido</div>
        <div style={{ color: 'var(--ink-2)', fontWeight: 500 }}>
          {what || 'Este módulo'} está disponible en {available.map(t => `Tier ${t}`).join(' · ')}.
        </div>
        <div style={{ marginTop: 4 }}>Tu nivel de acceso actual es Tier {tier}.</div>
      </div>
      <button className="btn-primary">Solicitar acceso</button>
    </div>
  );
}

export function FamilyHead({ idx, title, sub }) {
  return (
    <div className="family-head">
      <span className="num-chip">{String(idx).padStart(2, '0')}</span>
      <div>
        <div className="ft">{title}</div>
        <div className="ft-sub">{sub}</div>
      </div>
    </div>
  );
}
