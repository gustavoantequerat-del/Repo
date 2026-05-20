import { useState, useRef, useEffect } from 'react';

export function InteractiveChart({
  data,
  labels,
  height = 220,
  showArea = true,
  showThreshold = null,
  thresholdLabel = 'Umbral',
  unit = '',
  yPad = 0.10,
  accent = null,
}) {
  const wrapRef = useRef(null);
  const [w, setW] = useState(560);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setW(Math.max(280, Math.floor(e.contentRect.width)));
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  if (!data || data.length === 0) return null;
  const h = height;
  const padL = 40, padR = 14, padT = 14, padB = 24;
  const plotW = Math.max(40, w - padL - padR);
  const plotH = h - padT - padB;

  let lo = Math.min(...data), hi = Math.max(...data);
  if (showThreshold != null) {
    lo = Math.min(lo, showThreshold);
    hi = Math.max(hi, showThreshold);
  }
  const range = hi - lo || 1;
  const padRange = range * yPad;
  lo -= padRange; hi += padRange;
  const ySpan = hi - lo;

  const xFor = i => padL + (i / (data.length - 1)) * plotW;
  const yFor = v => padT + (1 - (v - lo) / ySpan) * plotH;

  const pts = data.map((v, i) => ({ x: xFor(i), y: yFor(v), v, label: labels && labels[i] }));
  const linePts = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPts = `${padL},${padT + plotH} ${linePts} ${padL + plotW},${padT + plotH}`;

  const ticks = [0, 1, 2, 3].map(i => {
    const v = lo + (ySpan * i / 3);
    return { v, y: yFor(v) };
  });

  const stroke = accent || 'var(--accent)';

  function onMove(e) {
    const rect = wrapRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    const idx = Math.round(((px - padL) / plotW) * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    setHover({ i: clamped, x: pts[clamped].x, y: pts[clamped].y });
  }
  function onLeave() { setHover(null); }

  return (
    <div ref={wrapRef} className="chart-wrap" style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none"
           onMouseMove={onMove} onMouseLeave={onLeave} style={{ display: 'block', touchAction: 'none' }}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={t.y} x2={padL + plotW} y2={t.y} stroke="var(--line-1)" strokeDasharray={i === 0 || i === 3 ? '' : '2 3'} />
            <text x={padL - 8} y={t.y + 3} fontSize="9.5" textAnchor="end" fill="var(--ink-5)" fontFamily="var(--font-mono)">
              {Math.abs(t.v) >= 10 ? t.v.toFixed(0) : t.v.toFixed(2)}
            </text>
          </g>
        ))}
        {labels && pts.map((p, i) => (
          (i === 0 || i === pts.length - 1 || i % Math.max(1, Math.floor(pts.length / 6)) === 0) ? (
            <text key={i} x={p.x} y={h - 8} fontSize="9.5" textAnchor="middle" fill="var(--ink-5)" fontFamily="var(--font-mono)">
              {labels[i]}
            </text>
          ) : null
        ))}
        {showThreshold != null && (
          <g>
            <line x1={padL} x2={padL + plotW} y1={yFor(showThreshold)} y2={yFor(showThreshold)}
                  stroke="var(--risk-high)" strokeDasharray="4 4" opacity="0.55" />
            <text x={padL + plotW - 4} y={yFor(showThreshold) - 4} fontSize="9.5"
                  textAnchor="end" fill="var(--risk-high)" fontFamily="var(--font-mono)" fontWeight="600">
              {thresholdLabel} {Math.abs(showThreshold) >= 10 ? showThreshold.toFixed(0) : showThreshold.toFixed(2)}
            </text>
          </g>
        )}
        {showArea && <polygon points={areaPts} fill={stroke} opacity="0.10" />}
        <polyline points={linePts} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinejoin="round" />
        <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="3.5" fill={stroke} />
        {hover && (
          <g>
            <line x1={hover.x} x2={hover.x} y1={padT} y2={padT + plotH} stroke="var(--ink-4)" strokeDasharray="2 3" />
            <circle cx={hover.x} cy={hover.y} r="4.5" fill="var(--surface)" stroke={stroke} strokeWidth="2" />
          </g>
        )}
      </svg>
      {hover && (
        <div className="chart-tooltip" data-show="true"
             style={{ left: `${(hover.x / w) * 100}%`, top: `${(hover.y / h) * 100}%` }}>
          <div className="tt-date">{labels ? labels[hover.i] : `#${hover.i + 1}`}</div>
          <div className="tt-val">
            {Math.abs(data[hover.i]) >= 10 ? data[hover.i].toFixed(1) : data[hover.i].toFixed(3)}
            <span style={{ marginLeft: 4, opacity: 0.6 }}>{unit}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function Spark({ data, w = 90, h = 22, stroke = 'var(--accent)', fill = 'none' }) {
  if (!data || data.length === 0) return null;
  const lo = Math.min(...data), hi = Math.max(...data);
  const span = (hi - lo) || 1;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => `${(i * stepX).toFixed(1)},${(h - ((v - lo) / span) * (h - 2) - 1).toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polyline points={pts} fill={fill} stroke={stroke} strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

// data: [{ label, value, color? }]
export function DonutChart({ data, height = 280, thickness = 36, centerLabel, centerValue, palette }) {
  const [hover, setHover] = useState(null);
  const colors = palette || [
    '#2563EB', '#14B8A6', '#F59E0B', '#EF4444',
    '#0891B2', '#7C3AED', '#94A3B8', '#0F172A',
  ];

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = 150, cy = 150, r = 110;
  const innerR = r - thickness;

  let acc = 0;
  const segs = data.map((d, i) => {
    const pct = d.value / total;
    const startA = acc * 2 * Math.PI - Math.PI / 2;
    acc += pct;
    const endA = acc * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startA);
    const y1 = cy + r * Math.sin(startA);
    const x2 = cx + r * Math.cos(endA);
    const y2 = cy + r * Math.sin(endA);
    const xi2 = cx + innerR * Math.cos(endA);
    const yi2 = cy + innerR * Math.sin(endA);
    const xi1 = cx + innerR * Math.cos(startA);
    const yi1 = cy + innerR * Math.sin(startA);
    const largeArc = pct > 0.5 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi1} ${yi1} Z`;
    return { ...d, path, color: d.color || colors[i % colors.length], pct };
  });

  const active = hover != null ? segs[hover] : null;

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 300 300" width="100%" height={height} style={{ display: 'block' }}
           onMouseLeave={() => setHover(null)}>
        {segs.map((s, i) => (
          <path key={i} d={s.path} fill={s.color}
                stroke="var(--surface)" strokeWidth="2"
                opacity={hover == null || hover === i ? 1 : 0.45}
                style={{ transition: 'opacity 0.12s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHover(i)} />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle"
              fontSize="11" fill="var(--ink-5)"
              letterSpacing="0.14em" fontWeight="700"
              style={{ textTransform: 'uppercase' }}>
          {active ? active.label : (centerLabel || 'Total')}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle"
              fontSize="22" fill="var(--ink-1)" fontWeight="700"
              fontFamily="var(--font-display)">
          {active ? `${(active.pct * 100).toFixed(1)}%` : (centerValue || '')}
        </text>
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', justifyContent: 'center', marginTop: 8, fontSize: 11.5 }}>
        {segs.map((s, i) => (
          <span key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                         opacity: hover == null || hover === i ? 1 : 0.5,
                         color: hover === i ? 'var(--ink-1)' : 'var(--ink-3)',
                         fontWeight: hover === i ? 600 : 500 }}>
            <span style={{ width: 10, height: 10, background: s.color, borderRadius: 2 }}></span>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// data: [{ label, value }]
export function HBarChart({ data, height, color = 'var(--accent)', valueFmt, axisStep, axisLabel, labelWidth = 80, barThickness = 14 }) {
  const wrapRef = useRef(null);
  const [w, setW] = useState(620);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setW(Math.max(320, Math.floor(e.contentRect.width)));
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const rowGap = Math.max(10, barThickness);
  const rowH = barThickness + rowGap;
  const padTop = 8, padBottom = 28;
  const h = height || (data.length * rowH + padTop + padBottom);
  const padL = labelWidth + 14;
  const padR = 16;
  const plotW = Math.max(40, w - padL - padR);

  const max = Math.max(...data.map(d => d.value));
  const step = axisStep || niceStep(max);
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= niceMax; v += step) ticks.push(v);

  const xFor = v => padL + (v / niceMax) * plotW;
  const yFor = i => padTop + i * rowH + rowGap / 2;

  return (
    <div ref={wrapRef} className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none"
           onMouseLeave={() => setHover(null)} style={{ display: 'block' }}>
        {ticks.map((t, i) => (
          <line key={i} x1={xFor(t)} x2={xFor(t)} y1={padTop} y2={h - padBottom + 4}
                stroke="var(--line-1)" strokeDasharray={i === 0 ? '' : '2 3'} />
        ))}
        {ticks.map((t, i) => (
          <text key={i} x={xFor(t)} y={h - padBottom + 18} fontSize="10" textAnchor="middle"
                fill="var(--ink-5)" fontFamily="var(--font-mono)">
            {valueFmt ? valueFmt(t) : t}
          </text>
        ))}
        {axisLabel && (
          <text x={padL + plotW / 2} y={h - 4} fontSize="9.5" textAnchor="middle"
                fill="var(--ink-4)" letterSpacing="0.08em">{axisLabel}</text>
        )}
        {data.map((d, i) => {
          const y = yFor(i);
          const barW = (d.value / niceMax) * plotW;
          const isHover = hover === i;
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)}>
              <text x={padL - 10} y={y + barThickness / 2 + 3.5}
                    fontSize="11.5" textAnchor="end"
                    fill={isHover ? 'var(--ink-1)' : 'var(--ink-3)'}
                    fontWeight={isHover ? 600 : 500}>{d.label}</text>
              <rect x={0} y={y - rowGap / 2} width={w} height={rowH} fill="transparent" />
              <rect x={padL} y={y} width={Math.max(1, barW)} height={barThickness}
                    fill={isHover ? 'var(--accent-2)' : color} rx="2" />
            </g>
          );
        })}
      </svg>
      {hover != null && (
        <div className="chart-tooltip" data-show="true"
             style={{ left: `${((padL + ((data[hover].value / niceMax) * plotW)) / w) * 100}%`,
                      top: `${((yFor(hover) + barThickness / 2) / h) * 100}%` }}>
          <div className="tt-date">{data[hover].label}</div>
          <div className="tt-val">{valueFmt ? valueFmt(data[hover].value) : data[hover].value.toLocaleString('en-US')}</div>
        </div>
      )}
    </div>
  );
}

export function VBarChart({ data, height = 240, color = 'var(--ink-1)', valueFmt, axisStep, axisLabel }) {
  const wrapRef = useRef(null);
  const [w, setW] = useState(620);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setW(Math.max(320, Math.floor(e.contentRect.width)));
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const padL = 56, padR = 16, padTop = 14, padBottom = 50;
  const h = height;
  const plotW = Math.max(40, w - padL - padR);
  const plotH = h - padTop - padBottom;

  const max = Math.max(...data.map(d => d.value));
  const step = axisStep || niceStep(max);
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= niceMax; v += step) ticks.push(v);

  const n = data.length;
  const slotW = plotW / n;
  const barW = Math.min(40, slotW * 0.7);

  const xFor = i => padL + i * slotW + (slotW - barW) / 2;
  const yFor = v => padTop + (1 - (v / niceMax)) * plotH;

  return (
    <div ref={wrapRef} className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none"
           onMouseLeave={() => setHover(null)} style={{ display: 'block' }}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={padL + plotW} y1={yFor(t)} y2={yFor(t)}
                  stroke="var(--line-1)" strokeDasharray={i === 0 ? '' : '2 3'} />
            <text x={padL - 8} y={yFor(t) + 3} fontSize="10" textAnchor="end"
                  fill="var(--ink-5)" fontFamily="var(--font-mono)">
              {valueFmt ? valueFmt(t) : t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = xFor(i);
          const y = yFor(d.value);
          const isHover = hover === i;
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)}>
              <rect x={x} y={y} width={barW} height={padTop + plotH - y}
                    fill={isHover ? 'var(--accent)' : color} rx="2" />
              <text x={x + barW / 2} y={h - padBottom + 18} fontSize="11" textAnchor="middle"
                    fill={isHover ? 'var(--ink-1)' : 'var(--ink-3)'} fontWeight={isHover ? 600 : 500}>
                {d.label}
              </text>
            </g>
          );
        })}
        {axisLabel && (
          <text x={20} y={padTop + plotH / 2} fontSize="9.5" textAnchor="middle"
                fill="var(--ink-4)" letterSpacing="0.08em"
                transform={`rotate(-90 20 ${padTop + plotH / 2})`}>{axisLabel}</text>
        )}
      </svg>
      {hover != null && (
        <div className="chart-tooltip" data-show="true"
             style={{ left: `${((xFor(hover) + barW / 2) / w) * 100}%`,
                      top: `${(yFor(data[hover].value) / h) * 100}%` }}>
          <div className="tt-date">{data[hover].label}</div>
          <div className="tt-val">{valueFmt ? valueFmt(data[hover].value) : data[hover].value.toLocaleString('en-US')}</div>
        </div>
      )}
    </div>
  );
}

function niceStep(max) {
  if (max <= 0) return 1;
  const raw = max / 5;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / pow;
  let nice;
  if (norm <= 1) nice = 1;
  else if (norm <= 2) nice = 2;
  else if (norm <= 5) nice = 5;
  else nice = 10;
  return nice * pow;
}
