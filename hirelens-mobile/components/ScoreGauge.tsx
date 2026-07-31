import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadows } from '../constants/theme';

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
    padding: 12,
  },
  circleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginBottom: 8,
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
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  labelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 6,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
