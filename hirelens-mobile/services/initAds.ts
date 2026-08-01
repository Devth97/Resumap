// Native: initialize the Google Mobile Ads SDK.
export function initAds(): void {
  try {
    const mobileAds = require('react-native-google-mobile-ads').default;
    mobileAds().initialize();
  } catch (e) {
    // SDK unavailable (e.g. Expo Go) — ads just won't show.
  }
}
