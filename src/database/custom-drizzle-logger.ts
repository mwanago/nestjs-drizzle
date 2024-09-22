import { Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'drizzle-orm/logger';

export class CustomDrizzleLogger implements Logger {
  private readonly logger = new NestLogger('SQL');

  logQuery(query: string, params: unknown[]): void {
    this.logger.log(`${query} | Params: ${JSON.stringify(params)}`);
  }
}
