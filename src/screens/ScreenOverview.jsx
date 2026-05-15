import { PageHead } from '../components/Shell.jsx';
import { KpiStrip, RiskChip, Delta, Eyebrow } from '../components/Atoms.jsx';
import { InteractiveChart, Spark } from '../components/Chart.jsx';
import { Tip } from '../components/Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

export function ScreenOverview({ tier }) {
  const cadence = tier === 1 ? 'Resumen mensual' : tier === 2 ? 'Cierre diario consolidado' : 'Cierre EOD / T+1';
  const headerIndices = D.indicesSpec.filter(i => i.tiers.includes(tier)).slice(0, 6);

  return (
    <>
      <PageHead
        eyebrow={tier === 1 ? 'Panel Ejecutivo · Tier 1' : tier === 2 ? 'Panel Profesional · Tier 2' : 'Panel Regulatorio · Tier 3'}
        title="Overview"
        desc="Feed de inteligencia institucional sobre el mercado P2P boliviano. Monitoreo de 13 índices propietarios BBIM a través del feed de Crystal con supervisión regulatoria."
        meta={[
          { label: 'Cadencia', value: cadence },
          { label: 'Snapshot', value: '30 Abr · 2026' },
          { label: 'Última sync', value: '—2 min' },
        ]}
      />

      <KpiStrip items={[
        { label: 'BBPI · Benchmark P2P',    value: '6.92', unit: 'BOB', delta: '+0.41%',    deltaNote: 'vs. Mar', risk: 'low', tip: BP2_GLOSSARY.idx.BBPI },
        { label: 'BPX · Premium',           value: '8.12', unit: '%',   delta: '+0.04 pp',  deltaNote: 'vs. Mar', risk: 'med', tip: BP2_GLOSSARY.idx.BPX },
        { label: 'SDR · Dominancia stable', value: '87.4', unit: '%',   delta: '−0.30 pp',  deltaNote: 'vs. Mar', risk: 'low', tip: BP2_GLOSSARY.idx.SDR },
        { label: 'Plataformas activas',     value: '9',                  delta: '+1',        deltaNote: 'vs. Mar', risk: 'low', tip: BP2_GLOSSARY.kpi.activePlatforms },
      ]} />

      <div style={{ height: 24 }} />

      <div className="grid-2">
        <div className="editorial-card">
          <div className="row" style={{ alignItems: 'flex-start', marginBottom: 14 }}>
            <Eyebrow withLine>Comentario del Head of Research</Eyebrow>
            <span className="num" style={{ color: 'var(--ink-4)', fontSize: 11 }}>BP2PIM · Abr 2026</span>
          </div>
          <p className="editorial" style={{ margin: 0 }}>
            El mercado P2P boliviano cerró abril con un BPX de <strong>8.12%</strong> sobre la referencia oficial, sostenido por una compresión moderada de profundidad (LDI <strong>0.62</strong>) y una dominancia stable que sigue desplazándose hacia USDC. La concentración por plataforma se mantiene elevada — PCI <strong>0.51</strong> — y la exposición agregada por rail bancario sube a <strong>BES 0.74</strong>.
          </p>
          <p className="editorial" style={{ marginTop: 12, marginBottom: 0 }}>
            Recomendamos observar la transición USDT → USDC y el comportamiento del SDR antes de reasignar coberturas de exposición.
          </p>
          <div className="editorial-sig">— J. Salinas · Head of Research</div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Pulso de índices</div>
            <span className="eyebrow" style={{ fontSize: 9 }}>13 propietarios</span>
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
            Ver los 13 índices · módulo <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Indices</span>
          </div>
        </div>
      </div>

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">BPX · Premium evolution</div>
            <div className="card-sub">Prima del mercado P2P sobre la referencia oficial · 12 meses</div>
          </div>
          <div className="cluster">
            <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>8.12%</span>
            <Delta value="+0.04 pp" />
          </div>
        </div>
        <div className="card-body">
          <InteractiveChart data={D.series.BPX} labels={D.monthsLabels} unit="%" height={240}
                            showThreshold={9.0} thresholdLabel="Alerta" />
        </div>
      </div>

      <div style={{ height: 24 }} />

      <div className="grid-3">
        <SimpleListCard title="Top plataformas"
          rows={D.platforms.slice(0, 5).map(p => ({
            left: <span className="logo-cell"><span className="logo-square">{p.code[0]}</span>{p.name}</span>,
            right: `${p.share.toFixed(1)}%`,
          }))} />
        <SimpleListCard title="Top cryptocurrencies"
          rows={D.cryptos.slice(0, 5).map(c => ({
            left: <span className="logo-cell"><span className="logo-square">{c.code[0]}</span>{c.code}</span>,
            right: `${c.share.toFixed(1)}%`,
          }))} />
        <SimpleListCard title="Exposición bancaria"
          rows={D.banks.slice(0, 5).map(b => ({
            left: (
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--ink-1)' }}>{b.name}</span>
                <span style={{ fontSize: 10.5, color: 'var(--ink-5)', fontFamily: 'var(--font-mono)' }}>{b.code}</span>
              </span>
            ),
            right: b.exposure.toFixed(2),
            risk: b.risk,
          }))} />
      </div>
    </>
  );
}

function SimpleListCard({ title, rows }) {
  return (
    <div className="card">
      <div className="card-head"><div className="card-title">{title}</div></div>
      <div style={{ padding: '4px 22px 14px' }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0',
            borderBottom: i < rows.length - 1 ? '1px solid var(--line-1)' : 'none',
          }}>
            <div style={{ fontSize: 13 }}>{r.left}</div>
            <div className="cluster">
              {r.risk && <RiskChip level={r.risk} />}
              <span className="num" style={{ fontSize: 13, color: 'var(--ink-1)', fontWeight: 600 }}>{r.right}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
