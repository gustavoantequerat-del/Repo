import { useState } from 'react';
import { PageHead } from '../components/Shell.jsx';
import { KpiStrip, RiskChip, Delta, Eyebrow, FamilyHead } from '../components/Atoms.jsx';
import { InteractiveChart, Spark } from '../components/Chart.jsx';
import { Tip } from '../components/Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

export function ScreenIndices({ tier }) {
  const [selectedCode, setSelectedCode] = useState('BPX');
  const [range, setRange] = useState('12m');
  const selected = D.indicesSpec.find(i => i.code === selectedCode) || D.indicesSpec[0];
  const seriesData = D.series[selected.code] || [];

  if (tier === 1) {
    const tier1 = D.indicesSpec.filter(i => i.code === 'BBPI' || i.code === 'BPX');
    return (
      <>
        <PageHead
          eyebrow="Suite propietaria · Tier 1 Ejecutivo"
          title="Indices · Resumen mensual"
          desc="Lectura ejecutiva de los dos índices de cabecera de la suite BBPI: precio P2P consolidado y prima del mercado. Variación mensual y comentario editorial."
          meta={[
            { label: 'Indices visibles', value: '2 de 13' },
            { label: 'Cadencia', value: 'Mensual' },
            { label: 'Snapshot', value: 'Abr · 2026' },
          ]}
        />
        <div className="grid-2-eq">
          {tier1.map(idx => (
            <div className="card" key={idx.code}>
              <div className="card-head">
                <div>
                  <Eyebrow>{idx.code}</Eyebrow>
                  <div className="card-title" style={{ marginTop: 4 }}>{idx.name}</div>
                </div>
                <RiskChip level={idx.risk} />
              </div>
              <div className="card-body">
                <div className="cluster" style={{ alignItems: 'baseline' }}>
                  <span className="display" style={{ fontSize: 44, color: 'var(--ink-1)' }}>{idx.value}</span>
                  <span style={{ color: 'var(--ink-4)', fontSize: 16, fontWeight: 500 }}>{idx.unit}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-4)' }}>
                  <Delta value={idx.deltaM} /> · variación mensual
                </div>
                <div style={{ marginTop: 18 }}>
                  <InteractiveChart data={D.series[idx.code]} labels={D.monthsLabels} unit={idx.unit} height={180} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 24 }} />
        <div className="card">
          <div className="card-head">
            <div className="card-title">Nota metodológica</div>
            <span className="eyebrow">BP2PIM v1</span>
          </div>
          <div className="card-body" style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>
            En Tier 1 sólo se muestran los dos índices de cabecera con su variación mensual. La descarga de histórico, la suite completa de 13 índices y la capa de alertamiento son parte de los niveles superiores.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead
        eyebrow={tier === 2 ? 'Suite propietaria · Tier 2 Profesional' : 'Suite propietaria · Tier 3 Regulator'}
        title="Indices BBIM"
        desc="Trece índices propietarios sobre la fuente Crystal, agrupados en cuatro familias metodológicas: precio y prima, liquidez, estructura y cumplimiento."
        meta={[
          { label: 'Suite', value: '13 índices' },
          { label: 'Familias', value: '4' },
          { label: 'Última sync', value: '—2 min' },
        ]}
      />

      <div className="grid-2-eq" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <Eyebrow>{selected.code} · {selected.name}</Eyebrow>
              <div className="cluster" style={{ marginTop: 8, alignItems: 'baseline' }}>
                <span className="display" style={{ fontSize: 36, color: 'var(--ink-1)' }}>{selected.value}</span>
                <span style={{ color: 'var(--ink-4)', fontSize: 14, fontWeight: 500 }}>{selected.unit}</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--ink-4)' }}>
                <Delta value={selected.delta} /> · 24h · <Delta value={selected.deltaM} /> · mensual
              </div>
            </div>
            <div className="tier-switch">
              {['7d', '30d', '12m'].map(r => (
                <button key={r} data-on={range === r} onClick={() => setRange(r)}>{r}</button>
              ))}
            </div>
          </div>
          <div className="card-body">
            <InteractiveChart data={seriesData} labels={D.monthsLabels} unit={selected.unit} height={220}
                              showThreshold={selected.threshold} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Metodología · {selected.code}</div>
            <RiskChip level={selected.risk} />
          </div>
          <div className="card-body">
            <dl style={{ margin: 0 }}>
              <div className="def"><dt>Propósito</dt><dd>{selected.purpose}</dd></div>
              <div className="def"><dt>Familia</dt><dd>{D.indexFamilies.find(f => f.id === selected.family).name}</dd></div>
              <div className="def"><dt>Fuente</dt><dd>Crystal Intelligence · feed normalizado</dd></div>
              <div className="def"><dt>Cadencia</dt><dd>{tier === 2 ? 'Diaria' : 'EOD / T+1 con auditoría regulatoria'}</dd></div>
              <div className="def"><dt>Tiers</dt><dd>{selected.tiers.map(t => `Tier ${t}`).join(' · ')}</dd></div>
              <div className="def"><dt>Banda</dt><dd>{selected.risk === 'low' ? 'Dentro de banda institucional' : selected.risk === 'med' ? 'Cerca de umbral superior' : 'Fuera de banda institucional'}</dd></div>
              {selected.threshold != null && (
                <div className="def"><dt>Umbral</dt><dd className="num">{selected.threshold} {selected.unit}</dd></div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {D.indexFamilies.map((fam, fi) => {
        const idxs = fam.codes.map(c => D.indicesSpec.find(i => i.code === c)).filter(Boolean);
        return (
          <div key={fam.id} style={{ marginTop: fi === 0 ? 0 : 8 }}>
            <FamilyHead idx={fi + 1} title={fam.name} sub={fam.sub} />
            <div className="card">
              <table className="t">
                <thead>
                  <tr>
                    <th style={{ width: 90 }}>Código</th>
                    <th>Índice</th>
                    <th>Propósito</th>
                    <th className="col-num">Valor</th>
                    <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.delta24} icon>Δ 24h</Tip></th>
                    <th className="col-num tippable"><Tip text={BP2_GLOSSARY.col.deltaM} icon>Δ mensual</Tip></th>
                    <th style={{ width: 90 }}>Riesgo</th>
                    <th style={{ width: 100 }} className="col-num tippable"><Tip text={BP2_GLOSSARY.col.trend12} icon>Tend. 12m</Tip></th>
                  </tr>
                </thead>
                <tbody>
                  {idxs.map(idx => {
                    const accessible = idx.tiers.includes(tier);
                    return (
                      <tr key={idx.code}
                          onClick={() => accessible && setSelectedCode(idx.code)}
                          style={{ cursor: accessible ? 'pointer' : 'default', background: selectedCode === idx.code ? 'var(--accent-soft)' : '' }}
                          className={!accessible ? 'locked-row' : ''}>
                        <td className="num" style={{ fontWeight: 700, color: accessible ? 'var(--ink-1)' : 'var(--ink-5)' }}>
                          <Tip text={BP2_GLOSSARY.idx[idx.code]} pos="right">{idx.code}</Tip>
                        </td>
                        <td style={{ fontWeight: 500 }}>{idx.name}</td>
                        <td style={{ color: 'var(--ink-4)', fontSize: 12.5 }}>{idx.purpose}</td>
                        <td className="num" style={{ fontWeight: 600 }}>{accessible ? `${idx.value} ${idx.unit}` : '—'}</td>
                        <td className="num">{accessible ? <Delta value={idx.delta} /> : '—'}</td>
                        <td className="num">{accessible ? <Delta value={idx.deltaM} /> : '—'}</td>
                        <td>{accessible ? <RiskChip level={idx.risk} /> : <span className="chip-tier">T{Math.min(...idx.tiers)}+</span>}</td>
                        <td style={{ textAlign: 'right' }}>{accessible && D.series[idx.code] ? <Spark data={D.series[idx.code]} w={90} h={22} stroke="var(--accent)" /> : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </>
  );
}
