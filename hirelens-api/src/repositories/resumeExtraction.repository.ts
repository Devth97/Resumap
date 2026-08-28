import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';

export interface ResumeExtractionRecord {
  id: string;
  sessionId: string;
  extractionMethod: 'pdf_text' | 'nvidia_ocr';
  pageCount: number;
  characterCount: number;
  extractionConfidence: number;
  redactedText: string;
  rawFileDeletedAt?: string;
  createdAt: string;
  expiresAt: string;
}

export class ResumeExtractionRepository {
  private static supabase: SupabaseClient | null =
    config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY
      ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)
      : null;

  private static memoryStore = new Map<string, ResumeExtractionRecord>();

  public static async save(record: ResumeExtractionRecord): Promise<ResumeExtractionRecord> {
    this.memoryStore.set(record.id, record);

    if (this.supabase) {
      try {
        const { error } = await this.supabase.from('resume_extractions').insert({
          id: record.id,
          session_id: record.sessionId,
          extraction_method: record.extractionMethod,
          page_count: record.pageCount,
          character_count: record.characterCount,
          extraction_confidence: record.extractionConfidence,
          redacted_text: record.redactedText,
          raw_file_deleted_at: record.rawFileDeletedAt,
          created_at: record.createdAt,
          expires_at: record.expiresAt,
        });

        // supabase-js returns errors instead of throwing — see
        // AnalysisRepository.save for why swallowing them is dangerous here.
        if (error) {
          console.error('[ResumeExtractionRepository.save] Supabase insert failed', {
            id: record.id,
            code: error.code,
            message: error.message,
            details: error.details,
          });
        }
      } catch (e) {
        console.error('[ResumeExtractionRepository.save] Supabase insert threw', record.id, e);
      }
    }

    return record;
  }

  public static async findById(id: string): Promise<ResumeExtractionRecord | null> {
    if (this.memoryStore.has(id)) {
      return this.memoryStore.get(id)!;
    }

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase.from('resume_extractions').select('*').eq('id', id).single();

        if (error && error.code !== 'PGRST116') {
          console.error('[ResumeExtractionRepository.findById] Supabase read failed', {
            id,
            code: error.code,
            message: error.message,
            details: error.details,
          });
        }

        if (data) {
          const rec: ResumeExtractionRecord = {
            id: data.id,
            sessionId: data.session_id,
            extractionMethod: data.extraction_method,
            pageCount: data.page_count,
            characterCount: data.character_count,
            extractionConfidence: Number(data.extraction_confidence ?? 0.9),
            redactedText: data.redacted_text,
            rawFileDeletedAt: data.raw_file_deleted_at,
            createdAt: data.created_at,
            expiresAt: data.expires_at,
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
