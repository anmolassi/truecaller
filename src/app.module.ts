import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { configuration, sqlConfig } from './config/configuration';
import { UserModule } from './user/user.module';
import { ContactsModule } from './contacts/contacts.module';
import { AlsModule } from './als/als.module';
import { AlSMiddleware } from './middleware/als.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, sqlConfig],
    }),
    DatabaseModule,
    UserModule,
    ContactsModule,
    AlsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AlSMiddleware)
      .exclude({ path: '/', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
