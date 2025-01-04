import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ContactsModel } from './contacts.schema';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectModel(ContactsModel)
    private readonly contactsModel: typeof ContactsModel,
  ) {}

  async bulkCreate(contactsData: any): Promise<ContactsModel[]> {
    const contacts = await this.contactsModel.bulkCreate(contactsData, {
      validate: true,
      returning: true,
      individualHooks: true,
    });
    return contacts;
  }

  async searchContacts(searchQuery: string) {
    const contacts = await this.contactsModel.findAll({
      where: {
        name: { [Op.like]: `%${searchQuery}%` },
      },
      order: [
        [
          Sequelize.literal(
            `CASE WHEN name LIKE '${searchQuery}%' THEN 1 ELSE 2 END`,
          ),
          'ASC',
        ],
        ['name', 'ASC'],
      ],
    });

    return contacts;
  }
}
