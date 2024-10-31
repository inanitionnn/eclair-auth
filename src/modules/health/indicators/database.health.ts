import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { DatabaseService } from '../../database/database.service';
import { sql } from 'drizzle-orm';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.databaseService.db.execute(sql`select 'Ping'`);
      return this.getStatus(key, true);
    } catch {
      throw new HealthCheckError(
        'Drizzle Database Connection Failed',
        this.getStatus(key, false),
      );
    }
  }
}
