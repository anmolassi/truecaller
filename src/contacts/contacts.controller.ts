import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { Request, Response } from 'express';
import { ContactsService } from './contacts.service';
import { sendResponse } from 'src/lib/response-handler.lib';
import { UserAuth } from 'src/decorators/user-auth.decorator';

@Controller('/v1/contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post()
  @UserAuth()
  async createContacts(
    @Body() body: CreateContactDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const contacts = await this.contactsService.createContacts(body);
    return sendResponse(
      request,
      response,
      HttpStatus.OK,
      'Contacts uploaded successfully',
      contacts,
    );
  }

  @Get()
  @UserAuth()
  async getContacts(
    @Query() query: { query: string },
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const contacts = await this.contactsService.getContacts(query);
    return sendResponse(
      request,
      response,
      HttpStatus.OK,
      'Contacts fetched successfully',
      contacts,
    );
  }

  @Patch('/:mobile')
  @UserAuth()
  async updateContacts(
    @Param() mobile: string,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const updatedRows = await this.contactsService.updateContact(mobile);
    return sendResponse(
      request,
      response,
      HttpStatus.OK,
      'Contacts updated successfully',
      { numberOfRowsUpdated: updatedRows },
    );
  }
}
