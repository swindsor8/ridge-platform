import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      status: 'ok',
      service: 'ridge-api',
      timestamp: new Date().toISOString(),
    };
  }
}
