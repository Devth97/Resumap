import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'strength' | 'gap' | 'gapHigh' | 'gapMed' | 'recommendation' | 'milestone' | 'stage' | 'upload' | 'reward';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  glowing?: boolean;
}

const variantStyles = {
  default: { backgroundColor: Colors.surface, borderColor: Colors.borderSubtle },
  elevated: { backgroundColor: Colors.surfaceElevated, borderColor: Colors.borderSubtle, ...Shadows.cardHover },
  outlined: { borderColor: Colors.borderPrimary },
  strength: { backgroundColor: Colors.strengthBg, borderColor: Colors.strengthBorder },
  gap: { backgroundColor: Colors.gapBg, borderColor: Colors.gapBorder },
  gapHigh: { backgroundColor: Colors.gapHighBg, borderColor: Colors.gapHighBorder },
  gapMed: { backgroundColor: Colors.gapMedBg, borderColor: Colors.gapMedBorder },
  recommendation: { backgroundColor: Colors.recommendationBg, borderColor: Colors.recommendationBorder },
  milestone: { backgroundColor: Colors.milestoneBg, borderColor: Colors.milestoneBorder },
  stage: { backgroundColor: Colors.stageBg, borderColor: Colors.stageBorder },
  upload: { backgroundColor: Colors.uploadBg, borderColor: Colors.uploadBorder },
  reward: { backgroundColor: Colors.rewardBg, borderColor: Colors.rewardBorder },
} as const;

const paddingStyles = {
  none: { padding: 0 },
  sm: { padding: Spacing.sm },
  md: { padding: Spacing.md },
  lg: { padding: Spacing.xl },
  xl: { padding: Spacing.xxl },
} as const;

const baseCardStyle: ViewStyle = {
  backgroundColor: Colors.surface,
  borderRadius: BorderRadius.lg,
  borderWidth: 1,
  borderColor: Colors.borderSubtle,
};

const glowingStyle: ViewStyle = {
  ...Shadows.glow,
};

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'lg',
  glowing = false,
}) => {
  const combinedStyle: ViewStyle = {
    ...baseCardStyle,
    ...variantStyles[variant],
    ...paddingStyles[padding],
    ...(glowing ? glowingStyle : {}),
    ...style,
  };

  return (
    <View style={combinedStyle}>
      {children}
    </View>
  );
};