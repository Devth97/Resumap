import assert from 'node:assert/strict';
import { makeResumePdf } from '../tests/fixtures/resumePdf';

// Uses synthetic resumes only. Run: npm run smoke -- https://resumap.ornalens.in
const origin = process.argv[2];
if (!origin) throw new Error('Pass the site origin as the first argument.');
const base = `${origin.replace(/\/$/, '')}/api/v1`;

async function request(path: string, init?: RequestInit, expected = 200) {
  const started = Date.now();
  const response = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(120_000) });
  const text = await response.text();
  assert.equal(response.status, expected, `${path}: HTTP ${response.status}: ${text.slice(0, 1000)}`);
  const result = JSON.parse(text);
  console.log(`PASS ${init?.method || 'GET'} ${path}: ${response.status} (${Date.now() - started}ms)`);
  return result;
}

async function main() {
  const health = await request('/health');
  assert.equal(health.build, 'pdf-parser-2', 'The parser fix has not reached this deployment.');
  assert.equal(health.analysis?.configured, true, 'A real Groq key must be configured for this smoke test.');
  console.log('Analysis model:', health.analysis.model);
  console.log('Persistence:', JSON.stringify(health.persistence));
  const session = await request('/sessions', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventCode: 'synthetic-smoke-test' }),
  }, 201);
  const { roles } = await request('/roles');
  assert.ok(roles.length);

  let extraction: any;
  for (const options of [{ compressed: false }, { compressed: true }, { pages: 2 }]) {
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(await makeResumePdf(options))], { type: 'application/pdf' }), 'synthetic-resume.pdf');
    extraction = await request('/resumes/extract', {
      method: 'POST', headers: { 'x-session-id': session.sessionId }, body: form,
    });
    assert.equal(extraction.status, 'ready');
    assert.equal(extraction.pageCount, options.pages || 1);
    assert.ok(extraction.redactedText.includes('PostgreSQL'));
    assert.ok(extraction.characterCount > 300);
  }

  const corrupt = new FormData();
  corrupt.append('file', new Blob(['%PDF-1.7\nbroken\n%%EOF'], { type: 'application/pdf' }), 'corrupt.pdf');
  const rejected = await request('/resumes/extract', { method: 'POST', body: corrupt }, 400);
  assert.ok(rejected.error.message.includes('Export it again'));

  const analysis = await request('/analyses', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: session.sessionId, resumeId: extraction.resumeId,
      redactedText: extraction.redactedText, roleId: roles[0].id,
      questionnaire: {
        timeline: '3 months', weeklyHours: '5-10', projects: '1-2',
        internship: 'completed', interviewConfidence: 3, selfLevel: 'beginner', roleAnswers: {},
      },
    }),
  }, 201);
  assert.equal(analysis.status, 'completed');
  assert.equal(analysis.result.roadmap.length, 4);
  for (const score of [analysis.result.resumeQualityScore, analysis.result.jobReadinessScore]) {
    assert.ok(Number.isFinite(score) && score >= 0 && score <= 100);
  }
  assert.ok(analysis.result.rawResumeText.includes('PostgreSQL'));
  console.log('PASS upload-to-results smoke test:', analysis.analysisId);
  if (!health.persistence.reachable) {
    console.log('UNRESOLVED: database persistence is unavailable; this test validates the inline result flow only.');
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
