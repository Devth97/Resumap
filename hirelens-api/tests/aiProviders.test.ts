import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SEEDED_ROLE_PROFILES } from '../src/services/roleProfile.service';

describe('AI providers', () => {
  const originalNvidiaApiKey = process.env.NVIDIA_API_KEY;
  const originalGroqApiKey = process.env.GROQ_API_KEY;

  beforeEach(() => {
    vi.resetModules();
    delete process.env.NVIDIA_API_KEY;
    delete process.env.GROQ_API_KEY;
  });

  afterEach(() => {
    if (originalNvidiaApiKey) {
      process.env.NVIDIA_API_KEY = originalNvidiaApiKey;
    } else {
      delete process.env.NVIDIA_API_KEY;
    }
    if (originalGroqApiKey) {
      process.env.GROQ_API_KEY = originalGroqApiKey;
    } else {
      delete process.env.GROQ_API_KEY;
    }
  });

  it('returns a clear error for OCR when no NVIDIA API key is configured', async () => {
    const { NvidiaOcrProvider } = await import('../src/providers/ocr/nvidiaOcr.provider');

    const result = await NvidiaOcrProvider.processImages([Buffer.from('sample resume text')]);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/NVIDIA API key/i);
  });

  it('returns mock signals for LLM analysis when no Groq API key is configured', async () => {
    const { GroqLlmProvider } = await import('../src/providers/llm/groqLlm.provider');

    const result = await GroqLlmProvider.generateSignals('Sample resume text', SEEDED_ROLE_PROFILES[0], {});

    expect(result).toBeDefined();
    expect(result.signals).toBeDefined();
    expect(result.signals.candidateProfile).toBeDefined();
    expect(result.signals.candidateProfile.educationSummary).toBe('B.Tech in Computer Science & Engineering');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });
});
