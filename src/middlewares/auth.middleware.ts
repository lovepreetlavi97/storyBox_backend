import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../utils/auth.util.js';
import { MESSAGES, HTTP_STATUS } from '../constants/index.js';

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (request.url.includes('/login')) return;
  const isAuthorized = verifyToken(request.headers.authorization);
  if (!isAuthorized) {
    reply.status(HTTP_STATUS.UNAUTHORIZED).send({ success: false, error: MESSAGES.UNAUTHORIZED });
  }
}
