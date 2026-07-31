export const Colors = {
  // Neo-Brutalism Canvas & Palette
  background: '#FAF7F0',
  cardBackground: '#FFFFFF',
  cardBorder: '#18181B',
  cardBorderGlow: '#6C5CE7',

  // Neo-Brutalist Accent Fills
  accentPrimary: '#6C5CE7',   // Electric Purple / Violet
  accentSecondary: '#FFD93D', // Canary Yellow
  accentPink: '#FF7675',      // Vibrant Coral Pink
  accentCyan: '#00CEC9',      // Bright Turquoise Cyan
  accentMint: '#00B894',      // Fresh Mint Green

  // Text Tokens
  textPrimary: '#18181B',
  textSecondary: '#475569',
  textMuted: '#64748B',

  // Indicator States
  success: '#00B894',
  warning: '#FFD93D',
  danger: '#FF7675',

  // Score Gauge Colors
  scoreGaugeHigh: '#00B894',
  scoreGaugeMid: '#FFD93D',
  scoreGaugeLow: '#FF7675',

  // Badges & Overlay
  badgeBackground: '#FFD93D',
  badgeText: '#18181B',

  // Gradient helper
  accentGradient: ['#6C5CE7', '#818CF8'] as const,
};

export const Shadows = {
  // Neo-Brutalist 3D Offset Drop Shadows
  card: {
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  button: {
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  glow: {
    shadowColor: '#18181B',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
};
