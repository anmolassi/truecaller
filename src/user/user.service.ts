import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './user.schema';
import { UserRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { UserConstants } from 'src/constants/user.constants';
import { ContactsRepository } from 'src/contacts/contacts.repository';
import { generateJwtToken } from 'src/services/helper/jwt.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private contactsRepository: ContactsRepository,
  ) {}
  async createUser(body: CreateUserDto): Promise<UserModel> {
    try {
      const createBody = { ...body };
      const user = await this.userRepository.create(createBody);
      await this.contactsRepository.bulkCreate([
        { ...user.dataValues, createdBy: user.uuid, isUser: true },
      ]);
      const jwt = generateJwtToken(user.dataValues);
      user.dataValues['jwt'] = jwt;
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getUser(body: GetUserDto): Promise<UserModel[]> {
    try {
      if (!body.mobile && !body.email && !body.uuid) {
        throw new HttpException(
          'Both Mobile and email are absent. Send atleast one.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const search = { ...body };
      const attributes: any = UserConstants.DEFAULT_LISTING_ATTRIBUTES;
      const user = await this.userRepository.findBy(search, attributes);
      return user;
    } catch (err) {
      throw err;
    }
  }
}
