import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StepIndicator } from '../components/StepIndicator';
import { UploadCard, SelectedFileAsset } from '../components/UploadCard';
import { AppButton } from '../components/AppButton';
import { Colors } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { ApiClient } from '../services/apiClient';
import { StorageService } from '../services/storage';
import { ArrowRight, AlertCircle } from 'lucide-react-native';

export default function UploadScreen() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<SelectedFileAsset | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleContinue = async () => {
    if (!selectedFile) return;

    setErrorMsg(null);
    setUploading(true);

    try {
      const sessionId = (await StorageService.getSessionId()) || 'sess_default';
      const result: any = await ApiClient.uploadFile(
        '/resumes/extract',
        selectedFile.uri,
        selectedFile.name,
        selectedFile.mimeType,
        sessionId,
        (selectedFile as any).file
      );

      await StorageService.setResumeExtraction({
        resumeId: result.resumeId,
        fileName: selectedFile.name,
        extractionMethod: result.extractionMethod,
        characterCount: result.characterCount,
      });

      router.push(ROUTES.ROLE as any);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract text from resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StepIndicator currentStep={1} />

      <Text style={styles.title}>Select Your Resume File</Text>
      <Text style={styles.subtitle}>
        Upload your single or two-page resume in PDF, JPG, or PNG format.
      </Text>

      <UploadCard
        selectedFile={selectedFile}
        onFileSelect={(file) => {
          setSelectedFile(file);
          setErrorMsg(null);
        }}
        onError={(msg) => setErrorMsg(msg)}
      />

      {errorMsg ? (
        <View style={styles.errorBox}>
          <AlertCircle size={18} color={Colors.danger} />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <AppButton
        title="Continue to Target Role"
        onPress={handleContinue}
        disabled={!selectedFile || uploading}
        loading={uploading}
        icon={<ArrowRight size={18} color="#FFFFFF" />}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    flex: 1,
    fontWeight: '500',
  },
});
