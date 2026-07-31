import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AD_UNITS, AdService } from '../services/ads';
import { Colors } from '../constants/theme';

export const AdBanner: React.FC = () => {
  if (AdService.isNativeSupported()) {
    try {
      const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');
      return (
        <View style={styles.container}>
          <BannerAd
            unitId={AD_UNITS.banner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            onAdFailedToLoad={() => {}}
          />
        </View>
      );
    } catch (e) {
      // Fallback below
    }
  }

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>Sponsored • AdMob Test Banner</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  fallbackContainer: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  fallbackText: {
    fontSize: 11,
    color: Colors.accentSecondary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
