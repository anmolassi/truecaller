import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  BeforeCreate,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import asyncLocalStorage from 'src/services/helper/context-helper';
import { encryptIt } from 'src/services/helper/encryption.service';
import { UserModel } from 'src/user/user.schema';
@Table({
  tableName: 'contacts',
  timestamps: true,
  version: false,
})
export class ContactsModel extends Model {
  @Unique
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  mobile: string;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  spamReported: number;

  @Default(0)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isUser: boolean;

  @ForeignKey(() => UserModel)
  @Column({ field: 'created_by', type: DataType.STRING, allowNull: true })
  createdBy: string;

  @BelongsTo(() => UserModel, {
    foreignKey: 'created_by',
    targetKey: 'uuid',
  })
  createdByUuid: UserModel;

  @BeforeCreate
  static async hashPassword(contact: ContactsModel, options: any) {
    const uuid = asyncLocalStorage.getStore()?.get('uuid');
    if (!uuid && !contact.createdBy) {
      throw new Error('UUID is not available in asyncLocalStorage.');
    }
    if (uuid) {
      contact.createdBy = uuid;
    }
    contact.mobile = await encryptIt(String(contact.mobile));
  }
}
