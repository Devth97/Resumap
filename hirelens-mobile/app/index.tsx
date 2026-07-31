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
        {/* CRED-Style Glowing Top Badge */}
        <View style={styles.topBadgeContainer}>
          <View style={styles.credPill}>
            <Text style={styles.credPillDot}>•</Text>
            <Text style={styles.credPillText}>INSPIRED BY CRED & INSPIRA UI</Text>
          </View>
        </View>

        {/* Hero Header Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoGlowRing}>
            <Image
              source={require('../assets/logo.jpg')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.heroTitle}>
            Resu<Text style={{ color: Colors.accentPrimary }}>Map</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            AI-Powered Student Resume & Job-Readiness Analyzer
          </Text>

          <Text style={styles.heroDescription}>
            Bridge the gap between academic projects and entry-level role expectations with evidence-based scoring and a personalized 4-stage action roadmap.
          </Text>

          <AppButton
            title="Start Resume Analysis →"
            onPress={() => router.push(ROUTES.PRIVACY as any)}
            style={styles.primaryActionButton}
          />
        </View>

        {/* CRED-Style Stat Cards Grid */}
        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>PII Redaction Privacy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#06B6D4' }]}>70B</Text>
            <Text style={styles.statLabel}>NVIDIA Llama 3.3 AI</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>4-Stage</Text>
            <Text style={styles.statLabel}>Action Roadmap</Text>
          </View>
        </View>

        {/* Meet Lensy Mascot Highlight Card */}
        <AppCard style={styles.mascotCard} glowing>
          <Image
            source={require('../assets/mascot.jpg')}
            style={styles.mascotAvatar}
            resizeMode="cover"
          />
          <View style={styles.mascotContent}>
            <View style={styles.mascotHeaderRow}>
              <Text style={styles.sparkleIcon}>✨</Text>
              <Text style={styles.mascotName}>Meet Lensy — Your AI Assistant</Text>
            </View>
            <Text style={styles.mascotQuote}>
              "Hi there! I'm Lensy, your student career guide. Tap my floating icon on the bottom right anytime to get instant tips!"
            </Text>
          </View>
        </AppCard>

        {/* Inspira UI Feature Cards */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Engineered for Student Success</Text>

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
    backgroundColor: '#070A11',
  },
  container: {
    padding: 20,
    backgroundColor: '#070A11',
    paddingBottom: 90,
  },
  topBadgeContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  credPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  credPillDot: {
    color: '#06B6D4',
    fontSize: 14,
  },
  credPillText: {
    color: Colors.accentSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  logoGlowRing: {
    padding: 3,
    borderRadius: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  logoImage: {
    width: 92,
    height: 92,
    borderRadius: 26,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -1.5,
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
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  primaryActionButton: {
    width: '100%',
    marginTop: 8,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(18, 24, 38, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#6366F1',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  mascotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderColor: 'rgba(99, 102, 241, 0.35)',
    marginVertical: 10,
  },
  mascotAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
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
