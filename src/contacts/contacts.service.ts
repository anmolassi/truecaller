import { Injectable } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactsModel } from './contacts.schema';

@Injectable()
export class ContactsService {
  constructor(private contactsRepository: ContactsRepository) {}

  async createContacts(body: CreateContactDto): Promise<ContactsModel[]> {
    const createBody = { ...body };
    createBody.contactsArr.forEach((val)=>{
        val['createdBy'] = "5ca0a33b-89d7-4125-bb2a-25bdd31cac2f"
    })
    const contacts = await this.contactsRepository.bulkCreate(createBody.contactsArr ?? []);
    return contacts;
  }

  async getContacts(body: any): Promise<ContactsModel[]> {
    const contacts = await this.contactsRepository.searchContacts(body.query);
    return contacts;
  }
}
