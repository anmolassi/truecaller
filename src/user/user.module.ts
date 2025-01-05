import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './user.schema';
import { UserRepository } from './users.repository';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), ContactsModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
