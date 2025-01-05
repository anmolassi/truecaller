import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(
    message = 'Invalid Request parameters.',
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super(message, statusCode);
  }
}

export class ConflictException extends HttpException {
  constructor(
    message = 'State already present in collection.',
    statusCode: number = HttpStatus.CONFLICT,
  ) {
    super(message, statusCode);
  }
}

export class DownStreamServiceException extends HttpException {
  constructor(
    message = `Downstream service failed`,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}

export class NotFoundException extends HttpException {
  constructor(
    message = `Resource not found`,
    statusCode: number = HttpStatus.NOT_FOUND,
  ) {
    super(message, statusCode);
  }
}
