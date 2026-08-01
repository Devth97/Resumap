import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { Colors } from '../constants/theme';
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
    <AppCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.stageNumberBadge}>
          <Text style={styles.stageNumberText}>Stage {stageItem.stage}</Text>
        </View>
        <View style={styles.durationRow}>
          <Calendar size={14} color={Colors.accentSecondary} />
          <Text style={styles.durationText}>{stageItem.durationWeeks} Weeks</Text>
        </View>
      </View>

      <Text style={styles.title}>{stageItem.title}</Text>
      <Text style={styles.objective}>{stageItem.objective}</Text>

      <View style={styles.actionsContainer}>
        <Text style={styles.actionsTitle}>Action Steps:</Text>
        {stageItem.actions.map((act, idx) => (
          <View key={idx} style={styles.actionRow}>
            <CheckSquare size={14} color={Colors.accentPrimary} style={{ marginTop: 2 }} />
            <Text style={styles.actionText}>{act}</Text>
          </View>
        ))}
      </View>

      <View style={styles.evidenceBox}>
        <Text style={styles.evidenceLabel}>Completion Milestone:</Text>
        <Text style={styles.evidenceText}>{stageItem.completionEvidence}</Text>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stageNumberBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stageNumberText: {
    color: Colors.accentPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: Colors.accentSecondary,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  objective: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 6,
    marginBottom: 10,
  },
  actionsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  evidenceBox: {
    backgroundColor: 'rgba(255, 217, 61, 0.18)',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentSecondary,
  },
  evidenceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  evidenceText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
