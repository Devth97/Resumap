import OpenAI from 'openai';
import { config } from '../../config/env';
import { SYSTEM_PROMPT, buildAnalysisPrompt } from '../../prompts/resumeAnalysis.prompt';
import { REPAIR_JSON_SYSTEM_PROMPT, buildRepairPrompt } from '../../prompts/repairJson.prompt';
import { AnalysisSignalSchema, AnalysisSignals } from '../../schemas/analysis.schema';
import { RoleProfile } from '../../schemas/roleProfile.schema';

// Real, reliably-served NVIDIA NIM model that returns structured JSON well and
// finishes inside Vercel's 60s cap. We pin a known-good model here rather than
// trusting the NVIDIA_LLM_MODEL env var, which has been set to non-existent /
// slow models (returning HTTP 529 "overloaded" or blowing the function cap).
const FAST_MODEL = 'meta/llama-3.3-70b-instruct';
// Only attempt the extra JSON-repair round-trip if we still have budget under
// the 60s function cap; otherwise fail cleanly instead of timing out.
const REPAIR_BUDGET_MS = 35_000;

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
      timeout: 45_000,
    });
  }

  public static async generateSignals(
    redactedText: string,
    roleProfile: RoleProfile,
    questionnaire: any
  ): Promise<{ signals: AnalysisSignals; latencyMs: number }> {
    const startTime = Date.now();

    if (!config.NVIDIA_API_KEY) {
      throw new Error('NVIDIA API key is not configured. Set NVIDIA_API_KEY to enable real AI analysis.');
    }

    const client = this.getClient();
    const promptContent = buildAnalysisPrompt(redactedText, roleProfile, questionnaire);

    try {
      // Single fast generation, no retry — retries/slow fallbacks stack up and
      // blow the 60s function cap. Full max_tokens so the (large) analysis JSON
      // is never truncated, and JSON mode so it parses on the first try.
      const completion = await this.createJsonCompletion(client, [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: promptContent },
      ], 0.1);

      const rawResponse = completion.choices[0]?.message?.content || '';
      const cleanJson = this.stripMarkdownWrappers(rawResponse);

      let parsedSignals: AnalysisSignals;

      try {
        const jsonObj = JSON.parse(cleanJson);
        parsedSignals = AnalysisSignalSchema.parse(jsonObj);
      } catch (firstErr) {
        // One repair round-trip, but only if we still have time budget.
        if (Date.now() - startTime > REPAIR_BUDGET_MS) {
          throw firstErr;
        }
        parsedSignals = await this.repairJson(cleanJson, client);
      }

      return {
        signals: parsedSignals,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      throw new Error(`NVIDIA LLM analysis failed: ${err?.message || 'Unknown error'}`);
    }
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

  // One fast generation on FAST_MODEL. Requests strict JSON mode for reliable
  // parsing, but transparently retries once without it if the model/endpoint
  // rejects the response_format param (some NIM models don't support it).
  private static async createJsonCompletion(
    client: OpenAI,
    messages: Array<{ role: 'system' | 'user'; content: string }>,
    temperature: number
  ) {
    const base = { model: FAST_MODEL, temperature, top_p: 0.7, max_tokens: 4000, messages };
    const attempt = (useJson: boolean) =>
      client.chat.completions.create(
        useJson ? ({ ...base, response_format: { type: 'json_object' } } as any) : base
      );
    try {
      return await attempt(true);
    } catch (err: any) {
      const status = err?.status ?? err?.statusCode;
      // Transient overload (429/5xx incl. NVIDIA's 529): brief backoff, retry.
      if (!status || status === 429 || status >= 500) {
        await new Promise((r) => setTimeout(r, 1500));
      }
      // Retry without JSON mode (also covers models that reject response_format).
      return await attempt(false);
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
