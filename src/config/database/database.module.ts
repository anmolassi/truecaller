import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sqlConfigService } from './mysql-config-service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: sqlConfigService,
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
