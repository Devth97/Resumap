import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { SessionRepository, SessionRecord } from '../repositories/session.repository';
import { cryptoRandomString } from '../utilities/hashing';

const createSessionSchema = z.object({
  eventCode: z.string().optional().nullable(),
  deviceHash: z.string().optional().nullable(),
});

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post('/sessions', async (request, reply) => {
    const body = createSessionSchema.parse(request.body || {});

    const sessionId = `sess_${cryptoRandomString(16)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const record: SessionRecord = {
      id: sessionId,
      eventCode: body.eventCode || null,
      deviceHash: body.deviceHash || null,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'active',
    };

    await SessionRepository.create(record);

    return reply.status(201).send({
      sessionId: record.id,
      expiresAt: record.expiresAt,
    });
  });
}
