require('dotenv').config();
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { INestApplication, RequestMethod, Logger } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import express = require('express');
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { createWinstonModuleOptions } from './utils/logger';

class Main {
  private static instance: Main;

  public static getInstance() {
    if (!Main.instance) {
      Main.instance = new Main();
    }
    return Main.instance;
  }

  public async initServer() {
    const app: INestApplication =
      await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: WinstonModule.createLogger(createWinstonModuleOptions()),
      });
    app.setGlobalPrefix('api', {
      exclude: [{ path: 'health', method: RequestMethod.GET }],
    });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    this.bootstrap(app);
    const port = this.getAppPort(app);
    const env = this.getAppEnv(app);
    await app.listen(port);
    Logger.log('=================================');
    Logger.log(`======= ENV: ${env} =======`);
    Logger.log(`🚀 App listening on the port ${port}`);
    Logger.log('=================================');
  }

  private bootstrap(app: INestApplication): void {
    this.initBodyParsing(app);
    this.enableCORS(app);
    this.initSwagger(app);
  }

  private enableCORS(app: INestApplication): void {
    app.enableCors({
      exposedHeaders: ['X-Total-Count', 'Content-Type'],
      origin: '*',
    });
  }

  private initBodyParsing(app: INestApplication): void {
    // parse application/x-www-form-urlencoded
    app.use(
      express.urlencoded({
        extended: true,
        limit: '50mb',
      }),
    );

    // parse application/json
    app.use(
      express.json({
        type: 'application/json',
        limit: '50mb',
      }),
    );
  }

  private initSwagger(app: INestApplication): void {
    app.use(
      '/api-doc',
      basicAuth({
        challenge: true,
        users: {
          tester: 'password',
        },
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Truecaller')
      .setDescription('API Description for Truecaller')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    const customOptions: SwaggerCustomOptions = {
      customSiteTitle: 'Truecaller',
    };

    SwaggerModule.setup('/api-doc', app, document, customOptions);
  }

  private getAppPort(app: INestApplication): number {
    const configService = app.get(ConfigService);
    return configService.get('PORT');
  }

  private getAppEnv(app: INestApplication): string {
    const configService = app.get(ConfigService);
    return configService.get('NODE_ENV');
  }
}

const main = Main.getInstance();
main.initServer();
