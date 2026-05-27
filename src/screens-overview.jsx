// Screens — Overview, Platforms, Cryptocurrencies
const {
  PageHead, Eyebrow, Tip, Spark, HBarChart, VBarChart, DonutChart,
  KpiStrip, RiskChip, Delta,
} = window;
const { useState: useS1 } = React;

// =================== OVERVIEW (Descripción general) ===================
function ScreenOverview({ tier }) {
  const D = window.BP2_DATA;
  const cadence = tier === 1 ? "Resumen mensual" : tier === 2 ? "Cierre diario consolidado" : "Cierre EOD / T+1";
  const headerIndices = D.indicesSpec.filter(i => i.tiers.includes(tier)).slice(0, 6);

  // Top plataformas — orden por capacidad observada (BOB)
  const platformsCap = [...D.platforms]
    .sort((a, b) => b.capacityBob - a.capacityBob)
    .map(p => ({ label: p.name.replace(" P2P", ""), value: p.capacityBob }));

  return (
    <>
      <PageHead
        eyebrow={tier === 1 ? "Panel Ejecutivo · Tier 1" : tier === 2 ? "Panel Profesional · Tier 2" : "Panel Regulatorio · Tier 3"}
        title="Descripción general"
        desc="Feed de inteligencia institucional sobre el mercado P2P boliviano. Monitoreo de 13 índices propietarios BBIM con supervisión regulatoria."
        meta={[
          { label: "Cadencia", value: cadence },
          { label: "Captura", value: "30 Abr · 2026" },
          { label: "Última sincronización", value: "—2 min" },
        ]}
      />

      <div className="grid-2">
        <div className="editorial-card">
          <div className="row" style={{ alignItems: "flex-start", marginBottom: 14 }}>
            <Eyebrow withLine>Comentario del Head of Research</Eyebrow>
            <span className="num" style={{ color: "var(--ink-4)", fontSize: 11 }}>BP2PIM · Abr 2026</span>
          </div>
          <p className="editorial" style={{ margin: 0 }}>
            El mercado P2P boliviano cerró abril con un BPX de <strong>8.12%</strong> sobre la referencia oficial, sostenido por una compresión moderada de profundidad (LDI <strong>0.62</strong>) y una dominancia stable que sigue desplazándose hacia USDC. La concentración por plataforma se mantiene elevada — PCI <strong>0.51</strong> — y la exposición agregada por riel bancario sube a <strong>BES 0.74</strong>.
          </p>
          <p className="editorial" style={{ marginTop: 12, marginBottom: 0 }}>
            Recomendamos observar la transición USDT → USDC y el comportamiento del SDR antes de reasignar coberturas de exposición.
          </p>
          <div className="editorial-sig">— J. Salinas · Head of Research</div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Pulso de índices</div>
            <span className="eyebrow" style={{ fontSize: 9 }}>{tier === 3 ? "13 propietarios" : "9 propietarios"}</span>
          </div>
          <div style={{ padding: "8px 22px 12px" }}>
            {headerIndices.map((idx, i) => (
              <div key={idx.code} style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 70px 60px",
                gap: 14, alignItems: "center",
                padding: "11px 0",
                borderBottom: i < headerIndices.length - 1 ? "1px solid var(--line-1)" : "none",
                fontSize: 12.5
              }}>
                <Tip text={window.BP2_GLOSSARY.idx[idx.code]} pos="right">
                  <span className="num" style={{ color: "var(--ink-1)", fontWeight: 700, fontSize: 12 }}>{idx.code}</span>
                </Tip>
                <span style={{ color: "var(--ink-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idx.purpose}</span>
                <span className="num" style={{ color: "var(--ink-1)", textAlign: "right", fontWeight: 600 }}>{idx.value}</span>
                <Spark data={D.series[idx.code] || []} w={60} h={18} stroke="var(--accent)" />
              </div>
            ))}
          </div>
          <div className="card-foot">
            Ver los índices · módulo <span style={{ color: "var(--accent-2)", fontWeight: 600 }}>Índices</span>
          </div>
        </div>
      </div>

      <div style={{ height: 24 }} />

      {/* Capacidad visible por plataforma + Capacidad por criptoactivo */}
      <div className="grid-2-eq">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Capacidad visible por plataforma</div>
              <div className="card-sub">Top plataformas por capacidad visible en BOB</div>
            </div>
          </div>
          <div className="card-body">
            <HBarChart
              data={platformsCap}
              barThickness={14}
              color="var(--accent)"
              labelWidth={70}
              valueFmt={v => v >= 1e6 ? `${(v/1e6).toFixed(0)} M` : v >= 1e3 ? `${(v/1e3).toFixed(0)} k` : v}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Capacidad por criptoactivo</div>
              <div className="card-sub">Top 10 monedas + Otros</div>
            </div>
          </div>
          <div className="card-body">
            <VBarChart
              data={D.capacityByCrypto.map(c => ({ label: c.code, value: c.cap }))}
              height={260}
              color="var(--ink-1)"
              valueFmt={v => v >= 1e6 ? `${(v/1e6).toFixed(0)} M` : v >= 1e3 ? `${(v/1e3).toFixed(0)} k` : v}
            />
          </div>
        </div>
      </div>

      <div style={{ height: 24 }} />

      {/* Rieles bancarios (menciones P2P) + Buy/Sell imbalance */}
      <div className="grid-2-eq">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Rieles bancarios</div>
              <div className="card-sub">Menciones por ofertas P2P</div>
            </div>
          </div>
          <div className="card-body">
            <HBarChart
              data={D.paymentMethods.slice(0, 10).map(p => ({ label: p.code, value: p.mentions }))}
              barThickness={14}
              color="#1B2E55"
              labelWidth={94}
              valueFmt={v => v >= 1e3 ? `${(v/1e3).toFixed(1)}k` : v}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Buy/Sell imbalance</div>
              <div className="card-sub">Distribución por side</div>
            </div>
          </div>
          <div className="card-body">
            <VBarChart
              data={[
                { label: "buy",  value: D.platforms.reduce((s, p) => s + p.buyOffers,  0) },
                { label: "sell", value: D.platforms.reduce((s, p) => s + p.sellOffers, 0) },
              ]}
              height={300}
              color="#F59E0B"
              valueFmt={v => v.toLocaleString("en-US")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function SimpleListCard({ title, rows }) {
  return (
    <div className="card">
      <div className="card-head"><div className="card-title">{title}</div></div>
      <div style={{ padding: "4px 22px 14px" }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0",
            borderBottom: i < rows.length - 1 ? "1px solid var(--line-1)" : "none"
          }}>
            <div style={{ fontSize: 13 }}>{r.left}</div>
            <div className="cluster">
              {r.risk && <RiskChip level={r.risk} />}
              <span className="num" style={{ fontSize: 13, color: "var(--ink-1)", fontWeight: 600 }}>{r.right}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== PLATAFORMAS ===================
// Platform-specific palette matching the Figma reference donut
const PLATFORM_PALETTE = {
  "Binance P2P": "#2563EB", // royal blue
  "Bybit":       "#14B8A6", // teal
  "Bitget":      "#F59E0B", // amber
  "OKX":         "#EF4444", // red
  "KuCoin":      "#22C55E", // green
};

function ScreenPlatforms({ tier }) {
  const D = window.BP2_DATA;

  // Sort by capacity (BOB) — drives the donut visual
  const byCap = [...D.platforms].sort((a, b) => b.capacityBob - a.capacityBob);
  const donutData = byCap.map(p => ({
    label: p.name.replace(" P2P", ""),
    value: p.capacityBob,
    color: PLATFORM_PALETTE[p.name] || "#94A3B8",
  }));
  const totalCap = byCap.reduce((s, p) => s + p.capacityBob, 0);

  return (
    <>
      <PageHead
        eyebrow="Mercado P2P · Plataformas"
        title="Plataformas"
        desc="Ranking institucional de las 5 plataformas P2P públicas con operaciones en Bolivia: Binance P2P, OKX, Bybit, KuCoin y Bitget."
        meta={[
          { label: "Plataformas", value: D.platforms.length },
          { label: "Visibles en Tier", value: tier },
          { label: "Captura", value: "Abr · 2026" },
        ]}
      />

      {/* Donut — visible para todos los tiers */}
      <div className="grid-2-eq" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Participación por plataforma</div>
              <div className="card-sub">Capacidad visible en BOB</div>
            </div>
          </div>
          <div className="card-body">
            <DonutChart
              data={donutData}
              centerLabel="Capacidad total"
              centerValue={`Bs ${(totalCap / 1e6).toFixed(1)}M`}
              height={280}
              thickness={36}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{tier === 1 ? "Cuota agregada" : "PCI · Concentración"}</div>
              <div className="card-sub">{tier === 1 ? "Top plataformas por participación visible" : "HHI por plataforma · 12 meses"}</div>
            </div>
            {tier > 1 && (
              <div className="cluster">
                <span className="num" style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>0.51</span>
                <Delta value="−0.01" />
              </div>
            )}
          </div>
          <div className="card-body">
            {tier === 1 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 6 }}>
                {byCap.map(p => (
                  <div key={p.code} style={{ display: "grid", gridTemplateColumns: "16px 130px 1fr 70px", gap: 12, alignItems: "center", fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, background: PLATFORM_PALETTE[p.name], borderRadius: 2 }}></span>
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                    <span className="bar"><span style={{ width: `${p.share}%`, background: PLATFORM_PALETTE[p.name] }}></span></span>
                    <span className="num" style={{ textAlign: "right", fontWeight: 600 }}>{p.share.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <InteractiveChart data={D.series.PCI} labels={D.monthsLabels} unit="HHI" height={220} showThreshold={0.60} />
            )}
          </div>
        </div>
      </div>

      {/* T1 termina aquí. T2/T3 muestran la tabla desagregada */}
      {tier !== 1 && (
        <>
          <KpiStrip items={[
            { label: "Ofertas de compra (24h)",  value: "1 899", delta: "+124", deltaNote: "vs. ayer", tip: window.BP2_GLOSSARY.col.buy },
            { label: "Ofertas de venta (24h)",   value: "1 357", delta: "+86",  deltaNote: "vs. ayer", tip: window.BP2_GLOSSARY.col.sell },
            { label: "HHI plataforma · PCI",     value: "0.51",  delta: "−0.01", deltaNote: "vs. Mar", risk: "med", tip: window.BP2_GLOSSARY.idx.PCI },
            { label: "Spread medio P2P",         value: "0.84",  unit: "%", delta: "+0.06 pp", deltaNote: "vs. Mar", tip: window.BP2_GLOSSARY.col.spread },
          ]} />

          <div style={{ height: 24 }} />

          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Ranking institucional</div>
                <div className="card-sub">Captura Abr · 2026 — ofertas como número, no como volumen monetario</div>
              </div>
            </div>
            <table className="t">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th>Plataforma</th>
                  <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.share} icon>Cuota</Tip></th>
                  <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.buy} icon>Ofertas compra</Tip></th>
                  <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.sell} icon>Ofertas venta</Tip></th>
                  <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.completion} icon>Completion</Tip></th>
                  <th className="col-num tippable"><Tip text={window.BP2_GLOSSARY.col.spread} icon>Spread</Tip></th>
                  <th>Riesgo</th>
                </tr>
              </thead>
              <tbody>
                {byCap.map(p => (
                  <tr key={p.code}>
                    <td className="num" style={{ color: "var(--ink-4)" }}>{String(p.rank).padStart(2, "0")}</td>
                    <td>
                      <span className="logo-cell">
                        <span className="logo-square" style={{ background: PLATFORM_PALETTE[p.name], color: "#fff", border: 0 }}>{p.code[0]}</span>
                        {p.name}
                      </span>
                    </td>
                    <td className="num" style={{ fontWeight: 600 }}>{p.share.toFixed(1)}%</td>
                    <td className="num"><span style={{ color: "var(--risk-low)" }}>{p.buyOffers}</span></td>
                    <td className="num"><span style={{ color: "var(--risk-high)" }}>{p.sellOffers}</span></td>
                    <td className="num">{p.completion ? `${p.completion.toFixed(1)}%` : "—"}</td>
                    <td className="num">{p.spread ? `${p.spread.toFixed(2)}%` : "—"}</td>
                    <td><RiskChip level={p.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

// =================== CRIPTOACTIVOS ===================
function ScreenCryptos({ tier }) {
  const D = window.BP2_DATA;

  // Capacity by coin — used in both vbar chart and the detailed table
  const capRows = D.capacityByCrypto;
  const totalCap = capRows.reduce((s, r) => s + r.cap, 0);
  const stableCodes = new Set(D.cryptos.filter(c => c.type === "stable").map(c => c.code));
  const stableCap = capRows.filter(r => stableCodes.has(r.code)).reduce((s, r) => s + r.cap, 0);
  const altcoinCap = totalCap - stableCap;
  const stableShare = (stableCap / totalCap) * 100;
  const altcoinShare = 100 - stableShare;

  return (
    <>
      <PageHead
        eyebrow="Activos cripto"
        title="Criptoactivos"
        desc="Mix de criptoactivos operando en el mercado P2P boliviano. Composición stablecoins vs altcoins y capacidad observada por moneda."
        meta={[
          { label: "Activos rastreados", value: D.cryptos.length },
          { label: "SDR · Dominancia stable", value: `${stableShare.toFixed(1)}%` },
          { label: "Captura", value: "Abr · 2026" },
        ]}
      />

      {/* Charts principales — visibles para todos los tiers */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Composición stablecoins vs altcoins</div>
              <div className="card-sub">Por capacidad visible</div>
            </div>
          </div>
          <div className="card-body">
            <DonutChart
              data={[
                { label: "Stablecoins", value: stableCap,  color: "#0F172A" },
                { label: "Altcoins",    value: altcoinCap, color: "#F59E0B" },
              ]}
              centerLabel="Capacidad total"
              centerValue={`Bs ${(totalCap/1e6).toFixed(1)}M`}
              height={260}
              thickness={32}
            />
            <div className="grid-2-eq" style={{ marginTop: 18 }}>
              <div className="kpi" style={{ background: "var(--surface-2)", padding: 16 }}>
                <div className="kpi-label">Stablecoins</div>
                <div className="kpi-value" style={{ fontSize: 18 }}>Bs {(stableCap).toLocaleString("es-BO")}</div>
                <div className="kpi-foot">{stableShare.toFixed(1)}%</div>
              </div>
              <div className="kpi" style={{ background: "var(--surface-2)", padding: 16 }}>
                <div className="kpi-label">Altcoins</div>
                <div className="kpi-value" style={{ fontSize: 18 }}>Bs {(altcoinCap).toLocaleString("es-BO")}</div>
                <div className="kpi-foot">{altcoinShare.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Capacidad por moneda</div>
              <div className="card-sub">Top 10 criptoactivos + Otros</div>
            </div>
          </div>
          <div className="card-body">
            <HBarChart
              data={capRows.map(c => ({ label: c.code, value: c.cap }))}
              barThickness={14}
              color="#14B8A6"
              labelWidth={70}
              valueFmt={v => v >= 1e6 ? `${(v/1e6).toFixed(0)} M` : v >= 1e3 ? `${(v/1e3).toFixed(0)} k` : v}
            />
          </div>
        </div>
      </div>

      {/* T2 y T3: tabla desagregada por activo */}
      {tier !== 1 && (
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Detalle por criptoactivo</div>
              <div className="card-sub">Dominancia, cambio mensual y volumen 24h</div>
            </div>
          </div>
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Activo</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th className="col-num">Cuota</th>
                <th className="col-num">Δ vs. mes anterior</th>
                <th className="col-num">Volumen 24h</th>
              </tr>
            </thead>
            <tbody>
              {D.cryptos.filter(c => c.tiers.includes(tier)).map(c => {
                const delta = c.share - c.prev;
                return (
                  <tr key={c.code}>
                    <td className="num" style={{ fontWeight: 700 }}>{c.code}</td>
                    <td>{c.name}</td>
                    <td><span className="chip-tier">{c.type === "stable" ? "estable" : c.type === "crypto" ? "volátil" : "mixto"}</span></td>
                    <td className="num" style={{ fontWeight: 600 }}>{c.share.toFixed(1)}%</td>
                    <td className="num" style={{ color: delta >= 0 ? "var(--risk-low)" : "var(--risk-high)" }}>
                      {delta >= 0 ? "+" : ""}{delta.toFixed(1)} pp
                    </td>
                    <td className="num">${(c.vol24/1e6).toFixed(2)}M</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

Object.assign(window, { ScreenOverview, ScreenPlatforms, ScreenCryptos });
