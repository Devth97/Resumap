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
    backgroundColor: 'rgba(18, 24, 38, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    padding: 18,
    marginVertical: 8,
    ...Shadows.card,
  },
  glowingCard: {
    borderColor: 'rgba(99, 102, 241, 0.5)',
    ...Shadows.glow,
  },
});
