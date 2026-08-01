import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StepIndicator } from '../components/StepIndicator';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { Colors } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { StorageService } from '../services/storage';
import { ApiClient } from '../services/apiClient';
import { ArrowRight, CheckCircle2 } from 'lucide-react-native';

export default function QuestionnaireScreen() {
  const router = useRouter();

  const [timeline, setTimeline] = useState('three_months');
  const [weeklyHours, setWeeklyHours] = useState('six_to_ten');
  const [projects, setProjects] = useState('one_completed');
  const [internship, setInternship] = useState('none');
  const [interviewConfidence, setInterviewConfidence] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);

    const questionnaireData = {
      timeline,
      weeklyHours,
      projects,
      internship,
      interviewConfidence,
      selfLevel: 'concepts_need_practice',
    };

    try {
      await StorageService.setQuestionnaire(questionnaireData);

      const sessionId = (await StorageService.getSessionId()) || 'sess_default';
      const extraction = await StorageService.getResumeExtraction();
      const role = await StorageService.getSelectedRole();

      if (!extraction || !role) {
        router.push(ROUTES.UPLOAD as any);
        return;
      }

      // Queue analysis on backend
      const res: any = await ApiClient.post('/analyses', {
        sessionId,
        resumeId: extraction.resumeId,
        roleId: role.id,
        roleTitle: role.title,
        redactedText: extraction.redactedText,
        questionnaire: questionnaireData,
      });

      if (res.analysisId) {
        // Cache the inline result so the results screen never depends on a
        // cross-instance server read-back.
        if (res.result) {
          await StorageService.setAnalysisResult(res.analysisId, res.result);
        }
        router.push(`/analysing?analysisId=${res.analysisId}` as any);
      } else {
        router.push('/analysing' as any);
      }
    } catch (e) {
      // Fallback redirect
      router.push(`/analysing?analysisId=ana_demo_${Date.now()}` as any);
    } finally {
      setSubmitting(false);
    }
  };

  const OptionGroup = ({
    title,
    options,
    selected,
    onSelect,
  }: {
    title: string;
    options: Array<{ id: string; label: string }>;
    selected: string;
    onSelect: (id: string) => void;
  }) => (
    <View style={styles.groupContainer}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.optionsList}>
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.7}
              onPress={() => onSelect(opt.id)}
              style={[styles.optionChip, isSelected && styles.selectedOptionChip]}
            >
              <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                {opt.label}
              </Text>
              {isSelected ? <CheckCircle2 size={16} color={Colors.accentSecondary} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StepIndicator currentStep={3} />

      <Text style={styles.title}>Candidate Context</Text>
      <Text style={styles.subtitle}>
        Help us personalize your readiness scores and action roadmap to your schedule.
      </Text>

      <AppCard style={styles.card}>
        <OptionGroup
          title="1. Target Job Hunt Timeline"
          selected={timeline}
          onSelect={setTimeline}
          options={[
            { id: 'immediate', label: 'Within 1 Month' },
            { id: 'three_months', label: 'Within 3 Months' },
            { id: 'six_months', label: 'Within 6 Months' },
            { id: 'exploring', label: 'Just Exploring' },
          ]}
        />

        <OptionGroup
          title="2. Weekly Time Available for Upskilling"
          selected={weeklyHours}
          onSelect={setWeeklyHours}
          options={[
            { id: 'one_to_five', label: '1 - 5 Hours / week' },
            { id: 'six_to_ten', label: '6 - 10 Hours / week' },
            { id: 'eleven_plus', label: '11+ Hours / week' },
          ]}
        />

        <OptionGroup
          title="3. Portfolio Projects Completed"
          selected={projects}
          onSelect={setProjects}
          options={[
            { id: 'none', label: 'No completed projects yet' },
            { id: 'one_completed', label: '1 completed project' },
            { id: 'two_plus_completed', label: '2+ completed projects' },
          ]}
        />

        <OptionGroup
          title="4. Practical Internship / Work History"
          selected={internship}
          onSelect={setInternship}
          options={[
            { id: 'none', label: 'No formal internship' },
            { id: 'virtual_internship', label: 'Virtual / Simulated internship' },
            { id: 'under_three_months', label: 'Internship under 3 months' },
            { id: 'three_months_plus', label: 'Internship 3+ months' },
          ]}
        />

        {/* Interview Confidence Rating */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>5. Interview Confidence Level (1-5)</Text>
          <View style={styles.confidenceRow}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity
                key={val}
                activeOpacity={0.7}
                onPress={() => setInterviewConfidence(val)}
                style={[
                  styles.confBtn,
                  interviewConfidence === val && styles.selectedConfBtn,
                ]}
              >
                <Text
                  style={[
                    styles.confText,
                    interviewConfidence === val && styles.selectedConfText,
                  ]}
                >
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </AppCard>

      <AppButton
        title="Generate AI Analysis & Roadmap"
        onPress={handleSubmit}
        loading={submitting}
        icon={<ArrowRight size={18} color="#FFFFFF" />}
        style={{ marginTop: 16 }}
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
  card: {
    gap: 18,
  },
  groupContainer: {
    gap: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  optionsList: {
    gap: 8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  selectedOptionChip: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: Colors.accentPrimary,
  },
  optionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  confBtn: {
    width: 50,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedConfBtn: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentSecondary,
  },
  confText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  selectedConfText: {
    color: '#FFFFFF',
  },
});
