import 'dotenv/config';
import path from 'path';

export const config = {
  port: Number(process.env.PORT) || 5000,
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/storybox',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtsecretkey',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'adminpassword',
  cors: {
    origin: [
      process.env.WEBSITE_URL || 'https://storyhub.xpernex.com',
      process.env.ADMIN_URL || 'https://consolestoryhub.xpernex.com',
      'https://storyhub.xpernex.com',
      'https://storyhub.xpernex.com/',
      'https://consolestoryhub.xpernex.com',
      'https://consolestoryhub.xpernex.com/',
      'http://storyhub.xpernex.com',
      'http://storyhub.xpernex.com/',
      'http://consolestoryhub.xpernex.com',
      'http://consolestoryhub.xpernex.com/',
      'http://localhost:3000',
      'http://localhost:3001',
      /^https?:\/\/(console)?storyhub\.xpernex\.com\/?$/
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    s3Bucket: process.env.AWS_S3_BUCKET || 'storybox-audio-uploads',
  },
  uploads: {
    dir: path.join(process.cwd(), 'uploads'),
    maxFileSize: 100 * 1024 * 1024, // 100MB
  }
};
