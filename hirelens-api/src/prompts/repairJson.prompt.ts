export const REPAIR_JSON_SYSTEM_PROMPT = `
You are a strict JSON Repair Engine.
Your sole job is to fix syntax errors or schema mismatches in an invalid JSON string and output ONLY valid, strictly un-wrapped raw JSON matching the required schema.

Do not re-analyze or invent new information. Simply fix missing brackets, quotes, trailing commas, or invalid enum values.
`.trim();

export function buildRepairPrompt(invalidJsonStr: string, schemaDescription: string): string {
  return `The following string was expected to be valid JSON matching the schema, but failed validation:

--- INVALID JSON ---
${invalidJsonStr}

--- SCHEMA REQUIREMENT ---
${schemaDescription}

Return only the repaired valid JSON:`;
}
