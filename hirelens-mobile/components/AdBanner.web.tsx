import React from 'react';

// AdMob has no web SDK — ads are native-only. On web, render nothing so the
// native react-native-google-mobile-ads module is never pulled into the web
// bundle (it imports React Native internals that don't exist on web).
export const AdBanner: React.FC = () => null;
