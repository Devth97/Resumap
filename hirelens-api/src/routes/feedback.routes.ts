import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { FeedbackRepository, FeedbackRecord } from '../repositories/feedback.repository';
import { cryptoRandomString } from '../utilities/hashing';

const submitFeedbackSchema = z.object({
  sessionId: z.string(),
  analysisId: z.string(),
  accuracyRating: z.number().min(1).max(5).optional(),
  roadmapUseful: z.string().optional(),
  mostUsefulSection: z.string().optional(),
  comments: z.string().optional(),
  wouldUseAgain: z.string().optional(),
  contactEmail: z.string().email().nullable().optional(),
  contactConsent: z.boolean().default(false),
});

export async function feedbackRoutes(fastify: FastifyInstance) {
  fastify.post('/feedback', async (request, reply) => {
    const body = submitFeedbackSchema.parse(request.body);

    const record: FeedbackRecord = {
      id: `fb_${cryptoRandomString(16)}`,
      sessionId: body.sessionId,
      analysisId: body.analysisId,
      accuracyRating: body.accuracyRating,
      roadmapUseful: body.roadmapUseful,
      mostUsefulSection: body.mostUsefulSection,
      comments: body.comments,
      wouldUseAgain: body.wouldUseAgain,
      contactEmail: body.contactEmail || null,
      contactConsent: body.contactConsent,
      createdAt: new Date().toISOString(),
    };

    await FeedbackRepository.save(record);

    return reply.status(201).send({
      success: true,
      feedbackId: record.id,
      message: 'Thank you for your feedback!',
    });
  });
}
