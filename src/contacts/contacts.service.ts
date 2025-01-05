import { Injectable } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactsModel } from './contacts.schema';
import { decryptIt, encryptIt } from 'src/services/helper/encryption.service';

@Injectable()
export class ContactsService {
  constructor(private contactsRepository: ContactsRepository) {}

  async createContacts(body: CreateContactDto): Promise<ContactsModel[]> {
    const createBody = { ...body };
    const contacts = await this.contactsRepository.bulkCreate(
      createBody.contactsArr ?? [],
    );
    return contacts;
  }

  async getContacts(body: any): Promise<ContactsModel[]> {
    const contacts = await this.contactsRepository.searchContacts(body.query);

    await Promise.all(
      contacts.map(async (val) => {
        val.dataValues.mobile = await decryptIt(val.dataValues.mobile);
      }),
    );

    return contacts;
  }
  async updateContact(mobile: string): Promise<number> {
    try {
      const encryptedMobile = await encryptIt(mobile['mobile']);
      const updatedCount = await this.contactsRepository.update({mobile: encryptedMobile});
      if (updatedCount === 0) {
        throw new Error('No contacts found with the given mobile number');
      }
      return updatedCount;
    } catch (error) {
      console.error('Error updating spamReported:', error);
      throw error;
    }
  }
}
