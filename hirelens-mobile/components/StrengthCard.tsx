import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { Colors, Spacing, Typography } from '../constants/theme';
import { CheckCircle } from 'lucide-react-native';

export interface StrengthItem {
  title: string;
  explanation: string;
  evidenceQuote?: string;
  relevance?: string;
}

export const StrengthCard: React.FC<{ strength: StrengthItem }> = ({ strength }) => {
  return (
    <AppCard variant="strength" padding="lg" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <CheckCircle size={18} color={Colors.success} />
        </View>
        <Text style={styles.title}>{strength.title}</Text>
      </View>
      <Text style={styles.explanation}>{strength.explanation}</Text>
      {strength.evidenceQuote ? (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{strength.evidenceQuote}"</Text>
        </View>
      ) : null}
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
    backgroundColor: Colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  title: {
    fontSize: Typography.heading4.fontSize,
    fontWeight: Typography.heading4.fontWeight,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: Typography.heading4.lineHeight,
  },
  explanation: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall.lineHeight,
  },
  quoteContainer: {
    marginTop: Spacing.md,
    paddingLeft: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  quoteText: {
    fontSize: Typography.quote.fontSize,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: Typography.quote.lineHeight,
  },
});