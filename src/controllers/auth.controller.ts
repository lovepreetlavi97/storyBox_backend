import { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from '../services/index.js';
import { HTTP_STATUS } from '../constants/index.js';

export const authController = {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const { username, password } = request.body as any;
    const result = await authService.login(username, password);

    if (result.success) {
      return result;
    } else {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send(result);
    }
  }
};
