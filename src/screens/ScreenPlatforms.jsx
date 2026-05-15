import { PageHead } from '../components/Shell.jsx';
import { KpiStrip, RiskChip } from '../components/Atoms.jsx';
import { InteractiveChart } from '../components/Chart.jsx';
import { Tip } from '../components/Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

export function ScreenPlatforms({ tier }) {
  const visible = D.platforms.filter(p => p.tiers.includes(tier));
  const hidden  = D.platforms.filter(p => !p.tiers.includes(tier));

  return (
    <>
      <PageHead
        eyebrow="Mercado P2P · Plataformas"
        title="Platform Rankings"
        desc="Ranking institucional de plataformas P2P públicas operando en Bolivia. Cuota, número de ofertas de compra y venta, tasa de completion y spread medio observado."
        meta={[
          { label: 'Plataformas', value: D.platforms.length },
          { label: 'Visibles en Tier', value: tier },
          { label: 'Ofertas totales', value: '3 142' },
        ]}
      />

      <KpiStrip items={[
        { label: 'Buy offers (24h)',     value: '1 853', delta: '+124',   deltaNote: 'vs. ayer', tip: BP2_GLOSSARY.col.buy },
        { label: 'Sell offers (24h)',    value: '1 289', delta: '+86',    deltaNote: 'vs. ayer', tip: BP2_GLOSSARY.col.sell },
        { label: 'HHI plataforma · PCI', value: '0.51', delta: '−0.01',  deltaNote: 'vs. Mar', risk: 'med', tip: BP2_GLOSSARY.idx.PCI },
        { label: 'Spread medio P2P',    value: '0.84',  unit: '%', delta: '+0.06 pp', deltaNote: 'vs. Mar', tip: BP2_GLOSSARY.col.spread },
      ]} />

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Ranking institucional</div>
            <div className="card-sub">Snapshot Abr · 2026 — ofertas como número, no como volumen monetario</div>
          </div>
          {tier >= 2 && (
            <div className="cluster">
              <button className="btn-ghost">Filtrar</button>
              <button className="btn-ghost">Exportar .csv</button>
            </div>
          )}
        </div>
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 50 }}>#</th>
              <th>Plataforma</th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.share} icon>Cuota</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.buy} icon>Buy offers</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.sell} icon>Sell offers</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.completion} icon>Completion</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.spread} icon>Spread</Tip></th>
              <th>Riesgo</th>
              <th>Disp.</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(p => (
              <tr key={p.code}>
                <td className="num" style={{ color: 'var(--ink-4)' }}>{String(p.rank).padStart(2, '0')}</td>
                <td>
                  <span className="logo-cell">
                    <span className="logo-square">{p.code[0]}</span>
                    {p.name}
                  </span>
                </td>
                <td className="num" style={{ fontWeight: 600 }}>{p.share.toFixed(1)}%</td>
                <td className="num"><span style={{ color: 'var(--risk-low)' }}>{p.buyOffers}</span></td>
                <td className="num"><span style={{ color: 'var(--risk-high)' }}>{p.sellOffers}</span></td>
                <td className="num">{p.completion ? `${p.completion.toFixed(1)}%` : '—'}</td>
                <td className="num">{p.spread ? `${p.spread.toFixed(2)}%` : '—'}</td>
                <td><RiskChip level={p.risk} /></td>
                <td><span className="num" style={{ fontSize: 10, color: 'var(--ink-5)' }}>{p.tiers.map(t => `T${t}`).join('·')}</span></td>
              </tr>
            ))}
            {hidden.map(p => (
              <tr key={p.code} className="locked-row">
                <td className="num">{String(p.rank).padStart(2, '0')}</td>
                <td><span className="logo-cell"><span className="logo-square">·</span>{p.name}</span></td>
                <td className="num">—</td>
                <td className="num">—</td>
                <td className="num">—</td>
                <td className="num">—</td>
                <td className="num">—</td>
                <td><span className="chip-tier">T{Math.min(...p.tiers)}+</span></td>
                <td><span className="num" style={{ fontSize: 10, color: 'var(--ink-5)' }}>{p.tiers.map(t => `T${t}`).join('·')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">PCI · Concentración de plataformas</div>
            <div className="card-sub">HHI por plataforma · 12 meses</div>
          </div>
          <div className="cluster">
            <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>0.51</span>
          </div>
        </div>
        <div className="card-body">
          <InteractiveChart data={D.series.PCI} labels={D.monthsLabels} unit="HHI" height={220} showThreshold={0.60} />
        </div>
      </div>
    </>
  );
}
