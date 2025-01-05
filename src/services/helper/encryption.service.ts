import * as crypto from 'crypto';

const ENCRYPTION_KEY = '12345678901234567890123456789012'; // 32 bytes
const ENCRYPTION_IV = '1234567890123456'; // 16 bytes

function encryptIt(data: string): string {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(ENCRYPTION_IV),
  );
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptIt(encryptedData: string): string {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(ENCRYPTION_IV),
  );
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export { encryptIt, decryptIt };
