import crypto from 'crypto';
import { config } from '../config/index.js';

export function hashPassword(password: string): string {
  const salt = 'storyhub_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const hash = hashPassword(password);
  return hash === storedHash;
}

export function generateToken(username: string): string {
  const payload = JSON.stringify({ username, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }); // 7 days expiration
  const signature = crypto.createHmac('sha256', config.jwtSecret).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

export function verifyToken(authHeader?: string): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return false;
    const payload = Buffer.from(payloadBase64, 'base64').toString();
    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return false;
    
    const expectedSignature = crypto.createHmac('sha256', config.jwtSecret).update(payload).digest('hex');
    return signature === expectedSignature;
  } catch {
    return false;
  }
}
