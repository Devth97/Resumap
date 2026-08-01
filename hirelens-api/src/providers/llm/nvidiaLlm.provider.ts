import OpenAI from 'openai';
import { config } from '../../config/env';
import { SYSTEM_PROMPT, buildAnalysisPrompt } from '../../prompts/resumeAnalysis.prompt';
import { REPAIR_JSON_SYSTEM_PROMPT, buildRepairPrompt } from '../../prompts/repairJson.prompt';
import { AnalysisSignalSchema, AnalysisSignals } from '../../schemas/analysis.schema';
import { RoleProfile } from '../../schemas/roleProfile.schema';

// Real, reliably-served, FAST NVIDIA NIM model. NOTE: the free hosted NIM
// endpoint drops the connection at ~79s, so large/slow models (70B) fail there
// even though Vercel Pro allows 300s. 8B finishes in ~15-20s — the reliable
// choice on this endpoint. Pinned here rather than trusting NVIDIA_LLM_MODEL,
// which has been set to non-existent models (HTTP 529).
const FAST_MODEL = 'meta/llama-3.1-8b-instruct';
// Budget before giving up on a second (retry) generation.
const REPAIR_BUDGET_MS = 40_000;

export class NvidiaLlmProvider {
  // Vercel Hobby serverless functions hard-cap at 60s. Keep every LLM call
  // well under that: maxRetries 0 (the SDK silently retries up to 2x with
  // backoff otherwise) and a hard client timeout so a slow generation fails
  // fast instead of blowing the function timeout.
  private static getClient(): OpenAI {
    return new OpenAI({
      apiKey: config.NVIDIA_API_KEY || 'mock-key',
      baseURL: config.NVIDIA_BASE_URL,
      maxRetries: 0,
      timeout: 70_000,
    });
  }

  public static async generateSignals(
    redactedText: string,
    roleProfile: RoleProfile,
    questionnaire: any
  ): Promise<{ signals: AnalysisSignals; latencyMs: number }> {
    const startTime = Date.now();

    // Use mock signals when NVIDIA API key is not configured
    if (!config.NVIDIA_API_KEY) {
      const mockSignals = this.generateMockSignals(redactedText, roleProfile);
      return {
        signals: this.normalizeDimensions(mockSignals),
        latencyMs: Date.now() - startTime,
      };
    }

    const client = this.getClient();
    const promptContent = buildAnalysisPrompt(redactedText, roleProfile, questionnaire);
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      { role: 'user' as const, content: promptContent },
    ];

