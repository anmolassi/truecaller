import { Injectable } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactsModel } from './contacts.schema';
import { decryptIt } from 'src/services/helper/encryption.service';

@Injectable()
export class ContactsService {
  constructor(private contactsRepository: ContactsRepository) {}

  async createContacts(body: CreateContactDto): Promise<ContactsModel[]> {
    const createBody = { ...body };
    const contacts = await this.contactsRepository.bulkCreate(createBody.contactsArr ?? []);
    return contacts;
  }

  async getContacts(body: any): Promise<ContactsModel[]> {
    const contacts = await this.contactsRepository.searchContacts(body.query);
  
    await Promise.all(
      contacts.map(async (val) => {
        val.dataValues.mobile = await decryptIt(val.dataValues.mobile);
      })
    );
  
    return contacts;
  }
  
}
