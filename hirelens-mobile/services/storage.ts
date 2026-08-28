import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SESSION_ID: 'hirelens_session_id',
  SELECTED_ROLE: 'hirelens_selected_role',
  RESUME_EXTRACTION: 'hirelens_resume_extraction',
  QUESTIONNAIRE_ANSWERS: 'hirelens_questionnaire_answers',
  UNLOCKED_ADVANCED_ROADMAP: 'hirelens_unlocked_roadmap_',
  ANALYSIS_RESULT: 'hirelens_analysis_result_',
};

// Results are also held in memory for the life of the app process. An analysis
// result carries the full resume text and roadmap, so the AsyncStorage write
// can fail on a device that is low on space or over the SQLite row limit — and
// that failure is not something the user should ever feel, because it would
// drop them onto the polling path and a 404 from a cold serverless instance.
const analysisResultMemoryCache = new Map<string, any>();

export class StorageService {
  // Cache a completed analysis result so the results screen never depends on a
  // cross-instance server read-back.
  public static async setAnalysisResult(analysisId: string, result: any): Promise<void> {
    analysisResultMemoryCache.set(analysisId, result);
    try {
      await AsyncStorage.setItem(`${KEYS.ANALYSIS_RESULT}${analysisId}`, JSON.stringify(result));
    } catch (e) {
      // Non-fatal: the in-memory copy above still serves this session.
      console.warn('[StorageService] Failed to persist analysis result', analysisId, e);
    }
  }

  public static async getAnalysisResult(analysisId: string): Promise<any | null> {
    const inMemory = analysisResultMemoryCache.get(analysisId);
    if (inMemory) {
      return inMemory;
    }

    try {
      const raw = await AsyncStorage.getItem(`${KEYS.ANALYSIS_RESULT}${analysisId}`);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      analysisResultMemoryCache.set(analysisId, parsed);
      return parsed;
    } catch {
      return null;
    }
  }

  public static async getSessionId(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.SESSION_ID);
  }

  public static async setSessionId(id: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.SESSION_ID, id);
  }

  public static async getSelectedRole(): Promise<any | null> {
    const raw = await AsyncStorage.getItem(KEYS.SELECTED_ROLE);
    return raw ? JSON.parse(raw) : null;
  }

  public static async setSelectedRole(role: any): Promise<void> {
    await AsyncStorage.setItem(KEYS.SELECTED_ROLE, JSON.stringify(role));
  }

  public static async getResumeExtraction(): Promise<any | null> {
    const raw = await AsyncStorage.getItem(KEYS.RESUME_EXTRACTION);
    return raw ? JSON.parse(raw) : null;
  }

  public static async setResumeExtraction(data: any): Promise<void> {
    await AsyncStorage.setItem(KEYS.RESUME_EXTRACTION, JSON.stringify(data));
  }

  public static async getQuestionnaire(): Promise<any | null> {
    const raw = await AsyncStorage.getItem(KEYS.QUESTIONNAIRE_ANSWERS);
    return raw ? JSON.parse(raw) : null;
  }

  public static async setQuestionnaire(answers: any): Promise<void> {
    await AsyncStorage.setItem(KEYS.QUESTIONNAIRE_ANSWERS, JSON.stringify(answers));
  }

  public static async isRoadmapUnlocked(analysisId: string): Promise<boolean> {
    const val = await AsyncStorage.getItem(`${KEYS.UNLOCKED_ADVANCED_ROADMAP}${analysisId}`);
    return val === 'true';
  }

  public static async setRoadmapUnlocked(analysisId: string): Promise<void> {
    await AsyncStorage.setItem(`${KEYS.UNLOCKED_ADVANCED_ROADMAP}${analysisId}`, 'true');
  }

  public static async clearFlowState(): Promise<void> {
    await AsyncStorage.multiRemove([
      KEYS.SELECTED_ROLE,
      KEYS.RESUME_EXTRACTION,
      KEYS.QUESTIONNAIRE_ANSWERS,
    ]);
  }
}
