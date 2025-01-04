import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  BeforeCreate,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
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

  @ForeignKey(() => UserModel)
  @Column({ field: 'created_by', type: DataType.STRING, allowNull: false })
  createdBy: string;

  @BelongsTo(() => UserModel, {
    foreignKey: 'created_by',
    targetKey: 'uuid',
  })
  createdByUuid: UserModel;

  @BeforeCreate
  static async hashPassword(contact: ContactsModel, options: any) {
    //contact.createdBy = "5ca0a33b-89d7-4125-bb2a-25bdd31cac2f";
    contact.mobile = await encryptIt(String(contact.mobile));
  }
  
}