import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface ScoreBreakdownProps {
  breakdown: {
    roleRelevance?: number;
    skillAlignment?: number;
    evidenceQuality?: number;
    projectClarity?: number;
    structureReadability?: number;
    languageQuality?: number;
    projectEvidence?: number;
    practicalExperience?: number;
    toolExposure?: number;
    communicationEvidence?: number;
  };
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  const items = [
    { label: 'Role Relevance', val: breakdown.roleRelevance ?? 75 },
    { label: 'Required Skill Alignment', val: breakdown.skillAlignment ?? 70 },
    { label: 'Evidence Quality', val: breakdown.evidenceQuality ?? 65 },
    { label: 'Project Clarity', val: breakdown.projectClarity ?? 70 },
    { label: 'Practical Experience', val: breakdown.practicalExperience ?? 50 },
    { label: 'Tool Exposure', val: breakdown.toolExposure ?? 70 },
  ];

  return (
    <AppCard variant="recommendation" padding="xl" style={styles.card}>
      <Text style={styles.sectionTitle}>Evaluation Breakdown</Text>
      <View style={styles.listContainer}>
        {items.map((item) => (
          <View key={item.label} style={styles.itemRow}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemVal}>{item.val}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, Math.max(0, item.val))}%`,
                    backgroundColor:
                      item.val >= 75
                        ? Colors.success
                        : item.val >= 55
                        ? Colors.warning
                        : Colors.danger,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.heading4.fontSize,
    fontWeight: Typography.heading4.fontWeight,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  listContainer: {
    gap: Spacing.md,
  },
  itemRow: {
    gap: Spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  itemLabel: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textSecondary,
  },
  itemVal: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: Typography.bodySmall.fontWeight,
    color: Colors.textPrimary,
  },
  progressTrack: {
    height: 12,
    backgroundColor: Colors.borderSubtle,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
});