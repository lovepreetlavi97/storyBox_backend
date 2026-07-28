import { FastifyInstance } from 'fastify';
import { 
  authController, 
  dashboardController, 
  uploadController, 
  categoryController, 
  audioController, 
  bannerController, 
  settingsController 
} from '../controllers/index.js';
import { authenticate } from '../middlewares/auth.middleware.js';

export default async function adminRoutes(fastify: FastifyInstance) {
  // Login Endpoint
  fastify.post('/login', authController.login);

  // Apply authorization to all routes below this point
  fastify.addHook('preHandler', authenticate);

  // Dashboard Stats
  fastify.get('/dashboard', dashboardController.getStats);

  // Upload Routes
  fastify.post('/upload/image', uploadController.uploadImage);
  fastify.post('/upload/audio', uploadController.uploadAudio);

  // Categories Routes
  fastify.get('/categories', categoryController.getAllAdmin);
  fastify.post('/categories', categoryController.create);
  fastify.put('/categories/:id', categoryController.update);
  fastify.delete('/categories/:id', categoryController.delete);

  // Audio Routes
  fastify.get('/audios', audioController.getPaginatedAdmin);
  fastify.post('/audios', audioController.create);
  fastify.put('/audios/:id', audioController.update);
  fastify.delete('/audios/:id', audioController.delete);

  // Banners Routes
  fastify.get('/banners', bannerController.getAllAdmin);
  fastify.post('/banners', bannerController.create);
  fastify.put('/banners/:id', bannerController.update);
  fastify.delete('/banners/:id', bannerController.delete);

  // Settings Routes
  fastify.get('/settings', settingsController.getSettingsAdmin);
  fastify.put('/settings', settingsController.updateSettings);
}
