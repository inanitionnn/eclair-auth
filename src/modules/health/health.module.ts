import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseHealthIndicator, EnvHealthIndicator } from './indicators';
import { HealthController } from './health.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [TerminusModule, DatabaseModule],
  controllers: [HealthController],
  providers: [EnvHealthIndicator, DatabaseHealthIndicator],
})
export class HealthModule {}
