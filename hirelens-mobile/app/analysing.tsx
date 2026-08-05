import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Colors } from '../constants/theme';
import { ApiClient } from '../services/apiClient';
import { StorageService } from '../services/storage';
import { StepIndicator } from '../components/StepIndicator';

export default function AnalysingScreen() {
  const router = useRouter();
  const { analysisId } = useLocalSearchParams<{ analysisId: string }>();

  const [statusMsg, setStatusMsg] = useState('Evaluating Resume & Competency Alignment...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let attempts = 0;
    const targetId = analysisId || 'ana_demo';

    async function checkStatus() {
      attempts++;
      try {
        // The result is already cached locally the moment the analysis POST
        // finished (see questionnaire.tsx) — this avoids depending on a
        // cross-instance server read-back that can 404 on a cold instance.
        const cached = await StorageService.getAnalysisResult(targetId);
        if (cached) {
          router.replace(`/results/${targetId}` as any);
          return;
        }

        const res: any = await ApiClient.get(`/analyses/${targetId}`);
        if (res.status === 'completed') {
          router.replace(`/results/${targetId}` as any);
          return;
        } else if (res.status === 'failed') {
          setErrorMsg('We could not prepare a reliable report from this analysis. Please retry.');
          return;
        }

        if (res.stage === 'evaluating_competencies') {
          setStatusMsg('Evaluating candidate skills against target role profile...');
        } else if (res.stage === 'generating_roadmap') {
          setStatusMsg('Generating personalized 4-stage roadmap & immediate actions...');
        }

        if (attempts > 30) {
          setErrorMsg('The analysis took too long to complete. Please retry the analysis.');
          return;
        }

        timer = setTimeout(checkStatus, 2000);
      } catch (err: any) {
        if (attempts > 3) {
          setErrorMsg(err?.message || 'The analysis service is currently unavailable. Please retry.');
        } else {
          timer = setTimeout(checkStatus, 2500);
        }
      }
    }

    checkStatus();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [analysisId]);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <ErrorState
          title="Analysis Could Not Complete"
          message={errorMsg}
          userAction="Please upload your resume again or try another file."
          onRetry={() => router.push('/upload')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={3} />
      <LoadingState message="NVIDIA AI Processing in Progress" stage={statusMsg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
});
