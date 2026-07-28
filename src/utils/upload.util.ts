import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { config } from '../config/index.js';

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  }
});

export async function uploadToS3(fileBuffer: Buffer, filename: string, mimeType: string, subfolder: string): Promise<string> {
  const bucketName = config.aws.s3Bucket;
  const key = `uploads/${subfolder}/${filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);
  return `https://${bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
}

export async function handleFileUpload(fileData: any, subfolder: string): Promise<string> {
  const ext = path.extname(fileData.filename).toLowerCase();
  const uniqueFilename = `${crypto.randomUUID()}${ext}`;
  const buffer = await fileData.toBuffer();

  if (config.aws.accessKeyId && config.aws.secretAccessKey && config.aws.s3Bucket) {
    try {
      return await uploadToS3(buffer, uniqueFilename, fileData.mimetype, subfolder);
    } catch (s3Err: any) {
      console.error('S3 Upload Error:', s3Err);
      throw new Error(`S3 Upload Failed: ${s3Err.message || s3Err}`);
    }
  }

  const uploadDir = path.join(config.uploads.dir, subfolder);
  await fs.promises.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, uniqueFilename);
  await fs.promises.writeFile(filePath, buffer);
  return `/uploads/${subfolder}/${uniqueFilename}`;
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
