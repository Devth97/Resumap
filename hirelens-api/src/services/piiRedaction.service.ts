export class PiiRedactionService {
  /**
   * Redact PII from raw extracted resume text.
   */
  public static redact(rawText: string): { redactedText: string; redactedCount: number } {
    let text = rawText;
    let count = 0;

    // 1. Redact Emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    text = text.replace(emailRegex, () => {
      count++;
      return '[EMAIL_REDACTED]';
    });

    // 2. Redact Phone numbers (+91, 10-digit Indian numbers, international formats)
    const phoneRegex = /(?:\+?\d{1,4}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}/g;
    text = text.replace(phoneRegex, (match) => {
      // Avoid matching simple 4-digit years or short numbers
      const digitsOnly = match.replace(/\D/g, '');
      if (digitsOnly.length < 8 || digitsOnly.length > 15) return match;
      count++;
      return '[PHONE_REDACTED]';
    });

    // 3. Redact Dates of Birth (DOB: DD/MM/YYYY or DOB: Month DD, YYYY)
    const dobRegex = /(?:DOB|Date of Birth|Birth Date)\s*[:\-]\s*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/gi;
    text = text.replace(dobRegex, () => {
      count++;
      return 'DOB: [DATE_OF_BIRTH_REDACTED]';
    });

    // 4. Redact Government IDs (Aadhaar 12-digit, PAN 10-character, SSN)
    const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;
    text = text.replace(aadhaarRegex, (match) => {
      // verify it's not a standard date range or year
      if (match.length === 12 || match.length === 14) {
        count++;
        return '[GOVT_ID_REDACTED]';
      }
      return match;
    });

    const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;
    text = text.replace(panRegex, () => {
      count++;
      return '[GOVT_ID_REDACTED]';
    });

    // 5. Replace candidate name line at the beginning if present
    const lines = text.split('\n');
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // If the first line looks like a name (2-4 words, no verbs, under 50 chars)
      if (firstLine.length > 2 && firstLine.length < 50 && !firstLine.includes('Resume') && !firstLine.includes('Curriculum')) {
        lines[0] = '[CANDIDATE_NAME]';
        text = lines.join('\n');
        count++;
      }
    }

    return {
      redactedText: text,
      redactedCount: count,
    };
  }
}
