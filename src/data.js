// BP2PIM — Bolivia P2P Intelligence Monitor
// Institutional fixture data

export const indexFamilies = [
  {
    id: 'price',
    name: 'Precio y prima',
    sub: 'Benchmark P2P y prima sobre referencia oficial',
    codes: ['BBPI', 'BPX', 'BBPI-ALT'],
  },
  {
    id: 'liquidity',
    name: 'Liquidez y profundidad',
    sub: 'Profundidad observada y capacidad del mercado',
    codes: ['LDI', 'VEI', 'VPR'],
  },
  {
    id: 'structure',
    name: 'Estructura y concentración',
    sub: 'Distribución del mercado por plataforma y operador',
    codes: ['PCI', 'MCI', 'BSI'],
  },
  {
    id: 'compliance',
    name: 'Cumplimiento y riesgo sistémico',
    sub: 'Exposición, perfil de riesgo y carga regulatoria',
    codes: ['BES', 'MRP', 'SDR', 'CRI'],
  },
];

export const indicesSpec = [
  { code: 'BBPI',     family: 'price',      name: 'BOB/USDT–USDC Benchmark',         purpose: 'Precio P2P consolidado',                 tiers: [1,2,3], value: 6.92,  unit: 'BOB',   delta: '+0.41%',   deltaM: '+0.91%',   risk: 'low',  min: 6.40, max: 7.20, threshold: 7.10 },
  { code: 'BPX',      family: 'price',      name: 'Premium sobre referencia',         purpose: 'Prima del P2P vs. oficial',               tiers: [1,2,3], value: 8.12,  unit: '%',     delta: '+0.04 pp', deltaM: '+0.32 pp', risk: 'med',  min: 0,    max: 15,   threshold: 10 },
  { code: 'BBPI-ALT', family: 'price',      name: 'Benchmark cripto alternativos',    purpose: 'BTC, ETH y altcoins',                     tiers: [1,2,3], value: 112.4, unit: 'idx',   delta: '+1.24%',   deltaM: '+4.20%',   risk: 'low',  min: 95,   max: 130,  threshold: null },
  { code: 'LDI',      family: 'liquidity',  name: 'Liquidity Depth Index',            purpose: 'Profundidad visible de libro',            tiers: [1,2,3], value: 0.62,  unit: 'idx',   delta: '−2.10%',   deltaM: '−4.80%',   risk: 'high', min: 0.30, max: 1.00, threshold: 0.50 },
  { code: 'VEI',      family: 'liquidity',  name: 'Volume Estimation Index',          purpose: 'Volumen proxy diario',                    tiers: [1,2,3], value: 24.1,  unit: 'USD M', delta: '+3.80%',   deltaM: '+8.50%',   risk: 'low',  min: 15,   max: 28,   threshold: null },
  { code: 'VPR',      family: 'liquidity',  name: 'Variation of Posted Capacity',     purpose: 'Variación de capacidad observada',        tiers: [1,2,3], value: 1.34,  unit: 'ratio', delta: '+0.12x',   deltaM: '+0.18x',   risk: 'med',  min: 0.80, max: 1.80, threshold: 1.50 },
  { code: 'PCI',      family: 'structure',  name: 'Platform Concentration Index',     purpose: 'HHI por plataforma',                      tiers: [1,2,3], value: 0.51,  unit: 'HHI',   delta: '−0.01',    deltaM: '−0.04',    risk: 'med',  min: 0.30, max: 0.70, threshold: 0.60 },
  { code: 'MCI',      family: 'structure',  name: 'Merchant Concentration Index',     purpose: 'HHI por comerciante',                     tiers: [1,2,3], value: 0.38,  unit: 'HHI',   delta: '+0.02',    deltaM: '+0.04',    risk: 'med',  min: 0.20, max: 0.55, threshold: 0.45 },
  { code: 'BSI',      family: 'structure',  name: 'Buy/Sell Imbalance',               purpose: 'Desbalance del libro',                    tiers: [1,2,3], value: 12.4,  unit: '%',     delta: '+1.10 pp', deltaM: '+3.20 pp', risk: 'med',  min: -25,  max: 25,   threshold: 15 },
  { code: 'BES',      family: 'compliance', name: 'Bank Exposure Score',              purpose: 'Exposición agregada por riel bancario',   tiers: [3],     value: 0.74,  unit: 'score', delta: '+0.03',    deltaM: '+0.06',    risk: 'high', min: 0.40, max: 1.00, threshold: 0.70 },
  { code: 'MRP',      family: 'compliance', name: 'Merchant Risk Profile',            purpose: 'Score de riesgo medio por operador',      tiers: [3],     value: 62,    unit: '/100',  delta: '−1',       deltaM: '−3',       risk: 'med',  min: 40,   max: 80,   threshold: 70 },
  { code: 'SDR',      family: 'compliance', name: 'Stablecoin Dominance Ratio',       purpose: 'Dominancia stable sobre el total cripto', tiers: [3],     value: 87.4,  unit: '%',     delta: '−0.30 pp', deltaM: '−0.80 pp', risk: 'low',  min: 80,   max: 95,   threshold: 92 },
  { code: 'CRI',      family: 'compliance', name: 'Compliance Readiness Index',       purpose: 'Carga regulatoria y disposición',         tiers: [3],     value: 0.71,  unit: 'score', delta: '+0.02',    deltaM: '+0.05',    risk: 'med',  min: 0.50, max: 1.00, threshold: 0.80 },
];

