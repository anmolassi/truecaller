import * as jwt from 'jsonwebtoken';

export function generateJwtToken(payload: any): string {
  const SECRET_KEY = process.env.SECRET_KEY;
  return jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });
}

export function verifyJwtToken(token: string): Record<string, unknown> | null {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] });
    return decoded as Record<string, unknown>;
  } catch (error) {
    console.error('Invalid or expired token:', error);
    return null;
  }
}
