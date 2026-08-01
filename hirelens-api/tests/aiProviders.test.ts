import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SEEDED_ROLE_PROFILES } from '../src/services/roleProfile.service';

describe('AI providers', () => {
  const originalApiKey = process.env.NVIDIA_API_KEY;

  beforeEach(() => {
    vi.resetModules();
    delete process.env.NVIDIA_API_KEY;
  });

  afterEach(() => {
    if (originalApiKey) {
      process.env.NVIDIA_API_KEY = originalApiKey;
    } else {
      delete process.env.NVIDIA_API_KEY;
    }
  });

  it('returns a clear error for OCR when no NVIDIA API key is configured', async () => {
    const { NvidiaOcrProvider } = await import('../src/providers/ocr/nvidiaOcr.provider');

    const result = await NvidiaOcrProvider.processImages([Buffer.from('sample resume text')]);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/NVIDIA API key/i);
  });

  it('returns mock signals for LLM analysis when no NVIDIA API key is configured', async () => {
    const { NvidiaLlmProvider } = await import('../src/providers/llm/nvidiaLlm.provider');

    const result = await NvidiaLlmProvider.generateSignals('Sample resume text', SEEDED_ROLE_PROFILES[0], {});

    expect(result).toBeDefined();
    expect(result.signals).toBeDefined();
    expect(result.signals.candidateProfile).toBeDefined();
    expect(result.signals.candidateProfile.educationSummary).toBe('B.Tech in Computer Science & Engineering');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });
});