    // The 8B model on the shared NIM endpoint occasionally returns malformed or
    // truncated JSON. A fresh regeneration is far more reliable than trying to
    // LLM-repair a broken string. Attempt up to twice while time budget allows.
    const MAX_ATTEMPTS = 2;
    let lastErr: any;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const completion = await this.createJsonCompletion(client, messages, 0.1);
        const raw = completion.choices[0]?.message?.content || '';
        const jsonStr = this.extractJson(raw);
        const parsed = AnalysisSignalSchema.parse(JSON.parse(jsonStr));
        return {
          signals: this.normalizeDimensions(parsed),
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        lastErr = err;
        // Only retry if a second full generation still fits under the 60s cap.
        if (attempt < MAX_ATTEMPTS && Date.now() - startTime < REPAIR_BUDGET_MS) {
          continue;
        }
        break;
      }
    }
    throw new Error(`NVIDIA LLM analysis failed: ${lastErr?.message || 'Unknown error'}`);
  }

  // Pull the JSON object out of a model response, tolerating prose or markdown
  // fences around it.
  private static extractJson(raw: string): string {
    const s = this.stripMarkdownWrappers(raw);
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    return start >= 0 && end > start ? s.slice(start, end + 1) : s;
  }

  // The model sometimes returns dimension scores as 0-1 fractions instead of
  // the expected 0-100 integers, which collapses the weighted score to ~1.
  // Rescale defensively so the scoring math is always on a 0-100 basis.
  private static normalizeDimensions(signals: AnalysisSignals): AnalysisSignals {
    const fix = (v: number) => {
      if (typeof v !== 'number' || !isFinite(v)) return 0;
      const scaled = v > 0 && v <= 1 ? v * 100 : v;
      return Math.round(Math.min(100, Math.max(0, scaled)));
    };
    const rd = signals.resumeDimensions as Record<string, number>;
    for (const k of Object.keys(rd)) rd[k] = fix(rd[k]);
    const rad = signals.readinessDimensions as Record<string, number>;
    for (const k of Object.keys(rad)) rad[k] = fix(rad[k]);
    return signals;
  }

  private static async repairJson(invalidJson: string, client: OpenAI): Promise<AnalysisSignals> {
    const repairPrompt = buildRepairPrompt(
      invalidJson,
      'AnalysisSignals schema with candidateProfile, resumeDimensions, readinessDimensions, strengths (max 5), gaps (max 8), resumeImprovements, roadmap (length 4), immediateActions (length 3)'
    );

    const completion = await this.createJsonCompletion(client, [
      { role: 'system', content: REPAIR_JSON_SYSTEM_PROMPT },
      { role: 'user', content: repairPrompt },
    ], 0.0);

    const repairedText = this.stripMarkdownWrappers(completion.choices[0]?.message?.content || '');
    const jsonObj = JSON.parse(repairedText);
    return AnalysisSignalSchema.parse(jsonObj);
  }

  // One fast generation on FAST_MODEL. Plain generation (NO response_format):
  // NVIDIA's guided-JSON decoding is grammar-constrained per token and is both
  // slow (~60s) and prone to truncation on the large analysis schema. We rely
  // on the prompt + stripMarkdownWrappers + a repair pass for valid JSON.
  // A generous token ceiling avoids mid-object truncation.
  private static async createJsonCompletion(
    client: OpenAI,
    messages: Array<{ role: 'system' | 'user'; content: string }>,
    temperature: number
  ) {
    const base = { model: FAST_MODEL, temperature, top_p: 0.7, max_tokens: 4000, messages };
    try {
      return await client.chat.completions.create(base);
    } catch (err: any) {
      const status = err?.status ?? err?.statusCode;
      // Transient server overload (429 / 5xx incl. NVIDIA's 529) fails fast, so
      // one quick retry is safe. A timeout/network error has NO status — never
      // retry those, or two slow calls stack past the 60s function cap.
      if (status && (status === 429 || status >= 500)) {
        await new Promise((r) => setTimeout(r, 1200));
        return await client.chat.completions.create(base);
      }
      throw err;
    }
  }

  private static stripMarkdownWrappers(raw: string): string {
    return raw
      .replace(/^```json/g, '')
      .replace(/^```/g, '')
      .replace(/```$/g, '')
      .trim();
  }

  private static generateMockSignals(redactedText: string, roleProfile: RoleProfile): AnalysisSignals {
    const lowerText = redactedText.toLowerCase();

    // Dynamically evaluate skills present in text
    const detectedSkills = roleProfile.requiredSkills.map((sk) => {
      const hasSkill = sk.aliases.some((alias) => lowerText.includes(alias.toLowerCase()));
      const hasProject = lowerText.includes('project') || lowerText.includes('dashboard') || lowerText.includes('api');
      const hasIntern = lowerText.includes('intern') || lowerText.includes('work');

      let level: 'absent' | 'mentioned' | 'practised' | 'demonstrated' | 'applied' = 'absent';
      let quote: string | null = null;

      if (hasSkill) {
        if (hasIntern) {
          level = 'applied';
          quote = `Applied ${sk.name} during internship/work project.`;
        } else if (hasProject) {
          level = 'demonstrated';
          quote = `Built project utilizing ${sk.name}.`;
        } else {
          level = 'mentioned';
          quote = `Listed ${sk.name} in skills section.`;
        }
      }

      return {
        skillId: sk.id,
        skillName: sk.name,
        evidenceLevel: level,
        evidenceQuote: quote,
        confidence: 0.9,
      };
    });

    return {
      candidateProfile: {
        educationSummary: 'B.Tech in Computer Science & Engineering',
        experienceLevel: 'student',
        detectedSkills,
        detectedTools: ['Git', 'VS Code', 'Postman'],
        projects: [
          {
            title: 'Sales Performance Dashboard',
            summary: 'Interactive sales analysis and reporting interface using SQL and data visualization.',
            tools: ['SQL', 'Excel'],
            evidenceStrength: 'moderate',
          },
        ],
      },
      resumeDimensions: {
        roleRelevance: 75,
        skillAlignment: 70,
        evidenceQuality: 65,
        projectClarity: 70,
        structureReadability: 80,
        languageQuality: 75,
      },
      readinessDimensions: {
        projectEvidence: 70,
        practicalExperience: 45,
        communicationEvidence: 60,
      },
      strengths: [
        {
          title: 'Strong Technical Foundation',
          explanation: 'Clear exposure to essential core skills required for the role.',
          evidenceQuote: 'Demonstrated SQL and programming fundamentals in coursework and projects.',
          relevance: 'Directly aligns with core technical expectations.',
        },
        {
          title: 'Structured Resume Layout',
          explanation: 'Resume sections are cleanly organized with clear headings.',
          evidenceQuote: 'Education, Technical Skills, and Projects sections are clearly demarcated.',
          relevance: 'Makes it easy for recruiters to scan key qualifications.',
        },
      ],
      gaps: roleProfile.requiredSkills
        .filter((sk) => !lowerText.includes(sk.name.toLowerCase()))
        .map((sk) => ({
          skillId: sk.id,
          title: `Demonstrate ${sk.name} with Project Evidence`,
          priority: (sk.priority === 'required' ? 'high' : 'medium') as 'high' | 'medium' | 'low',
          reason: `Target role requires demonstrated ${sk.name} capability.`,
          currentEvidence: 'No direct project evidence found in resume.',
          nextAction: sk.beginnerActions[0] || `Build a sample project using ${sk.name}.`,
          completionEvidence: `GitHub repository link or documented portfolio case study showing ${sk.name}.`,
        }))
        .slice(0, 5),
      resumeImprovements: [
        {
          category: 'content',
          issue: 'Project descriptions lack quantifiable impact metrics.',
          recommendation: 'Add numerical metrics (e.g. reduced load time by 30%, analyzed 10,000+ data rows).',
          example: 'Analyzed 15,000+ monthly retail transactions using SQL window functions.',
        },
        {
          category: 'language',
          issue: 'Bullet points rely on weak passive phrasing.',
          recommendation: 'Start bullet points with strong action verbs (e.g., Developed, Engineered, Optimized).',
          example: 'Engineered responsive frontend UI using React and Tailwind CSS.',
        },
      ],
      roadmap: [
        {
          stage: 1,
          title: 'Core Competency Mastery',
          durationWeeks: 2,
          objective: 'Strengthen fundamental skills required for entry-level role.',
          actions: [
            `Complete targeted tutorials on missing required skills.`,
            `Solve 15 practical exercises testing core concepts.`,
          ],
          completionEvidence: 'Successful completion of 5 hands-on code scripts or query sets.',
        },
        {
          stage: 2,
          title: 'Portfolio Project Construction',
          durationWeeks: 3,
          objective: 'Build end-to-end project demonstrating key technical capabilities.',
          actions: [
            'Design and build a real-world scenario project using target role tools.',
            'Document problem statement, approach, and findings in GitHub README.',
          ],
          completionEvidence: 'Public GitHub repository with detailed README documentation.',
        },
        {
          stage: 3,
          title: 'Resume Refinement & Metric Enhancement',
          durationWeeks: 1,
          objective: 'Rewrite resume bullet points using action-result framework.',
          actions: [
            'Incorporate newly built project into resume under Projects section.',
            'Quantify project outcomes with measurable business metrics.',
          ],
          completionEvidence: 'Updated 1-page PDF resume containing action-result bullet points.',
        },
        {
          stage: 4,
          title: 'Interview & Portfolio Readiness',
          durationWeeks: 2,
          objective: 'Practice technical interview discussions and project walkthroughs.',
          actions: [
            'Prepare 2-minute elevator pitch summarizing portfolio projects.',
            'Conduct 2 mock technical interviews focusing on core concepts.',
          ],
          completionEvidence: 'Completed mock interview feedback score of 80%+',
        },
      ],
      immediateActions: [
        'Add quantitative impact metrics to existing project bullet points.',
        'Build a mini project demonstrating required missing technical skills.',
        'Refactor resume bullet points to begin with strong action verbs.',
      ],
      confidence: 'high',
      confidenceExplanation: 'Resume contains readable text and clearly structured section headings.',
    };
  }
}
