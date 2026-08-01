import { buildApp } from '../src/app';

// Vercel Pro allows up to 300s. Gives the synchronous NVIDIA LLM analysis
// ample room to finish (even with the larger 70B model + a retry).
export const config = { maxDuration: 300 };

const app = buildApp();

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}
