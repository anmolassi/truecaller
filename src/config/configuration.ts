import { registerAs } from '@nestjs/config';

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOGGER_LEVEL: process.env.LOGGER_LEVEL || 'debug',
  SECRET_KEY: process.env.SECRET_KEY || '',
  LOG_FORMAT: process.env.LOG_FORMAT || '',
  LOG_DIR: process.env.LOG_DIR || '',
  TZ: process.env.TZ || 'Asia/Calcutta',
});

export const sqlConfig = registerAs('sqlDb', () => ({
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'pos_dev',
}));
