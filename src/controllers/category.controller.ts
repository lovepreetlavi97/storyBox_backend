import { FastifyReply, FastifyRequest } from 'fastify';
import { categoryService } from '../services/index.js';
import { validateCategoryInput } from '../validations/index.js';
import { getCached, setCache, clearCache } from '../utils/cache.util.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const categoryController = {
  async getAllAdmin() {
    const categories = await categoryService.getAll();
    return { success: true, data: categories };
  },

  async getAllPublic() {
    const cacheKey = 'categories';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const categories = await categoryService.getAll();
    const response = { success: true, data: categories };
    setCache(cacheKey, response, 60000);
    return response;
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const error = validateCategoryInput(request.body);
    if (error) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error });
    }

    try {
      const category = await categoryService.create(request.body as any);
      clearCache();
      return { success: true, data: category };
    } catch (err: any) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: err.message || 'Error creating category' });
    }
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    try {
      const category = await categoryService.update(id, request.body as any);
      if (!category) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({ success: false, error: MESSAGES.CATEGORY_NOT_FOUND });
      }
      clearCache();
      return { success: true, data: category };
    } catch (err: any) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: err.message || 'Error updating category' });
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    try {
      const category = await categoryService.delete(id);
      if (!category) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({ success: false, error: MESSAGES.CATEGORY_NOT_FOUND });
      }
      clearCache();
      return { success: true, message: MESSAGES.CATEGORY_DELETED };
    } catch (err: any) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: err.message });
    }
  }
};
