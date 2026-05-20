import { PageHead } from '../components/Shell.jsx';
import { KpiStrip, RiskChip, Delta, fmtUsd, fmtNum } from '../components/Atoms.jsx';
import { InteractiveChart } from '../components/Chart.jsx';
import { Tip } from '../components/Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

export function ScreenBanks({ tier }) {
  const trendChar = t => t === 'up' ? '▲' : t === 'down' ? '▼' : '■';
  const trendCls  = t => t === 'up' ? 'delta-up' : t === 'down' ? 'delta-dn' : 'delta-flat';
  const ranked = [...D.banks].sort((a, b) => b.exposure - a.exposure);

  if (tier === 1) {
    return (
      <>
        <PageHead
          eyebrow="Estructura del mercado · Rieles bancarios"
          title="Rieles bancarios · vista agregada"
          desc="Lectura ejecutiva de la exposición agregada del flujo P2P sobre los rieles bancarios. La tabla desagregada y los scores por riel forman parte de los Tiers 2 y 3."
          meta={[
            { label: 'Rieles activos', value: ranked.length },
            { label: 'BES máximo', value: `${ranked[0].exposure.toFixed(2)} · ${ranked[0].code}` },
            { label: 'Captura', value: 'Abr · 2026' },
          ]}
        />

        <div className="grid-2-eq" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Top rieles por exposición agregada</div>
                <div className="card-sub">BES — Bank Exposure Score</div>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ranked.map(b => (
                  <div key={b.code} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 70px', gap: 12, alignItems: 'center', fontSize: 13 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{b.name}</div>
                      <div className="num" style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{b.code}</div>
                    </div>
                    <span className="bar">
                      <span style={{ width: `${b.exposure * 100}%`, background: b.risk === 'high' ? 'var(--risk-high)' : b.risk === 'med' ? 'var(--risk-med)' : 'var(--risk-low)' }}></span>
                    </span>
                    <span className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{b.exposure.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
              <InteractiveChart data={D.series.BES} labels={D.monthsLabels} unit="score" height={220} showThreshold={0.70} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead
        eyebrow="Estructura del mercado · Rieles bancarios"
        title="Rieles bancarios"
        desc={tier === 2
          ? 'Bank Exposure Score (BES), capacidad observada y menciones en el flujo P2P normalizado por riel.'
          : 'Bank Exposure Score (BES), capacidad observada, menciones y participación (mention/capacity share) de cada riel sobre el total.'}
        meta={[
          { label: 'Rieles activos', value: ranked.length },
          { label: 'BES máximo', value: `${ranked[0].exposure.toFixed(2)} · ${ranked[0].code}` },
          { label: 'Capacidad total', value: '$18.5 M' },
        ]}
      />

      <KpiStrip items={[
        { label: 'BES agregado',        value: '0.52',    delta: '+0.03',  deltaNote: 'vs. Mar', risk: 'med', tip: BP2_GLOSSARY.idx.BES },
        { label: 'Capacidad rastreada', value: '$18.5 M', delta: '+8.1%',  deltaNote: 'vs. Mar', tip: BP2_GLOSSARY.col.capacity },
        { label: 'Menciones 30d',       value: '4 821',   delta: '+412',   deltaNote: 'vs. Mar', tip: BP2_GLOSSARY.col.mentions },
        { label: 'Rieles con flag',     value: '1',       delta: '+0',     deltaNote: 'BCB', risk: 'high', tip: 'Rieles que superan el umbral institucional de exposición y requieren revisión por compliance.' },
      ]} />

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Ranking de exposición por riel</div>
            <div className="card-sub">{tier === 3 ? 'Incluye mention share y capacity share calculados sobre el total observado' : 'BES, capacidad y menciones por riel'}</div>
          </div>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Riel bancario</th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.idx.BES} icon>BES</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.capacity} icon>Capacidad</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.mentions} icon>Menciones</Tip></th>
              {tier === 3 && <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.mentionShare} icon>Mention share</Tip></th>}
              {tier === 3 && <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.capacityShare} icon>Capacity share</Tip></th>}
              <th><Tip text={BP2_GLOSSARY.col.trend12} icon>Tendencia</Tip></th>
              <th>Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((b, i) => (
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
                <td className="num">{fmtNum(b.mentions)}</td>
                {tier === 3 && (
                  <td className="num">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span>{b.mentionShare.toFixed(1)}%</span>
                      <span style={{ width: 50, height: 4, background: 'var(--surface-sunk)', borderRadius: 2, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', width: `${b.mentionShare * 2.5}%`, background: 'var(--accent)' }}></span>
                      </span>
                    </div>
                  </td>
                )}
                {tier === 3 && (
                  <td className="num">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span>{b.capacityShare.toFixed(1)}%</span>
                      <span style={{ width: 50, height: 4, background: 'var(--surface-sunk)', borderRadius: 2, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', width: `${b.capacityShare * 2.5}%`, background: 'var(--accent-2)' }}></span>
                      </span>
                    </div>
                  </td>
                )}
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
        </div>
      </div>
    </>
  );
}
