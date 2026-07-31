import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Shadows } from '../constants/theme';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowing?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({ children, style, glowing = false }) => {
  return (
    <View style={[styles.card, glowing && styles.glowingCard, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 18,
    marginVertical: 8,
    ...Shadows.card,
  },
  glowingCard: {
    borderColor: Colors.cardBorderGlow,
    ...Shadows.glow,
  },
});
