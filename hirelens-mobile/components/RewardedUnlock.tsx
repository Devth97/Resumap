import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { AD_UNITS, AdService } from '../services/ads';
import { Colors } from '../constants/theme';
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
    <AppCard style={styles.card} glowing>
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
