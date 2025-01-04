import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './user.schema';
import { UserRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { UserConstants } from 'src/constants/user.constants';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  async createUser(body: CreateUserDto): Promise<UserModel> {
    const createBody = { ...body };
    const user = await this.userRepository.create(createBody);
    return user;
  }

  async getUser(body: GetUserDto): Promise<UserModel[]> {
    if (!body.mobile && !body.email) {
      throw new HttpException(
        'Both Mobile and email are absent. Send atleast one.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const search = { ...body };
    const attributes: any = UserConstants.DEFAULT_LISTING_ATTRIBUTES;
    const user = await this.userRepository.findBy(search, attributes);
    return user;
  }
}
