import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { sendResponse } from 'src/lib/response-handler.lib';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UserAuth } from 'src/decorators/user-auth.decorator';

@Controller('/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() createUser: CreateUserDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const user = await this.userService.createUser(createUser);
    return sendResponse(
      request,
      response,
      HttpStatus.OK,
      'User created successfully',
      user,
    );
  }

  @Get()
  @UserAuth()
  async getUser(
    @Query() query: GetUserDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const user = await this.userService.getUser(query);
    return sendResponse(
      request,
      response,
      HttpStatus.OK,
      'User fetched successfully',
      user,
    );
  }
}
