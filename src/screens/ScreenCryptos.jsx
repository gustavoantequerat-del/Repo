import { PageHead } from '../components/Shell.jsx';
import { DonutChart, HBarChart } from '../components/Chart.jsx';
import * as D from '../data.js';

export function ScreenCryptos({ tier }) {
  const capRows = D.capacityByCrypto;
  const totalCap = capRows.reduce((s, r) => s + r.cap, 0);
  const capByCode = Object.fromEntries(capRows.map(r => [r.code, r.cap]));
  const stableCodes = new Set(D.cryptos.filter(c => c.type === 'stable').map(c => c.code));
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
          { label: 'Activos rastreados', value: D.cryptos.length },
          { label: 'SDR · Dominancia stable', value: `${stableShare.toFixed(1)}%` },
          { label: 'Captura', value: 'Abr · 2026' },
        ]}
      />

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
                { label: 'Stablecoins', value: stableCap,  color: '#0F172A' },
                { label: 'Altcoins',    value: altcoinCap, color: '#F59E0B' },
              ]}
              centerLabel="Capacidad total"
              centerValue={`Bs ${(totalCap/1e6).toFixed(1)}M`}
              height={260}
              thickness={32}
            />
            <div className="grid-2-eq" style={{ marginTop: 18 }}>
              <div className="kpi" style={{ background: 'var(--surface-2)', padding: 16 }}>
                <div className="kpi-label">Stablecoins</div>
                <div className="kpi-value" style={{ fontSize: 18 }}>Bs {stableCap.toLocaleString('es-BO')}</div>
                <div className="kpi-foot">{stableShare.toFixed(1)}%</div>
              </div>
              <div className="kpi" style={{ background: 'var(--surface-2)', padding: 16 }}>
                <div className="kpi-label">Altcoins</div>
                <div className="kpi-value" style={{ fontSize: 18 }}>Bs {altcoinCap.toLocaleString('es-BO')}</div>
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
                <th className="col-num">Capacidad (Bs)</th>
                <th className="col-num">Capacity share %</th>
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
                    <td><span className="chip-tier">{c.type === 'stable' ? 'estable' : c.type === 'crypto' ? 'volátil' : 'mixto'}</span></td>
                    <td className="num">{capByCode[c.code] >= 1e6 ? `Bs ${(capByCode[c.code]/1e6).toFixed(2)}M` : capByCode[c.code] >= 1e3 ? `Bs ${(capByCode[c.code]/1e3).toFixed(0)}k` : '—'}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{c.share.toFixed(1)}%</td>
                    <td className="num" style={{ color: delta >= 0 ? 'var(--risk-low)' : 'var(--risk-high)' }}>
                      {delta >= 0 ? '+' : ''}{delta.toFixed(1)} pp
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
