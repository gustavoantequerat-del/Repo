import { PageHead } from '../components/Shell.jsx';
import { KpiStrip, RiskChip, Delta, LockedHint, fmtUsd, fmtNum } from '../components/Atoms.jsx';
import { InteractiveChart } from '../components/Chart.jsx';
import { Tip } from '../components/Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

export function ScreenBanks({ tier }) {
  if (tier < 2) {
    return (
      <>
        <PageHead eyebrow="Estructura del mercado" title="Banking Rails"
                  desc="Exposición y capacidad por rail bancario." meta={[{ label: 'Acceso', value: `Tier ${tier}` }]} />
        <LockedHint tier={tier} available={[2, 3]} what="El módulo Banking Rails" />
      </>
    );
  }

  const trendChar = t => t === 'up' ? '▲' : t === 'down' ? '▼' : '■';
  const trendCls  = t => t === 'up' ? 'delta-up' : t === 'down' ? 'delta-dn' : 'delta-flat';

  return (
    <>
      <PageHead
        eyebrow="Estructura del mercado · Rails bancarios"
        title="Banking Rails"
        desc="Bank Exposure Score (BES), capacidad observada, menciones en el flujo P2P normalizado y participación de cada rail sobre el total."
        meta={[
          { label: 'Rails activos',  value: '7' },
          { label: 'BES máximo',     value: '0.81 · BCB' },
          { label: 'Capacidad total', value: '$18.5 M' },
        ]}
      />

      <KpiStrip items={[
        { label: 'BES agregado',        value: '0.52',    delta: '+0.03',  deltaNote: 'vs. Mar', risk: 'med', tip: BP2_GLOSSARY.idx.BES },
        { label: 'Capacidad rastreada', value: '$18.5 M', delta: '+8.1%',  deltaNote: 'vs. Mar', tip: BP2_GLOSSARY.col.capacity },
        { label: 'Menciones 30d',       value: '4 821',   delta: '+412',   deltaNote: 'vs. Mar', tip: BP2_GLOSSARY.col.mentions },
        { label: 'Rails con flag',      value: '1',       delta: '+0',     deltaNote: 'BCB', risk: 'high', tip: 'Rails que superan el umbral institucional de exposición y requieren revisión por compliance.' },
      ]} />

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Ranking de exposición por rail</div>
            <div className="card-sub">Mention share y Capacity share calculados sobre el total observado</div>
          </div>
          <button className="btn-ghost">Exportar .csv</button>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Rail bancario</th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.idx.BES} icon>BES</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.capacity} icon>Capacidad</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.mentionShare} icon>Mention share</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.capacityShare} icon>Capacity share</Tip></th>
              {tier === 2 && <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.mentions} icon>Menciones</Tip></th>}
              <th><Tip text={BP2_GLOSSARY.col.trend12} icon>Tendencia</Tip></th>
              <th>Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {D.banks.map((b, i) => (
              <tr key={b.code}>
                <td className="num" style={{ color: 'var(--ink-4)' }}>{String(i + 1).padStart(2, '0')}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{b.name}</span>
                    <span className="num" style={{ fontSize: 11, color: 'var(--ink-5)' }}>{b.code}</span>
                  </div>
                </td>
                <td className="num" style={{ fontWeight: 600 }}>{b.exposure.toFixed(2)}</td>
                <td className="num">{fmtUsd(b.capacity)}</td>
                <td className="num">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span>{b.mentionShare.toFixed(1)}%</span>
                    <span style={{ width: 50, height: 4, background: 'var(--surface-sunk)', borderRadius: 2, overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${b.mentionShare * 2.5}%`, background: 'var(--accent)' }}></span>
                    </span>
                  </div>
                </td>
                <td className="num">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span>{b.capacityShare.toFixed(1)}%</span>
                    <span style={{ width: 50, height: 4, background: 'var(--surface-sunk)', borderRadius: 2, overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${b.capacityShare * 2.5}%`, background: 'var(--accent-2)' }}></span>
                    </span>
                  </div>
                </td>
                {tier === 2 && <td className="num">{fmtNum(b.mentions)}</td>}
                <td>
                  <span className={trendCls(b.trend)} style={{ fontSize: 12 }}>
                    {trendChar(b.trend)} {b.trend === 'up' ? 'Subiendo' : b.trend === 'down' ? 'Bajando' : 'Estable'}
                  </span>
                </td>
                <td><RiskChip level={b.risk} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">BES agregado · 12 meses</div>
            <div className="card-sub">Bank Exposure Score</div>
          </div>
          <div className="cluster">
            <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>0.74</span>
            <Delta value="+0.03" />
          </div>
        </div>
        <div className="card-body">
          <InteractiveChart data={D.series.BES} labels={D.monthsLabels} unit="score" height={240} showThreshold={0.70} />
          <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--ink-4)', lineHeight: 1.55 }}>
            BCB lidera la concentración (0.81) y las menciones del rail crecen +412 mes a mes, consistente con la fuerza relativa del USDT sobre el rail principal. Umbral institucional histórico: 0.70.
          </p>
        </div>
      </div>
    </>
  );
}
