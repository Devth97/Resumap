import { buildApp } from '../src/app';

// Allow up to 60s so the synchronous NVIDIA LLM analysis can finish before
// Vercel terminates the serverless function.
export const config = { maxDuration: 60 };

const app = buildApp();

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}
