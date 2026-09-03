import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'Vinterview API',
      timestamp: new Date().toISOString(),
    };
  }
}
