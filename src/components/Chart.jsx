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
