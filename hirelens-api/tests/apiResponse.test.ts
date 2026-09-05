import { describe, expect, it } from 'vitest';
import { readApiResponse } from '../../hirelens-mobile/services/apiResponse';

describe('app API response handling', () => {
  it('returns successful JSON responses unchanged', async () => {
    const result = { analysisId: 'ana_test', status: 'completed', result: { resumeQualityScore: 75 } };
    await expect(readApiResponse(new Response(JSON.stringify(result), { status: 201 }))).resolves.toEqual(result);
  });

  it.each([
    [{ detail: 'Provider unavailable', message: 'Analysis failed' }, 'Provider unavailable'],
    [{ message: 'Invalid questionnaire' }, 'Invalid questionnaire'],
    [{ detail: { unexpected: true }, message: 'Upload failed' }, 'Upload failed'],
  ])('preserves useful API errors: %j', async (error, expected) => {
    await expect(readApiResponse(new Response(JSON.stringify({ error }), { status: 400 }))).rejects.toThrow(expected);
  });

  it.each([
    [502, '<html><body>Bad Gateway</body></html>'],
    [504, 'Function timed out'],
    [503, ''],
    [500, '{'],
    [500, '{"error":{"detail":42}}'],
  ])('handles HTTP %s without leaking non-JSON response bodies', async (status, body) => {
    await expect(readApiResponse(new Response(body, { status }))).rejects.toThrow(
      `The request failed (HTTP ${status}). Please try again.`
    );
  });

  it('explains rate limiting when no structured API error is available', async () => {
    await expect(readApiResponse(new Response('', { status: 429 }))).rejects.toThrow('Too many requests');
  });

  it.each(['', '<html>App shell</html>', '{'])('rejects malformed successful responses: %s', async (body) => {
    await expect(readApiResponse(new Response(body))).rejects.toThrow('The service returned an invalid response');
  });
});
