import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware, LoggerModule } from './modules/logger';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env-validation';
import appConfig from './shared/config/app.config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './modules/health';
import { DrizzleModule } from './modules/database/drizzle.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: [appConfig],
      isGlobal: true,
      envFilePath: ['.env'],
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
