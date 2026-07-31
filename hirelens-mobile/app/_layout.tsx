import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Colors } from '../constants/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ title: 'Privacy Notice' }} />
        <Stack.Screen name="upload" options={{ title: 'Step 1: Upload Resume' }} />
        <Stack.Screen name="role" options={{ title: 'Step 2: Target Role' }} />
        <Stack.Screen name="questionnaire" options={{ title: 'Step 3: Candidate Context' }} />
        <Stack.Screen name="analysing" options={{ title: 'Analyzing...', headerLeft: () => null }} />
        <Stack.Screen name="results/[analysisId]" options={{ title: 'Analysis & Roadmap' }} />
        <Stack.Screen name="feedback/[analysisId]" options={{ title: 'Feedback & Rating' }} />
      </Stack>
    </QueryClientProvider>
  );
}
