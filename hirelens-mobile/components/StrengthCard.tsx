import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { Colors } from '../constants/theme';
import { CheckCircle } from 'lucide-react-native';

export interface StrengthItem {
  title: string;
  explanation: string;
  evidenceQuote?: string;
  relevance?: string;
}

export const StrengthCard: React.FC<{ strength: StrengthItem }> = ({ strength }) => {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <CheckCircle size={20} color={Colors.success} style={{ marginTop: 2 }} />
        <Text style={styles.title}>{strength.title}</Text>
      </View>
      <Text style={styles.explanation}>{strength.explanation}</Text>
      {strength.evidenceQuote ? (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>"{strength.evidenceQuote}"</Text>
        </View>
      ) : null}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  explanation: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  quoteBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  quoteText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
