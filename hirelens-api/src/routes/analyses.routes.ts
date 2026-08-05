import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ResumeExtractionRepository } from '../repositories/resumeExtraction.repository';
import { RoleProfileService } from '../services/roleProfile.service';
import { GroqLlmProvider, FAST_MODEL } from '../providers/llm/groqLlm.provider';
import { ScoringService } from '../services/scoring.service';
import { AnalysisRepository, AnalysisRecord } from '../repositories/analysis.repository';
import { QuestionnaireSchema } from '../schemas/analysis.schema';
import { CONSTANTS } from '../config/constants';
import { config } from '../config/env';
import { cryptoRandomString } from '../utilities/hashing';

const createAnalysisSchema = z.object({
  sessionId: z.string(),
  resumeId: z.string(),
  roleId: z.string(),
  roleTitle: z.string().optional(),
  redactedText: z.string().optional(),
  questionnaire: QuestionnaireSchema,
});

export async function analysisRoutes(fastify: FastifyInstance) {
  fastify.post('/analyses', async (request, reply) => {
    const body = createAnalysisSchema.parse(request.body);

    // Look up the stored extraction; if the record isn't visible on this
    // serverless instance (cross-instance / Supabase read miss), fall back to
    // the redacted text the client passed through from the upload step.
    let extraction: any = await ResumeExtractionRepository.findById(body.resumeId);
    if (!extraction && body.redactedText && body.redactedText.trim().length > 0) {
      extraction = { id: body.resumeId, redactedText: body.redactedText };
    }
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

    // Run analysis SYNCHRONOUSLY within this request. Vercel's serverless
    // functions freeze/terminate immediately after the response is sent, so a
    // fire-and-forget process.nextTick() never runs to completion — the record
    // would stay stuck at 'processing' forever. Awaiting here guarantees the
    // NVIDIA LLM call actually runs before we respond.
    try {
      const { signals, latencyMs } = await GroqLlmProvider.generateSignals(
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
          // Include raw resume text for ATS resume generation
          rawResumeText: extraction.redactedText,
        };

      record.analysisSignalsJson = signals;
      record.resultJson = resultJson;
      record.resumeQualityScore = scoreResult.resumeQualityScore;
      record.jobReadinessScore = scoreResult.jobReadinessScore;
      record.confidence = signals.confidence;
      record.status = 'completed';
      record.providerModel = config.GROQ_API_KEY ? FAST_MODEL : 'unconfigured';
      record.providerLatencyMs = latencyMs;
      record.completedAt = new Date().toISOString();

      await AnalysisRepository.save(record);

      // Return the full result inline. The analysis is synchronous, so the
      // client can use this immediately and never depends on a cross-instance
      // read-back (serverless instances don't share the in-memory store, and a
      // just-written Supabase row can briefly be unreadable elsewhere).
      return reply.status(201).send({
        analysisId: record.id,
        status: 'completed',
        result: resultJson,
      });
    } catch (err: any) {
      record.status = 'failed';
      record.errorCode = CONSTANTS.ERROR_CODES.ANALYSIS_RESPONSE_INVALID;
      await AnalysisRepository.save(record);

      return reply.status(500).send({
        error: {
          code: record.errorCode,
          message: 'Analysis failed to complete.',
          userAction: 'Please retry the analysis.',
          detail: String(err?.message || err).slice(0, 800),
        },
      });
    }
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
