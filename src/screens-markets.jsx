// Screens — Rieles bancarios, Índices, Comerciantes
const {
  PageHead, LockedHint, KpiStrip, Tip, InteractiveChart, Delta,
  RiskChip, fmtUsd, fmtNum, FamilyHead, Spark, Eyebrow,
  RangeBar,
} = window;
const { useState: useS2 } = React;

const INDEX_RANGE_OPTIONS = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "12m", label: "12M" },
];

function roundMetric(v) {
  if (Math.abs(v) >= 100) return Number(v.toFixed(1));
  if (Math.abs(v) >= 10) return Number(v.toFixed(2));
  return Number(v.toFixed(3));
}

function metricRange(monthly, monthLabels, range) {
  if (!monthly || monthly.length === 0) return { data: [], labels: [] };
  if (range === "12m") return { data: monthly, labels: monthLabels };

  const days = range === "30d" ? 30 : 7;
  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2] ?? last;
  const span = last - prev;
  const wobbleBase = Math.max(Math.abs(span), Math.abs(last) * 0.004, 0.01);
  const data = Array.from({ length: days }, (_, i) => {
    const t = days === 1 ? 1 : i / (days - 1);
    const wobble = Math.sin((i + 1) * 1.35) * wobbleBase * 0.12;
    return roundMetric(prev + span * t + wobble);
  });
  data[data.length - 1] = roundMetric(last);

  const labels = Array.from({ length: days }, (_, i) => {
    const remaining = days - i - 1;
    return remaining === 0 ? "Hoy" : `D-${remaining}`;
  });

  return { data, labels };
}

