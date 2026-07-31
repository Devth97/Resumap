import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StepIndicator } from '../components/StepIndicator';
import { RoleCard, RoleOption } from '../components/RoleCard';
import { AppButton } from '../components/AppButton';
import { Colors } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { ApiClient } from '../services/apiClient';
import { StorageService } from '../services/storage';
import { ArrowRight } from 'lucide-react-native';

const FALLBACK_ROLES: RoleOption[] = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Analyse raw data, construct SQL queries, build dashboards, and deliver business insights.',
    entryLevelTitles: ['Junior Data Analyst', 'Reporting Analyst', 'MIS Analyst'],
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Build backend APIs, database models, microservices, and core software applications.',
    entryLevelTitles: ['Junior Software Engineer', 'Backend Developer', 'Graduate Trainee'],
  },
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    description: 'Craft responsive user interfaces, dynamic React/Next.js components, and web applications.',
    entryLevelTitles: ['Junior Frontend Developer', 'React Developer', 'UI Web Developer'],
  },
  {
    id: 'aiml-engineer',
    title: 'AI / ML Engineer',
    description: 'Train machine learning models, build LLM pipelines, RAG search systems, and AI endpoints.',
    entryLevelTitles: ['Junior AI Engineer', 'ML Intern', 'Data Science Associate'],
  },
  {
    id: 'product-manager',
    title: 'Associate Product Manager',
    description: 'Authored product requirement specs (PRDs), analyze funnel metrics, and lead sprint backlogs.',
    entryLevelTitles: ['Associate Product Manager', 'Junior PM', 'Business Analyst'],
  },
];

export default function RoleScreen() {
  const router = useRouter();
  const [roles, setRoles] = useState<RoleOption[]>(FALLBACK_ROLES);
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoles() {
      try {
        const data: any = await ApiClient.get('/roles');
        if (data && data.roles && data.roles.length > 0) {
          setRoles(data.roles);
        }
      } catch (e) {
        // Fallback to pre-seeded roles
      } finally {
        setLoading(false);
      }
    }
    loadRoles();
  }, []);

  const handleContinue = async () => {
    if (!selectedRole) return;

    await StorageService.setSelectedRole(selectedRole);
    router.push(ROUTES.QUESTIONNAIRE as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StepIndicator currentStep={2} />

      <Text style={styles.title}>Select Your Target Role</Text>
      <Text style={styles.subtitle}>
        Choose the entry-level career profile you want your resume evaluated against.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.accentPrimary} style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.roleList}>
          {roles.map((r) => (
            <RoleCard
              key={r.id}
              role={r}
              selected={selectedRole?.id === r.id}
              onSelect={(role) => setSelectedRole(role)}
            />
          ))}
        </View>
      )}

      <AppButton
        title="Continue to Context Questionnaire"
        onPress={handleContinue}
        disabled={!selectedRole}
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
  roleList: {
    gap: 10,
  },
});
