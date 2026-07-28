import { FastifyReply, FastifyRequest } from 'fastify';
import { audioService, categoryService } from '../services/index.js';
import { validateAudioInput } from '../validations/index.js';
import { getCached, setCache } from '../utils/cache.util.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const audioController = {
  async getPaginatedAdmin(request: FastifyRequest) {
    const { page = 1, limit = 10, search } = request.query as any;
    const result = await audioService.getPaginatedAudios(Number(page), Number(limit), search);
    return {
      success: true,
      data: result.audios,
      pagination: result.pagination
    };
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const error = validateAudioInput(request.body);
    if (error) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error });
    }

    try {
      const audio = await audioService.create(request.body as any);
      return { success: true, data: audio };
    } catch (err: any) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: err.message || 'Error creating audio' });
    }
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    try {
      const audio = await audioService.update(id, request.body as any);
      if (!audio) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({ success: false, error: MESSAGES.AUDIO_NOT_FOUND });
      }
      return { success: true, data: audio };
    } catch (err: any) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: err.message || 'Error updating audio' });
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const audio = await audioService.delete(id);
    if (!audio) {
      return reply.status(HTTP_STATUS.NOT_FOUND).send({ success: false, error: MESSAGES.AUDIO_NOT_FOUND });
    }
    return { success: true, message: MESSAGES.AUDIO_DELETED };
  },

  async getFeatured() {
    const cacheKey = 'featured';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const audios = await audioService.getFeatured();
    const response = { success: true, data: audios };
    setCache(cacheKey, response);
    return response;
  },

  async getTrending() {
    const cacheKey = 'trending';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const audios = await audioService.getTrending();
    const response = { success: true, data: audios };
    setCache(cacheKey, response);
    return response;
  },

  async getLatest() {
    const cacheKey = 'latest';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const audios = await audioService.getLatest();
    const response = { success: true, data: audios };
    setCache(cacheKey, response);
    return response;
  },

  async getByCategorySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as any;
    const cacheKey = `category_${slug}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const category = await categoryService.getBySlug(slug);
    if (!category) {
      return reply.status(HTTP_STATUS.NOT_FOUND).send({ success: false, error: MESSAGES.CATEGORY_NOT_FOUND });
    }

    const audios = await audioService.getByCategory(category._id);
    const response = { success: true, data: { category, audios } };
    setCache(cacheKey, response, 15000);
    return response;
  },

  async searchPublic(request: FastifyRequest) {
    const { q, category } = request.query as any;
    const audios = await audioService.searchPublic(q, category);
    return { success: true, data: audios };
  },

  async getBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as any;
    const audio = await audioService.getBySlug(slug);
    if (!audio) {
      return reply.status(HTTP_STATUS.NOT_FOUND).send({ success: false, error: MESSAGES.AUDIO_NOT_FOUND });
    }
    return { success: true, data: audio };
  },

  async getRelated(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const related = await audioService.getRelated(id);
    if (!related) {
      return reply.status(HTTP_STATUS.NOT_FOUND).send({ success: false, error: MESSAGES.AUDIO_NOT_FOUND });
    }
    return { success: true, data: related };
  }
};
