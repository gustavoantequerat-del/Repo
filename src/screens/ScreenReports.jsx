import { useState } from 'react';
import { PageHead } from '../components/Shell.jsx';
import { Eyebrow } from '../components/Atoms.jsx';
import * as D from '../data.js';

export function ScreenReports({ tier }) {
  const [filter, setFilter] = useState('all');
  const accessible = r => r.tier <= tier;
  const filtered = D.reports.filter(r => {
    if (!accessible(r)) return false;
    if (filter === 'all') return true;
    if (filter === 'executive') return r.type === 'Ejecutivo';
    if (filter === 'analytical') return r.type === 'Analítico';
    if (filter === 'regulatory') return r.type === 'Regulatorio';
    return true;
  });

  return (
    <>
      <PageHead
        eyebrow="Repositorio institucional · Trazabilidad"
        title="Reportes"
        desc="Repositorio cronológico de reportes descargables en PDF. Ejecutivo (mensual T1) · Analítico (quincenal T2) · Regulatorio (bajo solicitud T3)."
        meta={[
          { label: 'Reportes accesibles', value: `${filtered.length} / ${D.reports.length}` },
          { label: 'Cobertura',           value: 'Feb 2026 — May 2026' },
          { label: 'Formato',             value: 'PDF' },
        ]}
      />

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, background: tier >= 1 ? 'var(--surface)' : 'var(--surface-2)', opacity: tier >= 1 ? 1 : 0.55 }}>
          <Eyebrow>Tier 1 · Ejecutivo</Eyebrow>
          <div className="display" style={{ fontSize: 22, marginTop: 8 }}>Reporte ejecutivo</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-4)', marginTop: 4 }}>Mensual · síntesis ejecutiva</div>
        </div>
        <div className="card" style={{ padding: 20, background: tier >= 2 ? 'var(--surface)' : 'var(--surface-2)', opacity: tier >= 2 ? 1 : 0.55 }}>
          <Eyebrow>Tier 2 · Analítico</Eyebrow>
          <div className="display" style={{ fontSize: 22, marginTop: 8 }}>Reporte analítico</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-4)', marginTop: 4 }}>Quincenal · analítica profunda</div>
        </div>
        <div className="card" style={{ padding: 20, background: tier >= 3 ? 'var(--surface)' : 'var(--surface-2)', opacity: tier >= 3 ? 1 : 0.55 }}>
          <Eyebrow>Tier 3 · Regulatorio</Eyebrow>
          <div className="display" style={{ fontSize: 22, marginTop: 8 }}>Reporte regulatorio</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-4)', marginTop: 4 }}>Bajo solicitud · supervisión</div>
        </div>
      </div>

      <div className="tabs">
        <button className="tab" data-on={filter === 'all'}        onClick={() => setFilter('all')}>Todos ({D.reports.filter(accessible).length})</button>
        <button className="tab" data-on={filter === 'executive'}  onClick={() => setFilter('executive')}>Ejecutivo</button>
        {tier >= 2 && <button className="tab" data-on={filter === 'analytical'} onClick={() => setFilter('analytical')}>Analítico</button>}
        {tier >= 3 && <button className="tab" data-on={filter === 'regulatory'} onClick={() => setFilter('regulatory')}>Regulatorio</button>}
      </div>

      <div className="stack" style={{ gap: 12 }}>
        {filtered.map(r => (
          <div className="report-card" key={r.id}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div className="report-cover">
                <span>{r.type[0]}</span>
                <span>{r.period}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="cluster">
                  <span className={`chip ${r.tier === 1 ? 'chip-neutral' : r.tier === 2 ? 'chip-accent' : 'chip-high'}`}>{r.type}</span>
                  <span className="chip-tier">Tier {r.tier}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>{r.title}</div>
                <div className="cluster" style={{ fontSize: 11.5, color: 'var(--ink-4)', gap: 16 }}>
                  <span><span style={{ color: 'var(--ink-5)' }}>Período</span> · {r.period}</span>
                  <span><span style={{ color: 'var(--ink-5)' }}>Publicado</span> · {r.published}</span>
                  <span><span style={{ color: 'var(--ink-5)' }}>Tamaño</span> · {r.size}</span>
                  <span className="num" style={{ color: 'var(--ink-5)' }}>{r.id}</span>
                </div>
              </div>
            </div>
            <div className="cluster">
              <button className="btn-primary">Previsualizar</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
