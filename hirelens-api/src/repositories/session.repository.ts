import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';

export interface SessionRecord {
  id: string;
  eventCode: string | null;
  deviceHash: string | null;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired';
}

export class SessionRepository {
  private static supabase: SupabaseClient | null =
    config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY
      ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)
      : null;

  private static memoryStore = new Map<string, SessionRecord>();

  public static async create(session: SessionRecord): Promise<SessionRecord> {
    this.memoryStore.set(session.id, session);

    if (this.supabase) {
      try {
        await this.supabase.from('sessions').insert({
          id: session.id,
          event_code: session.eventCode,
          device_hash: session.deviceHash,
          created_at: session.createdAt,
          expires_at: session.expiresAt,
          status: session.status,
        });
      } catch (e) {
        // Fallback to memory store silently
      }
    }

    return session;
  }

  public static async findById(id: string): Promise<SessionRecord | null> {
    if (this.memoryStore.has(id)) {
      return this.memoryStore.get(id)!;
    }

    if (this.supabase) {
      try {
        const { data } = await this.supabase.from('sessions').select('*').eq('id', id).single();
        if (data) {
          const rec: SessionRecord = {
            id: data.id,
            eventCode: data.event_code,
            deviceHash: data.device_hash,
            createdAt: data.created_at,
            expiresAt: data.expires_at,
            status: data.status,
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
