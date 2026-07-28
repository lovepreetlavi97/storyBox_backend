import { FastifyInstance } from 'fastify';
import { 
  bannerController, 
  audioController, 
  categoryController, 
  settingsController 
} from '../controllers/index.js';

export default async function publicRoutes(fastify: FastifyInstance) {
  // Public Banners
  fastify.get('/banners', bannerController.getPublishedPublic);

  // Public Audio Feeds
  fastify.get('/audios/featured', audioController.getFeatured);
  fastify.get('/audios/trending', audioController.getTrending);
  fastify.get('/audios/latest', audioController.getLatest);

  // Public Categories
  fastify.get('/categories', categoryController.getAllPublic);
  fastify.get('/categories/:slug/audios', audioController.getByCategorySlug);

  // Search & Audio details
  fastify.get('/audios/search', audioController.searchPublic);
  fastify.get('/audios/:slug', audioController.getBySlug);
  fastify.get('/audios/:id/related', audioController.getRelated);

  // Public Settings
  fastify.get('/settings', settingsController.getSettingsPublic);
}
