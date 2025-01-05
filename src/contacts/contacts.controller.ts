import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
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
    const user = await this.contactsService.createContacts(body);
    return sendResponse(
      request,
      response,
      HttpStatus.OK,
      'Contacts uploaded successfully',
      user,
    );
  }

  @Get()
   @UserAuth()
  async getContacts(
    @Query() query: {query: string},
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const user = await this.contactsService.getContacts(query);
    return sendResponse(
      request,
      response,
      HttpStatus.OK,
      'User fetched successfully',
      user,
    );
  }
}
