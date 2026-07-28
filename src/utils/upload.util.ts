import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { config } from '../config/index.js';

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  }
});

export async function uploadToS3(fileStream: any, filename: string, mimeType: string): Promise<string> {
  const bucketName = config.aws.s3Bucket;
  const key = `uploads/${mimeType.startsWith('audio/') ? 'audio' : 'images'}/${filename}`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: mimeType,
    }
  });

  await upload.done();
  return `https://${bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
}

export async function handleFileUpload(fileData: any, subfolder: string): Promise<string> {
  const ext = path.extname(fileData.filename).toLowerCase();
  const uniqueFilename = `${crypto.randomUUID()}${ext}`;

  if (config.isProduction) {
    return await uploadToS3(fileData.file, uniqueFilename, fileData.mimetype);
  } else {
    const uploadDir = path.join(config.uploads.dir, subfolder);
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueFilename);
    await pipeline(fileData.file, fs.createWriteStream(filePath));
    return `/uploads/${subfolder}/${uniqueFilename}`;
  }
}

export function cleanupLocalFile(relativeUrl?: string): void {
  try {
    if (relativeUrl && relativeUrl.startsWith('/uploads/')) {
      const fullPath = path.join(process.cwd(), relativeUrl);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  } catch (err) {
    console.error('Error cleaning up local file:', err);
  }
}
