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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#18181B',
    padding: 18,
    marginVertical: 8,
    ...Shadows.card,
  },
  glowingCard: {
    backgroundColor: '#FFFDF5',
    borderColor: '#18181B',
    ...Shadows.glow,
  },
});
