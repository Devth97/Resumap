let GoogleMobileAds: any = null;

try {
  GoogleMobileAds = require('react-native-google-mobile-ads');
} catch (err) {
  GoogleMobileAds = null;
}

export const AD_UNITS = {
  banner: GoogleMobileAds?.TestIds ? GoogleMobileAds.TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111',
  rewarded: GoogleMobileAds?.TestIds ? GoogleMobileAds.TestIds.REWARDED : 'ca-app-pub-3940256099942544/5224354917',
};

export class AdService {
  public static isNativeSupported(): boolean {
    return !!GoogleMobileAds && !!GoogleMobileAds.BannerAd;
  }
}
