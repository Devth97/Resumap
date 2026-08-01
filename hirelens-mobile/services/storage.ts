import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SESSION_ID: 'hirelens_session_id',
  SELECTED_ROLE: 'hirelens_selected_role',
  RESUME_EXTRACTION: 'hirelens_resume_extraction',
  QUESTIONNAIRE_ANSWERS: 'hirelens_questionnaire_answers',
  UNLOCKED_ADVANCED_ROADMAP: 'hirelens_unlocked_roadmap_',
  ANALYSIS_RESULT: 'hirelens_analysis_result_',
};

export class StorageService {
  // Cache a completed analysis result so the results screen never depends on a
  // cross-instance server read-back.
  public static async setAnalysisResult(analysisId: string, result: any): Promise<void> {
    try {
      await AsyncStorage.setItem(`${KEYS.ANALYSIS_RESULT}${analysisId}`, JSON.stringify(result));
    } catch {}
  }

  public static async getAnalysisResult(analysisId: string): Promise<any | null> {
    try {
      const raw = await AsyncStorage.getItem(`${KEYS.ANALYSIS_RESULT}${analysisId}`);
      return raw ? JSON.parse(raw) : null;
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
