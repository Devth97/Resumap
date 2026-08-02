import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadows, Typography, Spacing, BorderRadius } from '../constants/theme';

interface ScoreGaugeProps {
  score: number;
  label: string;
  title: string;
  type?: 'quality' | 'readiness';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  title,
  type = 'quality',
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return Colors.scoreGaugeHigh;
    if (val >= 60) return Colors.scoreGaugeMid;
    return Colors.scoreGaugeLow;
  };

  const scoreColor = getScoreColor(score);

  return (
    <View style={styles.container}>
      <View style={[styles.circleOuter, { borderColor: scoreColor }]}>
        <View style={styles.circleInner}>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}</Text>
          <Text style={styles.maxText}>/ 100</Text>
        </View>
      </View>
      <Text style={styles.titleText}>{title}</Text>
      <View style={[styles.labelBadge, { backgroundColor: `${scoreColor}20` }]}>
        <Text style={[styles.labelText, { color: scoreColor }]}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: Spacing.md,
  },
  circleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5, // Reduced from 6 to 5 (20% reduction)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    marginBottom: Spacing.sm,
    ...Shadows.glow,
  },
  circleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  maxText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: -2,
  },
  titleText: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: Typography.subheading.fontWeight,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  labelBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  labelText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight,
  },
});