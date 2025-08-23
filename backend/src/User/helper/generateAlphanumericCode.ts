import { randomBytes } from 'crypto';

export function generateAlphanumericCode(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytesBuffer = randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[randomBytesBuffer[i] % chars.length];
  }
  return code;
}
