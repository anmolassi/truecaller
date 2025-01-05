import { Injectable, NestMiddleware } from '@nestjs/common';
import asyncLocalStorage from 'src/services/helper/context-helper';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlSMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const checkTraceId = asyncLocalStorage.getStore()?.get('trace-id');
    const traceId = checkTraceId ?? uuidv4();

    req.headers['trace-id'] = traceId;

    const map = new Map();

    map.set('trace-id', traceId);

    asyncLocalStorage.run(map, () => {
      next();
    });
  }
}
