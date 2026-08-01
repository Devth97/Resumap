import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FloatingMascot } from '../components/FloatingMascot';

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Initialize the Google Mobile Ads SDK on native platforms only.
    if (Platform.OS !== 'web') {
      try {
        const mobileAds = require('react-native-google-mobile-ads').default;
        mobileAds().initialize();
      } catch (e) {
        // SDK not present (e.g. Expo Go) — ads simply won't show.
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#FAF7F0" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FAF7F0',
            },
            headerTintColor: '#18181B',
            headerTitleStyle: {
              fontWeight: '900',
            },
            contentStyle: {
              backgroundColor: '#FAF7F0',
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="privacy" options={{ title: 'Privacy Shield' }} />
          <Stack.Screen name="upload" options={{ title: 'Step 1: Upload Resume' }} />
          <Stack.Screen name="role" options={{ title: 'Step 2: Target Role' }} />
          <Stack.Screen name="questionnaire" options={{ title: 'Step 3: Candidate Context' }} />
          <Stack.Screen name="analysing" options={{ title: 'Analyzing...', headerLeft: () => null }} />
          <Stack.Screen name="results/[analysisId]" options={{ title: 'Analysis & Roadmap' }} />
          <Stack.Screen name="feedback/[analysisId]" options={{ title: 'Feedback & Rating' }} />
        </Stack>

        {/* Floating Lensy AI Mascot Widget on Bottom Right */}
        <FloatingMascot />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F0',
  },
});
