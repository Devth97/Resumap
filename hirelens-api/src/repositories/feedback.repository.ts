import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';

export interface FeedbackRecord {
  id: string;
  sessionId: string;
  analysisId: string;
  accuracyRating?: number;
  roadmapUseful?: string;
  mostUsefulSection?: string;
  comments?: string;
  wouldUseAgain?: string;
  contactEmail?: string | null;
  contactConsent: boolean;
  createdAt: string;
}

export class FeedbackRepository {
  private static supabase: SupabaseClient | null =
    config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY
      ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)
      : null;

  private static memoryStore = new Map<string, FeedbackRecord>();

  public static async save(record: FeedbackRecord): Promise<FeedbackRecord> {
    this.memoryStore.set(record.id, record);

    if (this.supabase) {
      try {
        await this.supabase.from('feedback').insert({
          id: record.id,
          session_id: record.sessionId,
          analysis_id: record.analysisId,
          accuracy_rating: record.accuracyRating,
          roadmap_useful: record.roadmapUseful,
          most_useful_section: record.mostUsefulSection,
          comments: record.comments,
          would_use_again: record.wouldUseAgain,
          contact_email: record.contactEmail,
          contact_consent: record.contactConsent,
          created_at: record.createdAt,
        });
      } catch (e) {
        // memory fallback
      }
    }

    return record;
  }
}
