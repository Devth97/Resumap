import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { Colors } from '../constants/theme';
import { ROUTES } from '../constants/routes';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Header Section */}
        <View style={styles.heroSection}>
          <Image
            source={require('../assets/logo.jpg')}
            style={styles.logoImage}
            resizeMode="cover"
          />

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
            title="Start Resume Analysis →"
            onPress={() => router.push(ROUTES.PRIVACY as any)}
            style={{ width: '100%', marginTop: 12 }}
          />
        </View>

        {/* Meet Lensy Mascot Card */}
        <AppCard style={styles.mascotCard} glowing>
          <Image
            source={require('../assets/mascot.jpg')}
            style={styles.mascotAvatar}
            resizeMode="cover"
          />
          <View style={styles.mascotContent}>
            <View style={styles.mascotHeaderRow}>
              <Text style={styles.sparkleIcon}>✨</Text>
              <Text style={styles.mascotName}>Meet Lensy — AI Career Mentor</Text>
            </View>
            <Text style={styles.mascotQuote}>
              "Hi there! I'm Lensy, your student career guide. I'll evaluate your skills, redact your personal info, and build a step-by-step roadmap to get you job-ready!"
            </Text>
          </View>
        </AppCard>

        {/* Feature Highlights Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Powered by Advanced AI Architecture</Text>

          <AppCard style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.emojiIcon}>⚡</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>NVIDIA NIM Acceleration</Text>
              <Text style={styles.featureDesc}>
                Nemotron OCR v2 for document extraction & Llama 3.3 70B Instruct for deep skill evaluation.
              </Text>
            </View>
          </AppCard>

          <AppCard style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.emojiIcon}>🛡️</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Strict Privacy & PII Redaction</Text>
              <Text style={styles.featureDesc}>
                Automated removal of emails, phone numbers, and personal identifiers before AI processing.
              </Text>
            </View>
          </AppCard>

          <AppCard style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.emojiIcon}>🎯</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Explainable Scoring Engine</Text>
              <Text style={styles.featureDesc}>
                Dual score metrics: Resume Quality & Job Readiness calculated with transparent weighted formulas.
              </Text>
            </View>
          </AppCard>

          <AppCard style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.emojiIcon}>🏆</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  container: {
    padding: 20,
    backgroundColor: '#090D16',
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#6366F1',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 2,
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
    fontSize: 40,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
  },
  mascotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderColor: 'rgba(99, 102, 241, 0.35)',
    marginVertical: 14,
  },
  mascotAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: Colors.accentSecondary,
  },
  mascotContent: {
    flex: 1,
    gap: 4,
  },
  mascotHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sparkleIcon: {
    fontSize: 16,
  },
  mascotName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.accentSecondary,
  },
  mascotQuote: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  featuresSection: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    marginBottom: 0,
  },
  featureIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiIcon: {
    fontSize: 20,
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
