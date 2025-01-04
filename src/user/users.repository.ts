import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './user.schema';
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}
  async create(usersData: any): Promise<UserModel> {
    return this.userModel.create(usersData);
  }
  async findBy(searchObjUser: any, attributes: string[]): Promise<UserModel[]> {
    const users = await this.userModel.findAll({
      where: searchObjUser,
      attributes,
      limit: 1,
    });

    return users;
  }
}
