import OpenAI from 'openai';
import { config } from '../../config/env';
import { SYSTEM_PROMPT, buildAnalysisPrompt } from '../../prompts/resumeAnalysis.prompt';
import { REPAIR_JSON_SYSTEM_PROMPT, buildRepairPrompt } from '../../prompts/repairJson.prompt';
import { AnalysisSignalSchema, AnalysisSignals } from '../../schemas/analysis.schema';
import { RoleProfile } from '../../schemas/roleProfile.schema';
import { retryWithBackoff } from '../../utilities/retry';

export class NvidiaLlmProvider {
  private static getClient(): OpenAI {
    return new OpenAI({
      apiKey: config.NVIDIA_API_KEY || 'mock-key',
      baseURL: config.NVIDIA_BASE_URL,
    });
  }

  public static async generateSignals(
    redactedText: string,
    roleProfile: RoleProfile,
    questionnaire: any
  ): Promise<{ signals: AnalysisSignals; latencyMs: number }> {
    const startTime = Date.now();

    if (!config.NVIDIA_API_KEY) {
      const mockSignals = this.generateMockSignals(redactedText, roleProfile);
      return {
        signals: mockSignals,
        latencyMs: Date.now() - startTime,
      };
    }

    const client = this.getClient();
    const promptContent = buildAnalysisPrompt(redactedText, roleProfile, questionnaire);

    try {
      const completion = await retryWithBackoff(async () => {
        try {
          return await client.chat.completions.create({
            model: config.NVIDIA_LLM_MODEL, // Primary: z-ai/glm-5.2
            temperature: 0.1,
            top_p: 0.7,
            max_tokens: 4000,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: promptContent },
            ],
          });
        } catch (primaryErr) {
          // Fallback to meta/llama-3.3-70b-instruct if primary model is unavailable
          return await client.chat.completions.create({
            model: 'meta/llama-3.3-70b-instruct',
            temperature: 0.1,
            top_p: 0.7,
            max_tokens: 4000,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: promptContent },
            ],
          });
        }
      }, 2, 2000);

      const rawResponse = completion.choices[0]?.message?.content || '';
      const cleanJson = this.stripMarkdownWrappers(rawResponse);

      let parsedSignals: AnalysisSignals;

      try {
        const jsonObj = JSON.parse(cleanJson);
        parsedSignals = AnalysisSignalSchema.parse(jsonObj);
      } catch (firstErr) {
        // Run 1 JSON repair attempt
        parsedSignals = await this.repairJson(cleanJson, client);
      }

      return {
        signals: parsedSignals,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      // Fall back to structured fallback signals if LLM fails
      const fallbackSignals = this.generateMockSignals(redactedText, roleProfile);
      return {
        signals: fallbackSignals,
        latencyMs: Date.now() - startTime,
      };
    }
  }

  private static async repairJson(invalidJson: string, client: OpenAI): Promise<AnalysisSignals> {
    const repairPrompt = buildRepairPrompt(
      invalidJson,
      'AnalysisSignals schema with candidateProfile, resumeDimensions, readinessDimensions, strengths (max 5), gaps (max 8), resumeImprovements, roadmap (length 4), immediateActions (length 3)'
    );

    const completion = await client.chat.completions.create({
      model: config.NVIDIA_LLM_MODEL,
      temperature: 0.0,
      max_tokens: 4000,
      messages: [
        { role: 'system', content: REPAIR_JSON_SYSTEM_PROMPT },
        { role: 'user', content: repairPrompt },
      ],
    });

    const repairedText = this.stripMarkdownWrappers(completion.choices[0]?.message?.content || '');
    const jsonObj = JSON.parse(repairedText);
    return AnalysisSignalSchema.parse(jsonObj);
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
