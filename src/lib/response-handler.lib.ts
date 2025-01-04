import { ApiResponse } from './dto/api-response.dto';
import { Request, Response } from 'express';

const sendResponse = (
  request: Request,
  response: Response,
  statusCode: number,
  message: string,
  responseBody: any,
) => {
  const res = new ApiResponse(statusCode, message, responseBody);
  return response.status(statusCode).json(res);
};

export { sendResponse };
