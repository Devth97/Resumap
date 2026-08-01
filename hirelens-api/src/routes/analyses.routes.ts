import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ResumeExtractionRepository } from '../repositories/resumeExtraction.repository';
import { RoleProfileService } from '../services/roleProfile.service';
import { NvidiaLlmProvider } from '../providers/llm/nvidiaLlm.provider';
import { ScoringService } from '../services/scoring.service';
import { AnalysisRepository, AnalysisRecord } from '../repositories/analysis.repository';
import { QuestionnaireSchema } from '../schemas/analysis.schema';
import { CONSTANTS } from '../config/constants';
import { cryptoRandomString } from '../utilities/hashing';

const createAnalysisSchema = z.object({
  sessionId: z.string(),
  resumeId: z.string(),
  roleId: z.string(),
  roleTitle: z.string().optional(),
  questionnaire: QuestionnaireSchema,
});

export async function analysisRoutes(fastify: FastifyInstance) {
  fastify.post('/analyses', async (request, reply) => {
    const body = createAnalysisSchema.parse(request.body);

    const extraction = await ResumeExtractionRepository.findById(body.resumeId);
    if (!extraction) {
      return reply.status(404).send({
        error: {
          code: CONSTANTS.ERROR_CODES.RESUME_TEXT_INSUFFICIENT,
          message: 'Resume extraction record not found or expired.',
          userAction: 'Please re-upload your resume.',
        },
      });
    }

    // Use a seeded role profile when available; otherwise synthesize a generic
    // profile for the user's custom / self-specified target role.
    const roleProfile =
      RoleProfileService.getRoleById(body.roleId) ||
      RoleProfileService.buildCustomRole(body.roleId, body.roleTitle || body.roleId);

    const analysisId = `ana_${cryptoRandomString(16)}`;
    const now = new Date().toISOString();

    const record: AnalysisRecord = {
      id: analysisId,
      sessionId: body.sessionId,
      resumeExtractionId: body.resumeId,
      roleId: roleProfile.id,
      roleVersion: roleProfile.version,
      questionnaireJson: body.questionnaire,
      status: 'processing',
      stage: 'evaluating_competencies',
      createdAt: now,
    };

    await AnalysisRepository.save(record);

    // Run async analysis calculation
    process.nextTick(async () => {
      try {
        const { signals, latencyMs } = await NvidiaLlmProvider.generateSignals(
          extraction.redactedText,
          roleProfile,
          body.questionnaire
        );

        const scoreResult = ScoringService.calculateScores(signals, roleProfile, body.questionnaire);

        const resultJson = {
          targetRoleName: roleProfile.title,
          resumeQualityScore: scoreResult.resumeQualityScore,
          jobReadinessScore: scoreResult.jobReadinessScore,
          resumeScoreLabel: scoreResult.resumeScoreLabel,
          readinessLabel: scoreResult.readinessLabel,
          requiredSkillCoverage: scoreResult.requiredSkillCoverage,
          dimensionBreakdown: scoreResult.dimensionBreakdown,
          candidateProfile: signals.candidateProfile,
          strengths: signals.strengths,
          gaps: signals.gaps,
          resumeImprovements: signals.resumeImprovements,
          roadmap: signals.roadmap,
          immediateActions: signals.immediateActions,
          confidence: signals.confidence,
          confidenceExplanation: signals.confidenceExplanation,
          disclaimer: 'This AI career analysis is tailored guidance for student readiness and does not guarantee employment, interviews, or selection.',
        };

        record.analysisSignalsJson = signals;
        record.resultJson = resultJson;
        record.resumeQualityScore = scoreResult.resumeQualityScore;
        record.jobReadinessScore = scoreResult.jobReadinessScore;
        record.confidence = signals.confidence;
        record.status = 'completed';
        record.providerModel = 'meta/llama-3.3-70b-instruct';
        record.providerLatencyMs = latencyMs;
        record.completedAt = new Date().toISOString();

        await AnalysisRepository.save(record);
      } catch (err: any) {
        record.status = 'failed';
        record.errorCode = CONSTANTS.ERROR_CODES.ANALYSIS_RESPONSE_INVALID;
        await AnalysisRepository.save(record);
      }
    });

    return reply.status(202).send({
      analysisId: record.id,
      status: 'processing',
    });
  });

  fastify.get('/analyses/:analysisId', async (request, reply) => {
    const { analysisId } = request.params as { analysisId: string };
    const record = await AnalysisRepository.findById(analysisId);

    if (!record) {
      return reply.status(404).send({
        error: {
          code: CONSTANTS.ERROR_CODES.ANALYSIS_RESPONSE_INVALID,
          message: 'Analysis record not found.',
          userAction: 'Please start a new analysis session.',
        },
      });
    }

    if (record.status === 'processing' || record.status === 'queued') {
      return reply.send({
        analysisId: record.id,
        status: 'processing',
        stage: record.stage || 'evaluating_competencies',
      });
    }

    if (record.status === 'failed') {
      return reply.status(500).send({
        error: {
          code: record.errorCode || CONSTANTS.ERROR_CODES.INTERNAL_ERROR,
          message: 'Analysis failed to complete cleanly.',
          userAction: 'Please retry the analysis.',
        },
      });
    }

    return reply.send({
      analysisId: record.id,
      status: 'completed',
      result: record.resultJson,
    });
  });
}
