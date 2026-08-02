export const Colors = {
  // Premium Cream + Yellow Brand Palette
  background: '#FFFDF8',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFDF8',

  // Neo-Brutalist Accent Fills
  accentPrimary: '#6C5CE7',   // Electric Purple / Violet
  accentSecondary: '#FFD93D', // Canary Yellow
  accentPink: '#FF7675',      // Vibrant Coral Pink
  accentCyan: '#00CEC9',      // Bright Turquoise Cyan
  accentMint: '#00B894',      // Fresh Mint Green

  // Text Tokens - Strong Hierarchy
  textPrimary: '#18181B',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textOnPrimary: '#18181B',

  // Indicator States - Softer Variants
  success: '#22C55E',
  successSoft: '#F0FDF4',
  successBorder: '#86EFAC',
  warning: '#F59E0B',
  warningSoft: '#FFFBEB',
  warningBorder: '#FDE68A',
  danger: '#EF4444',
  dangerSoft: '#FEF2F2',
  dangerBorder: '#FECACA',

  // Score Gauge Colors
  scoreGaugeHigh: '#22C55E',
  scoreGaugeMid: '#FFD93D',
  scoreGaugeLow: '#EF4444',

  // Category-tinted backgrounds (replaces grey fills)
  strengthBg: '#F0FDF4',      // Light green for strengths
  strengthBorder: '#86EFAC',
  gapBg: '#FEF2F2',           // Light red for gaps
  gapBorder: '#FECACA',
  gapHighBg: '#FEF2F2',
  gapHighBorder: '#FECACA',
  gapMedBg: '#FFFBEB',        // Light amber for medium gaps
  gapMedBorder: '#FDE68A',
  recommendationBg: '#FFF9E8', // Light yellow for recommendations
  recommendationBorder: '#FDE68A',
  milestoneBg: '#FFF9E8',     // Light yellow for milestones
  milestoneBorder: '#FDE68A',
  stageBg: '#F5F3FF',         // Light purple for stages
  stageBorder: '#DDD6FE',
  uploadBg: '#F5F3FF',        // Light purple for upload
  uploadBorder: '#DDD6FE',
  rewardBg: '#F5F3FF',        // Light purple for rewards
  rewardBorder: '#DDD6FE',

  // Borders
  borderPrimary: '#18181B',
  borderSubtle: '#E2E8F0',
  borderFocus: '#6C5CE7',

  // Badges & Overlay
  badgeBackground: '#FFD93D',
  badgeText: '#18181B',

  // Gradient helper
  accentGradient: ['#6C5CE7', '#818CF8'] as const,
};

export const Shadows = {
  // Soft, modern shadows (replacing harsh neo-brutalist)
  card: {
    shadowColor: '#18181B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#18181B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  button: {
    shadowColor: '#18181B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Typography = {
  // Strong hierarchy
  heading1: { fontSize: 32, fontWeight: '800' as const, lineHeight: 40, color: Colors.textPrimary },
  heading2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32, color: Colors.textPrimary },
  heading3: { fontSize: 20, fontWeight: '700' as const, lineHeight: 28, color: Colors.textPrimary },
  heading4: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24, color: Colors.textPrimary },
  subheading: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22, color: Colors.textSecondary },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, color: Colors.textPrimary },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, color: Colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16, color: Colors.textMuted },
  quote: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22, color: Colors.textSecondary, fontStyle: 'italic' },
  badge: { fontSize: 10, fontWeight: '700' as const, lineHeight: 14 },
  button: { fontSize: 16, fontWeight: '700' as const, lineHeight: 20, letterSpacing: 0.2 },
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};