import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppCard } from './AppCard';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { CheckCircle2 } from 'lucide-react-native';

export interface RoleOption {
  id: string;
  title: string;
  description: string;
  entryLevelTitles?: string[];
  requiredSkillsCount?: number;
}

interface RoleCardProps {
  role: RoleOption;
  selected: boolean;
  onSelect: (role: RoleOption) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, selected, onSelect }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onSelect(role)}>
      <AppCard variant={selected ? 'stage' : 'default'} padding="lg" style={selected ? styles.selectedCard : styles.card}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, selected && styles.selectedTitle]}>{role.title}</Text>
          {selected && <CheckCircle2 size={22} color={Colors.accentSecondary} />}
        </View>
        <Text style={styles.description}>{role.description}</Text>
        {role.entryLevelTitles && role.entryLevelTitles.length > 0 && (
          <View style={styles.titlesRow}>
            <Text style={styles.entryLabel}>Includes: </Text>
            <Text style={styles.entryTitles} numberOfLines={1}>
              {role.entryLevelTitles.slice(0, 3).join(' • ')}
            </Text>
          </View>
        )}
      </AppCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  selectedCard: {
    backgroundColor: Colors.stageBg,
    borderColor: Colors.accentPrimary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.heading4.fontSize,
    fontWeight: Typography.heading4.fontWeight,
    color: Colors.textPrimary,
  },
  selectedTitle: {
    color: Colors.accentSecondary,
  },
  description: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall.lineHeight,
  },
  titlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  entryLabel: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  entryTitles: {
    fontSize: Typography.caption.fontSize,
    color: Colors.accentPrimary,
    fontWeight: '600',
    flex: 1,
  },
});