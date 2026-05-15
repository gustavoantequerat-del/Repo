import { PageHead } from '../components/Shell.jsx';
import { KpiStrip } from '../components/Atoms.jsx';
import { InteractiveChart } from '../components/Chart.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

export function ScreenCryptos({ tier }) {
  const visible = D.cryptos.filter(c => c.tiers.includes(tier));
  const colors = [
    'var(--accent)', 'var(--accent-2)', 'var(--accent-3)', 'var(--ink-2)',
    'var(--ink-4)', 'var(--ink-5)', 'var(--ink-6)', 'var(--surface-sunk)',
  ];

  return (
    <>
      <PageHead
        eyebrow="Activos cripto"
        title="Cryptocurrencies"
        desc="Mix de criptoactivos operando en el mercado P2P boliviano. Dominancia, volumen 24h y desplazamientos estructurales del snapshot validado."
        meta={[
          { label: 'Activos rastreados', value: D.cryptos.length },
          { label: 'SDR · Stable dominance', value: '87.4%' },
          { label: 'Vol. estable 24h', value: '$24.6 M' },
        ]}
      />

      <KpiStrip items={[
        { label: 'SDR · Stable dominance', value: '87.4', unit: '%', delta: '−0.30 pp', deltaNote: 'vs. Mar', risk: 'low', tip: BP2_GLOSSARY.idx.SDR },
        { label: 'USDT participación',     value: '71.4', unit: '%', delta: '−1.7 pp',  deltaNote: 'vs. Mar', risk: 'med', tip: 'USDT — stablecoin emitida por Tether. Históricamente dominante en el mercado P2P boliviano.' },
        { label: 'USDC participación',     value: '19.8', unit: '%', delta: '+1.4 pp',  deltaNote: 'vs. Mar', risk: 'low', tip: 'USDC — stablecoin emitida por Circle. Ha ganado cuota frente a USDT durante el último trimestre.' },
        { label: 'BTC + ETH (non-stable)', value: '4.0',  unit: '%', delta: '+0.6 pp',  deltaNote: 'vs. Mar', risk: 'low', tip: 'Cuota agregada de criptoactivos no-stable (Bitcoin + Ethereum) sobre el total del mercado P2P.' },
      ]} />

      <div style={{ height: 24 }} />

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Composición del mercado</div>
            <div className="card-sub">Snapshot Abr · 2026</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', height: 14, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--line-1)', marginBottom: 20 }}>
              {visible.map((c, i) => (
                <div key={c.code} style={{ width: `${c.share}%`, background: colors[i % colors.length] }} title={`${c.code}: ${c.share}%`} />
              ))}
            </div>
            {visible.map((c, i) => {
              const delta = (c.share - c.prev);
              return (
                <div key={c.code} style={{
                  display: 'grid', gridTemplateColumns: '16px 64px 1fr 60px 90px 80px',
                  gap: 12, alignItems: 'center', padding: '11px 0',
                  borderBottom: i < visible.length - 1 ? '1px solid var(--line-1)' : 'none',
                  fontSize: 13,
                }}>
                  <span style={{ width: 10, height: 10, background: colors[i % colors.length], borderRadius: 2 }}></span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{c.code}</span>
                  <span style={{ color: 'var(--ink-4)' }}>{c.name}</span>
                  <span className="chip-tier" style={{ textAlign: 'center' }}>{c.type}</span>
                  <span className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{c.share.toFixed(1)}%</span>
                  <span className="num" style={{ textAlign: 'right', color: delta >= 0 ? 'var(--risk-low)' : 'var(--risk-high)' }}>
                    {delta >= 0 ? '+' : ''}{delta.toFixed(1)} pp
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">SDR · serie temporal</div>
              <div className="card-sub">Dominancia stable · 12 meses</div>
            </div>
            <div className="cluster">
              <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>87.4%</span>
            </div>
          </div>
          <div className="card-body">
            <InteractiveChart data={D.series.SDR} labels={D.monthsLabels} unit="%" height={220} />
            <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--ink-4)', lineHeight: 1.55 }}>
              Lectura: descenso suave y sostenido a lo largo del trimestre. La cesión USDT → USDC continúa siendo el desplazamiento estructural más relevante observado.
            </p>
          </div>
        </div>
      </div>

      {tier === 3 && (
        <>
          <div style={{ height: 24 }} />
          <div className="card">
            <div className="card-head">
              <div className="card-title">Stablecoin flow monitor</div>
              <span className="chip chip-accent">TIER 3 · REGULATOR</span>
            </div>
            <div className="card-body">
              <div className="grid-4">
                {[
                  { label: 'Flujo neto entrante', v: '+ $4.12 M', note: 'USDT mainnet',                risk: 'low'  },
                  { label: 'Flujo neto saliente', v: '− $1.84 M', note: 'USDC mainnet',                risk: 'low'  },
                  { label: 'Rails involucrados',  v: '4',          note: 'BCB · BMS · BUN · BIE',       risk: 'med'  },
                  { label: 'Eventos detectados',  v: '23',         note: 'Sobre umbral institucional',  risk: 'high' },
                ].map((k, i) => (
                  <div key={i} className="kpi" style={{ background: 'var(--surface-2)' }}>
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-value" style={{ fontSize: 22 }}>{k.v}</div>
                    <div className="kpi-foot">{k.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