// =================== RIELES BANCARIOS ===================
function ScreenBanks({ tier, range = "12m", setRange = () => {} }) {
  const D = window.BP2_DATA;
  const activeRange = tier >= 2 ? range : "12m";
  const trendChar = t => t === "up" ? "▲" : t === "down" ? "▼" : "■";
  const trendCls  = t => t === "up" ? "delta-up" : t === "down" ? "delta-dn" : "delta-flat";

  // Top 7 rails — orden por exposición
  const ranked = [...D.banks].sort((a, b) => b.exposure - a.exposure).map((b, i) => ({
    ...b,
    capacity: window.scaleMetricValue(b.capacity, activeRange, i + 1),
    mentions: window.scaleMetricValue(b.mentions, activeRange, i + 2),
  }));
  const besRange = metricRange(D.series.BES, D.monthsLabels, activeRange);

  // =========== Tier 1: vista AGREGADA ===========
  if (tier === 1) {
    return (
      <>
        <PageHead
          eyebrow="Estructura del mercado · Rieles bancarios"
          title="Rieles bancarios · vista agregada"
          desc="Lectura ejecutiva de la exposición agregada del flujo P2P sobre los rieles bancarios. La tabla desagregada y los scores por riel forman parte de los Tiers 2 y 3."
          meta={[
            { label: "Rieles activos", value: ranked.length },
            { label: "BES máximo", value: `${ranked[0].exposure.toFixed(2)} · ${ranked[0].code}` },
            { label: "Captura", value: "Abr · 2026" },
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
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {ranked.map(b => (
                  <div key={b.code} style={{ display: "grid", gridTemplateColumns: "180px 1fr 70px", gap: 12, alignItems: "center", fontSize: 13 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{b.name}</div>
                      <div className="num" style={{ fontSize: 10.5, color: "var(--ink-5)" }}>{b.code}</div>
                    </div>
                    <span className="bar"><span style={{ width: `${b.exposure * 100}%`, background: b.risk === "high" ? "var(--risk-high)" : b.risk === "med" ? "var(--risk-med)" : "var(--risk-low)" }}></span></span>
                    <span className="num" style={{ textAlign: "right", fontWeight: 600 }}>{b.exposure.toFixed(2)}</span>
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
                <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>0.74</span>
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

  // =========== Tier 2 / Tier 3 ===========
  return (
    <>
      <PageHead
        eyebrow="Estructura del mercado · Rieles bancarios"
        title="Rieles bancarios"
        desc={tier === 2
          ? "Bank Exposure Score (BES), capacidad observada y menciones en el flujo P2P normalizado por riel."
          : "Bank Exposure Score (BES), capacidad observada, menciones y participación (mention/capacity share) de cada riel sobre el total."}
        meta={[
          { label: "Rieles activos", value: ranked.length },
          { label: "BES máximo", value: `${ranked[0].exposure.toFixed(2)} · ${ranked[0].code}` },
          { label: "Capacidad total", value: "$18.5 M" },
        ]}
      />
      {tier >= 2 && <RangeBar range={range} setRange={setRange} />}

      <KpiStrip items={[
        { label: "BES agregado",        value: "0.52",    delta: "+0.03",  deltaNote: "vs. Mar", risk: "med", tip: window.BP2_GLOSSARY.idx.BES },
        { label: "Capacidad rastreada", value: "$18.5 M", delta: "+8.1%",  deltaNote: "vs. Mar", tip: window.BP2_GLOSSARY.col.capacity },
        { label: "Menciones 30d",       value: "4 821",   delta: "+412",   deltaNote: "vs. Mar", tip: window.BP2_GLOSSARY.col.mentions },
        { label: "Rieles con flag",     value: "1",       delta: "+0",     deltaNote: "BCB", risk: "high", tip: "Rieles que superan el umbral institucional de exposición y requieren revisión por compliance." },
      ]} />

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Ranking de exposición por riel</div>
            <div className="card-sub">{tier === 3 ? "Incluye mention share y capacity share calculados sobre el total observado" : "BES, capacidad y menciones por riel"}</div>
          </div>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Riel bancario</th>
              <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.idx.BES} icon>BES</Tip></th>
              <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.capacity} icon>Capacidad</Tip></th>
              <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.mentions} icon>Menciones</Tip></th>
              {tier === 3 && <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.mentionShare} icon>Mention share</Tip></th>}
              {tier === 3 && <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.capacityShare} icon>Capacity share</Tip></th>}
              <th><Tip text={window.BP2_GLOSSARY.col.trend12} icon>Tendencia</Tip></th>
              <th>Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((b, i) => (
              <tr key={b.code}>
                <td className="num" style={{ color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600 }}>{b.name}</span>
                    <span className="num" style={{ fontSize: 11, color: "var(--ink-5)" }}>{b.code}</span>
                  </div>
                </td>
                <td className="num" style={{ fontWeight: 600 }}>{b.exposure.toFixed(2)}</td>
                <td className="num">{fmtUsd(b.capacity)}</td>
                <td className="num">{fmtNum(b.mentions)}</td>
                {tier === 3 && (
                  <td className="num">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span>{b.mentionShare.toFixed(1)}%</span>
                      <span style={{ width: 50, height: 4, background: "var(--surface-sunk)", borderRadius: 2, overflow: "hidden" }}>
                        <span style={{ display: "block", height: "100%", width: `${b.mentionShare * 2.5}%`, background: "var(--accent)" }}></span>
                      </span>
                    </div>
                  </td>
                )}
                {tier === 3 && (
                  <td className="num">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span>{b.capacityShare.toFixed(1)}%</span>
                      <span style={{ width: 50, height: 4, background: "var(--surface-sunk)", borderRadius: 2, overflow: "hidden" }}>
                        <span style={{ display: "block", height: "100%", width: `${b.capacityShare * 2.5}%`, background: "var(--accent-2)" }}></span>
                      </span>
                    </div>
                  </td>
                )}
                <td>
                  <span className={trendCls(b.trend)} style={{ fontSize: 12 }}>
                    {trendChar(b.trend)} {b.trend === "up" ? "Subiendo" : b.trend === "down" ? "Bajando" : "Estable"}
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
            <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>0.74</span>
            <Delta value="+0.03" />
          </div>
        </div>
        <div className="card-body">
          <InteractiveChart data={besRange.data} labels={besRange.labels} unit="score" height={240} showThreshold={0.70} />
        </div>
      </div>
    </>
  );
}

// =================== ÍNDICES ===================
function ScreenIndices({ tier, range = "12m", setRange = () => {} }) {
  const D = window.BP2_DATA;
  const [selectedCode, setSelectedCode] = useS2("BPX");
  const selected = D.indicesSpec.find(i => i.code === selectedCode) || D.indicesSpec[0];
  const selectedRange = metricRange(D.series[selected.code] || [], D.monthsLabels, range);
  const rangeLabel = INDEX_RANGE_OPTIONS.find(r => r.id === range)?.label || "12M";

  const visibleFamilies = tier === 3
    ? D.indexFamilies
    : D.indexFamilies.filter(f => f.id !== "compliance");

  // Lista de índices disponibles para el selector según el tier
  const selectableIndices = D.indicesSpec.filter(i =>
    tier === 3 ? true : i.family !== "compliance"
  );

  // =========== Tier 1: vista agregada por familia ===========
  if (tier === 1) {
    return (
      <>
        <PageHead
          eyebrow="Suite propietaria · Tier 1 Ejecutivo"
          title="Índices BBIM · vista agregada"
          desc="Nueve índices propietarios agrupados en tres familias metodológicas. Lectura ejecutiva con variación mensual; la serie temporal y el desglose histórico son parte del Tier 2."
          meta={[
            { label: "Índices visibles", value: "9 de 13" },
            { label: "Cadencia", value: "Mensual" },
            { label: "Captura", value: "Abr · 2026" },
          ]}
        />

        {visibleFamilies.map((fam, fi) => {
          const idxs = fam.codes.map(c => D.indicesSpec.find(i => i.code === c)).filter(Boolean);
          return (
            <div key={fam.id}>
              <FamilyHead idx={fi + 1} title={fam.name} sub={fam.sub} />
              <div className="grid-3" style={{ marginBottom: 8 }}>
                {idxs.map(idx => (
                  <div className="kpi" key={idx.code} style={{ background: "var(--surface)" }}>
                    <div className="kpi-row">
                      <div className="kpi-label">
                        <Tip text={window.BP2_GLOSSARY.idx[idx.code]} icon>{idx.code}</Tip>
                      </div>
                      <RiskChip level={idx.risk} />
                    </div>
                    <div className="kpi-value">{idx.value}{idx.unit && <span className="kpi-unit">{idx.unit}</span>}</div>
                    <div className="kpi-delta"><Delta value={idx.deltaM} /><span style={{ color: "var(--ink-4)" }}> variación mensual</span></div>
                    <div className="kpi-foot">{idx.name}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ height: 24 }} />

        <div className="card">
          <div className="card-head">
            <div className="card-title">Nota metodológica</div>
            <span className="eyebrow">BP2PIM v1</span>
          </div>
          <div className="card-body" style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>
            En Tier 1 los índices se muestran en vista agregada con su variación mensual. La serie temporal completa, el desglose por captura diaria y la familia de cumplimiento y riesgo sistémico están disponibles en los niveles superiores.
          </div>
        </div>
      </>
    );
  }

  // =========== Tier 2 / Tier 3: chart con select + tablas por familia ===========
  return (
    <>
      <PageHead
        eyebrow={tier === 2 ? "Suite propietaria · Tier 2 Profesional" : "Suite propietaria · Tier 3 Regulador"}
        title="Índices BBIM"
        desc={tier === 2
          ? "Nueve índices propietarios sobre la fuente Crystal, agrupados en tres familias metodológicas con serie temporal y desglose analítico."
          : "Trece índices propietarios sobre la fuente Crystal, agrupados en cuatro familias metodológicas: precio, liquidez, estructura y cumplimiento."
        }
        meta={[
          { label: "Suite", value: tier === 2 ? "9 índices" : "13 índices" },
          { label: "Familias", value: visibleFamilies.length },
          { label: "Última sincronización", value: "—2 min" },
        ]}
      />

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head" style={{ alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="field" style={{ minWidth: 280 }}>
              <label>Índice</label>
              <select value={selectedCode} onChange={e => setSelectedCode(e.target.value)}>
                {selectableIndices.map(i => (
                  <option key={i.code} value={i.code}>{i.code} — {i.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Eyebrow>{selected.code} · {selected.name}</Eyebrow>
              <div className="cluster" style={{ marginTop: 6, alignItems: "baseline" }}>
                <span className="display" style={{ fontSize: 32, color: "var(--ink-1)" }}>{selected.value}</span>
                <span style={{ color: "var(--ink-4)", fontSize: 14, fontWeight: 500 }}>{selected.unit}</span>
                <RiskChip level={selected.risk} />
              </div>
              <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--ink-4)" }}>
                <Delta value={selected.delta} /> · 24h · <Delta value={selected.deltaM} /> · mensual
              </div>
            </div>
          </div>
          <div className="tier-switch" role="tablist" aria-label="Rango temporal">
            {INDEX_RANGE_OPTIONS.map(r => (
              <button key={r.id} data-on={range === r.id} onClick={() => setRange(r.id)}>{r.label}</button>
            ))}
          </div>
        </div>
        <div className="card-body">
          <InteractiveChart data={selectedRange.data} labels={selectedRange.labels} unit={selected.unit} height={260}
                            showThreshold={selected.threshold} />
          <p style={{ marginTop: 12, fontSize: 12, color: "var(--ink-4)" }}>
            {selected.purpose}. Familia: {D.indexFamilies.find(f => f.id === selected.family).name}.
            {selected.threshold != null && ` Umbral institucional: ${selected.threshold} ${selected.unit}.`}
          </p>
        </div>
      </div>

      {/* Render each family */}
      {visibleFamilies.map((fam, fi) => {
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
                    <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.delta24} icon>Δ 24h</Tip></th>
                    <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.deltaM} icon>Δ mensual</Tip></th>
                    <th style={{ width: 90 }}>Riesgo</th>
                    <th style={{ width: 100 }} className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.trend12} icon>Tend. {rangeLabel}</Tip></th>
                  </tr>
                </thead>
                <tbody>
                  {idxs.map(idx => {
                    const accessible = idx.tiers.includes(tier);
                    return (
                      <tr key={idx.code}
                          onClick={() => accessible && setSelectedCode(idx.code)}
                          style={{ cursor: accessible ? "pointer" : "default", background: selectedCode === idx.code ? "var(--accent-soft)" : "" }}
                          className={!accessible ? "locked-row" : ""}>
                        <td className="num" style={{ fontWeight: 700, color: accessible ? "var(--ink-1)" : "var(--ink-5)" }}>
                          <Tip text={window.BP2_GLOSSARY.idx[idx.code]} pos="right">{idx.code}</Tip>
                        </td>
                        <td style={{ fontWeight: 500 }}>{idx.name}</td>
                        <td style={{ color: "var(--ink-4)", fontSize: 12.5 }}>{idx.purpose}</td>
                        <td className="num" style={{ fontWeight: 600 }}>{accessible ? `${idx.value} ${idx.unit}` : "—"}</td>
                        <td className="num">{accessible ? <Delta value={idx.delta} /> : "—"}</td>
                        <td className="num">{accessible ? <Delta value={idx.deltaM} /> : "—"}</td>
                        <td>{accessible ? <RiskChip level={idx.risk} /> : <span className="chip-tier">T{Math.min(...idx.tiers)}+</span>}</td>
                        <td style={{ textAlign: "right" }}>{accessible && D.series[idx.code] ? <Spark data={metricRange(D.series[idx.code], D.monthsLabels, range).data} w={90} h={22} stroke="var(--accent)" /> : "—"}</td>
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

// =================== COMERCIANTES ===================
function ScreenMerchants({ tier, range = "12m", setRange = () => {} }) {
  const D = window.BP2_DATA;
  const activeRange = tier >= 2 ? range : "12m";
  if (tier < 2) {
    return (
      <>
        <PageHead eyebrow="Estructura del mercado" title="Comerciantes"
                  desc="Concentración, capacidad y perfil de riesgo por operador." meta={[{ label: "Acceso", value: `Tier ${tier}` }]} />
        <LockedHint tier={tier} available={[2, 3]} what="El módulo Comerciantes" />
      </>
    );
  }

  const kpisCommon = [
    { label: "MCI · HHI Merchant",    value: "0.38",   delta: "+0.02",   deltaNote: "vs. Mar", risk: "med", tip: window.BP2_GLOSSARY.idx.MCI },
    { label: "Top-5 cuota acumulada", value: "28.4%",  delta: "+1.1 pp", deltaNote: "vs. Mar", tip: window.BP2_GLOSSARY.kpi.top5 },
    { label: "Capacidad agregada",    value: "$14.8 M", delta: "+6.2%",  deltaNote: "vs. Mar", tip: window.BP2_GLOSSARY.col.capacity },
    { label: "Operadores marcados",   value: "3",      delta: "+1",      deltaNote: "nuevo flag", risk: "high", tip: window.BP2_GLOSSARY.kpi.flagged },
  ];
  const kpisT3 = [
    { label: "MCI · HHI Merchant",    value: "0.38",   delta: "+0.02",   deltaNote: "vs. Mar", risk: "med", tip: window.BP2_GLOSSARY.idx.MCI },
    { label: "Top-5 cuota acumulada", value: "28.4%",  delta: "+1.1 pp", deltaNote: "vs. Mar", tip: window.BP2_GLOSSARY.kpi.top5 },
    { label: "MRP promedio",          value: "62",     unit: "/100", delta: "−1", deltaNote: "vs. Mar", risk: "med", tip: window.BP2_GLOSSARY.kpi.avgMrp },
    { label: "Operadores marcados",   value: "3",      delta: "+1",      deltaNote: "nuevo flag", risk: "high", tip: window.BP2_GLOSSARY.kpi.flagged },
  ];

  const merchantRows = D.merchants.map((m, i) => ({
    ...m,
    capacity: window.scaleMetricValue(m.capacity, activeRange, i + 1),
  }));
  const mciRange = metricRange(D.series.MCI, D.monthsLabels, activeRange);

  return (
    <>
      <PageHead
        eyebrow="Estructura del mercado · Operadores"
        title="Comerciantes"
        desc={tier === 2
          ? "Operadores rastreados con su capacidad observada y rieles asociados. La cuota individual y el perfil de riesgo (MRP) son exclusivos del Tier 3."
          : "Concentración (MCI), capacidad observada y perfil de riesgo (MRP) por operador, con cuota individual y nombrado regulatorio."}
        meta={[
          { label: "Operadores rastreados", value: "1 402" },
          { label: "MCI · HHI", value: "0.38" },
          { label: "Capacidad agregada", value: "$14.8 M" },
        ]}
      />
      {tier >= 2 && <RangeBar range={range} setRange={setRange} />}

      <KpiStrip items={tier === 3 ? kpisT3 : kpisCommon} />

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Operadores por capacidad observada</div>
            <div className="card-sub">{tier === 2 ? "Vista institucional sin MRP individual" : "Vista regulatoria con cuota y MRP por operador"}</div>
          </div>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 100 }}>ID</th>
              <th>Operador</th>
              <th>Plataforma</th>
              <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.capacity} icon>Capacidad (Bs.)</Tip></th>
              {tier === 3 && <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.share} icon>Cuota</Tip></th>}
              {tier === 3 && <th className="col-num tippable" style={{ width: 180 }}><Tip text={window.BP2_GLOSSARY.col.mrp} icon>MRP</Tip></th>}
              <th><Tip text="Rieles bancarios o métodos de pago asociados al operador." icon>Rieles</Tip></th>
              <th><Tip text={window.BP2_GLOSSARY.col.status} icon>Estado</Tip></th>
            </tr>
          </thead>
          <tbody>
            {merchantRows.map(m => (
              <tr key={m.id}>
                <td className="num" style={{ color: "var(--ink-4)" }}>{m.id}</td>
                <td style={{ fontWeight: 500 }}>{m.alias}</td>
                <td style={{ color: "var(--ink-3)" }}>{m.platform}</td>
                <td className="num">{fmtNum(m.capacity)}</td>
                {tier === 3 && <td className="num">{m.share.toFixed(1)}%</td>}
                {tier === 3 && (
                  <td className="num">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, width: "100%", justifyContent: "flex-end" }}>
                      <span style={{ fontWeight: 600 }}>{m.mrp}</span>
                      <span style={{ width: 64, height: 5, background: "var(--surface-sunk)", borderRadius: 3, overflow: "hidden" }}>
                        <span style={{ display: "block", height: "100%", width: `${m.mrp}%`, background: m.risk === "low" ? "var(--risk-low)" : m.risk === "med" ? "var(--risk-med)" : "var(--risk-high)" }}></span>
                      </span>
                    </span>
                  </td>
                )}
                <td>
                  <span style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {m.rails.map(r => <span key={r} className="chip-tier">{r}</span>)}
                  </span>
                </td>
                <td>
                  <span className={`chip ${m.status === "active" ? "chip-low" : m.status === "review" ? "chip-med" : "chip-high"}`}>
                    {m.status === "active" ? "Activo" : m.status === "review" ? "Revisión" : "Marcado"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ height: 24 }} />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">MCI · Concentración por merchant</div>
            <div className="card-sub">HHI · 12 meses</div>
          </div>
          <div className="cluster">
            <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>0.38</span>
            <Delta value="+0.02" />
          </div>
        </div>
        <div className="card-body">
          <InteractiveChart data={mciRange.data} labels={mciRange.labels} unit="HHI" height={220} showThreshold={0.45} />
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ScreenBanks, ScreenIndices, ScreenMerchants });
