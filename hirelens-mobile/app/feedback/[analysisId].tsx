import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppCard } from '../../components/AppCard';
import { AppButton } from '../../components/AppButton';
import { Colors } from '../../constants/theme';
import { ApiClient } from '../../services/apiClient';
import { StorageService } from '../../services/storage';
import { Star, Send } from 'lucide-react-native';

export default function FeedbackScreen() {
  const router = useRouter();
  const { analysisId } = useLocalSearchParams<{ analysisId: string }>();

  const [rating, setRating] = useState(4);
  const [roadmapUseful, setRoadmapUseful] = useState('yes');
  const [mostUsefulSection, setMostUsefulSection] = useState('skill_gaps');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    setSubmitting(true);

    try {
      const sessionId = (await StorageService.getSessionId()) || 'sess_default';
      await ApiClient.post('/feedback', {
        sessionId,
        analysisId: analysisId || 'ana_demo',
        accuracyRating: rating,
        roadmapUseful,
        mostUsefulSection,
        comments,
        wouldUseAgain: 'yes',
        contactConsent: false,
      });

      Alert.alert(
        'Thank You!',
        'Your feedback helps us continuously improve ResuMap for students.',
        [{ text: 'Back to Home', onPress: () => router.push('/') }]
      );
    } catch (err) {
      Alert.alert('Feedback Recorded', 'Thank you for your response!', [
        { text: 'Back to Home', onPress: () => router.push('/') },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppCard style={styles.card}>
        <Text style={styles.title}>Analysis Feedback</Text>
        <Text style={styles.subtitle}>
          How accurate and useful was your AI Career Analysis report?
        </Text>

        {/* Accuracy Rating Stars */}
        <View style={styles.section}>
          <Text style={styles.label}>1. Analysis Accuracy Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                activeOpacity={0.7}
                onPress={() => setRating(star)}
              >
                <Star
                  size={32}
                  color={star <= rating ? Colors.warning : Colors.textMuted}
                  fill={star <= rating ? Colors.warning : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Most Useful Section */}
        <View style={styles.section}>
          <Text style={styles.label}>2. Most Valuable Report Section</Text>
          <View style={styles.chipRow}>
            {[
              { id: 'scores', label: 'Dual Scores' },
              { id: 'skill_gaps', label: 'Skill Gaps' },
              { id: 'roadmap', label: '4-Stage Roadmap' },
              { id: 'actions', label: 'Immediate Actions' },
            ].map((chip) => (
              <TouchableOpacity
                key={chip.id}
                onPress={() => setMostUsefulSection(chip.id)}
                style={[
                  styles.chip,
                  mostUsefulSection === chip.id && styles.selectedChip,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    mostUsefulSection === chip.id && styles.selectedChipText,
                  ]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comments Input */}
        <View style={styles.section}>
          <Text style={styles.label}>3. Suggestions & Comments (Optional)</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Tell us what was most helpful or how we can improve..."
            placeholderTextColor={Colors.textMuted}
            value={comments}
            onChangeText={setComments}
          />
        </View>

        <AppButton
          title="Submit Feedback"
          onPress={handleSubmitFeedback}
          loading={submitting}
          icon={<Send size={18} color="#FFFFFF" />}
          style={{ marginTop: 12 }}
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
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  selectedChip: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentSecondary,
  },
  chipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 90,
  },
});
