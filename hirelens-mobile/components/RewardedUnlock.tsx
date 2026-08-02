import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { AD_UNITS, AdService } from '../services/ads';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Lock, Sparkles } from 'lucide-react-native';

interface RewardedUnlockProps {
  onUnlocked: () => void;
  isUnlocked: boolean;
}

export const RewardedUnlock: React.FC<RewardedUnlockProps> = ({
  onUnlocked,
  isUnlocked,
}) => {
  const [loadingAd, setLoadingAd] = useState(false);

  const handleShowRewardedAd = () => {
    setLoadingAd(true);

    if (AdService.isNativeSupported()) {
      try {
        const { RewardedAd, RewardedAdReward, AdEventType } = require('react-native-google-mobile-ads');
        const rewarded = RewardedAd.createForAdRequest(AD_UNITS.rewarded, {
          requestNonPersonalizedAdsOnly: true,
        });

        rewarded.addAdEventListener(AdEventType.LOADED, () => {
          setLoadingAd(false);
          rewarded.show();
        });

        rewarded.addAdEventListener(RewardedAdReward.EARNED_REWARD, () => {
          onUnlocked();
        });

        rewarded.addAdEventListener(AdEventType.ERROR, () => {
          setLoadingAd(false);
          onUnlocked();
        });

        rewarded.load();
        return;
      } catch (e) {
        // Fallback below
      }
    }

    // Expo Go Mode Fallback
    setTimeout(() => {
      setLoadingAd(false);
      Alert.alert(
        'Unlocked Preview',
        'AdMob reward completed! Detailed stages 3 & 4 have been unlocked.',
        [{ text: 'View Roadmap', onPress: onUnlocked }]
      );
    }, 600);
  };

  if (isUnlocked) {
    return null;
  }

  return (
    <AppCard variant="reward" padding="xl" style={styles.card}>
      <View style={styles.iconCircle}>
        <Lock size={28} color={Colors.accentPrimary} />
      </View>
      <Text style={styles.title}>Unlock Deep Roadmap & Action Plan</Text>
      <Text style={styles.subtitle}>
        Watch a short sponsored video to unlock detailed 4-stage week-by-week action milestones.
      </Text>
      <AppButton
        title="Watch Video to Unlock Roadmap"
        onPress={handleShowRewardedAd}
        loading={loadingAd}
        icon={<Sparkles size={18} color="#FFFFFF" />}
        style={{ marginTop: Spacing.md }}
      />
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.heading4.fontSize,
    fontWeight: Typography.heading4.fontWeight,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.bodySmall.lineHeight,
    paddingHorizontal: Spacing.md,
  },
});