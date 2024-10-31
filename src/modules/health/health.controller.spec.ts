import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { EnvHealthIndicator } from './indicators/env.health';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { DatabaseHealthIndicator } from './indicators/database.health';
import { RedisHealthIndicator } from '@nestjs-modules/ioredis';

describe('HealthController', () => {
  let healthController: HealthController;
  let dbHealthIndicator: DatabaseHealthIndicator;
  let envHealthIndicator: EnvHealthIndicator;
  let redisHealthIndicator: RedisHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthCheckService,
        HealthCheckExecutor,
        {
          provide: EnvHealthIndicator,
          useValue: { isHealthy: jest.fn() },
        },
        {
          provide: RedisHealthIndicator,
          useValue: { isHealthy: jest.fn() },
        },
        {
          provide: DatabaseHealthIndicator,
          useValue: { isHealthy: jest.fn() },
        },
        {
          provide: 'TERMINUS_ERROR_LOGGER',
          useValue: {},
        },
        {
          provide: 'TERMINUS_LOGGER',
          useValue: {},
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    dbHealthIndicator = module.get<DatabaseHealthIndicator>(
      DatabaseHealthIndicator,
    );
    redisHealthIndicator =
      module.get<RedisHealthIndicator>(RedisHealthIndicator);
    envHealthIndicator = module.get<EnvHealthIndicator>(EnvHealthIndicator);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('should check health status of database and environment', async () => {
    const dbCheckSpy = jest
      .spyOn(dbHealthIndicator, 'isHealthy')
      .mockResolvedValue({ database: { status: 'up' } });
    const redisCheckSpy = jest
      .spyOn(redisHealthIndicator, 'isHealthy')
      .mockResolvedValue({ redis: { status: 'up' } });
    const isHealthySpy = jest
      .spyOn(envHealthIndicator, 'isHealthy')
      .mockResolvedValue({ env: { status: 'up' } });

    const result = await healthController.check();

    expect(result).toEqual({
      status: 'ok',
      info: {
        database: { status: 'up' },
        redis: { status: 'up' },
        env: { status: 'up' },
      },
      error: {},
      details: {
        database: { status: 'up' },
        redis: { status: 'up' },
        env: { status: 'up' },
      },
    });

    expect(dbCheckSpy).toHaveBeenCalledWith('database');
    expect(redisCheckSpy).toHaveBeenCalledWith('redis');
    expect(isHealthySpy).toHaveBeenCalledWith('env');
  });
});
