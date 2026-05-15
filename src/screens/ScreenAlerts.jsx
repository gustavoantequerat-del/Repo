import { useState } from 'react';
import { PageHead } from '../components/Shell.jsx';
import { KpiStrip, RiskChip, Eyebrow, LockedHint } from '../components/Atoms.jsx';
import { Tip } from '../components/Tip.jsx';
import { BP2_GLOSSARY } from '../glossary.jsx';
import * as D from '../data.js';

export function ScreenAlerts({ tier, rules, setRules, alerts, setAlerts }) {
  const [tab, setTab] = useState('active');
  const [draft, setDraft] = useState({ indexCode: 'BPX', operator: '>', threshold: 9.0, severity: 'high', module: 'Indices' });

  if (tier < 2) {
    return (
      <>
        <PageHead eyebrow="Operación" title="Alertas"
                  desc="Sistema de alertas configurables sobre los índices BBIM."
                  meta={[{ label: 'Acceso', value: `Tier ${tier}` }]} />
        <LockedHint tier={tier} available={[2, 3]} what="El módulo de alertas" />
      </>
    );
  }

  function createRule(e) {
    e.preventDefault();
    const id = 'r' + (rules.length + 1) + '_' + Date.now().toString(36).slice(-3);
    const newRule = { ...draft, id, enabled: true, createdBy: 'Tú', lastFire: null, scope: tier === 3 ? 'T3' : 'T2+' };
    setRules([newRule, ...rules]);

    const idx = D.indicesSpec.find(i => i.code === draft.indexCode);
    if (idx) {
      const v = idx.value;
      const triggered =
        (draft.operator === '>' && v > draft.threshold) ||
        (draft.operator === '<' && v < draft.threshold) ||
        (draft.operator === '≥' && v >= draft.threshold) ||
        (draft.operator === '≤' && v <= draft.threshold);
      if (triggered) {
        const now = new Date();
        const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const newAlert = {
          id: 'AL-' + Date.now().toString(36).toUpperCase().slice(-7),
          time: t,
          level: draft.severity,
          title: `${idx.code} cruza umbral`,
          sub: `${idx.code} ${v} ${idx.unit} ${draft.operator} ${draft.threshold} ${idx.unit}`,
          module: draft.module,
          tier,
          ruleId: id,
          indexCode: idx.code,
          value: v,
          isNew: true,
        };
        setAlerts([newAlert, ...alerts]);
      }
    }
  }

  function toggleRule(id) {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }
  function deleteRule(id) {
    setRules(rules.filter(r => r.id !== id));
  }

  const filtered = alerts.filter(a => a.tier <= tier);
  const counts = {
    high: filtered.filter(a => a.level === 'high').length,
    med:  filtered.filter(a => a.level === 'med').length,
    low:  filtered.filter(a => a.level === 'low').length,
  };

  const indicesForTier = D.indicesSpec.filter(i => i.tiers.includes(tier));

  return (
    <>
      <PageHead
        eyebrow="Operación · Señalización institucional"
        title="Alertas"
        desc="Crea reglas sobre los 13 índices BBIM. El sistema dispara una alerta automáticamente cuando el valor cruza el umbral definido (>, <, ≥, ≤)."
        meta={[
          { label: 'Reglas activas', value: rules.filter(r => r.enabled).length },
          { label: 'Alertas hoy',    value: filtered.length },
          { label: 'Cadencia',       value: tier === 2 ? 'Diaria' : 'EOD / T+1' },
        ]}
      />

      <KpiStrip items={[
        { label: 'Severidad alta',  value: counts.high, delta: '+1', deltaNote: 'vs. ayer', risk: 'high', tip: 'Alertas con severidad alta. Indicador más prioritario para revisión inmediata.' },
        { label: 'Severidad media', value: counts.med,  delta: '+0', deltaNote: '',         risk: 'med',  tip: 'Alertas con severidad media. Recomendado monitoreo activo sin acción inmediata.' },
        { label: 'Severidad baja',  value: counts.low,  delta: '−2', deltaNote: '',         risk: 'low',  tip: 'Alertas de severidad informativa. Cambios menores dentro de la banda institucional.' },
        { label: 'Reglas en cola',  value: rules.length, foot: `${rules.filter(r => r.enabled).length} activas / ${rules.filter(r => !r.enabled).length} pausadas`, tip: BP2_GLOSSARY.kpi.rules },
      ]} />

      <div style={{ height: 24 }} />

      <div className="tabs">
        <button className="tab" data-on={tab === 'active'} onClick={() => setTab('active')}>Cola de alertas ({filtered.length})</button>
        <button className="tab" data-on={tab === 'rules'}  onClick={() => setTab('rules')}>Reglas configuradas ({rules.length})</button>
        <button className="tab" data-on={tab === 'scope'}  onClick={() => setTab('scope')}>Alcance MVP v1</button>
      </div>

      {tab === 'active' && (
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Cola de alertas</div>
              <div className="card-sub">Ordenadas por hora de disparo · más recientes primero</div>
            </div>
            <div className="cluster">
              <button className="btn-ghost">Marcar todas como leídas</button>
            </div>
          </div>
          <div>
            {filtered.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                No hay alertas activas en este nivel de acceso.
              </div>
            )}
            {filtered.map(a => (
              <div className="alert-row" key={a.id} style={{ background: a.isNew ? 'var(--accent-soft)' : '' }}>
                <span className="alert-dot" style={{ background: a.level === 'high' ? 'var(--risk-high)' : a.level === 'med' ? 'var(--risk-med)' : 'var(--risk-low)' }}></span>
                <div>
                  <div className="alert-time">{a.time}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-5)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{a.id}</div>
                </div>
                <div>
                  <div className="alert-title">
                    {a.title}
                    {a.isNew && <span style={{ marginLeft: 8, fontSize: 9, color: 'var(--accent-2)', letterSpacing: '0.14em' }}>NUEVO</span>}
                  </div>
                  <div className="alert-sub">{a.sub}</div>
                </div>
                <div className="cluster">
                  <span className="chip-tier">{a.module}</span>
                  {a.ruleId && <span className="chip-tier" style={{ fontFamily: 'var(--font-mono)' }}>regla {a.ruleId}</span>}
                </div>
                <span className="num" style={{ fontSize: 11, color: 'var(--ink-5)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Tier {a.tier}+</span>
                <RiskChip level={a.level} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'rules' && (
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Nueva regla de alerta</div>
              <div className="card-sub">Las reglas se aplican sobre el feed normalizado del snapshot actual</div>
            </div>
          </div>
          <form onSubmit={createRule} className="rule-form">
            <div className="field">
              <label><Tip text="El índice BBIM cuyo valor será evaluado contra el umbral." icon>Índice</Tip></label>
              <select value={draft.indexCode} onChange={e => setDraft({ ...draft, indexCode: e.target.value })}>
                {indicesForTier.map(i => <option key={i.code} value={i.code}>{i.code} — {i.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label><Tip text={BP2_GLOSSARY.col.operator} icon>Operador</Tip></label>
              <select value={draft.operator} onChange={e => setDraft({ ...draft, operator: e.target.value })}>
                <option value=">">{`> mayor que`}</option>
                <option value="<">{`< menor que`}</option>
                <option value="≥">{`≥ mayor o igual`}</option>
                <option value="≤">{`≤ menor o igual`}</option>
              </select>
            </div>
            <div className="field">
              <label><Tip text={BP2_GLOSSARY.col.threshold} icon>Umbral</Tip></label>
              <input type="number" step="0.01" value={draft.threshold}
                     onChange={e => setDraft({ ...draft, threshold: parseFloat(e.target.value) })} />
            </div>
            <div className="field">
              <label><Tip text={BP2_GLOSSARY.col.severity} icon>Severidad</Tip></label>
              <select value={draft.severity} onChange={e => setDraft({ ...draft, severity: e.target.value })}>
                <option value="low">Baja</option>
                <option value="med">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="field">
              <label><Tip text="Módulo del producto al que pertenece la regla." icon>Módulo</Tip></label>
              <select value={draft.module} onChange={e => setDraft({ ...draft, module: e.target.value })}>
                <option>Indices</option>
                <option>Platforms</option>
                <option>Banking Rails</option>
                <option>Merchants</option>
                <option>Cryptocurrencies</option>
              </select>
            </div>
            <button type="submit" className="btn-accent">Crear regla</button>
          </form>
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Regla</th>
                <th className="col-num tippable"><Tip text="Valor más reciente del índice. Si está cruzando el umbral aparece en rojo." icon>Valor actual</Tip></th>
                <th>Módulo</th>
                <th><Tip text={BP2_GLOSSARY.col.severity} icon>Severidad</Tip></th>
                <th><Tip text="Última vez que la regla disparó una alerta automatizada." icon>Última activación</Tip></th>
                <th><Tip text={BP2_GLOSSARY.col.scope} icon>Acceso</Tip></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rules.map(r => {
                const idx = D.indicesSpec.find(i => i.code === r.indexCode);
                const v = idx ? idx.value : null;
                const triggered = v != null && (
                  (r.operator === '>' && v > r.threshold) ||
                  (r.operator === '<' && v < r.threshold) ||
                  (r.operator === '≥' && v >= r.threshold) ||
                  (r.operator === '≤' && v <= r.threshold)
                );
                return (
                  <tr key={r.id} style={{ opacity: r.enabled ? 1 : 0.55 }}>
                    <td>
                      <button onClick={() => toggleRule(r.id)}
                        style={{ width: 32, height: 18, borderRadius: 9, padding: 0, border: 0, background: r.enabled ? 'var(--accent)' : 'var(--ink-6)', position: 'relative', cursor: 'pointer' }}>
                        <span style={{ position: 'absolute', top: 2, left: r.enabled ? 16 : 2, width: 14, height: 14, background: '#fff', borderRadius: '50%', transition: 'left 0.15s ease' }}></span>
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                          {r.indexCode} {r.operator} {r.threshold}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--ink-5)' }}>
                          {idx ? idx.name : ''} · por {r.createdBy}
                        </span>
                      </div>
                    </td>
                    <td className="num">
                      <span style={{ color: triggered ? 'var(--risk-high)' : 'var(--ink-1)', fontWeight: triggered ? 700 : 500 }}>
                        {v != null ? `${v} ${idx.unit}` : '—'}
                      </span>
                      {triggered && <div style={{ fontSize: 10, color: 'var(--risk-high)', marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Cruzando</div>}
                    </td>
                    <td><span className="chip-tier">{r.module}</span></td>
                    <td><RiskChip level={r.severity} /></td>
                    <td className="num" style={{ color: 'var(--ink-4)' }}>{r.lastFire || '—'}</td>
                    <td><span className="chip-tier">{r.scope}</span></td>
                    <td>
                      <button onClick={() => deleteRule(r.id)} className="btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'scope' && (
        <div className="card">
          <div className="card-head">
            <div className="card-title">Alcance del alertamiento — MVP v1</div>
            <Eyebrow>Fuera de alcance</Eyebrow>
          </div>
          <div className="card-body">
            <dl style={{ margin: 0 }}>
              <div className="def"><dt>Incluido</dt><dd>Reglas básicas sobre los 13 índices propietarios con operadores comparativos (&gt;, &lt;, ≥, ≤).</dd></div>
              <div className="def"><dt>Excluido</dt><dd>Detección sofisticada de anomalías, modelos predictivos, workflows automatizados completos.</dd></div>
              <div className="def"><dt>Roadmap</dt><dd>Reglas avanzadas, machine learning y triggers compuestos quedan para fases posteriores del producto.</dd></div>
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
