import { existsSync, mkdirSync } from 'fs';
 import { join } from 'path';
 import * as winston from 'winston';
 import * as winstonDaily from 'winston-daily-rotate-file';
 import contextHelper from '../services/helper/context-helper';
 import { configuration } from 'src/config/configuration';
 import { ConfigService } from '@nestjs/config';
 require('dotenv').config();
 
 // logs dir
 const logDir: string = join(__dirname, configuration().LOG_DIR);
 
 if (!existsSync(logDir)) {
   mkdirSync(logDir);
 }
 
 const levels = {
   error: 0,
   warn: 1,
   info: 2,
   http: 3,
   debug: 4,
 };
 
 export const createWinstonModuleOptions = () => {
   const level = () => {
     const configService = new ConfigService();
     return configService.get('LOGGER_LEVEL');
   };
 
   const colors = {
     error: 'red',
     warn: 'yellow',
     info: 'green',
     http: 'magenta',
     debug: 'white',
   };
 
   winston.addColors(colors);
 
   const format = winston.format.combine(
     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
     // winston.format.colorize(),
     winston.format.splat(),
     winston.format.metadata({
       fillExcept: ['message', 'level', 'timestamp', 'label'],
     }),
     winston.format.json(),
     winston.format.printf(({ timestamp, level, message, ...metadata }) => {
       const msg = {
         timestamp,
         level,
         traceId: contextHelper.getStore()?.get('trace-id'),
         message,
         ...metadata,
       };
       return JSON.stringify(msg);
     }),
   );
 
   const transports = [
     new winston.transports.Console(),
     new winstonDaily({
       level: 'error',
       datePattern: 'YYYY-MM-DD',
       dirname: 'logs/error', // log file /logs/debug/*.log in save
       filename: '%DATE%.log',
       maxFiles: 30, // 30 Days saved
       json: false,
       handleExceptions: true,
       zippedArchive: true,
     }),
     new winstonDaily({
       datePattern: 'YYYY-MM-DD',
       dirname: 'logs/debug', // log file /logs/debug/*.log in save
       filename: '%DATE%.log',
       maxFiles: 30, // 30 Days saved
       json: false,
       zippedArchive: true,
     }),
   ];
 
   return {
     level: level(),
     levels,
     format,
     transports,
   };
 };