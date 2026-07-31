import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { Colors } from '../constants/theme';
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

  return (
    <AppCard style={isHigh ? styles.highCard : styles.card}>
      <View style={styles.header}>
        <AlertTriangle
          size={20}
          color={isHigh ? Colors.danger : Colors.warning}
          style={{ marginTop: 2 }}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{gap.title}</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: isHigh ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)' },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: isHigh ? Colors.danger : Colors.warning },
                ]}
              >
                {gap.priority.toUpperCase()} PRIORITY
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.reason}>{gap.reason}</Text>

      <View style={styles.actionBox}>
        <View style={styles.actionHeader}>
          <ArrowRight size={14} color={Colors.accentSecondary} />
          <Text style={styles.actionLabel}>Recommended Action:</Text>
        </View>
        <Text style={styles.actionText}>{gap.nextAction}</Text>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    marginBottom: 8,
  },
  highCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  reason: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  actionBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accentSecondary,
  },
  actionText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