export const platforms = [
  { rank: 1, code: 'BIN', name: 'Binance P2P', share: 48.2, buyOffers: 824, sellOffers: 612, completion: 98.4, spread: 0.42, risk: 'low',  tiers: [1,2,3], capacityBob: 102_400_000 },
  { rank: 2, code: 'OKX', name: 'OKX',          share: 19.7, buyOffers: 412, sellOffers: 281, completion: 96.2, spread: 0.61, risk: 'low',  tiers: [1,2,3], capacityBob:   2_180_000 },
  { rank: 3, code: 'BYB', name: 'Bybit',        share: 15.1, buyOffers: 318, sellOffers: 224, completion: 92.5, spread: 0.84, risk: 'med',  tiers: [1,2,3], capacityBob:  11_400_000 },
  { rank: 4, code: 'KCN', name: 'KuCoin',       share: 10.3, buyOffers: 211, sellOffers: 148, completion: 89.1, spread: 1.10, risk: 'med',  tiers: [1,2,3], capacityBob:     420_000 },
  { rank: 5, code: 'BIT', name: 'Bitget',       share:  6.7, buyOffers: 134, sellOffers:  92, completion: 87.3, spread: 1.34, risk: 'med',  tiers: [1,2,3], capacityBob:   5_800_000 },
];

export const capacityByCrypto = [
  { code: 'USDT',  cap: 92_400_000 },
  { code: 'USDC',  cap: 10_800_000 },
  { code: 'BTC',   cap:  3_120_000 },
  { code: 'BNB',   cap:  2_100_000 },
  { code: 'ETH',   cap:  1_840_000 },
  { code: 'XRP',   cap:  1_240_000 },
  { code: 'ADA',   cap:    920_000 },
  { code: 'DAI',   cap:    810_000 },
  { code: 'SOL',   cap:    640_000 },
  { code: 'FDUSD', cap:    520_000 },
  { code: 'Otros', cap:  1_980_000 },
];

export const paymentMethods = [
  { code: 'Bank transfer', mentions: 4820, capacity: 18_200_000 },
  { code: 'BUN',           mentions: 3940, capacity: 17_100_000 },
  { code: 'BGA',           mentions: 3810, capacity: 17_400_000 },
  { code: 'BEC',           mentions: 3740, capacity: 18_900_000 },
  { code: 'BCR',           mentions: 3010, capacity: 14_200_000 },
  { code: 'BNB',           mentions: 2410, capacity: 11_800_000 },
  { code: 'BME',           mentions: 2380, capacity: 12_400_000 },
  { code: 'BSO',           mentions: 1620, capacity:  8_900_000 },
  { code: 'BIE',           mentions: 1110, capacity:  7_400_000 },
  { code: 'SoliPagos',     mentions:  820, capacity:  5_100_000 },
  { code: 'Tigo Money',    mentions:  340, capacity:  2_800_000 },
  { code: 'Yape',          mentions:  180, capacity:  1_400_000 },
  { code: 'Otros',         mentions:  120, capacity:    980_000 },
];

