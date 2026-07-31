import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppCard } from './AppCard';
import { Colors } from '../constants/theme';
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
    <TouchableOpacity activeOpacity={0.8} onPress={() => onSelect(role)}>
      <AppCard glowing={selected} style={selected ? styles.selectedCard : undefined}>
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
  selectedCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderColor: Colors.accentPrimary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  selectedTitle: {
    color: Colors.accentSecondary,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  titlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  entryLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  entryTitles: {
    fontSize: 11,
    color: Colors.accentPrimary,
    fontWeight: '600',
    flex: 1,
  },
});
