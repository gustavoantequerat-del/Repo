import { useState } from 'react';
import { PageHead } from '../components/Shell.jsx';
import { Eyebrow, LockedHint } from '../components/Atoms.jsx';
import * as D from '../data.js';

export function ScreenScenarios({ tier }) {
  const [selected, setSelected] = useState('base');
  const [fxShock, setFxShock] = useState(0);
  const [usdtFlow, setUsdtFlow] = useState(0);
  const [railRestriction, setRailRestriction] = useState(0);

  if (tier < 3) {
    return (
      <>
        <PageHead eyebrow="Operación regulatoria" title="Escenarios"
                  desc="Simulaciones ejecutivas para sensibilidad del BPX, profundidad de liquidez y dominancia stable."
                  meta={[{ label: 'Acceso', value: `Tier ${tier}` }]} />
        <LockedHint tier={tier} available={[3]} what="El módulo Escenarios" />
      </>
    );
  }

  const base = D.scenarios[0];
  const proj = {
    bpx: (base.bpx + fxShock * 0.6 + usdtFlow * 0.4 + railRestriction * 0.3).toFixed(2),
    ldi: Math.max(0.1, (base.ldi - fxShock * 0.015 - usdtFlow * 0.020 - railRestriction * 0.018)).toFixed(2),
    sdr: Math.max(70, (base.sdr - fxShock * 0.3 - usdtFlow * 0.5 - railRestriction * 0.2)).toFixed(1),
  };
  const riskLevel = (parseFloat(proj.bpx) > 12 || parseFloat(proj.ldi) < 0.4) ? 'Crítico'
                 : (parseFloat(proj.bpx) > 9.5 || parseFloat(proj.ldi) < 0.55) ? 'Alerta' : 'Estable';

  return (
    <>
      <PageHead
        eyebrow="Operación regulatoria · Tier 3"
        title="Escenarios"
        desc="Simulación de sensibilidad para BPX, profundidad de liquidez y dominancia stable. Modelo determinístico — sin ML predictivo."
        meta={[
          { label: 'Modelo',         value: 'Determinístico v1' },
          { label: 'Snapshot base',  value: 'Abr · 2026' },
          { label: 'Cadencia',       value: 'Bajo demanda' },
        ]}
      />

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Variables de entrada</div>
            <Eyebrow>Ajuste manual</Eyebrow>
          </div>
          <div className="card-body">
            <Knob label="Shock cambiario (FX %)" value={fxShock} min={-10} max={20}
                  display={`${fxShock >= 0 ? '+' : ''}${fxShock}%`}
                  onChange={setFxShock} />
            <Knob label="Retiro de USDT (presión)" value={usdtFlow} min={0} max={10}
                  display={String(usdtFlow)}
                  onChange={setUsdtFlow} />
            <Knob label="Restricción de rails" value={railRestriction} min={0} max={10}
                  display={String(railRestriction)}
                  onChange={setRailRestriction} />

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line-1)' }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Presets institucionales</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {D.scenarios.map(s => (
                  <button key={s.id}
                    onClick={() => {
                      setSelected(s.id);
                      if (s.id === 'base')   { setFxShock(0);  setUsdtFlow(0); setRailRestriction(0); }
                      if (s.id === 'stress') { setFxShock(5);  setUsdtFlow(2); setRailRestriction(1); }
                      if (s.id === 'shock')  { setFxShock(8);  setUsdtFlow(8); setRailRestriction(3); }
                      if (s.id === 'policy') { setFxShock(2);  setUsdtFlow(1); setRailRestriction(8); }
                    }}
                    style={{
                      textAlign: 'left',
                      background: selected === s.id ? 'var(--accent-soft)' : 'var(--surface-2)',
                      border: '1px solid ' + (selected === s.id ? 'var(--accent)' : 'var(--line-1)'),
                      padding: '10px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      color: 'var(--ink-1)',
                      fontSize: 13,
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 500,
                    }}>
                    <span>{s.name}</span>
                    <span className="num" style={{ color: 'var(--ink-4)', fontSize: 11 }}>BPX {s.bpx}%</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-head">
              <div className="card-title">Proyección</div>
              <span className={`chip ${riskLevel === 'Crítico' ? 'chip-high' : riskLevel === 'Alerta' ? 'chip-med' : 'chip-low'}`}>{riskLevel}</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
                <ProjMetric label="BPX" base={base.bpx + '%'} proj={proj.bpx + '%'} />
                <ProjMetric label="LDI" base={String(base.ldi)} proj={proj.ldi} />
                <ProjMetric label="SDR" base={base.sdr + '%'} proj={proj.sdr + '%'} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <div className="card-title">Cadena de impacto</div>
              <Eyebrow>Sensibilidad determinística</Eyebrow>
            </div>
            <div className="card-body">
              <dl style={{ margin: 0 }}>
                <div className="def"><dt>Entrada</dt><dd>FX {fxShock >= 0 ? '+' : ''}{fxShock}% · retiro stable {usdtFlow} · rails {railRestriction}</dd></div>
                <div className="def"><dt>Premium</dt><dd>BPX se mueve a {proj.bpx}% ({(proj.bpx - base.bpx).toFixed(2)} pp)</dd></div>
                <div className="def"><dt>Liquidez</dt><dd>LDI baja a {proj.ldi} ({(proj.ldi - base.ldi).toFixed(2)})</dd></div>
                <div className="def"><dt>Dominancia</dt><dd>SDR se ajusta a {proj.sdr}%</dd></div>
                <div className="def"><dt>Lectura</dt><dd>Nivel <strong>{riskLevel}</strong> en marco institucional</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Knob({ label, value, min, max, display, onChange }) {
  return (
    <div className="knob">
      <div className="knob-label">
        <span>{label}</span>
        <span className="v">{display}</span>
      </div>
      <input type="range" min={min} max={max} step="1" value={value}
             onChange={e => onChange(parseInt(e.target.value))} />
    </div>
  );
}

function ProjMetric({ label, base, proj }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      <div className="display" style={{ fontSize: 26, color: 'var(--ink-1)' }}>{proj}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-5)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
        base · {base}
      </div>
    </div>
  );
}
