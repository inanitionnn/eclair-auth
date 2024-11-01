import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { EnvHealthIndicator, DatabaseHealthIndicator } from './indicators';
import { Public } from '../../shared/decorators';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: DatabaseHealthIndicator,
    private env: EnvHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.db.isHealthy('database'),
      () => this.env.isHealthy('env'),
    ]);
  }
}
