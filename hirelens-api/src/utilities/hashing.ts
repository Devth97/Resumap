import crypto from 'crypto';

export function cryptoRandomString(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
