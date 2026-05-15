import { PageHead } from '../components/Shell.jsx';
import { KpiStrip, RiskChip, LockedHint, fmtNum } from '../components/Atoms.jsx';
import { InteractiveChart } from '../components/Chart.jsx';
import { Tip } from '../components/Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

export function ScreenMerchants({ tier }) {
  if (tier < 2) {
    return (
      <>
        <PageHead eyebrow="Estructura del mercado" title="Merchants"
                  desc="Concentración, capacidad y perfil de riesgo por operador." meta={[{ label: 'Acceso', value: `Tier ${tier}` }]} />
        <LockedHint tier={tier} available={[2, 3]} what="El módulo Merchants" />
      </>
    );
  }

  return (
    <>
      <PageHead
        eyebrow="Estructura del mercado · Operadores"
        title="Merchants"
        desc="Concentración (MCI), capacidad observada y perfil de riesgo (MRP) por operador. Lectura simplificada para revisión institucional."
        meta={[
          { label: 'Operadores rastreados', value: '1 402' },
          { label: 'MCI · HHI', value: '0.38' },
          { label: 'Capacidad agregada', value: '$14.8 M' },
        ]}
      />

      <KpiStrip items={[
        { label: 'MCI · HHI Merchant',    value: '0.38',  delta: '+0.02',   deltaNote: 'vs. Mar', risk: 'med', tip: BP2_GLOSSARY.idx.MCI },
        { label: 'Top-5 cuota acumulada', value: '28.4%', delta: '+1.1 pp', deltaNote: 'vs. Mar', tip: BP2_GLOSSARY.kpi.top5 },
        { label: 'MRP promedio',          value: '62',    unit: '/100', delta: '−1', deltaNote: 'vs. Mar', risk: 'med', tip: BP2_GLOSSARY.kpi.avgMrp },
        { label: 'Operadores marcados',   value: '3',     delta: '+1',  deltaNote: 'nuevo flag', risk: 'high', tip: BP2_GLOSSARY.kpi.flagged },
      ]} />

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Operadores por capacidad observada</div>
            <div className="card-sub">Versión simplificada · MRP visible para todos los operadores</div>
          </div>
          <div className="cluster">
            <button className="btn-ghost">Filtrar</button>
            {tier >= 2 && <button className="btn-ghost">Exportar</button>}
          </div>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 100 }}>ID</th>
              <th>Operador</th>
              <th>Plataforma</th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.capacity} icon>Capacidad (Bs.)</Tip></th>
              <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.share} icon>Cuota</Tip></th>
              <th className="col-num tippable" style={{ width: 180 }}><Tip text={BP2_GLOSSARY.col.mrp} icon>MRP</Tip></th>
              <th><Tip text={BP2_GLOSSARY.col.rails} icon>Rails</Tip></th>
              <th><Tip text={BP2_GLOSSARY.col.status} icon>Estado</Tip></th>
            </tr>
          </thead>
          <tbody>
            {D.merchants.map(m => (
              <tr key={m.id}>
                <td className="num" style={{ color: 'var(--ink-4)' }}>{m.id}</td>
                <td style={{ fontWeight: 500 }}>{m.alias}</td>
                <td style={{ color: 'var(--ink-3)' }}>{m.platform}</td>
                <td className="num">{fmtNum(m.capacity)}</td>
                <td className="num">{m.share.toFixed(1)}%</td>
                <td className="num">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontWeight: 600 }}>{m.mrp}</span>
                    <span style={{ width: 64, height: 5, background: 'var(--surface-sunk)', borderRadius: 3, overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${m.mrp}%`, background: m.risk === 'low' ? 'var(--risk-low)' : m.risk === 'med' ? 'var(--risk-med)' : 'var(--risk-high)' }}></span>
                    </span>
                  </span>
                </td>
                <td>
                  <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {m.rails.map(r => <span key={r} className="chip-tier">{r}</span>)}
                  </span>
                </td>
                <td>
                  <span className={`chip ${m.status === 'active' ? 'chip-low' : m.status === 'review' ? 'chip-med' : 'chip-high'}`}>
                    {m.status === 'active' ? 'Activo' : m.status === 'review' ? 'Revisión' : 'Marcado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ height: 24 }} />

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">MCI · Concentración por merchant</div>
              <div className="card-sub">HHI · 12 meses</div>
            </div>
            <div className="cluster">
              <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>0.38</span>
            </div>
          </div>
          <div className="card-body">
            <InteractiveChart data={D.series.MCI} labels={D.monthsLabels} unit="HHI" height={200} showThreshold={0.45} />
          </div>
        </div>

        {tier === 3 ? (
          <div className="card">
            <div className="card-head">
              <div className="card-title">Named entity overlay</div>
              <span className="chip chip-accent">TIER 3</span>
            </div>
            <div className="card-body">
              <dl style={{ margin: 0 }}>
                <div className="def"><dt>MX-0021</dt><dd>Identidad atribuida — capa regulatoria · cluster de wallets verificado.</dd></div>
                <div className="def"><dt>MX-0058</dt><dd>Sin atribución — patrón compatible con operador profesional · pendiente de validación.</dd></div>
                <div className="def"><dt>MX-0064</dt><dd>Flag UIF · revisión recomendada por compliance interno.</dd></div>
                <div className="def"><dt>MX-0071</dt><dd>Vínculo cross-platform observado · OTC sospechado.</dd></div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-head">
              <div className="card-title">Distribución de MRP</div>
              <div className="card-sub">Histograma · 1 402 operadores</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140 }}>
                {[14, 22, 31, 48, 68, 92, 110, 138, 165, 180, 142, 96, 58, 32, 18].map((v, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${(v / 180) * 100}%`,
                    background: i < 4 ? 'var(--risk-high)' : i < 9 ? 'var(--risk-med)' : 'var(--risk-low)',
                    borderRadius: '2px 2px 0 0',
                    opacity: 0.85,
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: 'var(--ink-5)', fontFamily: 'var(--font-mono)' }}>
                <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
