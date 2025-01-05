import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Logger,
    BadRequestException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { verifyJwtToken } from 'src/services/helper/jwt.service';
  import asyncLocalStorage from 'src/services/helper/context-helper';
  
  @Injectable()
  export class UserAuthGuard implements CanActivate {
    private readonly logger = new Logger(UserAuthGuard.name);
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req: any = context.switchToHttp().getRequest();
      const authorization = req.header('Authorization');
  
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authorization header is missing or invalid.');
      }
  
      const token = authorization.split(' ')[1];
      const payload = await this.decodeJWTFromReq(token);
  
      if (!payload) {
        throw new BadRequestException("Unable to handle this JWT.");
      }
  
      const { uuid, mobile, email } = payload;
  
      this.logger.debug(`User details extracted: uuid=${uuid}, mobile=${mobile}, email=${email}`);
  
      const storage = asyncLocalStorage.getStore();
      if (!storage) {
        throw new BadRequestException('AsyncLocalStorage is not initialized.');
      }
  
      storage.set('uuid', uuid);
      storage.set('mobile', mobile);
      storage.set('email', email);
  
      return true;
    }
  
    private async decodeJWTFromReq(token: string): Promise<any> {
      try {
        this.logger.log('Decoding JWT token...');
        const payload = verifyJwtToken(token);
        return payload;
      } catch (err) {
        this.logger.error('Error decoding JWT token', err);
        throw new UnauthorizedException('Invalid or expired JWT token.');
      }
    }
  }
  