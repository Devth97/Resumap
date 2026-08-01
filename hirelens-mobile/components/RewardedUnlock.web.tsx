import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { Colors } from '../constants/theme';
import { Lock, Sparkles } from 'lucide-react-native';

interface RewardedUnlockProps {
  onUnlocked: () => void;
  isUnlocked: boolean;
}

// Web has no AdMob SDK. This variant never imports react-native-google-mobile-ads
// (which pulls in RN internals that break the web bundle). On web we simply
// grant the unlock after a brief moment.
export const RewardedUnlock: React.FC<RewardedUnlockProps> = ({ onUnlocked, isUnlocked }) => {
  const [loading, setLoading] = useState(false);

  const handleUnlock = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onUnlocked();
    }, 500);
  };

  if (isUnlocked) {
    return null;
  }

  return (
    <AppCard style={styles.card} glowing>
      <View style={styles.iconCircle}>
        <Lock size={28} color={Colors.accentPrimary} />
      </View>
      <Text style={styles.title}>Unlock Deep Roadmap & Action Plan</Text>
      <Text style={styles.subtitle}>
        Unlock the detailed 4-stage week-by-week action milestones.
      </Text>
      <AppButton
        title="Unlock Full Roadmap"
        onPress={handleUnlock}
        loading={loading}
        icon={<Sparkles size={18} color="#FFFFFF" />}
        style={{ marginTop: 12 }}
      />
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: 20,
    marginVertical: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
});
