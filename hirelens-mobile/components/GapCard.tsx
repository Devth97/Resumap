import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { AlertTriangle, ArrowRight } from 'lucide-react-native';

export interface GapItem {
  skillId?: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  currentEvidence?: string;
  nextAction: string;
  completionEvidence?: string;
}

export const GapCard: React.FC<{ gap: GapItem }> = ({ gap }) => {
  const isHigh = gap.priority === 'high';
  const isMedium = gap.priority === 'medium';

  return (
    <AppCard variant={isHigh ? 'gapHigh' : isMedium ? 'gapMed' : 'gap'} padding="lg" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <AlertTriangle size={18} color={isHigh ? Colors.danger : Colors.warning} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{gap.title}</Text>
            <View style={[
              styles.badge,
              {
                backgroundColor: isHigh ? Colors.dangerSoft : isMedium ? Colors.warningSoft : Colors.successSoft,
              },
            ]}>
              <Text
                style={[
                  styles.badgeText,
                  { color: isHigh ? Colors.danger : isMedium ? Colors.warning : Colors.success },
                ]}
              >
                {gap.priority.toUpperCase()} PRIORITY
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.reason}>{gap.reason}</Text>

      <View style={styles.actionRow}>
        <View style={styles.actionIcon}>
          <ArrowRight size={14} color={Colors.accentSecondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionLabel}>Recommended Action</Text>
          <Text style={styles.actionText}>{gap.nextAction}</Text>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF1F2', // light red
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.heading4.fontSize,
    fontWeight: Typography.heading4.fontWeight,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: Typography.heading4.lineHeight,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: Typography.badge.fontSize,
    fontWeight: Typography.badge.fontWeight,
    lineHeight: Typography.badge.lineHeight,
  },
  reason: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall.lineHeight,
    marginBottom: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  actionLabel: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight,
    color: Colors.accentSecondary,
    marginBottom: 2,
  },
  actionText: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textPrimary,
    fontWeight: '500',
    lineHeight: Typography.bodySmall.lineHeight,
  },
});