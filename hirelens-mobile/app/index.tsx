import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { Colors } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { ShieldCheck, Cpu, Target, Award, ArrowRight } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Glow Section */}
      <View style={styles.heroSection}>
        <View style={styles.badgeRow}>
          <View style={styles.betaBadge}>
            <Text style={styles.betaText}>BETA v1.0 • HIRE LENS</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>
          Resu<Text style={{ color: Colors.accentPrimary }}>Map</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          AI-Powered Student Resume & Job-Readiness Analyzer
        </Text>
        <Text style={styles.heroDescription}>
          Bridge the gap between academic resumes and entry-level role expectations with evidence-based scoring and a personalized 4-stage roadmap.
        </Text>

        <AppButton
          title="Start Resume Analysis"
          onPress={() => router.push(ROUTES.PRIVACY as any)}
          icon={<ArrowRight size={20} color="#FFFFFF" />}
          style={{ width: '100%', marginTop: 16 }}
        />
      </View>

      {/* Feature Highlights Grid */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionHeading}>Powered by Advanced AI Architecture</Text>

        <AppCard style={styles.featureCard}>
          <View style={styles.featureIconCircle}>
            <Cpu size={24} color={Colors.accentSecondary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>NVIDIA NIM Acceleration</Text>
            <Text style={styles.featureDesc}>
              Nemotron OCR v2 for high-precision document extraction & Llama 3.3 70B Instruct for deep skill evaluation.
            </Text>
          </View>
        </AppCard>

        <AppCard style={styles.featureCard}>
          <View style={styles.featureIconCircle}>
            <ShieldCheck size={24} color={Colors.success} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Strict Privacy & PII Redaction</Text>
            <Text style={styles.featureDesc}>
              Automated removal of emails, phone numbers, and personal identifiers before AI processing. Raw files deleted in 15 mins.
            </Text>
          </View>
        </AppCard>

        <AppCard style={styles.featureCard}>
          <View style={styles.featureIconCircle}>
            <Target size={24} color={Colors.warning} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Explainable Scoring Engine</Text>
            <Text style={styles.featureDesc}>
              Dual score metrics: Resume Quality & Job Readiness calculated with transparent server-side weighted formulas.
            </Text>
          </View>
        </AppCard>

        <AppCard style={styles.featureCard}>
          <View style={styles.featureIconCircle}>
            <Award size={24} color={Colors.accentPrimary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>4-Stage Action Roadmap</Text>
            <Text style={styles.featureDesc}>
              Clear milestone targets detailing missing skill projects, bullet point metric rewrites, and interview preparation.
            </Text>
          </View>
        </AppCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  betaBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  betaText: {
    color: Colors.accentSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  featuresSection: {
    marginTop: 20,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    marginBottom: 0,
  },
  featureIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
