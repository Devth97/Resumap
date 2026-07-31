import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StepIndicator } from '../../components/StepIndicator';
import { ScoreGauge } from '../../components/ScoreGauge';
import { ScoreBreakdown } from '../../components/ScoreBreakdown';
import { StrengthCard, StrengthItem } from '../../components/StrengthCard';
import { GapCard, GapItem } from '../../components/GapCard';
import { RoadmapStage, RoadmapStageItem } from '../../components/RoadmapStage';
import { RewardedUnlock } from '../../components/RewardedUnlock';
import { AdBanner } from '../../components/AdBanner';
import { BulletRewriterCard } from '../../components/BulletRewriterCard';
import { AtsPdfGeneratorModal } from '../../components/AtsPdfGeneratorModal';
import { AppCard } from '../../components/AppCard';
import { AppButton } from '../../components/AppButton';
import { Colors } from '../../constants/theme';
import { ApiClient } from '../../services/apiClient';
import { StorageService } from '../../services/storage';
import { MessageSquare, ShieldAlert, Sparkles } from 'lucide-react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const { analysisId } = useLocalSearchParams<{ analysisId: string }>();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  useEffect(() => {
    async function loadData() {
      const targetId = analysisId || 'ana_demo';

      // Check unlock status
      const unlocked = await StorageService.isRoadmapUnlocked(targetId);
      setIsUnlocked(unlocked);

      try {
        const data: any = await ApiClient.get(`/analyses/${targetId}`);
        if (data && data.result) {
          setResult(data.result);
        } else {
          setResult(getFallbackResult());
        }
      } catch (err) {
        setResult(getFallbackResult());
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [analysisId]);

  const handleUnlockSuccess = async () => {
    const targetId = analysisId || 'ana_demo';
    await StorageService.setRoadmapUnlocked(targetId);
    setIsUnlocked(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accentPrimary} />
        <Text style={styles.loadingText}>Fetching AI Career Analysis...</Text>
      </View>
    );
  }

  const res = result || getFallbackResult();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StepIndicator currentStep={4} />

      {/* Score Overview Header */}
      <AppCard style={styles.scoreOverviewCard} glowing>
        <Text style={styles.sectionHeaderTitle}>Career Readiness Evaluation</Text>
        <View style={styles.scoreGaugesRow}>
          <ScoreGauge
            score={res.resumeQualityScore ?? 68}
            label={res.resumeScoreLabel ?? 'Good Foundation'}
            title="Resume Quality"
            type="quality"
          />
          <View style={styles.scoreDivider} />
          <ScoreGauge
            score={res.jobReadinessScore ?? 54}
            label={res.readinessLabel ?? 'Developing'}
            title="Job Readiness"
            type="readiness"
          />
        </View>

        {/* 1-Click ATS PDF Generator CTA */}
        <AppButton
          title="📄 Download 1-Page ATS PDF Resume"
          onPress={() => setPdfModalVisible(true)}
          style={{ width: '100%', marginTop: 14 }}
        />

        <View style={styles.disclaimerBox}>
          <ShieldAlert size={14} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            {res.disclaimer || 'Guidance only; does not guarantee employment or interviews.'}
          </Text>
        </View>
      </AppCard>

      {/* ATS PDF Generator Modal */}
      <AtsPdfGeneratorModal
        visible={pdfModalVisible}
        onClose={() => setPdfModalVisible(false)}
        targetRoleName={res.targetRoleName || 'Software Engineer'}
        analysisResult={res}
      />

      {/* Evaluation Breakdown Bars */}
      {res.dimensionBreakdown ? (
        <ScoreBreakdown breakdown={res.dimensionBreakdown} />
      ) : null}

      {/* Immediate Actions Top Highlights */}
      {res.immediateActions && res.immediateActions.length > 0 ? (
        <AppCard style={styles.immediateCard}>
          <View style={styles.immediateHeader}>
            <Sparkles size={18} color={Colors.accentSecondary} />
            <Text style={styles.immediateTitle}>Immediate Top 3 Actions</Text>
          </View>
          {res.immediateActions.map((act: string, idx: number) => (
            <View key={idx} style={styles.immediateRow}>
              <Text style={styles.bulletNum}>{idx + 1}.</Text>
              <Text style={styles.bulletText}>{act}</Text>
            </View>
          ))}
        </AppCard>
      ) : null}

      {/* Key Strengths */}
      {res.strengths && res.strengths.length > 0 ? (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Detected Strengths ({res.strengths.length})</Text>
          {res.strengths.map((s: StrengthItem, idx: number) => (
            <StrengthCard key={idx} strength={s} />
          ))}
        </View>
      ) : null}

      {/* AI Bullet Point Quantifier & ATS Rewriter Tool */}
      <BulletRewriterCard />

      {/* Skill Gaps */}
      {res.gaps && res.gaps.length > 0 ? (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Skill Gaps & Recommended Projects</Text>
          {res.gaps.map((g: GapItem, idx: number) => (
            <GapCard key={idx} gap={g} />
          ))}
        </View>
      ) : null}

      {/* 4-Stage Action Roadmap */}
      {res.roadmap && res.roadmap.length > 0 ? (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Personalized 4-Stage Roadmap</Text>

          {/* Stage 1 & 2 available */}
          {res.roadmap.slice(0, 2).map((stg: RoadmapStageItem) => (
            <RoadmapStage key={stg.stage} stageItem={stg} />
          ))}

          {/* Rewarded Ad Lock for Stage 3 & 4 */}
          <RewardedUnlock isUnlocked={isUnlocked} onUnlocked={handleUnlockSuccess} />

          {isUnlocked &&
            res.roadmap.slice(2).map((stg: RoadmapStageItem) => (
              <RoadmapStage key={stg.stage} stageItem={stg} isUnlocked={isUnlocked} />
            ))}
        </View>
      ) : null}

      {/* Test Banner Ad */}
      <AdBanner />

      {/* Submit Feedback CTA */}
      <AppButton
        title="Submit Analysis Feedback"
        onPress={() => router.push(`/feedback/${analysisId || 'ana_demo'}` as any)}
        variant="secondary"
        icon={<MessageSquare size={18} color={Colors.textPrimary} />}
        style={{ marginTop: 16 }}
      />
    </ScrollView>
  );
}

