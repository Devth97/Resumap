import { FastifyInstance } from 'fastify';
import { RoleProfileService } from '../services/roleProfile.service';
import { CONSTANTS } from '../config/constants';

export async function roleRoutes(fastify: FastifyInstance) {
  fastify.get('/roles', async (_request, reply) => {
    const roles = RoleProfileService.getAllRoles().map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      entryLevelTitles: r.entryLevelTitles,
      requiredSkillsCount: r.requiredSkills.length,
    }));

    return reply.send({ roles });
  });

  fastify.get('/roles/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const role = RoleProfileService.getRoleById(id);

    if (!role) {
      return reply.status(404).send({
        error: {
          code: CONSTANTS.ERROR_CODES.ROLE_NOT_FOUND,
          message: `Role with ID '${id}' was not found.`,
          userAction: 'Select a valid role from the role selection screen.',
        },
      });
    }

    return reply.send({ role });
  });
}
