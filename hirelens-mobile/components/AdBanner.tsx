import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNITS } from '../services/ads';
import { Colors } from '../constants/theme';

export const AdBanner: React.FC = () => {
  try {
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
  } catch (err) {
    // Fallback if native ad banner cannot render on simulator/web preview
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>Sponsored • AdMob Test Banner</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  fallbackContainer: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  fallbackText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
