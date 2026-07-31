import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StepIndicator } from '../components/StepIndicator';
import { RoleCard, RoleOption } from '../components/RoleCard';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { Colors, Shadows } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { ApiClient } from '../services/apiClient';
import { StorageService } from '../services/storage';
import { ArrowRight, Sparkles, Edit3 } from 'lucide-react-native';

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
  const [isCustom, setIsCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
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

  const handleSelectCustom = () => {
    setIsCustom(true);
    const roleId = customTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'custom-role';
    setSelectedRole({
      id: roleId,
      title: customTitle || 'Custom Role',
      description: `Targeting custom role: ${customTitle}`,
      entryLevelTitles: [customTitle],
    });
  };

  const handleCustomTextChange = (text: string) => {
    setCustomTitle(text);
    const roleId = text.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'custom-role';
    setSelectedRole({
      id: roleId,
      title: text || 'Custom Role',
      description: `Targeting custom role: ${text}`,
      entryLevelTitles: [text],
    });
  };

  const handleContinue = async () => {
    if (!selectedRole || (isCustom && !customTitle.trim())) return;

    await StorageService.setSelectedRole(selectedRole);
    router.push(ROUTES.QUESTIONNAIRE as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <StepIndicator currentStep={2} />

      <Text style={styles.title}>Select Your Target Role</Text>
      <Text style={styles.subtitle}>
        Choose a role or type your own custom career target.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.accentPrimary} style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.roleList}>
          {roles.map((r) => (
            <RoleCard
              key={r.id}
              role={r}
              selected={!isCustom && selectedRole?.id === r.id}
              onSelect={(role) => {
                setIsCustom(false);
                setSelectedRole(role);
              }}
            />
          ))}

          {/* Custom Target Role Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSelectCustom}
            style={[styles.customCard, isCustom && styles.customCardSelected]}
          >
            <View style={styles.customHeaderRow}>
              <View style={styles.customIconCircle}>
                <Edit3 size={18} color="#18181B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.customTitle}>Specify Custom Target Role</Text>
                <Text style={styles.customSub}>Type any specific job title (e.g. DevOps, Cloud, Cybersecurity)</Text>
              </View>
              {isCustom && (
                <View style={styles.selectedBadge}>
                  <Sparkles size={14} color="#18181B" />
                </View>
              )}
            </View>

            {isCustom && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.customInput}
                  placeholder="e.g. Full Stack Developer / Cloud Engineer"
                  placeholderTextColor={Colors.textMuted}
                  value={customTitle}
                  onChangeText={handleCustomTextChange}
                  autoFocus
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      <AppButton
        title="Continue to Context Questionnaire"
        onPress={handleContinue}
        disabled={!selectedRole || (isCustom && !customTitle.trim())}
        icon={<ArrowRight size={18} color="#18181B" />}
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  roleList: {
    gap: 12,
  },
  customCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#18181B',
    padding: 16,
    gap: 12,
    ...Shadows.card,
  },
  customCardSelected: {
    backgroundColor: '#FFFDF5',
    borderColor: '#18181B',
    ...Shadows.glow,
  },
  customHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFD93D',
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#18181B',
  },
  customSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD93D',
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginTop: 4,
  },
  customInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#18181B',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
  },
});
