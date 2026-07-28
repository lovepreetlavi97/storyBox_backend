import { FastifyReply, FastifyRequest } from 'fastify';
import { bannerService } from '../services/index.js';
import { validateBannerInput } from '../validations/index.js';
import { getCached, setCache, clearCache } from '../utils/cache.util.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const bannerController = {
  async getAllAdmin() {
    const banners = await bannerService.getAll();
    return { success: true, data: banners };
  },

  async getPublishedPublic() {
    const cacheKey = 'banners';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const banners = await bannerService.getPublished();
    const response = { success: true, data: banners };
    setCache(cacheKey, response, 30000);
    return response;
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const error = validateBannerInput(request.body);
    if (error) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error });
    }

    try {
      const banner = await bannerService.create(request.body as any);
      clearCache();
      return { success: true, data: banner };
    } catch (err: any) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: err.message || 'Error creating banner' });
    }
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    try {
      const banner = await bannerService.update(id, request.body as any);
      if (!banner) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({ success: false, error: MESSAGES.BANNER_NOT_FOUND });
      }
      clearCache();
      return { success: true, data: banner };
    } catch (err: any) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: err.message || 'Error updating banner' });
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    try {
      const banner = await bannerService.delete(id);
      if (!banner) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({ success: false, error: MESSAGES.BANNER_NOT_FOUND });
      }
      clearCache();
      return { success: true, message: MESSAGES.BANNER_DELETED };
    } catch (err: any) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: err.message });
    }
  }
};
