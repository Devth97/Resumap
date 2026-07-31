import { describe, it, expect } from 'vitest';
import { PiiRedactionService } from '../src/services/piiRedaction.service';

describe('PiiRedactionService', () => {
  it('redacts email addresses and phone numbers', () => {
    const raw = `
Ananya Rao
Email: ananya.rao@example.com
Phone: +91 98765 43210
Skills: Python, SQL
    `.trim();

    const { redactedText, redactedCount } = PiiRedactionService.redact(raw);

    expect(redactedText).toContain('[CANDIDATE_NAME]');
    expect(redactedText).toContain('[EMAIL_REDACTED]');
    expect(redactedText).toContain('[PHONE_REDACTED]');
    expect(redactedText).not.toContain('ananya.rao@example.com');
    expect(redactedText).not.toContain('98765 43210');
    expect(redactedCount).toBeGreaterThanOrEqual(3);
  });
});
