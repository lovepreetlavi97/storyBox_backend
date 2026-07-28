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

  // S3 Diagnostics Endpoint (Public for debugging)
  fastify.get('/s3-diagnose', async (request, reply) => {
    try {
      const { S3Client, ListObjectsV2Command } = await import('@aws-sdk/client-s3');
      const { config } = await import('../config/index.js');
      
      const keyId = config.aws.accessKeyId || '';
      const secret = config.aws.secretAccessKey || '';
      
      const details = {
        region: config.aws.region,
        s3Bucket: config.aws.s3Bucket,
        accessKeyIdLength: keyId.length,
        accessKeyIdMasked: keyId ? `${keyId.substring(0, 4)}...${keyId.substring(keyId.length - 4)}` : 'EMPTY',
        secretAccessKeyLength: secret.length,
        secretAccessKeyMasked: secret ? `${secret.substring(0, 4)}...${secret.substring(secret.length - 4)}` : 'EMPTY',
        envKeysPresentInProcessEnv: {
          AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
          AWS_REGION: !!process.env.AWS_REGION,
          AWS_S3_BUCKET: !!process.env.AWS_S3_BUCKET,
          NODE_ENV: process.env.NODE_ENV
        },
        s3TestResult: 'not_started',
        s3TestError: null as any
      };
      
      try {
        const s3Client = new S3Client({
          region: config.aws.region,
          credentials: {
            accessKeyId: keyId,
            secretAccessKey: secret,
          }
        });
        
        const cmd = new ListObjectsV2Command({
          Bucket: config.aws.s3Bucket,
          MaxKeys: 1
        });
        
        await s3Client.send(cmd);
        details.s3TestResult = 'SUCCESS';
      } catch (err: any) {
        details.s3TestResult = 'FAILED';
        details.s3TestError = {
          message: err.message,
          code: err.code,
          name: err.name
        };
      }
      
      return details;
    } catch (topErr: any) {
      return { error: topErr.message };
    }
  });

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
