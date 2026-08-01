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
import { ErrorState } from '../../components/ErrorState';
import { MessageSquare, ShieldAlert, Sparkles } from 'lucide-react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const { analysisId } = useLocalSearchParams<{ analysisId: string }>();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  useEffect(() => {
    async function loadData() {
      const targetId = analysisId || 'ana_demo';

      // Check unlock status
      const unlocked = await StorageService.isRoadmapUnlocked(targetId);
      setIsUnlocked(unlocked);

      // Prefer the inline result cached at analysis time — avoids any dependency
      // on a cross-instance server read-back.
      const cached = await StorageService.getAnalysisResult(targetId);
      if (cached) {
        setResult(cached);
        setErrorMessage(null);
        setLoading(false);
        return;
      }

      // Retry a few times: a completed analysis can briefly be unreadable on a
      // cold serverless instance right after it's written (read-after-write lag
      // across instances). Don't fall back to an error on the first empty read.
      const maxAttempts = 5;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const data: any = await ApiClient.get(`/analyses/${targetId}`);
          if (data && data.result) {
            setResult(data.result);
            setErrorMessage(null);
            setLoading(false);
            return;
          }
          if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 1500));
            continue;
          }
          if (data && data.error) {
            setErrorMessage(data.error.message || 'The analysis result could not be loaded.');
          } else {
            setErrorMessage('We could not load a completed analysis result. Please try again.');
          }
        } catch (err: any) {
          if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 1500));
            continue;
          }
          setErrorMessage(err?.message || 'We could not load the analysis result.');
        }
      }
      setLoading(false);
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

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <ErrorState
          title="Analysis Result Unavailable"
          message={errorMessage}
          userAction="Please retry the analysis to generate a fresh report."
          onRetry={() => router.push('/upload')}
        />
      </View>
    );
  }

  const res = result;

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
