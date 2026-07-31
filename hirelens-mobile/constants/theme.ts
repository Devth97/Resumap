export const Colors = {
  background: '#090D16',
  cardBackground: '#131B2E',
  cardBorder: 'rgba(99, 102, 241, 0.25)',
  cardBorderGlow: '#6366F1',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  accentPrimary: '#6366F1', // Neon Violet
  accentSecondary: '#06B6D4', // Electric Cyan
  accentGradient: ['#6366F1', '#06B6D4'] as const,

  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  danger: '#EF4444', // Red

  scoreGaugeTrack: 'rgba(255, 255, 255, 0.08)',
  scoreGaugeHigh: '#10B981',
  scoreGaugeMid: '#F59E0B',
  scoreGaugeLow: '#EF4444',

  badgeBackground: 'rgba(99, 102, 241, 0.15)',
  badgeText: '#818CF8',

  glassBackground: 'rgba(19, 27, 46, 0.85)',
};

export const Shadows = {
  glow: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
};
