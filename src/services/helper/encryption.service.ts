import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export const encryptIt = async (value: string) => {
  const password = process.env.ENCRYPTION_PASSWORD;
  const iv = randomBytes(16);
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const encryptedText = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ]);

  const encryptedData = Buffer.concat([iv, encryptedText]);
  return encryptedData.toString('base64');
};

export const decryptIt = async (encryptedDataBase64: string) => {
  const password = process.env.ENCRYPTION_PASSWORD;
  const encryptedData = Buffer.from(encryptedDataBase64, 'base64');
  const iv = encryptedData.slice(0, 16);
  const encryptedText = encryptedData.slice(16);

  const key: Buffer = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;

  const decipher = createDecipheriv('aes-256-ctr', key, iv);

  const decryptedText = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decryptedText.toString('utf8');
};
