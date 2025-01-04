import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { hashIt } from 'src/services/helper/hashing.service';
@Table({
  tableName: 'users',
  timestamps: true,
  version: false,
})
export class UserModel extends Model {
  @Unique
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Unique
  @Column({ type: DataType.STRING, allowNull: true })
  uuid: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: true })
  email: string;

  @Unique
  @Column({ type: DataType.BIGINT, allowNull: false })
  mobile: number;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @BeforeCreate
  static async hashPassword(user: UserModel, options: any) {
    user.uuid = uuidv4();
    user.password = await hashIt(user.password);
  }
  
}
