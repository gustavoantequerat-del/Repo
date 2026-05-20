import { PageHead } from '../components/Shell.jsx';
import { RiskChip, Eyebrow } from '../components/Atoms.jsx';
import { Spark, HBarChart, VBarChart } from '../components/Chart.jsx';
import { Tip } from '../components/Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

const TOP_KPI_CODES = ['BBPI', 'BPX', 'PCI'];

export function ScreenOverview({ tier }) {
  const cadence = tier === 1 ? 'Resumen mensual' : tier === 2 ? 'Cierre diario consolidado' : 'Cierre EOD / T+1';
  const headerIndices = D.indicesSpec.filter(i => i.tiers.includes(tier)).slice(0, 6);
  const topKpis = TOP_KPI_CODES.map(code => D.indicesSpec.find(i => i.code === code));

  const platformsCap = [...D.platforms]
    .sort((a, b) => b.capacityBob - a.capacityBob)
    .map(p => ({ label: p.name.replace(' P2P', ''), value: p.capacityBob }));

  return (
    <>
      <PageHead
        eyebrow={tier === 1 ? 'Panel Ejecutivo · Tier 1' : tier === 2 ? 'Panel Profesional · Tier 2' : 'Panel Regulatorio · Tier 3'}
        title="Descripción general"
        desc="Feed de inteligencia institucional sobre el mercado P2P boliviano. Monitoreo de 13 índices propietarios BBIM con supervisión regulatoria."
        meta={[
          { label: 'Cadencia', value: cadence },
          { label: 'Captura', value: '30 Abr · 2026' },
          { label: 'Última sincronización', value: '—2 min' },
        ]}
      />

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {topKpis.map(idx => (
          <div className="card" key={idx.code}>
            <div style={{ padding: '18px 20px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Tip text={BP2_GLOSSARY.idx[idx.code]} pos="right">
                  <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.08em', cursor: 'default' }}>
                    {idx.code} · {idx.name.toUpperCase()} <span style={{ fontSize: 9, opacity: 0.6 }}>ⓘ</span>
                  </span>
                </Tip>
                <RiskChip level={idx.risk} />
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--ink-1)' }}>
                {idx.value} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink-4)' }}>{idx.unit}</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: idx.delta.startsWith('+') ? 'var(--risk-low)' : idx.delta.startsWith('−') || idx.delta.startsWith('-') ? 'var(--risk-high)' : 'var(--ink-4)' }}>
                {idx.delta.startsWith('+') ? '▲' : idx.delta.startsWith('−') || idx.delta.startsWith('-') ? '▼' : '■'} {idx.delta.replace(/^[+−-]/, '')} vs. Mar
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="editorial-card">
          <div className="row" style={{ alignItems: 'flex-start', marginBottom: 14 }}>
            <Eyebrow withLine>Comentario del Head of Research</Eyebrow>
            <span className="num" style={{ color: 'var(--ink-4)', fontSize: 11 }}>BP2PIM · Abr 2026</span>
          </div>
          <p className="editorial" style={{ margin: 0 }}>
            El mercado P2P boliviano cerró abril con un BPX de <strong>8.12%</strong> sobre la referencia oficial, sostenido por una compresión moderada de profundidad (LDI <strong>0.62</strong>) y una dominancia stable que sigue desplazándose hacia USDC. La concentración por plataforma se mantiene elevada — PCI <strong>0.51</strong> — y la exposición agregada por riel bancario sube a <strong>BES 0.74</strong>.
          </p>
          <p className="editorial" style={{ marginTop: 12, marginBottom: 0 }}>
            Recomendamos observar la transición USDT → USDC y el comportamiento del SDR antes de reasignar coberturas de exposición.
          </p>
          <div className="editorial-sig">— J. Salinas · Head of Research</div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Pulso de índices</div>
            <span className="eyebrow" style={{ fontSize: 9 }}>{tier === 3 ? '13 propietarios' : '9 propietarios'}</span>
          </div>
          <div style={{ padding: '8px 22px 12px' }}>
            {headerIndices.map((idx, i) => (
              <div key={idx.code} style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 70px 60px',
                gap: 14, alignItems: 'center',
                padding: '11px 0',
                borderBottom: i < headerIndices.length - 1 ? '1px solid var(--line-1)' : 'none',
                fontSize: 12.5,
              }}>
                <Tip text={BP2_GLOSSARY.idx[idx.code]} pos="right">
                  <span className="num" style={{ color: 'var(--ink-1)', fontWeight: 700, fontSize: 12 }}>{idx.code}</span>
                </Tip>
                <span style={{ color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idx.purpose}</span>
                <span className="num" style={{ color: 'var(--ink-1)', textAlign: 'right', fontWeight: 600 }}>{idx.value}</span>
                <Spark data={D.series[idx.code] || []} w={60} h={18} stroke="var(--accent)" />
              </div>
            ))}
          </div>
          <div className="card-foot">
            Ver los índices · módulo <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Índices</span>
          </div>
        </div>
      </div>

      <div style={{ height: 24 }} />

      <div className="grid-2-eq">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Capacidad visible por plataforma</div>
              <div className="card-sub">Top plataformas por capacidad visible en BOB</div>
            </div>
          </div>
          <div className="card-body">
            <HBarChart
              data={platformsCap}
              barThickness={14}
              color="var(--accent)"
              labelWidth={70}
              valueFmt={v => v >= 1e6 ? `${(v/1e6).toFixed(0)} M` : v >= 1e3 ? `${(v/1e3).toFixed(0)} k` : v}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Capacidad por criptoactivo</div>
              <div className="card-sub">Top 10 monedas + Otros</div>
            </div>
          </div>
          <div className="card-body">
            <VBarChart
              data={D.capacityByCrypto.map(c => ({ label: c.code, value: c.cap }))}
              height={260}
              color="var(--ink-1)"
              valueFmt={v => v >= 1e6 ? `${(v/1e6).toFixed(0)} M` : v >= 1e3 ? `${(v/1e3).toFixed(0)} k` : v}
            />
          </div>
        </div>
      </div>

      <div style={{ height: 24 }} />

      <div className="grid-2-eq">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Rieles bancarios</div>
              <div className="card-sub">Menciones por ofertas P2P</div>
            </div>
          </div>
          <div className="card-body">
            <HBarChart
              data={D.paymentMethods.slice(0, 10).map(p => ({ label: p.code, value: p.mentions }))}
              barThickness={14}
              color="#1B2E55"
              labelWidth={94}
              valueFmt={v => v >= 1e3 ? `${(v/1e3).toFixed(1)}k` : v}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Buy/Sell imbalance</div>
              <div className="card-sub">Distribución por side</div>
            </div>
          </div>
          <div className="card-body">
            <VBarChart
              data={[
                { label: 'buy',  value: D.platforms.reduce((s, p) => s + p.buyOffers,  0) },
                { label: 'sell', value: D.platforms.reduce((s, p) => s + p.sellOffers, 0) },
              ]}
              height={300}
              color="#F59E0B"
              valueFmt={v => v.toLocaleString('en-US')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