export const merchants = [
  { id: 'MX-0021', alias: 'Comerciante α', platform: 'Binance', capacity: 1240000, share: 8.4, mrp: 78, risk: 'low',  rails: ['BNB-BO', 'BCB'], status: 'active' },
  { id: 'MX-0014', alias: 'Comerciante β', platform: 'Binance', capacity:  980000, share: 6.6, mrp: 71, risk: 'low',  rails: ['BMS'],            status: 'active' },
  { id: 'MX-0009', alias: 'Comerciante γ', platform: 'OKX',     capacity:  840000, share: 5.7, mrp: 62, risk: 'med',  rails: ['BCB', 'BUN'],     status: 'active' },
  { id: 'MX-0037', alias: 'Comerciante δ', platform: 'Bybit',   capacity:  610000, share: 4.1, mrp: 58, risk: 'med',  rails: ['BIE'],             status: 'review' },
  { id: 'MX-0042', alias: 'Comerciante ε', platform: 'Binance', capacity:  540000, share: 3.6, mrp: 49, risk: 'med',  rails: ['BCB'],             status: 'active' },
  { id: 'MX-0058', alias: 'Comerciante ζ', platform: 'KuCoin',  capacity:  410000, share: 2.8, mrp: 42, risk: 'high', rails: ['BUN', 'BIE'],     status: 'flagged' },
  { id: 'MX-0064', alias: 'Comerciante η', platform: 'Bybit',   capacity:  380000, share: 2.6, mrp: 38, risk: 'high', rails: ['BMS'],             status: 'flagged' },
  { id: 'MX-0071', alias: 'Comerciante θ', platform: 'Bitget',  capacity:  290000, share: 1.9, mrp: 31, risk: 'high', rails: ['BCB'],             status: 'flagged' },
];

const totalMentions = 1284 + 942 + 813 + 612 + 511 + 388 + 271;
const totalCapacity = 5810000 + 3420000 + 2980000 + 2110000 + 1830000 + 1410000 + 980000;
const banksRaw = [
  { code: 'BCB',    name: 'Banco Central',              mentions: 1284, capacity: 5810000, exposure: 0.81, trend: 'up',   risk: 'high' },
  { code: 'BMS',    name: 'BancoSol',                   mentions: 942,  capacity: 3420000, exposure: 0.62, trend: 'flat', risk: 'med'  },
  { code: 'BUN',    name: 'Banco Unión',                mentions: 813,  capacity: 2980000, exposure: 0.54, trend: 'up',   risk: 'med'  },
  { code: 'BIE',    name: 'Banco Bisa',                 mentions: 612,  capacity: 2110000, exposure: 0.41, trend: 'down', risk: 'med'  },
  { code: 'BNB-BO', name: 'BNB',                        mentions: 511,  capacity: 1830000, exposure: 0.38, trend: 'flat', risk: 'med'  },
  { code: 'BME',    name: 'Banco Mercantil Santa Cruz', mentions: 388,  capacity: 1410000, exposure: 0.29, trend: 'down', risk: 'low'  },
  { code: 'BFA',    name: 'Banco FIE',                  mentions: 271,  capacity:  980000, exposure: 0.21, trend: 'down', risk: 'low'  },
];
export const banks = banksRaw.map(b => ({
  ...b,
  mentionShare:  (b.mentions / totalMentions) * 100,
  capacityShare: (b.capacity / totalCapacity) * 100,
}));

