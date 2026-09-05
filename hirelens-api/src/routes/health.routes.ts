import { FastifyInstance } from 'fastify';
import { AnalysisRepository } from '../repositories/analysis.repository';
import { config } from '../config/env';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_request, reply) => {
    // `persistence` answers the question that matters when analyses go missing:
    // are records actually reaching Supabase, or only this instance's memory?
    // Booleans and a Postgres error string only — no credentials.
    const persistence = await AnalysisRepository.persistenceStatus();

    return reply.send({
      status: 'ok',
      version: '1.0.0',
      build: 'pdf-parser-2-structured',
      analysis: { configured: Boolean(config.GROQ_API_KEY), model: config.GROQ_MODEL },
      persistence,
      timestamp: new Date().toISOString(),
    });
  });
}
