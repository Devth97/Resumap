import { TestIds } from 'react-native-google-mobile-ads';

export const AD_UNITS = {
  banner: TestIds ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111',
  rewarded: TestIds ? TestIds.REWARDED : 'ca-app-pub-3940256099942544/5224354917',
};

export class AdService {
  public static isSupported(): boolean {
    return true;
  }
}
