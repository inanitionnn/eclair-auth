import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware, LoggerModule } from './modules/logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env-validation';
import appConfig from './shared/config/app.config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './modules/health';
import { DrizzleModule } from './modules/database/drizzle.module';
import { DatabaseModule } from './modules/database/database.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppConfigType } from './shared/types';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: [appConfig],
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AppConfigType>) => ({
        type: 'single',
        url: configService.get<string>('redis'),
      }),
      inject: [ConfigService],
    }),
    TerminusModule,
    LoggerModule.register(),
    HealthModule,
    DrizzleModule,
    DatabaseModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
