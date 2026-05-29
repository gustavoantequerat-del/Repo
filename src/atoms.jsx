// Atoms — small reusable components

// Brand glyph: 2x2 mark
const Tip = (props) => window.Tip(props);

const RANGE_OPTIONS = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "12m", label: "12M" },
];

function getRangeLabel(range) {
  return RANGE_OPTIONS.find(r => r.id === range)?.label || "12M";
}

function roundMetric(v) {
  if (Math.abs(v) >= 100) return Number(v.toFixed(1));
  if (Math.abs(v) >= 10) return Number(v.toFixed(2));
  return Number(v.toFixed(3));
}

function metricRange(monthly, monthLabels, range) {
  if (!monthly || monthly.length === 0) return { data: [], labels: [] };
  if (range === "12m") return { data: monthly, labels: monthLabels };

  const days = range === "30d" ? 30 : 7;
  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2] ?? last;
  const span = last - prev;
  const wobbleBase = Math.max(Math.abs(span), Math.abs(last) * 0.004, 0.01);
  const data = Array.from({ length: days }, (_, i) => {
    const t = days === 1 ? 1 : i / (days - 1);
    const wobble = Math.sin((i + 1) * 1.35) * wobbleBase * 0.12;
    return roundMetric(prev + span * t + wobble);
  });
  data[data.length - 1] = roundMetric(last);

  const labels = Array.from({ length: days }, (_, i) => {
    const remaining = days - i - 1;
    return remaining === 0 ? "Hoy" : `D-${remaining}`;
  });

  return { data, labels };
}

function scaleMetricValue(value, range, seed = 0) {
  if (range === "12m" || typeof value !== "number") return value;
  const base = range === "7d" ? 0.93 : 0.985;
  const spread = range === "7d" ? 0.13 : 0.045;
  const factor = base + ((Math.sin(seed * 1.77) + 1) / 2) * spread;
  return Math.max(0, Math.round(value * factor));
}

function scaleMetricData(rows, range, valueKey = "value") {
  if (range === "12m") return rows;
  return rows.map((row, i) => ({
    ...row,
    [valueKey]: scaleMetricValue(row[valueKey], range, i + 1),
  }));
}

function RangeSwitch({ range, setRange }) {
  return (
    <div className="tier-switch" role="tablist" aria-label="Rango temporal">
      {RANGE_OPTIONS.map(r => (
        <button key={r.id} data-on={range === r.id} onClick={() => setRange(r.id)}>{r.label}</button>
      ))}
    </div>
  );
}

function RangeBar({ range, setRange }) {
  return (
    <div className="range-bar">
      <span className="eyebrow">Ventana</span>
      <RangeSwitch range={range} setRange={setRange} />
    </div>
  );
}

function BrandGlyph() {
  return (
    <div className="brand-glyph" aria-hidden="true">
      <span></span><span></span><span></span><span></span>
    </div>
  );
}

// Risk pill
function RiskChip({ level, label }) {
  const map = { low: "chip-low", med: "chip-med", high: "chip-high" };
  const text = label || ({ low: "Bajo", med: "Medio", high: "Alto" }[level]);
  const g = window.BP2_GLOSSARY;
  return (
    <Tip text={g.risk[level]} pos="left">
      <span className={`chip ${map[level] || "chip-neutral"}`}>{text}</span>
    </Tip>
  );
}

// Delta inline
function Delta({ value }) {
  if (value == null) return <span className="num delta-flat">—</span>;
  const s = String(value);
  const up = s.startsWith("+") || (parseFloat(s) > 0 && !s.startsWith("−") && !s.startsWith("-"));
  const dn = s.startsWith("−") || s.startsWith("-");
  const cls = up ? "delta-up" : dn ? "delta-dn" : "delta-flat";
  const arr = up ? "▲" : dn ? "▼" : "■";
  return (
    <span className={`num ${cls}`} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <span style={{ fontSize: 8 }}>{arr}</span>{s.replace(/^[+−-]/, "")}
    </span>
  );
}

function fmtUsd(n) {
  if (typeof n !== "number") return n;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`;
  return `$${n}`;
}
function fmtNum(n) {
  if (typeof n !== "number") return n;
  return n.toLocaleString("en-US");
}

// Eyebrow header with hairline
function Eyebrow({ children, withLine }) {
  return (
    <div className="eyebrow-row">
      <span className="eyebrow">{children}</span>
      {withLine && <span className="line"></span>}
    </div>
  );
}

function TierRibbon({ tier }) {
  return (
    <span className="tier-ribbon">
      <span className="dot"></span> Tier {tier} · {tier === 1 ? "Executive" : tier === 2 ? "Professional" : "Regulator"}
    </span>
  );
}

// KPI strip
function KpiStrip({ items }) {
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
              {k.deltaNote && <span style={{ color: "var(--ink-4)" }}> {k.deltaNote}</span>}
            </div>
          )}
          {k.foot && <div className="kpi-foot">{k.foot}</div>}
        </div>
      ))}
    </div>
  );
}

function LockedHint({ tier, available, what }) {
  return (
    <div style={{
      border: "1px dashed var(--line-2)",
      padding: "32px 28px",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      color: "var(--ink-4)",
      fontSize: 13,
      background: "var(--surface-2)"
    }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Acceso restringido</div>
        <div style={{ color: "var(--ink-2)", fontWeight: 500 }}>
          {what || "Este módulo"} está disponible en {available.map(t => `Tier ${t}`).join(" · ")}.
        </div>
        <div style={{ marginTop: 4 }}>Tu nivel de acceso actual es Tier {tier}.</div>
      </div>
      <button className="btn-primary">Solicitar acceso</button>
    </div>
  );
}

// Family group header (icon-numbered)
function FamilyHead({ idx, title, sub }) {
  return (
    <div className="family-head">
      <span className="num-chip">{String(idx).padStart(2, "0")}</span>
      <div>
        <div className="ft">{title}</div>
        <div className="ft-sub">{sub}</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  BrandGlyph, RiskChip, Delta, fmtUsd, fmtNum, Eyebrow, TierRibbon, KpiStrip, LockedHint, FamilyHead,
  RANGE_OPTIONS, getRangeLabel, metricRange, scaleMetricValue, scaleMetricData, RangeSwitch, RangeBar
});