function getFallbackResult() {
  return {
    resumeQualityScore: 72,
    jobReadinessScore: 64,
    resumeScoreLabel: 'Strong Resume',
    readinessLabel: 'Developing',
    disclaimer: 'This analysis is guidance and does not guarantee employment or interviews.',
    dimensionBreakdown: {
      roleRelevance: 78,
      skillAlignment: 72,
      evidenceQuality: 68,
      projectClarity: 74,
      structureReadability: 82,
      languageQuality: 76,
      projectEvidence: 70,
      practicalExperience: 45,
      toolExposure: 75,
      communicationEvidence: 65,
    },
    immediateActions: [
      'Add quantitative impact metrics to project bullet points.',
      'Build an end-to-end portfolio project demonstrating core required skills.',
      'Refactor resume bullet points to start with strong action verbs.',
    ],
    strengths: [
      {
        title: 'Clear Technical Competency Alignment',
        explanation: 'Resume explicitly includes core skills required for the target role.',
        evidenceQuote: 'Demonstrated SQL, Python, and Data Analysis coursework.',
      },
    ],
    gaps: [
      {
        title: 'Demonstrate SQL with Portfolio Project Evidence',
        priority: 'high',
        reason: 'Target role heavily emphasizes SQL database queries, but project evidence is absent.',
        nextAction: 'Build a sales dataset reporting pipeline using PostgreSQL window functions.',
      },
    ],
    roadmap: [
      {
        stage: 1,
        title: 'Core Competency Mastery',
        durationWeeks: 2,
        objective: 'Strengthen fundamental skills required for entry-level role.',
        actions: ['Complete targeted exercises on core skills', 'Solve 15 coding challenges'],
        completionEvidence: 'Successful completion of hands-on query sets',
      },
      {
        stage: 2,
        title: 'Portfolio Project Construction',
        durationWeeks: 3,
        objective: 'Build end-to-end project demonstrating key technical capabilities.',
        actions: ['Build sales analytics dashboard', 'Document project in GitHub README'],
        completionEvidence: 'Public GitHub repository link',
      },
      {
        stage: 3,
        title: 'Resume Refinement & Metric Enhancement',
        durationWeeks: 1,
        objective: 'Rewrite bullet points using action-result framework.',
        actions: ['Quantify project outcomes with business metrics', 'Highlight technology stack'],
        completionEvidence: 'Updated 1-page PDF resume',
      },
      {
        stage: 4,
        title: 'Interview & Portfolio Readiness',
        durationWeeks: 2,
        objective: 'Practice technical interview discussions and project walkthroughs.',
        actions: ['Prepare 2-minute elevator pitch', 'Conduct 2 mock technical interviews'],
        completionEvidence: 'Completed mock interview score of 80%+',
      },
    ],
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  scoreOverviewCard: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  scoreGaugesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  scoreDivider: {
    width: 1,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 14,
  },
  disclaimerText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  immediateCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    gap: 8,
  },
  immediateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  immediateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  immediateRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bulletNum: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accentSecondary,
  },
  bulletText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  sectionBlock: {
    gap: 8,
    marginTop: 8,
  },
  blockTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
});
