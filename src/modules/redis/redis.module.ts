import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as IoRedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigType } from '../../shared/types';

@Module({
  imports: [
    IoRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AppConfigType>) => ({
        type: 'single',
        url: `redis://${configService.get<string>('redisHost')}:${configService.get<number>('redisPort')}`,
        options: {
          port: configService.get<number>('redisPort'),
          host: configService.get<string>('redisHost'),
          connectTimeout: 10000,
          keepAlive: 1000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
