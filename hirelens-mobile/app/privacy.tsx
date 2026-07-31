import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { Colors } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { ApiClient } from '../services/apiClient';
import { StorageService } from '../services/storage';
import { ShieldCheck, CheckSquare, Square } from 'lucide-react-native';

export default function PrivacyScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAcceptPrivacy = async () => {
    if (!agreed) return;
    setLoading(true);

    try {
      // Create session
      const res: any = await ApiClient.post('/sessions', { eventCode: 'STUDENT-BETA' });
      if (res.sessionId) {
        await StorageService.setSessionId(res.sessionId);
      }
    } catch (e) {
      // Fallback offline session ID
      await StorageService.setSessionId(`sess_${Date.now()}`);
    } finally {
      setLoading(false);
      router.push(ROUTES.UPLOAD as any);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppCard style={styles.card}>
        <View style={styles.iconHeader}>
          <ShieldCheck size={36} color={Colors.success} />
          <Text style={styles.title}>Data Privacy & Protection</Text>
        </View>

        <Text style={styles.intro}>
          Before uploading your resume, please review how ResuMap (HireLens by Ornalens LLP) handles your document and personal data:
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. PII Redaction & Privacy First</Text>
          <Text style={styles.bodyText}>
            Our system automatically strips email addresses, phone numbers, addresses, and candidate names before sending resume text to AI providers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Temporary File Retention</Text>
          <Text style={styles.bodyText}>
            Raw uploaded PDF or image files are permanently deleted within 15 minutes of extraction. Redacted extracted text is deleted after 24 hours.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. AI Provider Processing</Text>
          <Text style={styles.bodyText}>
            Extracted text is processed via secure NVIDIA NIM microservices (Nemotron OCR v2 & Llama 3.3 70B Instruct) solely for generating your evaluation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. No Ads Personalization via Resume</Text>
          <Text style={styles.bodyText}>
            No resume content or personal details are ever shared with advertising partners (Google AdMob).
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAgreed(!agreed)}
          style={styles.checkboxRow}
        >
          {agreed ? (
            <CheckSquare size={22} color={Colors.accentPrimary} />
          ) : (
            <Square size={22} color={Colors.textMuted} />
          )}
          <Text style={styles.checkboxLabel}>
            I understand and accept the Privacy Policy and data processing terms.
          </Text>
        </TouchableOpacity>

        <AppButton
          title="I Agree & Continue"
          onPress={handleAcceptPrivacy}
          disabled={!agreed}
          loading={loading}
          style={{ marginTop: 16 }}
        />
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  card: {
    padding: 20,
  },
  iconHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  intro: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accentSecondary,
    marginBottom: 2,
  },
  bodyText: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
});
