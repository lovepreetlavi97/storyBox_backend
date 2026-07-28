import { FastifyRequest } from 'fastify';
import { settingsService } from '../services/index.js';
import { getCached, setCache } from '../utils/cache.util.js';

export const settingsController = {
  async getSettingsAdmin() {
    const settings = await settingsService.getSettings();
    return { success: true, data: settings };
  },

  async getSettingsPublic() {
    const cacheKey = 'settings';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const settings = await settingsService.getSettings();
    const response = { success: true, data: settings };
    setCache(cacheKey, response, 60000);
    return response;
  },

  async updateSettings(request: FastifyRequest) {
    const settings = await settingsService.updateSettings(request.body as any);
    return { success: true, data: settings };
  }
};
