// 绿松石色板（复刻 Tzafit II Power Station）
export const palette = {
  teal: '#00D7A0',
  tealDark: '#009B77',
  tealMid: '#00BF8F',
  tealGlow: 'rgba(0, 215, 160, 0.25)',
  tealDim: 'rgba(0, 215, 160, 0.08)',
  bgVoid: '#080D18',
  bgDark: '#0A101E',
  bgMid: '#0E1728',
  bgCard: 'rgba(255,255,255,0.035)',
  bgCardH: 'rgba(0,215,160,0.07)',
  textHi: '#FFFFFF',
  textMd: '#C0D4E8',
  textLo: '#6A8CAA',
  border: 'rgba(0,215,160,0.18)',
  borderH: 'rgba(0,215,160,0.55)',
  // 工程分类色（保留）
  road: '#00D7A0',
  roadLight: '#33e0b6',
  bridge: '#00BF8F',
  bridgeLight: '#00D7A0',
  culvert: '#009B77',
  culvertLight: '#4ddbc1',
  temp: '#33e0b6',
  tempLight: '#33e0b6',
  pile: '#009980',
  pileLight: '#009B77',
  base: '#007a64',
  baseLight: '#009B77',
  pier: '#33e0b6',
  pierLight: '#33e0b6',
  beam: '#009B77',
  beamLight: '#4ddbc1',
  soft: '#007a64',
  critical: '#ef4444',
  running: '#22c55e',
  grid: 'rgba(0, 215, 160, 0.25)',
} as const;

export const chartColors = [
  '#00D7A0', '#00BF8F', '#009B77', '#33e0b6', '#4ddbc1',
  '#009980', '#007a64', '#00D7A0', '#33e0b6',
];

export const chartTheme = {
  color: '#FFFFFF',
  grid: 'rgba(0, 215, 160, 0.15)',
  text: '#6A8CAA',
  font: { family: "'JetBrains Mono', ui-monospace, monospace", size: 10 },
};

export const severityColor = (s: string) => {
  switch (s) {
    case '低': return '#22c55e';
    case '中': return '#33e0b6';
    case '高': return '#00BF8F';
    case '严重': return '#ef4444';
    default: return '#6A8CAA';
  }
};

export const statusColor = (s: string) => {
  if (s?.includes('进行') || s?.includes('在') || s?.includes('active')) return '#22c55e';
  if (s?.includes('完成') || s?.includes('done') || s?.includes('closed')) return '#00D7A0';
  if (s?.includes('阻塞') || s?.includes('卡') || s?.includes('风险')) return '#ef4444';
  if (s?.includes('计划') || s?.includes('待') || s?.includes('pending')) return '#33e0b6';
  if (s?.includes('延期') || s?.includes('滞后')) return '#00BF8F';
  return '#6A8CAA';
};
