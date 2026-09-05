import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app';

describe('request validation', () => {
  const app = buildApp();
  afterAll(() => app.close());

  it.each([
    ['/api/v1/sessions', { eventCode: 42 }, 'eventCode'],
    ['/api/v1/analyses', { sessionId: 'sess_test' }, 'questionnaire'],
    ['/api/v1/feedback', { sessionId: 'sess_test', analysisId: 'ana_test', contactEmail: 'invalid' }, 'contactEmail'],
  ])('returns actionable HTTP 400 errors for %s', async (url, payload, field) => {
    const response = await app.inject({ method: 'POST', url: url as string, payload });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: 'VALIDATION_ERROR',
        userAction: 'Please check your entries and submit again.',
        fields: expect.arrayContaining([expect.objectContaining({ path: field })]),
      },
    });
  });

  it('preserves HTTP 400 for malformed JSON', async () => {
    const response = await app.inject({
      method: 'POST', url: '/api/v1/analyses',
      headers: { 'content-type': 'application/json' }, payload: '{',
    });
    expect(response.statusCode).toBe(400);
  });
});
