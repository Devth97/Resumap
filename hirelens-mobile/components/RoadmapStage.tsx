import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Calendar, CheckSquare } from 'lucide-react-native';

export interface RoadmapStageItem {
  stage: number;
  title: string;
  durationWeeks: number;
  objective: string;
  actions: string[];
  completionEvidence: string;
}

export const RoadmapStage: React.FC<{ stageItem: RoadmapStageItem; isUnlocked?: boolean }> = ({
  stageItem,
  isUnlocked = true,
}) => {
  return (
    <AppCard variant="stage" padding="xl" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.stageBadge}>
          <Text style={styles.stageText}>Stage {stageItem.stage}</Text>
        </View>
        <View style={styles.durationRow}>
          <Calendar size={14} color={Colors.accentSecondary} />
          <Text style={styles.durationText}>{stageItem.durationWeeks} Weeks</Text>
        </View>
      </View>

      <Text style={styles.title}>{stageItem.title}</Text>
      <Text style={styles.objective}>{stageItem.objective}</Text>

      <View style={styles.actionsContainer}>
        <Text style={styles.actionsTitle}>Action Steps</Text>
        {stageItem.actions.map((act, idx) => (
          <View key={idx} style={styles.actionRow}>
            <View style={styles.checkCircle}>
              <CheckSquare size={14} color={Colors.accentPrimary} />
            </View>
            <Text style={styles.actionText}>{act}</Text>
          </View>
        ))}
      </View>

      <View style={styles.evidenceContainer}>
        <Text style={styles.evidenceLabel}>Completion Milestone</Text>
        <View style={styles.evidenceContent}>
          <Text style={styles.evidenceText}>{stageItem.completionEvidence}</Text>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  stageBadge: {
    backgroundColor: Colors.accentPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  stageText: {
    color: '#FFFFFF',
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  durationText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.accentSecondary,
    fontWeight: '600',
  },
  title: {
    fontSize: Typography.heading3.fontSize,
    fontWeight: Typography.heading3.fontWeight,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    lineHeight: Typography.heading3.lineHeight,
  },
  objective: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.bodySmall.lineHeight,
  },
  actionsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionsTitle: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  actionText: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: Typography.bodySmall.lineHeight,
  },
  evidenceContainer: {
    gap: Spacing.xs,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  evidenceLabel: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight,
    color: Colors.textPrimary,
  },
  evidenceContent: {
    backgroundColor: Colors.milestoneBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentSecondary,
  },
  evidenceText: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall.lineHeight,
  },
});