export const cryptos = [
  { code: 'USDT',  name: 'Tether',        type: 'stable', share: 71.4, prev: 73.1, vol24: 18420000, trend: 'down', price: 1.000,  tiers: [1,2,3] },
  { code: 'USDC',  name: 'USD Coin',      type: 'stable', share: 19.8, prev: 18.4, vol24:  5110000, trend: 'up',   price: 1.000,  tiers: [1,2,3] },
  { code: 'DAI',   name: 'MakerDAO DAI',  type: 'stable', share:  3.1, prev:  3.6, vol24:   810000, trend: 'down', price: 1.001,  tiers: [2,3] },
  { code: 'BTC',   name: 'Bitcoin',       type: 'crypto', share:  2.4, prev:  2.0, vol24:   612000, trend: 'up',   price: 67420,  tiers: [1,2,3] },
  { code: 'ETH',   name: 'Ethereum',      type: 'crypto', share:  1.6, prev:  1.4, vol24:   408000, trend: 'up',   price: 3540,   tiers: [1,2,3] },
  { code: 'FDUSD', name: 'First Digital', type: 'stable', share:  0.9, prev:  0.7, vol24:   230000, trend: 'up',   price: 0.999,  tiers: [2,3] },
  { code: 'BNB',   name: 'BNB',           type: 'crypto', share:  0.5, prev:  0.5, vol24:   128000, trend: 'flat', price: 612,    tiers: [2,3] },
  { code: 'Otros', name: 'Otros',         type: 'mixed',  share:  0.3, prev:  0.3, vol24:    80000, trend: 'flat', price: null,   tiers: [2,3] },
];

export const alertRulesSeed = [
  { id: 'r1', indexCode: 'BPX', operator: '>',  threshold: 9.0,  severity: 'high', enabled: true,  module: 'Indices',       lastFire: '08:14', createdBy: 'Risk team',  scope: 'T2+' },
  { id: 'r2', indexCode: 'LDI', operator: '<',  threshold: 0.55, severity: 'high', enabled: true,  module: 'Indices',       lastFire: null,    createdBy: 'Research',   scope: 'T2+' },
  { id: 'r3', indexCode: 'MCI', operator: '>',  threshold: 0.40, severity: 'med',  enabled: true,  module: 'Merchants',     lastFire: '11:02', createdBy: 'Compliance', scope: 'T2+' },
  { id: 'r4', indexCode: 'BES', operator: '>',  threshold: 0.70, severity: 'high', enabled: true,  module: 'Banking Rails', lastFire: '09:31', createdBy: 'Compliance', scope: 'T3'  },
  { id: 'r5', indexCode: 'SDR', operator: '<',  threshold: 85,   severity: 'med',  enabled: false, module: 'Indices',       lastFire: null,    createdBy: 'Research',   scope: 'T1+' },
];

export const alertsSeed = [
  { id: 'AL-2026-0412', time: '13:42', level: 'high', title: 'Spread BPX anormal',         sub: 'BPX 9.4% — supera umbral 9.0%',         module: 'Indices',       tier: 2, ruleId: 'r1', indexCode: 'BPX', value: 9.4  },
  { id: 'AL-2026-0411', time: '12:08', level: 'med',  title: 'Cambio MRP — Comerciante α', sub: 'Velocidad de operación +28% en 24h',    module: 'Merchants',     tier: 2 },
  { id: 'AL-2026-0410', time: '10:55', level: 'med',  title: 'Desbalance BSI',             sub: 'BSI +12.4% sostenido por 6 ciclos',     module: 'Indices',       tier: 2 },
  { id: 'AL-2026-0409', time: '09:31', level: 'high', title: 'Pico de exposición — BCB',   sub: 'BES 0.74 — supera umbral 0.70',         module: 'Banking Rails', tier: 3, ruleId: 'r4', indexCode: 'BES', value: 0.74 },
  { id: 'AL-2026-0408', time: '08:14', level: 'high', title: 'Caída de profundidad LDI',   sub: 'LDI 0.52 — bajo umbral 0.55',           module: 'Indices',       tier: 2, ruleId: 'r2', indexCode: 'LDI', value: 0.52 },
  { id: 'AL-2026-0407', time: '07:02', level: 'med',  title: 'Concentración merchant',     sub: 'MCI 0.41 — supera umbral 0.40',         module: 'Merchants',     tier: 2, ruleId: 'r3', indexCode: 'MCI', value: 0.41 },
];

export const monthsLabels = ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'];

