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
        {/* Playful Top Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandLogoBox}>
              <Text style={styles.brandLogoIcon}>📄</Text>
            </View>
            <Text style={styles.brandTitle}>ResuMap</Text>
          </View>

          <View style={styles.betaPill}>
            <Text style={styles.betaPillText}>⚡ BETA v1.0</Text>
          </View>
        </View>

        {/* Hero Section Container */}
        <View style={styles.heroBox}>
          <View style={styles.heroContent}>
            <View style={styles.stickerTag}>
              <Text style={styles.stickerTagText}>★ #1 STUDENT ATS ANALYZER</Text>
            </View>

            <Text style={styles.heroTitle}>
              Tune In to Your <Text style={{ color: '#FFD93D' }}>Dream Career</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Upload your resume to get instant ATS scores, detect skill gaps, and generate a 4-stage action roadmap.
            </Text>

            <AppButton
              title="Start Resume Analysis →"
              onPress={() => router.push(ROUTES.UPLOAD as any)}
              style={styles.heroButton}
            />
          </View>

          <View style={styles.mascotHeroWrapper}>
            <View style={styles.mascotFrame}>
              <Image
                source={require('../assets/mascot.jpg')}
                style={styles.heroMascotImage}
                resizeMode="cover"
              />
              <View style={styles.mascotBadge}>
                <Text style={styles.mascotBadgeText}>LENSY AI</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Neo-Brutalist Stat Banner */}
        <View style={styles.statBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>PII Redacted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#6C5CE7' }]}>70B</Text>
            <Text style={styles.statLabel}>NVIDIA AI Model</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#00CEC9' }]}>4-Stage</Text>
            <Text style={styles.statLabel}>Action Roadmap</Text>
          </View>
        </View>

        {/* Meet Lensy Feature Card */}
        <AppCard style={styles.mascotHighlightCard} glowing>
          <Image
            source={require('../assets/mascot.jpg')}
            style={styles.mascotAvatar}
            resizeMode="cover"
          />
          <View style={styles.mascotContent}>
            <View style={styles.mascotTitleRow}>
              <Text style={styles.sparkleIcon}>✨</Text>
              <Text style={styles.mascotName}>Meet Lensy — Your Career Mentor</Text>
            </View>
            <Text style={styles.mascotQuote}>
              "Hi there! Tap my floating widget at the bottom right anytime to get instant resume tips & ATS bullet suggestions!"
            </Text>
          </View>
        </AppCard>

        {/* Feature Cards Grid (Neo-Brutalist Style) */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Engineered for Student Success</Text>

          <AppCard style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: '#FFD93D' }]}>
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
            <View style={[styles.featureIconBox, { backgroundColor: '#00CEC9' }]}>
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
            <View style={[styles.featureIconBox, { backgroundColor: '#FF7675' }]}>
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
            <View style={[styles.featureIconBox, { backgroundColor: '#00B894' }]}>
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
    backgroundColor: '#FAF7F0',
  },
  container: {
    padding: 16,
    backgroundColor: '#FAF7F0',
    paddingBottom: 90,
    gap: 14,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFD93D',
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoIcon: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -0.5,
  },
  betaPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#18181B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  betaPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#18181B',
  },
  heroBox: {
    backgroundColor: '#6C5CE7',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#18181B',
    padding: 20,
    gap: 16,
  },
  heroContent: {
    gap: 10,
  },
  stickerTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD93D',
    borderWidth: 2,
    borderColor: '#18181B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  stickerTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#E0E7FF',
    lineHeight: 19,
    fontWeight: '500',
  },
  heroButton: {
    marginTop: 6,
  },
  mascotHeroWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  mascotFrame: {
    position: 'relative',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    overflow: 'hidden',
    backgroundColor: '#FFD93D',
  },
  heroMascotImage: {
    width: 140,
    height: 140,
  },
  mascotBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#00CEC9',
    borderWidth: 2,
    borderColor: '#18181B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mascotBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#18181B',
  },
  statBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#18181B',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF7675',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    marginTop: 2,
  },
  statDivider: {
    width: 2,
    height: 32,
    backgroundColor: '#18181B',
  },
  mascotHighlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    backgroundColor: '#FFFDF5',
  },
  mascotAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: '#18181B',
  },
  mascotContent: {
    flex: 1,
    gap: 4,
  },
  mascotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sparkleIcon: {
    fontSize: 16,
  },
  mascotName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#18181B',
  },
  mascotQuote: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    fontWeight: '500',
  },
  featuresSection: {
    gap: 10,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#18181B',
    marginBottom: 2,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    marginBottom: 0,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#18181B',
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
    fontWeight: '900',
    color: '#18181B',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
});
