import { Platform } from 'react-native';

// Google's official TEST ad unit ids — always safe to click during development.
const TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};

// Real AdMob ad unit ids for the ResuMap Android app.
const REAL_IDS = {
  banner: 'ca-app-pub-7761261690953165/8570995827',
  rewarded: 'ca-app-pub-7761261690953165/4513311259',
};

// Only serve REAL ads in the production build (EXPO_PUBLIC_USE_REAL_ADS=true is
// set in the eas.json production profile). Everywhere else — dev, preview,
// simulator — use test ads. Clicking your own live ads violates AdMob policy
// and gets the account banned.
const useRealAds = process.env.EXPO_PUBLIC_USE_REAL_ADS === 'true';

export const AD_UNITS = useRealAds ? REAL_IDS : TEST_IDS;

export const ADMOB_APP_ID = 'ca-app-pub-7761261690953165~4823322506';

export class AdService {
  // AdMob is a native SDK — it does not run on web.
  public static isNativeSupported(): boolean {
    return Platform.OS !== 'web';
  }
}