export const series = {
  BBPI:       [6.78, 6.81, 6.84, 6.79, 6.82, 6.85, 6.88, 6.86, 6.89, 6.91, 6.90, 6.92],
  BPX:        [7.4,  7.6,  7.8,  7.9,  7.8,  7.9,  8.0,  8.1,  8.0,  8.0,  8.08, 8.12],
  'BBPI-ALT': [105,  106,  108,  107,  109,  110,  111,  109,  110,  112,  111,  112.4],
  LDI:        [0.78, 0.76, 0.74, 0.72, 0.71, 0.70, 0.69, 0.68, 0.66, 0.65, 0.63, 0.62],
  VEI:        [19.1, 20.0, 20.4, 21.2, 21.4, 22.0, 22.5, 22.9, 23.4, 23.8, 23.8, 24.1],
  VPR:        [1.18, 1.20, 1.21, 1.22, 1.24, 1.25, 1.27, 1.29, 1.30, 1.32, 1.33, 1.34],
  PCI:        [0.55, 0.55, 0.54, 0.54, 0.53, 0.53, 0.52, 0.52, 0.52, 0.51, 0.51, 0.51],
  MCI:        [0.32, 0.33, 0.33, 0.34, 0.34, 0.35, 0.35, 0.36, 0.37, 0.37, 0.38, 0.38],
  BSI:        [6.1,  7.0,  8.2,  9.1,  9.4,  10.1, 10.8, 11.0, 11.4, 11.8, 12.0, 12.4],
  BES:        [0.62, 0.64, 0.66, 0.68, 0.69, 0.71, 0.72, 0.72, 0.73, 0.73, 0.74, 0.74],
  MRP:        [68,   67,   67,   66,   65,   65,   64,   63,   63,   63,   62,   62],
  SDR:        [89.1, 89.0, 88.6, 88.4, 88.1, 87.9, 87.8, 87.7, 87.8, 87.6, 87.7, 87.4],
  CRI:        [0.65, 0.65, 0.66, 0.67, 0.67, 0.68, 0.69, 0.69, 0.70, 0.70, 0.71, 0.71],
};

export const reports = [
  { id: 'R-2026-04-E',  type: 'Ejecutivo',   title: 'Reporte ejecutivo — Abril 2026',      period: 'Abr 2026',  published: '30 Abr 2026', tier: 1, size: '2.4 MB' },
  { id: 'R-2026-W18-A', type: 'Analítico',   title: 'Reporte analítico — Semana 18 2026',  period: 'Sem. 18',   published: '07 May 2026', tier: 2, size: '5.8 MB' },
  { id: 'R-2026-W17-A', type: 'Analítico',   title: 'Reporte analítico — Semana 17 2026',  period: 'Sem. 17',   published: '30 Abr 2026', tier: 2, size: '5.6 MB' },
  { id: 'R-2026-04-R',  type: 'Regulatorio', title: 'Reporte regulatorio — Abril 2026',    period: 'Abr 2026',  published: '29 Abr 2026', tier: 3, size: '8.1 MB' },
  { id: 'R-2026-03-E',  type: 'Ejecutivo',   title: 'Reporte ejecutivo — Marzo 2026',      period: 'Mar 2026',  published: '31 Mar 2026', tier: 1, size: '2.3 MB' },
  { id: 'R-2026-W16-A', type: 'Analítico',   title: 'Reporte analítico — Semana 16 2026',  period: 'Sem. 16',   published: '23 Abr 2026', tier: 2, size: '5.7 MB' },
  { id: 'R-2026-03-R',  type: 'Regulatorio', title: 'Reporte regulatorio — Marzo 2026',    period: 'Mar 2026',  published: '31 Mar 2026', tier: 3, size: '7.9 MB' },
  { id: 'R-2026-02-E',  type: 'Ejecutivo',   title: 'Reporte ejecutivo — Febrero 2026',    period: 'Feb 2026',  published: '28 Feb 2026', tier: 1, size: '2.2 MB' },
];

export const scenarios = [
  { id: 'base',   name: 'Caso base',                       bpx: 8.12, ldi: 0.62, sdr: 87.4, risk: 'Estable' },
  { id: 'stress', name: 'Estrés FX +5%',                   bpx: 11.4, ldi: 0.48, sdr: 84.1, risk: 'Alerta'  },
  { id: 'shock',  name: 'Shock de retiro stablecoin',      bpx: 13.8, ldi: 0.31, sdr: 79.0, risk: 'Crítico' },
  { id: 'policy', name: 'Restricción regulatoria — rails', bpx: 9.6,  ldi: 0.40, sdr: 81.2, risk: 'Alerta'  },
];
