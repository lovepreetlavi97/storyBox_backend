import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fs from 'fs';
import path from 'path';
import { config } from './config/index.js';
import { adminRoutes, publicRoutes } from './routes/index.js';

export function createApp(): FastifyInstance {
  // Ensure upload folders exist locally in non-production
  if (!config.isProduction) {
    try {
      fs.mkdirSync(path.join(config.uploads.dir, 'images'), { recursive: true });
      fs.mkdirSync(path.join(config.uploads.dir, 'audio'), { recursive: true });
    } catch (err) {
      console.warn('Could not create local upload directories:', err);
    }
  }

  const app = Fastify({
    logger: true
  });

  // Configure CORS
  app.register(cors, config.cors);

  // Register Multipart plugin
  app.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 1000000,
      fields: 10,
      fileSize: config.uploads.maxFileSize,
      files: 1
    }
  });

  // Serve local uploads folder statically if it exists
  if (fs.existsSync(config.uploads.dir)) {
    app.register(fastifyStatic, {
      root: config.uploads.dir,
      prefix: '/uploads/',
      decorateReply: false
    });
  }

  // Health check route
  app.get('/health', async () => {
    return { status: 'OK', message: 'StoryHub API Server is healthy' };
  });

  // Root check route
  app.get('/', async () => {
    return { status: 'OK', message: 'StoryHub API Server is running' };
  });

  // Register routes
  app.register(adminRoutes, { prefix: '/api/admin' });
  app.register(publicRoutes, { prefix: '/api/public' });

  return app;
}
