import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';

export interface AnalysisRecord {
  id: string;
  sessionId: string;
  resumeExtractionId: string;
  roleId: string;
  roleVersion: string;
  questionnaireJson: any;
  analysisSignalsJson?: any;
  resultJson?: any;
  resumeQualityScore?: number;
  jobReadinessScore?: number;
  confidence?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  stage?: string;
  errorCode?: string;
  providerModel?: string;
  providerLatencyMs?: number;
  createdAt: string;
  completedAt?: string;
}

export class AnalysisRepository {
  private static supabase: SupabaseClient | null =
    config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY
      ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)
      : null;

  private static memoryStore = new Map<string, AnalysisRecord>();

  public static async save(record: AnalysisRecord): Promise<AnalysisRecord> {
    this.memoryStore.set(record.id, record);

    if (this.supabase) {
      try {
        await this.supabase.from('analyses').upsert({
          id: record.id,
          session_id: record.sessionId,
          resume_extraction_id: record.resumeExtractionId,
          role_id: record.roleId,
          role_version: record.roleVersion,
          questionnaire_json: record.questionnaireJson,
          analysis_signals_json: record.analysisSignalsJson,
          result_json: record.resultJson,
          resume_quality_score: record.resumeQualityScore,
          job_readiness_score: record.jobReadinessScore,
          confidence: record.confidence,
          status: record.status,
          error_code: record.errorCode,
          provider_model: record.providerModel,
          provider_latency_ms: record.providerLatencyMs,
          created_at: record.createdAt,
          completed_at: record.completedAt,
        });
      } catch (e) {
        // memory fallback
      }
    }

    return record;
  }

  public static async findById(id: string): Promise<AnalysisRecord | null> {
    if (this.memoryStore.has(id)) {
      return this.memoryStore.get(id)!;
    }

    if (this.supabase) {
      try {
        const { data } = await this.supabase.from('analyses').select('*').eq('id', id).single();
        if (data) {
          const rec: AnalysisRecord = {
            id: data.id,
            sessionId: data.session_id,
            resumeExtractionId: data.resume_extraction_id,
            roleId: data.role_id,
            roleVersion: data.role_version,
            questionnaireJson: data.questionnaire_json,
            analysisSignalsJson: data.analysis_signals_json,
            resultJson: data.result_json,
            resumeQualityScore: data.resume_quality_score,
            jobReadinessScore: data.job_readiness_score,
            confidence: data.confidence,
            status: data.status,
            errorCode: data.error_code,
            providerModel: data.provider_model,
            providerLatencyMs: data.provider_latency_ms,
            createdAt: data.created_at,
            completedAt: data.completed_at,
          };
          this.memoryStore.set(rec.id, rec);
          return rec;
        }
      } catch (e) {
        return null;
      }
    }

    return null;
  }
}
