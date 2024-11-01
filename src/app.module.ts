import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware, LoggerModule } from './modules/logger';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env-validation';
import appConfig from './shared/config/app.config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './modules/health';
import { DrizzleModule } from './modules/database/drizzle.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/guards';
import { JwtStrategy } from './modules/auth/strategies';
import { RedisModule } from './modules/redis/redis.module';

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
    UserModule,
    AuthModule,
    RedisModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
