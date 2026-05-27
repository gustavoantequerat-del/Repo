// Screens — Alerts (with configurable rules), Scenarios, Reports
const { PageHead, LockedHint, KpiStrip, Tip, RiskChip, Eyebrow } = window;
const { useState: useS3, useMemo: useMemoR, useEffect: useEffectR } = React;

// =================== ALERTS ===================
function ScreenAlerts({ tier, rules, setRules, alerts, setAlerts }) {
  const D = window.BP2_DATA;
  const [tab, setTab] = useS3("active");
  const [draft, setDraft] = useS3({ indexCode: "BPX", operator: ">", threshold: 9.0, severity: "high", module: "Indices" });

  if (tier < 2) {
    return (
      <>
        <PageHead eyebrow="Operación" title="Alertas"
                  desc="Sistema de alertas configurables sobre los índices BBIM."
                  meta={[{ label: "Acceso", value: `Tier ${tier}` }]} />
        <LockedHint tier={tier} available={[2, 3]} what="El módulo de alertas" />
      </>
    );
  }

  function createRule(e) {
    e.preventDefault();
    const id = "r" + (rules.length + 1) + "_" + Date.now().toString(36).slice(-3);
    const newRule = { ...draft, id, enabled: true, createdBy: "Tú", lastFire: null, scope: tier === 3 ? "T3" : "T2+" };
    setRules([newRule, ...rules]);

    // Evaluate current value against rule -> generate alert if crossed
    const idx = D.indicesSpec.find(i => i.code === draft.indexCode);
    if (idx) {
      const v = idx.value;
      const triggered = (draft.operator === ">" && v > draft.threshold) ||
                        (draft.operator === "<" && v < draft.threshold) ||
                        (draft.operator === "≥" && v >= draft.threshold) ||
                        (draft.operator === "≤" && v <= draft.threshold);
      if (triggered) {
        const now = new Date();
        const t = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
        const newAlert = {
          id: "AL-" + Date.now().toString(36).toUpperCase().slice(-7),
          time: t,
          level: draft.severity,
          title: `${idx.code} cruza umbral`,
          sub: `${idx.code} ${v} ${idx.unit} ${draft.operator} ${draft.threshold} ${idx.unit}`,
          module: draft.module,
          tier: tier,
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
    high: filtered.filter(a => a.level === "high").length,
    med:  filtered.filter(a => a.level === "med").length,
    low:  filtered.filter(a => a.level === "low").length,
  };

  const indicesForTier = D.indicesSpec.filter(i => i.tiers.includes(tier));

  return (
    <>
      <PageHead
        eyebrow="Operación · Señalización institucional"
        title="Alertas"
        desc="Crea reglas sobre los 13 índices BBIM. El sistema dispara una alerta automáticamente cuando el valor cruza el umbral definido (>, <, ≥, ≤)."
        meta={[
          { label: "Reglas activas", value: rules.filter(r => r.enabled).length },
          { label: "Alertas hoy", value: filtered.length },
          { label: "Cadencia", value: tier === 2 ? "Diaria" : "EOD / T+1" },
        ]}
      />

      <KpiStrip items={[
        { label: "Severidad alta",     value: counts.high, delta: "+1", deltaNote: "vs. ayer", risk: "high", tip: "Alertas con severidad alta. Indicador más prioritario para revisión inmediata." },
        { label: "Severidad media",    value: counts.med,  delta: "+0", deltaNote: "", risk: "med", tip: "Alertas con severidad media. Recomendado monitoreo activo sin acción inmediata." },
        { label: "Severidad baja",     value: counts.low,  delta: "−2", deltaNote: "", risk: "low", tip: "Alertas de severidad informativa. Cambios menores dentro de la banda institucional." },
        { label: "Reglas en cola",     value: rules.length, foot: `${rules.filter(r => r.enabled).length} activas / ${rules.filter(r => !r.enabled).length} pausadas`, tip: window.BP2_GLOSSARY.kpi.rules },
      ]} />

      <div style={{ height: 24 }} />

      <div className="tabs">
        <button className="tab" data-on={tab === "active"} onClick={() => setTab("active")}>Cola de alertas ({filtered.length})</button>
        <button className="tab" data-on={tab === "rules"} onClick={() => setTab("rules")}>Reglas configuradas ({rules.length})</button>
        <button className="tab" data-on={tab === "scope"} onClick={() => setTab("scope")}>Alcance MVP v1</button>
      </div>

      {tab === "active" && (
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
              <div style={{ padding: 32, textAlign: "center", color: "var(--ink-4)", fontSize: 13 }}>
                No hay alertas activas en este nivel de acceso.
              </div>
            )}
            {filtered.map(a => (
              <div className="alert-row" key={a.id} style={{ background: a.isNew ? "var(--accent-soft)" : "" }}>
                <span className="alert-dot" style={{ background: a.level === "high" ? "var(--risk-high)" : a.level === "med" ? "var(--risk-med)" : "var(--risk-low)" }}></span>
                <div>
                  <div className="alert-time">{a.time}</div>
                  <div style={{ fontSize: 10, color: "var(--ink-5)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{a.id}</div>
                </div>
                <div>
                  <div className="alert-title">
                    {a.title}
                    {a.isNew && <span style={{ marginLeft: 8, fontSize: 9, color: "var(--accent-2)", letterSpacing: "0.14em" }}>NUEVO</span>}
                  </div>
                  <div className="alert-sub">{a.sub}</div>
                </div>
                <div className="cluster">
                  <span className="chip-tier">{a.module}</span>
                  {a.ruleId && <span className="chip-tier" style={{ fontFamily: "var(--font-mono)" }}>regla {a.ruleId}</span>}
                </div>
                <span className="num" style={{ fontSize: 11, color: "var(--ink-5)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>Tier {a.tier}+</span>
                <RiskChip level={a.level} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "rules" && (
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
              <label><Tip text={window.BP2_GLOSSARY.col.operator} icon>Operador</Tip></label>
              <select value={draft.operator} onChange={e => setDraft({ ...draft, operator: e.target.value })}>
                <option value=">">{`> mayor que`}</option>
                <option value="<">{`< menor que`}</option>
                <option value="≥">{`≥ mayor o igual`}</option>
                <option value="≤">{`≤ menor o igual`}</option>
              </select>
            </div>
            <div className="field">
              <label><Tip text={window.BP2_GLOSSARY.col.threshold} icon>Umbral</Tip></label>
              <input type="number" step="0.01" value={draft.threshold} onChange={e => setDraft({ ...draft, threshold: parseFloat(e.target.value) })} />
            </div>
            <div className="field">
              <label><Tip text={window.BP2_GLOSSARY.col.severity} icon>Severidad</Tip></label>
              <select value={draft.severity} onChange={e => setDraft({ ...draft, severity: e.target.value })}>
                <option value="low">Baja</option>
                <option value="med">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="field">
              <label><Tip text="Módulo del producto al que pertenece la regla. Útil para filtrar y agrupar alertas." icon>Módulo</Tip></label>
              <select value={draft.module} onChange={e => setDraft({ ...draft, module: e.target.value })}>
                <option>Índices</option>
                <option>Plataformas</option>
                <option>Rieles bancarios</option>
                <option>Comerciantes</option>
                <option>Criptoactivos</option>
              </select>
            </div>
            <button type="submit" className="btn-accent">Crear regla</button>
          </form>
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Regla</th>
                <th className="col-num tippable"><Tip text="Valor más reciente del índice. Si está cruzando el umbral aparece marcado en rojo y la regla dispara alerta." icon>Valor actual</Tip></th>
                <th>Módulo</th>
                <th><Tip text={window.BP2_GLOSSARY.col.severity} icon>Severidad</Tip></th>
                <th><Tip text="Última vez que la regla disparó una alerta automatizada." icon>Última activación</Tip></th>
                <th><Tip text={window.BP2_GLOSSARY.col.scope} icon>Acceso</Tip></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rules.map(r => {
                const idx = D.indicesSpec.find(i => i.code === r.indexCode);
                const v = idx ? idx.value : null;
                const triggered = v != null && (
                  (r.operator === ">" && v > r.threshold) ||
                  (r.operator === "<" && v < r.threshold) ||
                  (r.operator === "≥" && v >= r.threshold) ||
                  (r.operator === "≤" && v <= r.threshold)
                );
                return (
                  <tr key={r.id} style={{ opacity: r.enabled ? 1 : 0.55 }}>
                    <td>
                      <button onClick={() => toggleRule(r.id)}
                        style={{ width: 32, height: 18, borderRadius: 9, padding: 0, border: 0, background: r.enabled ? "var(--accent)" : "var(--ink-6)", position: "relative", cursor: "pointer" }}>
                        <span style={{ position: "absolute", top: 2, left: r.enabled ? 16 : 2, width: 14, height: 14, background: "#fff", borderRadius: "50%", transition: "left 0.15s ease" }}></span>
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", fontSize: 13 }}>
                          {r.indexCode} {r.operator} {r.threshold}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--ink-5)" }}>
                          {idx ? idx.name : ""} · por {r.createdBy}
                        </span>
                      </div>
                    </td>
                    <td className="num">
                      <span style={{ color: triggered ? "var(--risk-high)" : "var(--ink-1)", fontWeight: triggered ? 700 : 500 }}>
                        {v != null ? `${v} ${idx.unit}` : "—"}
                      </span>
                      {triggered && <div style={{ fontSize: 10, color: "var(--risk-high)", marginTop: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Cruzando</div>}
                    </td>
                    <td><span className="chip-tier">{r.module}</span></td>
                    <td><RiskChip level={r.severity} /></td>
                    <td className="num" style={{ color: "var(--ink-4)" }}>{r.lastFire || "—"}</td>
                    <td><span className="chip-tier">{r.scope}</span></td>
                    <td>
                      <button onClick={() => deleteRule(r.id)} className="btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "scope" && (
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

// =================== SCENARIOS ===================
function ScreenScenarios({ tier }) {
  const D = window.BP2_DATA;
  const [selected, setSelected] = useS3("base");
  const [fxShock, setFxShock] = useS3(0);
  const [usdtFlow, setUsdtFlow] = useS3(0);
  const [railRestriction, setRailRestriction] = useS3(0);

  if (tier < 3) {
    return (
      <>
        <PageHead eyebrow="Operación regulatoria" title="Escenarios"
                  desc="Simulaciones ejecutivas para sensibilidad del BPX, profundidad de liquidez y dominancia stable."
                  meta={[{ label: "Acceso", value: `Tier ${tier}` }]} />
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
  const riskLevel = (parseFloat(proj.bpx) > 12 || parseFloat(proj.ldi) < 0.4) ? "Crítico"
                   : (parseFloat(proj.bpx) > 9.5 || parseFloat(proj.ldi) < 0.55) ? "Alerta" : "Estable";

  return (
    <>
      <PageHead
        eyebrow="Operación regulatoria · Tier 3"
        title="Escenarios"
        desc="Simulación de sensibilidad para BPX, profundidad de liquidez y dominancia stable. Modelo determinístico — sin ML predictivo."
        meta={[
          { label: "Modelo", value: "Determinístico v1" },
          { label: "Snapshot base", value: "Abr · 2026" },
          { label: "Cadencia", value: "Bajo demanda" },
        ]}
      />

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Variables de entrada</div>
            <Eyebrow>Ajuste manual</Eyebrow>
          </div>
          <div className="card-body">
            <div className="knob">
              <div className="knob-label">
                <span>Shock cambiario (FX %)</span>
                <span className="v">{fxShock >= 0 ? "+" : ""}{fxShock}%</span>
              </div>
              <input type="range" min="-10" max="20" step="1" value={fxShock} onChange={e => setFxShock(parseInt(e.target.value))} />
            </div>
            <div className="knob">
              <div className="knob-label">
                <span>Retiro de USDT (presión)</span>
                <span className="v">{usdtFlow}</span>
              </div>
              <input type="range" min="0" max="10" step="1" value={usdtFlow} onChange={e => setUsdtFlow(parseInt(e.target.value))} />
            </div>
            <div className="knob">
              <div className="knob-label">
                <span>Restricción de rails</span>
                <span className="v">{railRestriction}</span>
              </div>
              <input type="range" min="0" max="10" step="1" value={railRestriction} onChange={e => setRailRestriction(parseInt(e.target.value))} />
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line-1)" }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Presets institucionales</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {D.scenarios.map(s => (
                  <button key={s.id}
                    onClick={() => {
                      setSelected(s.id);
                      if (s.id === "base") { setFxShock(0); setUsdtFlow(0); setRailRestriction(0); }
                      if (s.id === "stress") { setFxShock(5); setUsdtFlow(2); setRailRestriction(1); }
                      if (s.id === "shock")  { setFxShock(8); setUsdtFlow(8); setRailRestriction(3); }
                      if (s.id === "policy") { setFxShock(2); setUsdtFlow(1); setRailRestriction(8); }
                    }}
                    style={{
                      textAlign: "left",
                      background: selected === s.id ? "var(--accent-soft)" : "var(--surface-2)",
                      border: "1px solid " + (selected === s.id ? "var(--accent)" : "var(--line-1)"),
                      padding: "10px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      color: "var(--ink-1)",
                      fontSize: 13,
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 500
                    }}>
                    <span>{s.name}</span>
                    <span className="num" style={{ color: "var(--ink-4)", fontSize: 11 }}>BPX {s.bpx}%</span>
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
              <span className={`chip ${riskLevel === "Crítico" ? "chip-high" : riskLevel === "Alerta" ? "chip-med" : "chip-low"}`}>{riskLevel}</span>
            </div>
            <div className="card-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
                <ProjMetric label="BPX" base={base.bpx + "%"} proj={proj.bpx + "%"} />
                <ProjMetric label="LDI" base={base.ldi} proj={proj.ldi} />
                <ProjMetric label="SDR" base={base.sdr + "%"} proj={proj.sdr + "%"} />
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
                <div className="def"><dt>Entrada</dt><dd>FX {fxShock >= 0 ? "+" : ""}{fxShock}% · retiro stable {usdtFlow} · rails {railRestriction}</dd></div>
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

function ProjMetric({ label, base, proj }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      <div className="display" style={{ fontSize: 26, color: "var(--ink-1)" }}>{proj}</div>
      <div style={{ fontSize: 11, color: "var(--ink-5)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
        base · {base}
      </div>
    </div>
  );
}

// =================== REPORTES ===================
function ScreenReports({ tier }) {
  const D = window.BP2_DATA;
  const [filter, setFilter] = useS3("all");
  const accessible = r => r.tier <= tier;
  // Filter tabs match the translated type values
  const filtered = D.reports.filter(r => {
    if (!accessible(r)) return false;
    if (filter === "all") return true;
    if (filter === "executive") return r.type === "Ejecutivo";
    if (filter === "analytical") return r.type === "Analítico";
    if (filter === "regulatory") return r.type === "Regulatorio";
    return true;
  });

  return (
    <>
      <PageHead
        eyebrow="Repositorio institucional · Trazabilidad"
        title="Reportes"
        desc="Repositorio cronológico de reportes descargables en PDF. Ejecutivo (mensual T1) · Analítico (quincenal T2) · Regulatorio (bajo solicitud T3)."
        meta={[
          { label: "Reportes accesibles", value: filtered.length + " / " + D.reports.length },
          { label: "Cobertura", value: "Feb 2026 — May 2026" },
          { label: "Formato", value: "PDF" },
        ]}
      />

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, background: tier >= 1 ? "var(--surface)" : "var(--surface-2)", opacity: tier >= 1 ? 1 : 0.55 }}>
          <Eyebrow>Tier 1 · Ejecutivo</Eyebrow>
          <div className="display" style={{ fontSize: 22, marginTop: 8 }}>Reporte ejecutivo</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-4)", marginTop: 4 }}>Mensual · síntesis ejecutiva</div>
        </div>
        <div className="card" style={{ padding: 20, background: tier >= 2 ? "var(--surface)" : "var(--surface-2)", opacity: tier >= 2 ? 1 : 0.55 }}>
          <Eyebrow>Tier 2 · Analítico</Eyebrow>
          <div className="display" style={{ fontSize: 22, marginTop: 8 }}>Reporte analítico</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-4)", marginTop: 4 }}>Quincenal · analítica profunda</div>
        </div>
        <div className="card" style={{ padding: 20, background: tier >= 3 ? "var(--surface)" : "var(--surface-2)", opacity: tier >= 3 ? 1 : 0.55 }}>
          <Eyebrow>Tier 3 · Regulatorio</Eyebrow>
          <div className="display" style={{ fontSize: 22, marginTop: 8 }}>Reporte regulatorio</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-4)", marginTop: 4 }}>Bajo solicitud · supervisión</div>
        </div>
      </div>

      <div className="tabs">
        <button className="tab" data-on={filter === "all"} onClick={() => setFilter("all")}>Todos ({D.reports.filter(accessible).length})</button>
        <button className="tab" data-on={filter === "executive"} onClick={() => setFilter("executive")}>Ejecutivo</button>
        {tier >= 2 && <button className="tab" data-on={filter === "analytical"} onClick={() => setFilter("analytical")}>Analítico</button>}
        {tier >= 3 && <button className="tab" data-on={filter === "regulatory"} onClick={() => setFilter("regulatory")}>Regulatorio</button>}
      </div>

      <div className="stack" style={{ gap: 12 }}>
        {filtered.map(r => (
          <div className="report-card" key={r.id}>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div className="report-cover">
                <span>{r.type[0]}</span>
                <span>{r.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="cluster">
                  <span className={`chip ${r.tier === 1 ? "chip-neutral" : r.tier === 2 ? "chip-accent" : "chip-high"}`}>{r.type}</span>
                  <span className="chip-tier">Tier {r.tier}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-1)" }}>{r.title}</div>
                <div className="cluster" style={{ fontSize: 11.5, color: "var(--ink-4)", gap: 16 }}>
                  <span><span style={{ color: "var(--ink-5)" }}>Período</span> · {r.period}</span>
                  <span><span style={{ color: "var(--ink-5)" }}>Publicado</span> · {r.published}</span>
                  <span><span style={{ color: "var(--ink-5)" }}>Tamaño</span> · {r.size}</span>
                  <span className="num" style={{ color: "var(--ink-5)" }}>{r.id}</span>
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

Object.assign(window, { ScreenAlerts, ScreenScenarios, ScreenReports });
