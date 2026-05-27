import { PageHead } from '../components/Shell.jsx';
import { KpiStrip, RiskChip, Delta } from '../components/Atoms.jsx';
import { InteractiveChart, DonutChart } from '../components/Chart.jsx';
import { Tip } from '../components/Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

const PLATFORM_PALETTE = {
  'Binance P2P': '#2563EB',
  'Bybit':       '#14B8A6',
  'Bitget':      '#F59E0B',
  'OKX':         '#EF4444',
  'KuCoin':      '#22C55E',
};

export function ScreenPlatforms({ tier }) {
  const byCap = [...D.platforms].sort((a, b) => b.capacityBob - a.capacityBob);
  const donutData = byCap.map(p => ({
    label: p.name.replace(' P2P', ''),
    value: p.capacityBob,
    color: PLATFORM_PALETTE[p.name] || '#94A3B8',
  }));
  const totalCap = byCap.reduce((s, p) => s + p.capacityBob, 0);

  return (
    <>
      <PageHead
        eyebrow="Mercado P2P · Plataformas"
        title="Plataformas"
        desc="Ranking institucional de las 5 plataformas P2P públicas con operaciones en Bolivia: Binance P2P, OKX, Bybit, KuCoin y Bitget."
        meta={[
          { label: 'Plataformas', value: D.platforms.length },
          { label: 'Visibles en Tier', value: tier },
          { label: 'Captura', value: 'Abr · 2026' },
        ]}
      />

      <div className="grid-2-eq" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Participación por plataforma</div>
              <div className="card-sub">Capacidad visible en BOB</div>
            </div>
          </div>
          <div className="card-body">
            <DonutChart
              data={donutData}
              centerLabel="Capacidad total"
              centerValue={`Bs ${(totalCap / 1e6).toFixed(1)}M`}
              height={280}
              thickness={36}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{tier === 1 ? 'Cuota agregada' : 'PCI · Concentración'}</div>
              <div className="card-sub">{tier === 1 ? 'Top plataformas por participación visible' : 'HHI por plataforma · 12 meses'}</div>
            </div>
            {tier > 1 && (
              <div className="cluster">
                <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>0.51</span>
                <Delta value="−0.01" />
              </div>
            )}
          </div>
          <div className="card-body">
            {tier === 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
                {byCap.map(p => (
                  <div key={p.code} style={{ display: 'grid', gridTemplateColumns: '16px 130px 1fr 70px', gap: 12, alignItems: 'center', fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, background: PLATFORM_PALETTE[p.name], borderRadius: 2 }}></span>
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                    <span className="bar"><span style={{ width: `${p.share}%`, background: PLATFORM_PALETTE[p.name] }}></span></span>
                    <span className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{p.share.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <InteractiveChart data={D.series.PCI} labels={D.monthsLabels} unit="HHI" height={220} showThreshold={0.60} />
            )}
          </div>
        </div>
      </div>

      {tier !== 1 && (
        <>
          <KpiStrip items={[
            { label: 'Ofertas de compra (24h)',  value: '1 899', delta: '+124', deltaNote: 'vs. ayer', tip: BP2_GLOSSARY.col.buy },
            { label: 'Ofertas de venta (24h)',   value: '1 357', delta: '+86',  deltaNote: 'vs. ayer', tip: BP2_GLOSSARY.col.sell },
            { label: 'HHI plataforma · PCI',     value: '0.51',  delta: '−0.01', deltaNote: 'vs. Mar', risk: 'med', tip: BP2_GLOSSARY.idx.PCI },
            { label: 'Spread medio P2P',         value: '0.84',  unit: '%', delta: '+0.06 pp', deltaNote: 'vs. Mar', tip: BP2_GLOSSARY.col.spread },
          ]} />

          <div style={{ height: 24 }} />

          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Ranking institucional</div>
                <div className="card-sub">Captura Abr · 2026 — ofertas como número, no como volumen monetario</div>
              </div>
            </div>
            <table className="t">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th>Plataforma</th>
                  <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.share} icon>Cuota</Tip></th>
                  <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.buy} icon>Ofertas compra</Tip></th>
                  <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.sell} icon>Ofertas venta</Tip></th>
                  <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.completion} icon>Completion</Tip></th>
                  <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.spread} icon>Spread</Tip></th>
                  <th>Riesgo</th>
                </tr>
              </thead>
              <tbody>
                {byCap.map(p => (
                  <tr key={p.code}>
                    <td className="num" style={{ color: 'var(--ink-4)' }}>{String(p.rank).padStart(2, '0')}</td>
                    <td>
                      <span className="logo-cell">
                        <span className="logo-square" style={{ background: PLATFORM_PALETTE[p.name], color: '#fff', border: 0 }}>{p.code[0]}</span>
                        {p.name}
                      </span>
                    </td>
                    <td className="num" style={{ fontWeight: 600 }}>{p.share.toFixed(1)}%</td>
                    <td className="num"><span style={{ color: 'var(--risk-low)' }}>{p.buyOffers}</span></td>
                    <td className="num"><span style={{ color: 'var(--risk-high)' }}>{p.sellOffers}</span></td>
                    <td className="num">{p.completion ? `${p.completion.toFixed(1)}%` : '—'}</td>
                    <td className="num">{p.spread ? `${p.spread.toFixed(2)}%` : '—'}</td>
                    <td><RiskChip level={p.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
