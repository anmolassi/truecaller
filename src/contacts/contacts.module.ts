import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactsRepository } from './contacts.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactsModel } from './contacts.schema';

@Module({
  imports: [SequelizeModule.forFeature([ContactsModel])],
  controllers: [ContactsController],
  providers: [ContactsService, ContactsRepository],
  exports: [ContactsService, ContactsRepository],
})
export class ContactsModule {}
